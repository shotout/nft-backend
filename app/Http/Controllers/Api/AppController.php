<?php

namespace App\Http\Controllers\Api;

use App\Models\Setting;
use App\Models\Version;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AppController extends Controller
{
    public function list()
    {
        // get all setting
        $settings = Setting::get();

        // retun response
        return response()->json([
            'status' => 'success',
            'data' => $settings
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
