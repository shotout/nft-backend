@extends('layouts.app')
@section('css')
{{-- select2 css --}}
<link rel="stylesheet" href="{{ asset('datta-able/plugins/select2/css/select2.min.css') }}"> 
<link rel="stylesheet" type="text/css" href="{{ asset('dist/css/item.min.css') }}">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.4.0/min/dropzone.min.css">
@endsection
@section('content')
@include('sweetalert::alert')
  <!-- Main content -->
<div class="col-sm-12" id="add-item-container">
  <div class="card user-list">
    <div class="card-header">        
      <h5><a href="{{ url('magang') }}">{{ __('Promotions') }}</a> >> {{ __('Promotion Edit') }}</h5>       
      <div class="card-header-right">      
      </div>
    </div>
    <div class="card-body table-border-style" >
        <div class="form-tabs">
          <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item">
              <a class="nav-link active text-uppercase" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="false">{{ __('Promotion Information') }}</a>
            </li>
            <li class="nav-item">
                <a class="nav-link text-uppercase" id="color-tab" data-toggle="tab" data-rel="{{ $promotion->id }}" href="#color" role="tab" aria-controls="profile" aria-selected="false">{{ __('Theme Setting') }}</a>
            </li>
            <li class="nav-item">
                <a class="nav-link text-uppercase" id="collection-tab" data-toggle="tab" data-rel="{{ $promotion->id }}" href="#collection" role="tab" aria-controls="profile" aria-selected="false">{{ __('Collection') }}</a>
            </li>
          </ul>
        </div>
      <form id="itemAddForm" class="form-horizontal" action="{{ url('promotion/save-promotion') }}" method="post" enctype="multipart/form-data">
        <input type="hidden" value="{{ csrf_token() }}" name="_token" id="token">
        <input type="hidden" value="{{ $promotion->id }}" name="promotion_id" id="promotion_id">
        <div class="tab-content" id="myTabContent">
          <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="info-tab">
            <div class="row">
              <div class="col-md-12">
                <div class="form-group row ">
                  <label class="col-sm-2 control-label require">{{ __('NFT Title') }}</label>
                  <div class="col-sm-9 pl-sm-3-custom">
                    <input type="text" class="form-control" placeholder="{{ __('NFT Title')  }}" name="nft_title" id="nft_title" value="{{ $promotion->nft_title }}">
                    <span id="checkMsg" class="text-danger"></span>
                  </div>
                </div>
                <div class="form-group row ">
                  <label class="col-sm-2 control-label require">{{ __('NFT Type') }}</label>
                  <div class="col-sm-4 pl-sm-3-custom">
                    <input type="text" class="form-control" placeholder="{{ __('NFT Type')  }}" name="nft_type" id="nft_type" value="{{ $promotion->nft_type }}">
                    <span id="checkMsg" class="text-danger"></span>
                  </div>
                  <label class="col-sm-1 control-label require">{{ __('NFT Price') }}</label>
                  <div class="col-sm-4 pl-sm-3-custom">
                    <input type="number" class="form-control" placeholder="{{ __('NFT Price')  }}" name="nft_price" id="nft_price" value="{{ $promotion->nft_price }}">
                    <span id="checkMsg" class="text-danger"></span>
                  </div>
                </div>
                <div class="form-group row ">
                  <label class="col-sm-2 control-label require">{{ __('NFT Owner') }}</label>
                  <div class="col-sm-4 pl-sm-3-custom">
                    <input type="number" class="form-control" placeholder="{{ __('NFT Owner')  }}" name="nft_amount" id="nft_amount" value="{{ $promotion->nft_amount }}">
                    <span id="checkMsg" class="text-danger"></span>
                  </div>
                  <label class="col-sm-1 control-label require">{{ __('Publish Date') }}</label>
                  <div class="col-sm-4 pl-sm-3-custom">
                    <input type="date" class="form-control" placeholder="{{ __('NFT Publish Date')  }}" name="nft_date" id="nft_date" value="{{ $promotion->nft_publish_date }}">
                    <span id="checkMsg" class="text-danger"></span>
                  </div>
                </div>
                <div class="form-group row mb-xs-2">
                  <label class="col-sm-2 control-label">{{ __('Description')  }}</label>
                  <div class="col-sm-6 pl-sm-3-custom">
                    <div class="custom-file">
                      <textarea class="form-control" name="nft_desc" id="nft_desc" rows="5">{{ $promotion->nft_description }}</textarea>
                    </div>                    
                  </div>                  
                </div> 
                <div class="form-group row mb-xs-2">
                  <label class="col-sm-2 control-label">{{ __('Raffle')  }}</label>
                  <div class="col-sm-6 pl-sm-3-custom">
                    <div class="custom-file">
                      <textarea class="form-control" name="nft_raffle" id="nft_raffle" rows="5">{{ $promotion->nft_raffle }}</textarea>
                    </div>                    
                  </div>   
              </div>
              <div class="form-group row mb-xs-2">
                  <label class="col-sm-2 control-label">{{ __('Community')  }}</label>
                  <div class="col-sm-6 pl-sm-3-custom">
                    <div class="custom-file">
                      <textarea class="form-control" name="nft_com" id="nft_com" rows="5">{{ $promotion->nft_community }}</textarea>
                    </div>                    
                  </div>   
              </div>
            
          <div class="col-sm-8 pl-sm-3-custom px-0 mobile-margin">
            <button class="btn btn-primary custom-btn-small custom-variant-title-validation" type="submit" id="btnSubmit">{{  __('Submit')  }}</button>   
            <a href="{{ url('magang') }}" class="btn btn-danger custom-btn-small">{{ __('Cancel') }}</a>
          </div>
        </div>
      </form>
    </div>
  </div>


            <div class="tab-pane fade" id="collection" role="tabpanel" aria-labelledby="collection-tab">
              
                      
                      <div class="row">
                        <div class="col-md-12">
                          <table id="example1" class="table table-bordered table-striped">
                            <thead>
                              <tr>
                                <th>{{ __('Collection') }}</th>
                              </tr>
                            </thead>
                            <tbody>
                                @foreach ($collection as $data)
                                  <tr>
                                    <td><img src="{{ url($data->image) }}" alt="" width="150" height="150"></td>
                                  </tr>                        
                                @endforeach
                              <tr>
                              </tr>
                            </tbody>
                            <form id="itemAddForm" class="form-horizontal" action="{{ url('promotion/save-collection') }}" method="post" enctype="multipart/form-data">
                                <input type="hidden" value="{{ csrf_token() }}" name="_token" id="token">
                                <input type="hidden" value="{{ $promotion->id }}" name="promotion_id" id="promotion_id">
                                    <div class="row">
                                      <div class="col-md-12">
                                      <div class="form-group row mb-xs-2">
                                          <label class="col-sm-2 control-label">{{ __('Collections')  }}</label>
                                          <div class="custom-file col-sm-8 pl-sm-3-custom">
                                            <div class="custom-file">
                                              <input type="file" class="custom-file-input" name="collection" id="validatedCustomFile" required>
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
                                    <button class="btn btn-primary custom-btn-small custom-variant-title-validation" type="submit" id="btnSubmit">{{  __('Add')  }}</button>   
                                    <a href="{{ url('magang') }}" class="btn btn-danger custom-btn-small">{{ __('Cancel') }}</a>
                                  </div>
                              </form>
                          </table>
                        </div>
                      </div>

                  
                    
            </div>   
  
        
  <div class="tab-pane fade" id="color" role="tabpanel" aria-labelledby="color-tab">                    
    <form id="itemAddForm" class="form-horizontal" action="{{ url('promotion/save-promotion') }}" method="post" enctype="multipart/form-data">
        <input type="hidden" value="{{ csrf_token() }}" name="_token" id="token">
        <input type="hidden" value="{{ $promotion->id }}" name="promotion_id" id="promotion_id">
            <div class="row">
              <div class="col-md-12">
                <div class="form-group row ">
                  <label class="col-sm-2 control-label ">{{ __('Main Color') }}</label>
                  <div class="col-sm-4 pl-sm-3-custom ">
                    <input type="text" class="form-control colorpicker" placeholder="{{ __('Main Color')  }}" name="main_color" id="main_color" value="{{ $color->main_color }}">
                    <span id="checkMsg" class="text-danger"></span>
                  </div>
                </div>
                <div class="form-group row ">
                  <label class="col-sm-2 control-label ">{{ __('Background Color') }}</label>
                  <div class="col-sm-4 pl-sm-3-custom">
                    <input type="text" class="form-control colorpicker" placeholder="{{ __('Background Color')  }}" name="background_color" id="background_color" value="{{ $color->background_color }}">
                    <span id="checkMsg" class="text-danger"></span>
                  </div>
                </div>
                <div class="form-group row ">
                  <label class="col-sm-2 control-label ">{{ __('Gradient Color #1') }}</label>
                  <div class="col-sm-4 pl-sm-3-custom">
                    <input type="text" class="form-control colorpicker" placeholder="{{ __('Main Color')  }}" name="main_color" id="main_color" value="{{ $color->gradient1_color }}">
                    <span id="checkMsg" class="text-danger"></span>
                  </div>
                </div>
                <div class="form-group row ">
                  <label class="col-sm-2 control-label ">{{ __('Gradient Color #2') }}</label>
                  <div class="col-sm-4 pl-sm-3-custom">
                    <input type="text" class="form-control colorpicker" placeholder="{{ __('Main Color')  }}" name="main_color" id="main_color" value="{{ $color->gradient2_color }}">
                    <span id="checkMsg" class="text-danger"></span>
                  </div>
                </div>
            
          <div class="col-sm-8 pl-sm-3-custom px-0 mobile-margin">
            <button class="btn btn-primary custom-btn-small custom-variant-title-validation" type="submit" id="btnSubmit">{{  __('Submit')  }}</button>   
            <a href="{{ url('magang') }}" class="btn btn-danger custom-btn-small">{{ __('Cancel') }}</a>
          </div>
      </form>
  </div>   

      


@endsection

@section('js')

<script src="{{ asset('datta-able/plugins/select2/js/select2.full.min.js')}}"></script>
<script src="{{ asset('dist/js/jquery.validate.min.js')}}"></script>
<script src="{{ asset('dist/js/custom/item.min.js') }}"></script>
</script>
@endsection

@push('script-internal')
   <script>
     
      var uploadedDocumentMap = {}
      Dropzone.options.documentDropzone = {
        
         url: "{{ route('images.upload') }}",
         maxFilesize: 2, // MB
         addRemoveLinks: true,
         acceptedFiles: ".jpeg,.jpg,.png,.gif",
         headers: {
            'X-CSRF-TOKEN': "{{ csrf_token() }}"
         },
         success: function(file, response) {
            $('form').append('<input type="hidden" name="photo[]" value="' + response.name + '">')
            uploadedDocumentMap[file.name] = response.name
         },
         removedfile: function(file) {
            file.previewElement.remove()
            var name = ''
            if (typeof file.file_name !== 'undefined') {
               name = file.file_name
            } else {
               name = uploadedDocumentMap[file.name]
            }
            $('form').find('input[name="photo[]"][value="' + name + '"]').remove()
         }
      }
   </script>
@endpush

@section('javascript')
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-colorpicker/2.5.3/js/bootstrap-colorpicker.min.js"></script>
    <script>
        $('.colorpicker').colorpicker();
    </script>
@stop