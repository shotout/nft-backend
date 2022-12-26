<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Ramsey\Uuid\Uuid;
use App\Models\Wallet;
use App\Models\UserWallet;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Jobs\SendConfirmEmail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Contentful\Management\Client;
use Contentful\Core\Api\Exception;
use Contentful\Management\Resource\Entry;
use hisorange\BrowserDetect\Parser as Browser;

class AuthController extends Controller


{
    public function register(Request $request)
    {
        // validation
        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:100|unique:users,email',
            'wallet' => 'required',
            // 'fcm_token' => 'required'
        ]);

        $user = DB::transaction(function () use ($request) {
            // add user
            $user = new User;
            $user->uuid = Uuid::uuid4();
            $user->name = $request->name;
            $user->email = $request->email;
            $user->email_verified_at = now();
            if ($request->has('fcm_token') && $request->fcm_token != '') {
                $user->fcm_token = $request->fcm_token;
            }
            if ($request->has('email_subscribe') && $request->email_subscribe === true) {
                $user->email_subscribe = 1;
            }
            $user->remember_token = Str::random(16);
            $user->save();

            // wallets id
            $wallets = Wallet::whereIn('uuid', $request->wallet)->pluck('id')->toArray();

            // add wallets
            $user->wallets()->sync($wallets);


            //adding data to contentful          
            $newuser = DB::table('users')
                ->leftjoin('user_wallets', 'users.id', '=', 'user_id')
                ->leftjoin('wallets', 'wallets.id', '=', 'wallet_id')
                ->select('users.id', 'users.name', 'users.email', 'users.email_verified_at', 'users.created_at')
                ->selectRaw(DB::raw('GROUP_CONCAT(wallets.name) AS wallets'))
                ->selectRaw(DB::raw('IF(users.email_subscribe = 0, "No", "Yes") AS email_subscribe'))
                ->where('users.email', $request->email)
                ->groupBy('users.email')
                ->first();

            $client = new Client(env('CONTENTFUL_MANAGEMENT_ACCESS_TOKEN'));
            $environment = $client->getEnvironmentProxy(env('CONTENTFUL_SPACE_ID'), 'master');


            $entry = new Entry('users');
            $entry->setField('name', 'en-US', $newuser->name);
            $entry->setField('email', 'en-US', $newuser->email);
            $entry->setField('accountCreatedTime', 'en-US', $newuser->created_at);
            $entry->setField('verifiedTime', 'en-US', $newuser->email_verified_at);
            $entry->setField('emailsubsribed', 'en-US', $newuser->email_subscribe);
            $entry->setField('wallets', 'en-US', $newuser->wallets);

            try {
                $environment->create($entry);
            } catch (Exception $exception) {
                log($exception->getMessage());
            }

            $entry_id = $entry->getId();
            $updateuser = User::where('email', $request->email)->first();
            $updateuser->entry_id = $entry_id;
            $updateuser->save();

            // return user
            return $user;
        });

        if ($user) {
            // sending email verification
            SendConfirmEmail::dispatch($user, 'register')->onQueue('apiNft');

            // generate token
            $token = $user->createToken('auth_token')->plainTextToken;

            // retun response
            return response()->json([
                'status' => 'success',
                'token' => $token,
                'data' => $user
            ]);
        }
    }

    public function login(Request $request)
    {
        // validation
        $request->validate([
            'email' => 'required|email|max:100',
        ]);

        // find email
        $user = User::where('email', $request->email)->first();

        // check if email has register
        if (!$user) {
            return response()->json([
                'status' => 'failed',
                'message' => 'email account not registered',
            ]);
        }

        // check if email has verify
        // if (!$user->email_verified_at) {
        //     return response()->json([
        //         'status' => 'failed',
        //         'message' => 'email account not verified',
        //     ]);
        // }

        // update user
        $user->email_verified_at = now();
        if ($request->has('fcm_token') && $request->fcm_token != '') {
            $user->fcm_token = $request->fcm_token;
        }
        $user->remember_token = Str::random(16);
        $user->update();

        // generate token
        $token = $user->createToken('auth_token')->plainTextToken;

        // sending email verification
        SendConfirmEmail::dispatch($user, 'login')->onQueue('apiNft');

        // retun response
        return response()->json([
            'status' => 'success',
            'token' => $token,
            'data' => $user
        ]);
    }

    public function verify($token)
    {
        // deep link
        // if ($request->has('deeplink') && $request->deeplink != '') {
        //     return redirect()->to(env('DEEP_URL').'/auth/verify/'.$request->deeplink);
        // }

        // check email token and update 
        $user = User::where('remember_token', $token)->first();

        if (!$user) {

            if (Browser::platformFamily() == 'Windows' || Browser::platformFamily() == 'Mac') {
                return redirect('https://nftdaily.app');
            } 
            else {
                
                return response()->json([
                    'status' => 'failed',
                    'message' => 'token expired',
                ]);
        
            }
            
        }

        $user->email_verified_at = now();
        // $user->remember_token = null;
        $user->update();

        // generate token api
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'token' => $token,
            'data' => $user
        ]);
        

        // if (Browser::platformFamily() == 'Windows' || Browser::platformFamily() == 'Mac') {
        //     return redirect('https://nftdaily.app');
        // } 
        // else {
        //     return response()->json([
        //         'status' => 'success',
        //         'token' => $token,
        //         'data' => $user
        //     ]);
    
        // }
      
    }
}
