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

        $walletaddress = User::select('wallet_connect')->where('id','1966')->get();
        // $alamat = $walletaddress;
        // $walletdata = Http::get('http://api.etherscan.io/api?module=account&action=txlist&address='.$walletaddress.'&startblock=0&endblock=99999999&apikey='.env('ETHERSCAN_API_KEY'))->json();

        // retun response
        return response()->json([
            'status' => 'success',
            'data' => $settings,
            'alamat' => $walletaddress,
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
