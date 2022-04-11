<!DOCTYPE html>
<html>

<head>
    <title>{{ env('APP_NAME', '') }} {{!empty($page_title) ? '| ' . ucfirst($page_title) : '' }}</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=0, minimal-ui">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    
    <!-- Favicon icon -->
    @if(!empty($favicon))
        <link rel='shortcut icon' href="{{ URL::to('/') }}/uploads/companyIcon/{{ $favicon }}" type='image/x-icon' />
    @endif
    <link rel="stylesheet" href="{{ asset('datta-able/fonts/fontawesome/css/fontawesome-all.min.css') }}">
    <link rel="stylesheet" href="{{ asset('datta-able/plugins/animation/css/animate.min.css') }}">
    <link rel="stylesheet" href="{{ asset('datta-able/css/style.css') }}">
    
    
</head>
<body>
    <div class="auth-wrapper">
        <div class="auth-content">
            <div class="card">
                <div class="card-body text-center">
                    <div class="mb-4">
                        <i class="feather icon-unlock auth-icon"></i>
                    </div>
                    <h4 class="mb-4"><b>{{'NFT of The Day'}}</b></h4>
                    <div class="">
                        @if (count($errors) > 0)
                            <div class="alert alert-danger">
                                <strong>Whoops!</strong> There were some problems with your input.<br><br>
                                <ul>
                                    @foreach ($errors->all() as $error)
                                        <li>{{ $error }}</li>
                                    @endforeach
                                </ul>
                            </div>
                        @endif

                        @foreach (['success', 'danger', 'fail', 'warning', 'info'] as $msg)
                            @if($message = Session::get($msg))
                                <div class="alert alert-{{ $msg == 'fail' ? 'danger' : $msg }}">
                                    <button type="button" class="close" data-dismiss="alert">×</button>
                                    <strong>{{ $message }}</strong>
                                </div>~
                                @break
                            @endif
                        @endforeach
                    </div>
                    @yield('content')
                </div>
            </div>
        </div>
    </div>
    <script src="{{ asset('datta-able/js/pcoded.min.js') }}"></script>
    @yield('js')
</body>
</html>
