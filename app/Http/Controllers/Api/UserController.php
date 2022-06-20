<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Ramsey\Uuid\Uuid;
use App\Models\Wallet;
use App\Models\UserWallet;
use Illuminate\Http\Request;
use App\Jobs\SendConfirmEmail;
use App\Http\Controllers\Controller;
use Contentful\Management\Client;
use Illuminate\Support\Facades\DB;
use Contentful\Management\Resource\Entry;
use Exception;

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
}