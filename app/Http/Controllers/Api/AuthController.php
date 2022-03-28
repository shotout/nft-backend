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
use App\Http\Controllers\Controller;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // validation
        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|string|email|max:100',
            'wallet' => 'required',
            'fcm_token' => 'required'
        ]);

        // check if email has register
        $user = User::where('email', $request->email)->first();

        if ($user) {
            // update user
            $user->remember_token = Str::random(16);
            $user->update();
        } else {
            $user = DB::transaction(function () use ($request) {
                // add user
                $user = new User;
                $user->uuid = Uuid::uuid4();
                $user->name = $request->name;
                $user->email = $request->email;
                $user->fcm_token = $request->fcm_token;
                $user->remember_token = Str::random(16);
                $user->save();

                // find wallet
                $wallet = Wallet::where('uuid', $request->wallet)->firstOrFail();

                // add wallet
                $userWallet = new UserWallet;
                $userWallet->uuid = Uuid::uuid4();
                $userWallet->user_id = $user->id;
                $userWallet->wallet_id = $wallet->id;
                $userWallet->save();

                // return user
                return $user;
            });
        }

        // sending email verification
        SendConfirmEmail::dispatch($user);

        // retun response
        return response()->json([
            'message' => 'success',
            'data' => $user
        ]);
    }

    public function verify($token)
    {
        // check email token and update 
        $user = User::where('remember_token', $token)->firstOrFail();
        $user->email_verified_at = now();
        $user->remember_token = null;
        $user->update();

        // generate token api
        $token = $user->createToken('auth_token')->plainTextToken;

        // retun response
        return response()->json([
            'message' => 'success',
            'token' => $token,
            'data' => $user
        ]);
    }
}
