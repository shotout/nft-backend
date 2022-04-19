<!DOCTYPE html>
<head>
    <title>{{ 'NFT of The Day' }}</title>
    
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=0, minimal-ui">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <link rel='shortcut icon' href="{{ weblogo() }}" type='image/x-icon' />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-colorpicker/2.5.3/css/bootstrap-colorpicker.min.css" rel="stylesheet">
    <!-- fontawesome icon -->
    <link rel="stylesheet" href="{{ asset('datta-able/fonts/fontawesome/css/fontawesome-all.min.css') }}">
    <!-- Material icon -->
    <link rel="stylesheet" href="{{ asset('datta-able/fonts/material/css/materialdesignicons.min.css') }}">
    <!-- flaq icon -->
    <link rel="stylesheet" href="{{ asset('datta-able/fonts/flag/css/flag-icon.min.css') }}">
    <!-- animation css -->
    <link rel="stylesheet" href="{{ asset('datta-able/plugins/animation/css/animate.min.css') }}">
    <!-- vendor css -->
    <link rel="stylesheet" href="{{ asset('datta-able/css/style.css?v=1.0') }}">
    <link rel="stylesheet" href="{{ asset('dist/css/custom.min.css?v=1.0') }}">


    <!--Custom CSS that was written on view-->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.5.1/min/dropzone.min.css" rel="stylesheet" />
   <style>
      .dz-image img {
         width: 120px;
         height: 120px;
      }

   </style>

    @yield('css')

    @php
        if (getThemeClass('theme-mode') == 'navbar-dark brand-dark') {
    @endphp
        <link rel="stylesheet" href="{{ asset('datta-able/css/layouts/dark.min.css') }}">
        <link rel="stylesheet" href="{{ asset('datta-able/css/layouts/dark-custom.min.css?v=1.0') }}">
    @php } @endphp
    <script type="text/javascript">
        'use strict';
        var SITE_URL              = "{{ URL::to('/') }}";

    </script>
    <!-- Required Js -->
    <script src="{{ asset('datta-able/js/vendor-all.js') }}"></script>
</head>

<?php
	$appName = env('APP_NAME', '');
	$appName = (!empty($appName) && mb_strlen($appName) > 19) ? mb_substr($appName, 0, 17) .'..' : $appName;
?>

<body class="navbar-dark brand-dark">
    <!-- [ Pre-loader ] start -->
    <div class="loader-bg">
        <div class="loader-track">
            <div class="loader-fill"></div>
        </div>
    </div>
    <!-- [ Pre-loader ] End -->

    <!-- [ navigation menu ] start -->
    @include('layouts.includes.sidebar')
    <!-- [ navigation menu ] end -->

    <!-- [ Header ] start -->
    @include('layouts.includes.header')
    <!-- [ Header ] end -->

    <!-- [ Main Content ] start -->
    <div class="pcoded-main-container">
        <div class="pcoded-wrapper">
            <div class="pcoded-content">
                <div class="pcoded-inner-content">
                    <!-- [ breadcrumb ] start -->
                    <!-- [ breadcrumb ] end -->
                    <div class="main-body">
                        <div class="page-wrapper">
                            <!-- [ Main Content ] start -->
                            <div class="row">
                                @yield('content')
                            </div>
                            <!-- [ Main Content ] end -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    {{-- Custom Js --}}
    <script>
        "use strict";
        var menu = "{{ $menu }}";
    </script>
    <!-- Required Js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.5.1/min/dropzone.min.js"></script>
    <script src="{{ asset('datta-able/js/pcoded.min.js') }}"></script>
    <script src="{{ asset('dist/js/custom/app-layout.min.js') }}"></script>

    @yield('javascript')
    <!-- Custom Js -->
    @yield('js')
</body>

</html>
