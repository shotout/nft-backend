<?php

namespace App\Http\Controllers;

class PageController extends Controller
{
    public function apple()
    {
        return (object) array(
            "applinks" => (object) array(
                "apps" => [],
                "details" => array(
                    (object) array(
                        'appID' => 'PQ7KYCJA35.com.nftdaily',
                        'paths' => ['*']
                    )
                )
            )
        );
    }

    public function asset()
    {
        return response()->file(public_path('assets/logo/assetlinks.json'));
        // $data = array();
        // $data[] = (object) array(
        //     "relation" => array("delegate_permission/common.handle_all_urls"),
        //     "target" => (object) array(
        //         "namespace" => "android_app",
        //         "package_name" => "com.nftdaily",
        //         "sha256_cert_fingerprints" => array("CD:10:C9:F3:6E:2E:62:E2:D1:80:5F:95:60:8C:B9:74:C2:FC:DF:09:D9:F5:05:07:37:6E:70:49:F8:39:C5:F4")
        //     )
        // );
        // return $data;
    }
}
