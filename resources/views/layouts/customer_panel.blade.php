<!DOCTYPE html>
  <head>
      <title>NFT of The Day</title>
      <!-- HTML5 Shim and Respond.js IE10 support of HTML5 elements and media queries -->
      <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
      <!--[if lt IE 10]>
        <script src="{{ asset('public/dist/js/respond.min.js') }}"></script>
      <![endif]-->
      <!-- Meta -->
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=0, minimal-ui">
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <link rel='shortcut icon' href="{{ weblogo() }}" type='image/x-icon' />

      <!-- fontawesome icon -->
      <link rel="stylesheet" href="{{ asset('datta-able/fonts/fontawesome/css/fontawesome-all.min.css') }}">
      <!-- material icon -->
      <link rel="stylesheet" href="{{ asset('datta-able/fonts/material/css/materialdesignicons.min.css') }}">
      <!-- flaq icon -->
      <link rel="stylesheet" href="{{ asset('datta-able/fonts/flag/css/flag-icon.min.css') }}">
      <!-- animation css -->
      <link rel="stylesheet" href="{{ asset('datta-able/plugins/animation/css/animate.min.css') }}">
      <!-- vendor css -->
      <link rel="stylesheet" href="{{ asset('datta-able/css/style.css?v=1.0') }}">
      <link rel="stylesheet" href="{{ asset('dist/css/custom.min.css') }}">

      <!--Custom CSS that was written on view-->
      @yield('css')

      @php 
        if (getThemeClass('theme-mode') == 'navbar-dark brand-dark') {
      @endphp
          <link rel="stylesheet" href="{{ asset('datta-able/css/layouts/dark.css') }}">
          <link rel="stylesheet" href="{{ asset('datta-able/css/layouts/dark-custom.min.css?v=1.0') }}">
      @php } @endphp
      
      <!-- Theme style RTL -->
      @php
        if (\Cache::get('gb-language-direction') == 'rtl') {
      @endphp
          <link rel="stylesheet" href="{{ asset('datta-able/css/layouts/rtl.css') }}">
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

  <body class="{{ getThemeClass('body') }}">
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

      <div class="modal fade" id="confirmDelete" role="dialog" aria-labelledby="confirmDeleteLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
              <h4 class="modal-title">{{ __('Delete Parmanently') }}</h4>
            </div>
            <div class="modal-body">
              <p>{{ __('Are you sure about this?') }}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">{{ __('Cancel') }}</button>
              <button type="button" class="btn btn-danger" id="confirm">{{ __('Delete') }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Required Js -->    
      <script src="{{ asset('datta-able/js/pcoded.min.js') }}"></script>
      <script src="{{ asset('datta-able/plugins/select2/js/select2.full.min.js') }}"></script>
      
      <script src="{{ asset('dist/js/moment.min.js') }}"></script>
      <script src="{{ asset('dist/plugins/bootstrap-daterangepicker/daterangepicker.min.js') }}"></script>
      <!-- Custom Js -->  
      <script type="text/javascript">
        'use strict';
        var startDate = "{!! isset($from) ? $from : 'undefined' !!}";
        var endDate   = "{!! isset($to) ? $to : 'undefined' !!}";
        </script>
      <script src="{{ asset('dist/js/custom/customer-panel.min.js') }}"></script>
      @yield('js')
  </body>

</html>