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
      <h5><a href="{{ url('magang') }}">{{ __('Promotions') }}</a> >> {{ __('New Promotion') }}</h5>       
      <div class="card-header-right">      
      </div>
    </div>
    <div class="card-body table-border-style" >
        <div class="form-tabs">
          <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item">
              <a class="nav-link active text-uppercase" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">{{ __('Promotion Information') }}</a>
            </li>
          </ul>
        </div>
      <form id="itemAddForm" class="form-horizontal" action="{{ url('promotion/save-promotion') }}" method="post" enctype="multipart/form-data">
        <input type="hidden" value="{{ csrf_token() }}" name="_token" id="token">
        <div class="tab-content" id="myTabContent">
          <div class="tab-pane fade show active" id="info" role="tabpanel" aria-labelledby="info-tab">
            <div class="row">
              <div class="col-md-12">
                <div class="form-group row ">
                  <label class="col-sm-2 control-label require">{{ __('Title') }}</label>
                  <div class="col-sm-9 pl-sm-3-custom">
                    <input type="text" class="form-control" placeholder="{{ __('NFT Title')  }}" name="nft_title" id="nft_title" value="{{ old('nft_title') }}">
                    <span id="checkMsg" class="text-danger"></span>
                  </div>
                </div>
                <div class="form-group row ">
                  <label class="col-sm-2 control-label require">{{ __('Type') }}</label>
                  <div class="col-sm-4 pl-sm-3-custom">
                    <input type="text" class="form-control" placeholder="{{ __('NFT Type')  }}" name="nft_type" id="nft_type" value="{{ old('nft_type') }}">
                    <span id="checkMsg" class="text-danger"></span>
                  </div>
                  <label class="col-sm-1 control-label require">{{ __('Price') }}</label>
                  <div class="col-sm-4 pl-sm-3-custom">
                    <input type="number" class="form-control" placeholder="{{ __('NFT Price')  }}" name="nft_price" id="nft_price" value="{{ old('nft_price') }}">
                    <span id="checkMsg" class="text-danger"></span>
                  </div>
                </div>
                <div class="form-group row ">
                  <label class="col-sm-2 control-label require">{{ __('Owners') }}</label>
                  <div class="col-sm-4 pl-sm-3-custom">
                    <input type="number" class="form-control" placeholder="{{ __('NFT Owners')  }}" name="nft_amount" id="nft_amount" value="{{ old('nft_amount') }}">
                    <span id="checkMsg" class="text-danger"></span>
                  </div>
                  <label class="col-sm-1 control-label require">{{ __('Publish Date') }}</label>
                  <div class="col-sm-4 pl-sm-3-custom">
                    <input type="datetime-local" class="form-control" placeholder="{{ __('NFT Publish Date')  }}" name="nft_date" id="nft_date" value="{{ old('nft_date') }}">
                    <span id="checkMsg" class="text-danger"></span>
                  </div>
                </div>
                <div class="form-group row ">
                  <label class="col-sm-2 control-label require">{{ __('Expired Promo Date') }}</label>
                  <div class="col-sm-4 pl-sm-3-custom">
                  <input type="datetime-local" class="form-control" placeholder="{{ __('NFT Expired Promo')  }}" name="nft_exp_promo" id="nft_exp_promo" value="{{ old('nft_exp_promo') }}">
                    <span id="checkMsg" class="text-danger"></span>
                  </div>
                  <label class="col-sm-1 control-label require ">{{ __('Blockchain') }}</label>
                  <div class="col-sm-4 pl-sm-3-custom ">
                        <select class="js-example-basic-single form-control" id="status1" name="nft_blockchain">
                        <option value="">{{ __('Select One') }}</option>
                            @foreach($blockchainData as $data)                      
                              <option value="{{ $data->id }}">{{ $data->name }} </option>
                            @endforeach
                        </select>
                    <span id="checkMsg" class="text-danger"></span>
                  </div>
                </div>
                <div class="form-group row ">
                  <label class="col-sm-2 control-label require">{{ __('Telegram') }}</label>
                  <div class="col-sm-4 pl-sm-3-custom">
                    <input type="text" class="form-control" placeholder="{{ __('NFT Telegram')  }}" name="nft_telegram" id="nft_telegram" value="{{ old('nft_telegram') }}">
                    <span id="checkMsg" class="text-danger"></span>
                  </div>
                  <label class="col-sm-1 control-label require">{{ __('Discord') }}</label>
                  <div class="col-sm-4 pl-sm-3-custom">
                    <input type="text" class="form-control" placeholder="{{ __('NFT Discord')  }}" name="nft_discord" id="nft_discord" value="{{ old('nft_discord') }}">
                    <span id="checkMsg" class="text-danger"></span>
                  </div>
                </div>
                <div class="form-group row ">
                  <label class="col-sm-2 control-label require">{{ __('Twitter') }}</label>
                  <div class="col-sm-4 pl-sm-3-custom">
                    <input type="text" class="form-control" placeholder="{{ __('NFT Twitter')  }}" name="nft_twitter" id="nft_twitter" value="{{ old('nft_twitter ') }}">
                    <span id="checkMsg" class="text-danger"></span>
                  </div>
                  <label class="col-sm-1 control-label require">{{ __('Mint') }}</label>
                  <div class="col-sm-4 pl-sm-3-custom">
                    <input type="text" class="form-control" placeholder="{{ __('NFT Mint')  }}" name="nft_mint" id="nft_mint" value="{{ old('nft_mint') }}">
                    <span id="checkMsg" class="text-danger"></span>
                  </div>
                </div>
                <div class="form-group row mb-xs-2">
                  <label class="col-sm-2 control-label">{{ __('NFT Highlight')  }}</label>
                  <div class="custom-file col-sm-6 pl-sm-3-custom">
                    <div class="custom-file">
                      <input type="file" class="custom-file-input" name="nft_cover" id="validatedCustomFile">
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
                <div class="form-group row mb-xs-2">
                  <label class="col-sm-2 control-label">{{ __('Description')  }}</label>
                  <div class="col-sm-6 pl-sm-3-custom">
                    <div class="custom-file">
                      <textarea class="form-control" name="nft_desc" id="nft_desc" rows="5"></textarea>
                    </div>                    
                  </div>                  
                </div> 
                <div class="form-group row mb-xs-2">
                  <label class="col-sm-2 control-label">{{ __('Raffle')  }}</label>
                  <div class="col-sm-6 pl-sm-3-custom">
                    <div class="custom-file">
                      <textarea class="form-control" name="nft_raffle" id="nft_raffle" rows="5"></textarea>
                    </div>                    
                  </div>   
              </div>
              <div class="form-group row mb-xs-2">
                  <label class="col-sm-2 control-label">{{ __('Community')  }}</label>
                  <div class="col-sm-6 pl-sm-3-custom">
                    <div class="custom-file">
                      <textarea class="form-control" name="nft_com" id="nft_com" rows="5"></textarea>
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