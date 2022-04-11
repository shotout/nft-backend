@extends('layouts.app')
@section('css')
  {{-- Datatable --}}
  <link rel="stylesheet" href="{{ asset('dist/plugins/Responsive-2.2.5/css/responsive.dataTables.css') }}">
  <!-- daterange picker -->
  <link rel="stylesheet" href="{{ asset('dist/plugins/bootstrap-daterangepicker/daterangepicker.css') }}">
  <!-- Select2 -->
  <link rel="stylesheet" href="{{ asset('datta-able/plugins/select2/css/select2.min.css') }}">
  <!-- Bootstrap multi select -->
  <link rel="stylesheet" href="{{ asset('dist/plugins/bootstrap-select/dist/css/bootstrap-select.min.css') }}">

  @yield('listCSS')

@endsection

@section('content')
  <!-- Main content -->
<div class="col-sm-12 list-container" id="list-layout-container">
  <div class="card">
    <div class="card-header">
      @yield('list-title')
      <div class="card-header-right d-inline-block">
        @yield('list-add-button')
        
      </div>
    </div>
    <div class="card-body p-0">
      <div class="col-sm-12 yearMarginCSS px-0">
        @yield('list-form-content')
      </div>
      <div class="card-block pt-2 barChart display_none">
        @yield('barChart-content')
      </div>
      <div class="card-block pt-2 px-2">
        <div class="col-sm-12">
          <div class="table-responsive">
            {!! $dataTable->table(['class' => 'table table-striped table-hover dt-responsive', 'width' => '100%', 'cellspacing' => '0']) !!}
          </div>
          @yield('special-note')  
        </div>
      </div>
    </div>
  </div>
</div>
<div class="modal fade" id="theModal" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="theModalLabel"></h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <div class="modal-body">
          
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary custom-btn-small" data-dismiss="modal">{{ __('Close') }}</button>
        <button type="button" id="theModalSubmitBtn" data-task="" class="btn btn-danger custom-btn-small">{{ __('Delete') }}</button>
        <span class="ajax-loading"></span>
      </div>
    </div>
  </div>
</div>
@endsection
@section('js')
<script src="{{ asset('dist/plugins/DataTables-1.10.21/js/jquery.dataTablesCus.min.js') }}"></script>
<script src="{{ asset('dist/plugins/Responsive-2.2.5/js/dataTables.responsive.min.js') }}"></script>
<script src="{{ asset('dist/js/moment.min.js') }}"></script>
<script src="{{ asset('dist/plugins/bootstrap-daterangepicker/daterangepicker.min.js') }}"></script>
<script src="{{ asset('datta-able/plugins/select2/js/select2.full.min.js') }}"></script>
<script src="{{ asset('dist/plugins/bootstrap-select/dist/js/bootstrap-select.min.js') }}"></script>
@yield('list-js')
{!! $dataTable->scripts() !!}
<script type="text/javascript">
  'use strict';
  var startDate = "{!! isset($from) ? $from : 'undefined' !!}";
  var endDate   = "{!! isset($to) ? $to : 'undefined' !!}";
</script>
<script src="{{ asset('dist/js/custom/list-layout.min.js') }}"></script>
@endsection