<?php

namespace App\Http\Controllers\Api;

use Exception;
use App\Models\User;
use Ramsey\Uuid\Uuid;
use App\Models\Wallet;
use App\Models\Product;
use App\Models\UserWallet;
use App\Jobs\SendMintEmail;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\UserWatchlist;
use App\Jobs\SendConfirmEmail;
use Contentful\Management\Client;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\UserAirdrop;
use Contentful\Management\Resource\Entry;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function show()
    {
        // find user
        $user = User::where('id', auth('sanctum')->user()->id)->with('wallets')->first();

        // if not found
        if (!$user) {
            return response()->json([
                'status' => 'failed',
                'message' => 'user not found',
            ]);
        }

        // parsing response
        if ($user->email_subscribe === 1) {
            $user->email_subscribe = true;
        } else {
            $user->email_subscribe = false;
        }

        // retun response
        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }

    public function update(Request $request)
    {
        // validation
        $request->validate([
            'name' => 'nullable|string|max:100',
            'email' => 'nullable|string|email|max:100|unique:users,email,'.auth('sanctum')->user()->id
        ]);

        // find user
        $user = User::where('id', auth('sanctum')->user()->id)->with('wallets')->first();

        // if not found
        if (!$user) {
            return response()->json([
                'status' => 'failed',
                'message' => 'user not found',
            ]);
        }

        // update name
        if ($request->has('name') && $request->name != '') {
            $user->name = $request->name;
            $user->update();
        }

        // update email
        if ($request->has('email') && $request->email != '') {
            if ($user->email != $request->email) {
                $user->email = $request->email;
                $user->email_verified_at = null;
                $user->update();

                // sending email verification
                SendConfirmEmail::dispatch($user, 'register')->onQueue('apiNft');
            }
        }

        // update wallet
        if ($request->has('wallet') && $request->wallet != '') {
            // wallets id
            $wallets = Wallet::whereIn('uuid', $request->wallet)->pluck('id')->toArray();

            // add wallets
            $user->wallets()->sync($wallets);
        }

        // update email_subscribe
        if ($request->has('email_subscribe') && $request->email_subscribe === true) {
            $user->email_subscribe = 1;
            $user->update();
        }
        if ($request->has('email_subscribe') && $request->email_subscribe === false) {
            $user->email_subscribe = 0;
            $user->update();
        }

        // enable notif
        if ($request->has('fcm_token') && $request->fcm_token != '') {
            $user->fcm_token = $request->fcm_token;
            $user->update();
        }

        // reset user notif counter
        if ($request->has('notif_count') && $request->notif_count != '') {
            $user->notif_count = 0;
            $user->update();
        }

        // app rating
        if ($request->has('app_rating') && $request->app_rating != '') {
            $user->app_rating = $request->app_rating;
            $user->update();
        }

        // update user content
        $user = User::where('id', auth('sanctum')->user()->id)->with('wallets')->first();

        //update contentful data
            $updateuser = User::where('id', auth('sanctum')->user()->id)->first();

            if($updateuser->entry_id != null and $updateuser->entry_id !=''){

            $newuserdata = DB::table('users')
                    ->leftjoin('user_wallets','users.id','=','user_id')
                    ->leftjoin('wallets','wallets.id','=','wallet_id')
                    ->select('users.id','users.name','users.email','users.email_verified_at','users.created_at')
                    ->selectRaw(DB::raw('GROUP_CONCAT(wallets.name) AS wallets'))
                    ->selectRaw(DB::raw('IF(users.email_subscribe = 0, "No", "Yes") AS email_subscribe'))
                    ->where('users.email', $updateuser->email)
                    ->groupBy('users.email')
                    ->first();

            $client = New Client(env('CONTENTFUL_MANAGEMENT_ACCESS_TOKEN'));
            $environment = $client->getEnvironmentProxy(env('CONTENTFUL_SPACE_ID'), 'master');

            $entry = $environment->getEntry($updateuser->entry_id);
            $entry->setField('name', 'en-US', $newuserdata->name);
            $entry->setField('email', 'en-US', $newuserdata->email);
            $entry->setField('accountCreatedTime', 'en-US', $newuserdata->created_at);
            $entry->setField('verifiedTime', 'en-US', $newuserdata->email_verified_at);
            $entry->setField('emailsubsribed', 'en-US', $newuserdata->email_subscribe);
            $entry->setField('wallets', 'en-US', $newuserdata->wallets);

            $entry->update();
            
            }

        // parsing response
        if ($user->email_subscribe === 1) {
            $user->email_subscribe = true;
        } else {
            $user->email_subscribe = false;
        }

        // retun response
        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }

    public function destroy()
    {
        // find user
        $user = User::where('id', auth('sanctum')->user()->id)->first();

        // if not found
        if (!$user) {
            return response()->json([
                'status' => 'failed',
                'message' => 'user not found',
            ]);
        }

        // update user
        $user->remember_token = Str::random(16);
        $user->update();

        // sending email verification
        SendConfirmEmail::dispatch($user, 'unregister')->onQueue('apiNft');

        // retun response
        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }

    public function destroyConfirm($token)
    {
        // check email token
        $user = User::where('remember_token', $token)->first();

        if (!$user) {
            return response()->json([
                'status' => 'failed',
                'message' => 'token expired'
            ]);
        }

        // delete user
        if ($user->delete()) {
            // delete watchlist
            UserWatchlist::where('user_id', $user->id)->delete();

            // delete wallet
            UserWallet::where('user_id', $user->id)->delete();

            // retun response
            return redirect('https://nftdaily.app/account-deletion');
            // return response()->json([
            //     'status' => 'success',
            //     'message' => 'user account deleted'
            // ]);
        }
    }

    public function getRememberToken()
    {
        // find user
        $user = User::where('id', auth('sanctum')->user()->id)->first();

        // if not found
        if (!$user) {
            return response()->json([
                'status' => 'failed',
                'message' => 'user not found',
            ]);
        }

        // update user
        $user->remember_token = Str::random(16);
        $user->update();
 
        // retun response
        return response()->json([
            'status' => 'success',
            'data' => $user->remember_token
        ]);
    }

    public function walletConnect(Request $request, $token)
    {
        // check remember token
        $user = User::where('remember_token', $token)->first();

        // return response
        if (!$user) {
            return response()->json([
                'status' => 'failed',
                'message' => 'token expired'
            ]);
        }

        // add wallet connect
        if ($user->wallet_connect) {
            $oldWallet = array();
            foreach ($user->wallet_connect as $wc) {
                if ($wc['walletAddress'] != $request->walletAddress) {
                    $oldWallet[] = $wc;
                }
            }
            $oldWallet[] = $request->all();

            $user->wallet_connect = $oldWallet;
            $user->save();
        } else {
            $newWallet = array();
            $newWallet[] = $request->all();

            $user->wallet_connect = $newWallet;
            $user->save();
        }

        if($request->walletAddress)
        {
            $user->wallet_address = $request->walletAddress;
            $user->save();

            $data = User::where('remember_token', $token)->first();

            $walletdata = Http::get('http://api.etherscan.io/api?module=account&action=txlist&address='.$data->wallet_address.'&startblock=0&endblock=99999999&apikey='.env('ETHERSCAN_API_KEY'))->json();
            
            if($walletdata['status'] == '1'){

                $data->wallet_transaction = $walletdata['result'];
                $data->save();
            }
            
            if($walletdata['status'] == '0')
            {
                $data->wallet_transaction = $walletdata['message'];
                $data->save();
            }

            
        }

        

       
       
        // return response
        return response()->json([
            'status' => 'success',
            'data' => $user->wallet_connect
        ]);
    }

    public function mintingWithEmail(Request $request, $id)
    {
        // find user
        $user = User::where('id', auth('sanctum')->user()->id)->first();

        // if not found
        if (!$user) {
            return response()->json([
                'status' => 'failed',
                'message' => 'user not found',
            ]);
        }

        // find product
        $product = Product::with('collections','blockchain','preferance','community')
            ->where('uuid', $id)
            ->first();

        // if not found
        if (!$product) {
            return response()->json([
                'status' => 'failed',
                'message' => 'nft not found',
            ]);
        }

        // sending email
        SendMintEmail::dispatch($user, $product, $request->email)->onQueue('apiNft');

        // return response
        return response()->json([
            'status' => 'success',
            'message' => 'email minting send',
        ]);
    }

    
   
}