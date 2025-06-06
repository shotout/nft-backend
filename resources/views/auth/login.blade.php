@extends('layouts.app2')
@section('content')
<form action="{{ url('/authenticate') }}" method="post" id="signInform">
    @csrf {!! csrf_field() !!}
    <div class="input-group mb-3">
        <input type="email" id="email"  class="form-control" value="{{ old('email') }}" name="email" placeholder="Email">
    </div>
    <div class="input-group mb-4">
        <input type="password" id="password" class="form-control" name="password" placeholder="password">
    </div>      
    <div class="form-group">       

        <div class="col-6 col-sm-5 float-right">
            <button class="btn btn-primary custom-btn-small" type="submit" id="btnSubmit"></i>{{ __('Sign In') }}</button>
        </div>
    </div>
    <p class="mb-2 text-muted text-left">{{ __('Forgot your password?') }} <a href="{{ url('/password/reset') }}">{{ __('Reset') }}</a></p>
</form>
@endsection
@section('js')
<script src="{{ asset('dist/js/custom/login.min.js') }}"></script>
@endsection
