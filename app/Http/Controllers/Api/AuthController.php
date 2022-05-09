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
            // $user->fcm_token = $request->fcm_token;
            $user->remember_token = Str::random(16);
            $user->save();

            // wallets id
            $wallets = Wallet::whereIn('uuid', $request->wallet)->pluck('id')->toArray();

            // add wallets
            $user->wallets()->sync($wallets);

            // return user
            return $user;
        });

        if ($user) {
            // sending email verification
            SendConfirmEmail::dispatch($user)->onQueue('apiNft');

            // retun response
            return response()->json([
                'status' => 'success',
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
        if (!$user->email_verified_at) {
            return response()->json([
                'status' => 'failed',
                'message' => 'email account not verified',
            ]);
        }

        // update user
        $user->remember_token = Str::random(16);
        $user->update();

        // sending email verification
        SendConfirmEmail::dispatch($user)->onQueue('apiNft');

        // retun response
        return response()->json([
            'status' => 'success',
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
            return response()->json([
                'status' => 'failed',
                'message' => 'token expired',
            ]);
        }

        $user->email_verified_at = now();
        $user->remember_token = null;
        $user->update();

        // generate token api
        $token = $user->createToken('auth_token')->plainTextToken;

        // retun response
        return response()->json([
            'status' => 'success',
            'token' => $token,
            'data' => $user
        ]);
    }
}
