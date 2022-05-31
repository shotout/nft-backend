<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Ramsey\Uuid\Uuid;
use App\Models\Wallet;
use App\Models\UserWallet;
use Illuminate\Http\Request;
use App\Jobs\SendConfirmEmail;
use App\Http\Controllers\Controller;

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