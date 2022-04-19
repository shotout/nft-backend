@extends('layouts.app')
@section('css')
{{-- select2 css --}}
<link rel="stylesheet" href="{{ asset('datta-able/plugins/select2/css/select2.min.css') }}"> 
<link rel="stylesheet" type="text/css" href="{{ asset('dist/css/item.min.css') }}">
@endsection
@section('content')
@include('sweetalert::alert')
  <!-- Main content -->
<div class="col-sm-12" id="add-item-container">
  <div class="card user-list">
      <div class="card-header">
        <h5><a href="{{ url('faq/list') }}">{{ __('FAQ') }}</a> >> {{ __('New FAQ') }}</h5>
        <div class="card-header-right">
        </div>
      </div>
    <div class="card-block">
      <div class="form-tabs">
        <ul class="nav nav-tabs" id="myTab" role="tablist">
          <li class="nav-item">
            <a class="nav-link active text-uppercase" id="info-tab" data-toggle="tab" href="#info" role="tab" aria-controls="info" aria-selected="true">{{ __('FAQ Information') }}</a>
          </li>          
        </ul>
      </div>
      <form id="itemAddForm" class="form-horizontal" action="{{ url('faq/save') }}" method="post" enctype="multipart/form-data">
        <input type="hidden" value="{{ csrf_token() }}" name="_token" id="token">
        <div class="tab-content" id="myTabContent">
          <div class="tab-pane fade show active" id="info" role="tabpanel" aria-labelledby="info-tab">
            <div class="row">
              <div class="col-md-8">
                <div class="form-group row ">
                  <label class="col-sm-2 control-label require">{{ __('Question') }}</label>
                  <div class="col-sm-10 pl-sm-3-custom">
                    <textarea type="text" class="form-control" placeholder="{{ __('Question')  }}" name="faq_question" id="faq_question" value="{{ old('Wallet Name') }}" rows = "3"></textarea>
                    <span id="checkMsg" class="text-danger"></span>
                  </div>
                </div>
                <div class="form-group row">
                      <label class="col-sm-2 control-label require">{{ __('Message') }}</label>
                          <div class="col-sm-10">
                              <textarea class="ticket_message form-control" name="faq_answer" id="faq_answer" placeholder="{{ __('Answer')  }}">{{ old('message') }}</textarea>
                          <label id="ticket_messages-error" class="error" for="ticket_messages"></label>
                      </div>
                </div>                        
               </div>
                <div class="form-group row" id="prvw" hidden="true">
                  <div class="col-md-4 offset-md-2">
                    <img id="blah" src="#" alt="" class="img-responsive img-thumbnail" hidden="true" />
                  </div>
                </div>             
              </div>
            </div>
            
          <div class="col-sm-8 pl-sm-3-custom px-0 mobile-margin">
            <button class="btn btn-primary custom-btn-small custom-variant-title-validation" type="submit" id="btnSubmit">{{  __('Submit')  }}</button>   
            <a href="{{ url('faq/list') }}" class="btn btn-danger custom-btn-small">{{ __('Cancel') }}</a>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>
@endsection

@section('js')

<script src="{{ asset('datta-able/plugins/select2/js/select2.full.min.js')}}"></script>
<script src="{{ asset('dist/js/jquery.validate.min.js')}}"></script>
<script src="{{ asset('dist/js/custom/item.min.js') }}"></script>
</script>
@endsection

@push('scripts')
<script src="//cdn.ckeditor.com/4.6.2/standard/ckeditor.js"></script>
<script>
    CKEDITOR.replace('faq_answer');
    </script>
@endpush