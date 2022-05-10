@extends('layouts.list-layout')

@section('list-title')
  <h5><a href="{{ url('dosen/list') }}">{{ __('Admin List') }}</a></h5>
@endsection

@section('list-form-content')
  @php  
    $from = $to = ''; 
  @endphp
  <div class="col-md-12 col-sm-12 col-xs-12 m-l-10 m-b-0">
    <div class="buttonRelation mt-3">      
      <a href="{{ url('admin/create-admin') }}" class="btn btn-outline-primary custom-btn-small"><span class="fa fa-plus"> &nbsp;</span>Add New Admin</a>
    </div>
    
    <div class="row mt-3">
      <div class="col-md-4 col-sm-4 col-xs-12">
        <div class="card project-task theme-bg">
          <div class="card-block">
            <div class="row  align-items-center">
              <div class="col-6">
                <a href="{{ url('admin/list?admin=total') }}">
                  <h5 class="text-white"><i class="fas fa-users m-r-10 f-20"></i>{{ __('Total') }}</h5>
                </a>
              </div>
              <div class="col-6 text-right">
                <a href="{{ url('admin/list?admin=total') }}">
                  <h3 class="text-white" id="total_admin">{{ $total_admin }}</h3>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-sm-4 col-xs-12">
        <div class="card project-task bg-c-blue">
          <div class="card-block">
            <div class="row  align-items-center">
              <div class="col-6">
                <a href="{{ url('admin/list?admin=admin_active') }}">
                  <h5 class="text-white"><i class="fas fa-users m-r-5 f-20"></i>{{ __('Active') }}</h5>
                </a>
              </div>
              <div class="col-6 text-right">
                <a href="{{ url('admin/list?admin=admin_active') }}">
                  <h3 class="text-white" id="admin_active">{{ $admin_active }}</h3>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-sm-4 col-xs-12">
        <div class="card project-task theme-bg2">
          <div class="card-block">
            <div class="row align-items-center">
              <div class="col-7">
                <a href="{{ url('admin/list?admin=admin_inactive') }}">
                  <h5 class="text-white"><i class="fas fa-users m-r-10 f-20"></i>{{ __('Inactive') }}</h5>
                </a>
              </div>
              <div class="col-5 text-right">
                <a href="{{ url('admin/list?admin=admin_inactive') }}">
                  <h3 class="text-white" id="admin_inactive">{{ $admin_inactive }}</h3>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="alert alert-danger display_none" role="alert" id="alert">
    {{ __('Something went wrong, please try again.') }}
  </div>
@endsection

@section('list-js')
<script src="{{ asset('dist/js/custom/customer.min.js') }}"></script>
@endsection