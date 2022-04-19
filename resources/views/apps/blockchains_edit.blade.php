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
        <h5><a href="{{ url('blockchain/list') }}">{{ __('Blockchains') }}</a> >> {{ $blockchainData->name }} >> {{ __('Update Blockchain Data') }}</h5>
        <div class="card-header-right">
        </div>
      </div>
    <div class="card-block">
      <div class="form-tabs">
        <ul class="nav nav-tabs" id="myTab" role="tablist">
          <li class="nav-item">
            <a class="nav-link active text-uppercase" id="info-tab" data-toggle="tab" href="#info" role="tab" aria-controls="info" aria-selected="true">{{ __('Blockchain Information') }}</a>
          </li>          
        </ul>
      </div>
      <form id="itemAddForm" class="form-horizontal" action="{{ url('blockchain/update') }}" method="post" enctype="multipart/form-data">
        <input type="hidden" value="{{ csrf_token() }}" name="_token" id="token">
        <input type="hidden" value="{{ $blockchainData->id }}" name="blockchain_id" id="blockchain_id">
        <div class="tab-content" id="myTabContent">
          <div class="tab-pane fade show active" id="info" role="tabpanel" aria-labelledby="info-tab">
            <div class="row">
              <div class="col-md-8">
                <div class="form-group row ">
                  <label class="col-sm-2 control-label require">{{ __('Blockchain Name') }}</label>
                  <div class="col-sm-8 pl-sm-3-custom">
                    <input type="text" class="form-control" placeholder="{{ __('Blockchain Name')  }}" name="blockchain_name" id="blockchain_name" value="{{ $blockchainData->name }}">
                    <span id="checkMsg" class="text-danger"></span>
                  </div>
                </div>
                <div class="form-group row mb-xs-2">
                  <label class="col-sm-2 control-label">{{ __('Blockchain Logo')  }}</label>
                  <div class="custom-file col-sm-8 pl-sm-3-custom">
                    <div class="custom-file">
                      <input type="file" class="custom-file-input" name="blockchain_logo" id="validatedCustomFile">
                      <label class="custom-file-label overflow-hidden" for="validatedCustomFile">{{ __('Upload File')  }}</label>
                    </div>                    
                  </div>
                </div>
                <div class="form-group row" id="prvw" hidden="true">
                  <div class="col-md-4 offset-md-2">
                    <img id="blah" src="#" alt="" class="img-responsive img-thumbnail" hidden="true" />
                  </div>
                </div>
                <div class="form-group row">
                  <div class="col-md-8 offset-sm-2" id='note_txt_1'>
                    <span class="badge badge-danger">{{ __('Note')  }}!</span> {{ __(' Allowed File Extensions: JPG,PNG,JPEG') }} || {{__('Max File Size : 10 Mb') }}
                  </div>
                </div>                
              </div>
            </div>
            
          <div class="col-sm-8 pl-sm-3-custom px-0 mobile-margin">
            <button class="btn btn-primary custom-btn-small custom-variant-title-validation" type="submit" id="btnSubmit">{{  __('Update')  }}</button>   
            <a href="{{ url('blockchain/list') }}" class="btn btn-danger custom-btn-small">{{ __('Cancel') }}</a>
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