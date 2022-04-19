@extends('layouts.list-layout')

@section('list-title')
  <h5><a href="{{ url('promotion/list') }}">{{ __('Promotions List') }}</a></h5>
@endsection

@section('list-form-content')
@include('sweetalert::alert')
  @php  
    $from = $to = ''; 
  @endphp
  <div class="col-md-12 col-sm-12 col-xs-12 m-l-10 m-b-0">
    <div class="buttonRelation mt-3">      
      <a href="{{ url('promotion/create') }}" class="btn btn-outline-primary custom-btn-small"><span class="fa fa-plus"> &nbsp;</span>Add New Promotion</a>
    </div>
  </div>
  <div class="alert alert-danger display_none" role="alert" id="alert">
    {{ __('Something went wrong, please try again.') }}
  </div>

  <div class="modal fade" id="confirmDelete" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="confirmDeleteLabel"></h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">×</span>
          </button>
        </div>
        <div class="modal-body">
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary custom-btn-small" data-dismiss="modal">{{ __('Close') }}</button>
          <button type="button" id="confirmDeleteSubmitBtn" data-task="" class="btn btn-danger custom-btn-small delete-task-btn">{{ __('Submit') }}</button>
          <span class="ajax-loading"></span>
        </div>
      </div>
    </div>
  </div>
@endsection

@section('list-js')
<script src="{{ asset('dist/js/custom/customer.min.js') }}"></script>
<script src="{{ asset('dist/js/custom/item.min.js') }}"></script>

@endsection