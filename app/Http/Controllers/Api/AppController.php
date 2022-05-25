<?php

namespace App\Http\Controllers\Api;

use App\Models\Setting;
use App\Http\Controllers\Controller;

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
}
