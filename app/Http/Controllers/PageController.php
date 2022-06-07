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
}
