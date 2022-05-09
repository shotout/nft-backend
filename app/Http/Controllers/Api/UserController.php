<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Ramsey\Uuid\Uuid;
use App\Models\Wallet;
use App\Models\UserWallet;
use Illuminate\Http\Request;
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

        // retun response
        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }

    public function update(Request $request)
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

        // update name
        if ($request->has('name') && $request->name != '') {
            $user->name = $request->name;
            $user->update();
        }

        // update email
        if ($request->has('email') && $request->email != '') {
            $user->email = $request->email;
            $user->update();
        }

        // update wallet
        if ($request->has('wallet') && $request->wallet != '') {
            // wallets id
            $wallets = Wallet::whereIn('uuid', $request->wallet)->pluck('id')->toArray();

            // add wallets
            $user->wallets()->sync($wallets);
        }

        // enable notif
        if ($request->has('fcm_token') && $request->fcm_token != '') {
            $user->fcm_token = $request->fcm_token;
            $user->update();
        }

        // update user content
        $user = User::where('id', auth('sanctum')->user()->id)->with('wallets')->first();

        // retun response
        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }
}