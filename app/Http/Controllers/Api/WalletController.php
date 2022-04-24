<?php

namespace App\Http\Controllers\Api;

use App\Models\Wallet;
use App\Http\Controllers\Controller;

class WalletController extends Controller
{
    public function list()
    {
        // get all wallets
        $wallets = Wallet::select('uuid','name','image')->get();

        // add image url
        foreach ($wallets as $wallet) {
            $wallet->image_url = env('APP_URL').'/'.$wallet->image;
        }

        // retun response
        return response()->json([
            'status' => 'success',
            'data' => $wallets
        ]);
    }
}