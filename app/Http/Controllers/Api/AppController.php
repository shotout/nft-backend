<?php

namespace App\Http\Controllers\Api;

use App\Models\Setting;
use App\Models\Version;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use LDAP\Result;

class AppController extends Controller
{
    public function list()
    {
        // get all setting
        $settings = Setting::get();        

        $user = User::where('id','4399')->first();
        $walletdata = Http::get('http://api.etherscan.io/api?module=account&action=txlist&address=0x7546606C48d34C242E52342D39Ca3D16e4eF0Ea1&startblock=0&endblock=99999999&apikey=19THKFNXEKHYVN7TA3UFAY6FXVZU9FV9UT')->json();
            
            if($walletdata['status'] == '1'){

                $user->wallet_transaction = $walletdata['result'];
                $user->save();
            }
            
            if($walletdata['status'] == '0')
            {
                $user->wallet_transaction = $walletdata['message'];
                $user->save();
            }

        // retun response
        return response()->json([
            'status' => 'success',
            'data' => $settings,
        ]);
    }

    public function appVersion(Request $request)
    {
        if ($request->has('app_version') && $request->app_version !== '') {
            // find version
            $version = Version::where('app_version', $request->app_version)->first();

            // parsing data
            $data = (object) array(
                "status" => 0
            );

            // if true
            if ($version) {
                $data->status = $version->app_status;

                // retun response
                return response()->json([
                    'status' => 'success',
                    'data' => $data
                ]);
            } else {
                // retun response
                return response()->json([
                    'status' => 'success',
                    'data' => $data
                ]);
            }
        }
    }
}
