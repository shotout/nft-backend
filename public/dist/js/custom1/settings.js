"use strict";
$(document).on( 'init.dt', function () {
  $(".dataTables_length").remove();
  $('#dataTableBuilder').removeAttr('style');
});
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
    }
}

function myFunction(x) {
    // If media query matches
    if (x.matches) {
      $('#cardRightButton').prev().css({'display': 'block'});
      $('#cardRightButton').addClass('row').css({'display': 'block', 'float': 'left', 'position': 'relative', 'right': '-20px'});

    } else {
      $('#cardRightButton').prev().css({'display': 'inline-block'});
      $('#cardRightButton').removeClass('row').css({'display': 'inline-block', 'float': 'right','position': 'absolute','right': '10px'});
    }
  }

$(window).on('load', function () {
    if ($(window).width() > 575 && $(window).width() < 800) {
        $('#company-settings-container #siteshortlabel').addClass('pb-0 pt-0');
    }
    var isVisible = $('#company-settings-container #pro_img').is(":visible");
    if (isVisible) {
        $('#company-settings-container #iconTop').css('cssText', 'margin-top: -1.5rem !important;');
    }
});
if ($('.main-body .page-wrapper').find('#company-settings-container').length) {
    $(".js-example-basic-single").select2();

    jQuery.validator.addMethod("regxEmailValidation", function(value, element) {
      return this.optional(element) || validateEmail(value);
    }, jsLang('Enter a valid email'));

    $('#dflt_lang').on('change', function() {
      var languageId = $( "#dflt_lang option:selected" ).attr('data-rel');
      $.ajax({
        url: SITE_URL + "/languages/translation/" + languageId,
        type: "get",
        data: {
            '_token': token
        }
      });
    });

    $('#settingForm').validate({
        rules: {
            company_name: {
                required: true,
                normalizer: function(value) {
                  return value.trim();
                }
            },
            company_email: {
                required: true,
                regxEmailValidation: true
            },
            company_phone: {
                required: true,
                regxPhone: true
            },
            company_city: {
                required: true,
                normalizer: function(value) {
                  return value.trim();
                }
            },
            company_state: {
                required: true,
                normalizer: function(value) {
                  return value.trim();
                }
            },
            company_country: {
                required: true
            },
        },
        submitHandler: function () {
            if (imageInvalid == 1 || imageInvalidFavicon == 1) {
                return false;
            }
            return true;
        }
    });
    var logoExists = $('#logoCompany').find('img').length;
    if (logoExists == 0) {
        $('#iconTop').css('margin-top', '4%');
    } else {
        $('#iconTop').css('margin-top', '-3%');
    }

    var iconExists = $('#iconCompany').find('img').length;
    if (iconExists == 0) {
        $('#addTop').css('margin-top', '10%');
    } else {
        $('#addTop').css('margin-top', '0');
    }
    $("#btnSubmit").on('click', function () {
        swal({
            icon: 'success',
            title: jsLang('This option is not available on demo version.'),
            buttons: [false, jsLang('Ok')],
        });
        return false;
    });

    $(document).on('change', '#company_logo', function () {
        var isVisible = $('#pro_img').is(":visible");
        if (isVisible) {
            $('#getBottomMargin').css('margin-bottom', '0%');
            if ($('.invalidSpan').is(":visible")) {
                $('#logoCompany').css('margin-top', '10%');
                $('#getBottomMargin').css('margin-bottom', '5%');
            } else {
                $('#logoCompany').css('margin-top', '2%');
            }
        } else {
            if ($('.invalidSpan').is(":visible")) {
                $('#getBottomMargin').css('margin-bottom', '10%');
                $('#logoCompany').css('margin-top', '10%');
            } else {
                $('#getBottomMargin').css('margin-bottom', '0%');
            }
        }
    });

    $(document).on('change', '#company_icon', function () {
        var isVisible = $('#pro_icon').is(":visible");
        if (isVisible) {
            if ($('.invalidIconSpan').is(":visible")) {
                $('#iconTop').css('margin-bottom', '5%');
                $('#iconCompany').css('margin-top', '4%');
            } else {
                $('#iconCompany').css('margin-top', '-4%');
            }
        }
    });

    $('.remove_img_preview').on('click', function () {
        var image = $('#company_logo').attr('data-rel');
        if (image) {
            $.ajax({
                url: SITE_URL + "/company/image_delete",
                type: "post",
                data: {
                    '_token': token,
                    'company_logo': image,
                },
                dataType: 'json',
                success: function (reply) {
                    if (reply.success == 1) {
                        swal({
                            icon: 'success',
                            title: reply.message,
                            buttons: [false, jsLang('Ok')],
                        });
                        $("#logoCompany").remove();
                    } else {
                        swal({
                            icon: 'success',
                            title: reply.message,
                            buttons: [false, jsLang('Ok')],
                        });
                    }
                }
            });
        }
    });

    var imageInvalid = 0;
    var imageInvalidFavicon = 0;
    $("#company_logo").on('change', function () {
        // get uploaded filename
        var files = [];
        for (var i = 0; i < $(this)[0].files.length; i++) {
            files.push($(this)[0].files[i].name);
        }
        $(this).next('.custom-file-label').html(files.join(', '));

        // image validation
        var file = this.files[0];
        var fileType = file["type"];
        var validImageTypes = ["image/jpg", "image/jpeg", "image/png"];
        if ($.inArray(fileType, validImageTypes) < 0) {
            $('#note_txt_1, .logo-picture-2').hide();
            $('#note_txt_2').html('<h6> <span class="text-danger font-weight-bolder invalidSpan f-11 display_inline_block">' + jsLang('Invalid Image type!') + '</span> </h6> <span class="badge badge-danger" id="abc">' + jsLang('Note') + '! </span> ' + jsLang('Allowed File Extensions: jpg, jpeg, png'));
            $('#note_txt_2').show();
            imageInvalid = 1;
        } else {
            imageInvalid = 0;
            $('#note_txt_2').hide();
            $('#note_txt_1, .logo-picture-2').show();
            readURL(this);
        }
    });

    $('.remove_icon_preview').on('click', function () {
        var image = $('#company_icon').attr('data-icon');
        if (image) {
            $.ajax({
                url: SITE_URL + "/company/icon_delete",
                type: "post",
                data: {
                    '_token': token,
                    'company_icon': image,
                },
                dataType: 'json',
                success: function (reply) {
                    if (reply.success == 1) {
                        swal({
                            icon: 'success',
                            title: reply.message,
                        });
                        $("#iconCompany").remove();
                    } else {
                        swal({
                            icon: 'success',
                            title: reply.message,
                        });
                    }
                }
            });
        }
    });
    $("#company_icon").on('change', function () {
        // get uploaded filename
        var files = [];
        for (var i = 0; i < $(this)[0].files.length; i++) {
            files.push($(this)[0].files[i].name);
        }
        $(this).next('.custom-file-label').html(files.join(', '));

        // image validation
        var file = this.files[0];
        var fileType = file["type"];
        var validImageTypes = ["image/x-icon"];
        if ($.inArray(fileType, validImageTypes) < 0) {
            $('#note_txt_3').hide();
            $('#note_txt_4').html('<h6> <span class="text-danger font-weight-bolder invalidIconSpan f-11">' + jsLang('Invalid Icon type!') + '</span> </h6> <span class="badge badge-danger">' + jsLang('Note') + '! </span> ' + jsLang('Allowed File Extensions: ico'));
            $('#note_txt_4').show();
            $('.logo-picture-1').hide();
            imageInvalidFavicon = 1;
        } else {
            imageInvalidFavicon = 0;
            $('#note_txt_4').hide();
            $('#note_txt_3, .logo-picture-1').show();
            readURL(this);
        }
    });
    $('#company_name').on('blur', function () {
        if ($(this).val() == "") {
            $('#site_short_name').val("");
        } else {
            var company_name = $(this).val().split(' ');
            if (company_name.length == 1) {
                $('#site_short_name').val(company_name[0][0].toUpperCase() + company_name[0][1].toUpperCase());
            } else if (company_name.length == 2) {
                $('#site_short_name').val(company_name[0][0].toUpperCase() + company_name[1][0].toUpperCase());
            } else {
                $('#site_short_name').val(company_name[0][0].toUpperCase() + company_name[1][0].toUpperCase() + company_name[2][0].toUpperCase());
            }
        }
    });
    jQuery.validator.addMethod("regxPhone", function (value, element) {
        var regExp = new RegExp(/^((\+\d{1,4}(-| )?\(?\d\)?(-| )?\d{1,9})|(\(?\d{2,9}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/);
        var regExp2 = new RegExp(/^[+0-9 () \-]{8,20}$/);
        return this.optional(element) || regExp.test(value) || regExp2.test(value);
    }, jsLang('Enter a valid phone number'));
}

$('input').on('keyup', function () {
    $(this).valid();
});

// Department settings js here
if ($('.main-body .page-wrapper').find('#department-settings-container').length) {
    $("#dataTableBuilder").DataTable({
        "columnDefs": [ {
            "targets": 1,
            "orderable": false
        } ],
        "language": {
          "url": app_locale_url
        },
        "pageLength": row_per_page
    });
  
    $(document).on('click', '.department_edit', function() {
      var id = $(this).attr("id");
      $('#depart_id').val($(this).attr("id"));
      $.ajax({
          url: SITE_URL + "/edit-department",
          data:{
              "_token": token,
              id:id
          },
          type: 'POST',
          dataType: 'JSON',
          success: function (data) {
            $('#name').val(data.name);
            $('#department_edit').modal();
          }
      });
    });
  
    $('#myform1').validate({
        rules: {
            name: {
              required: true,
              remote: SITE_URL + "/department-valid",
              normalizer: function(value) {
                return value.trim();
              }
            }
        }
    });
  
    $('#editDept').validate({
        rules: {
          name: {
            required: true,
            remote: {
              url: SITE_URL + "/department-valid",
              type: "GET",
              data: {
                deptID: function(){return $('input[name=depart_id]').val();}
              }
            },
            normalizer: function(value) {
              return value.trim();
            }
          },
        }
    });
  
    $('#add-department').on('hidden.bs.modal', function (e) {
        $(this).find('input[name=name]').val('');
        $('#myform1').validate().resetForm();
        $('input[name=name]').removeClass('error');
    });
    
    $('#department_edit').on('show.bs.modal', function (e) {
        $('#editDept').validate().resetForm();
        $('input[name=name]').removeClass('error');
    });
  
    $('#confirmDelete').on('show.bs.modal', function (e) {
      var button = $(e.relatedTarget);
      var modal = $(this);
      $('#confirmDeleteSubmitBtn').attr('data-task', '').removeClass('delete-task-btn');
      if (button.data("label") == 'Delete'){
        modal.find('#confirmDeleteSubmitBtn').addClass('delete-task-btn').attr('data-task', button.data('id')).text(jsLang('Delete')).show();
        modal.find('#confirmDeleteLabel').text(button.data('title'));
        modal.find('.modal-body').text(button.data('message'));
      }
      $('#confirmDeleteSubmitBtn').on('click', function () {
        $('#delete-dept-'+$(this).data('task')).trigger('submit');
      });
    });
}

// Role settings js here
if ($('.main-body .page-wrapper').find('#role-settings-container').length) {
    $("#dataTableBuilder").DataTable({
      "columnDefs": [ {
        "targets": 3,
        "orderable": false
        } ],
  
        "language": {
              "url": app_locale_url
            },
        "pageLength": row_per_page
    });  
  
    $('.btn-group').hide();
  
    $('#confirmDelete').on('show.bs.modal', function (e) {
      var button = $(e.relatedTarget);
      var modal = $(this);
      $('#confirmDeleteSubmitBtn').attr('data-task', '').removeClass('delete-task-btn');
      if (button.data("label") == 'Delete') {
        modal.find('#confirmDeleteSubmitBtn').addClass('delete-task-btn').attr('data-task', button.data('id')).text(jsLang('Delete')).show();
        modal.find('#confirmDeleteLabel').text(button.data('title'));
        modal.find('.modal-body').text(button.data('message'));
      }
      $('#confirmDeleteSubmitBtn').on('click', function () {
        $('#delete-role-'+$(this).data('task')).trigger('submit');
      })
    });
  
    var x = window.matchMedia("(max-width: 850px)");
    // Call listener function at run time
    myFunction(x);
    // Attach listener function on state changes
    x.addEventListener('load', myFunction);
    
    $("#dataTableBuilder").addClass('user-role');
}

// Role add settings js here
if ($('.main-body .page-wrapper').find('#roleAdd-settings-container').length) {
    $("#dataTableBuilder").DataTable({
        "autoWidth":false,
        "columnDefs": [
            { "width": "350px", "targets": 0 },
            { "width": "350px", "targets": 1, "orderable": false },
            { "width": "350px", "targets": 2, "orderable": false },
            { "width": "350px", "targets": 3, "orderable": false },
            { "width": "350px", "targets": 4, "orderable": false },
            { "width": "350px", "targets": 5, "orderable": false },
          ],
        "paging": false,
        "searching": false,
        "info": false,
    });
        
    $.validator.setDefaults({
      errorPlacement: function (error, element) {
        if (element.is(":checkbox")) {
          $('.errors').html(error);
        } else {
          error.insertAfter(element);
        }
      }
    });
    
    $('#addRole').validate({
        rules: {
          name: {
              required: true,
              remote  : SITE_URL + "/role-valid",
              normalizer: function(value) {
                  return value.trim();
              }
          },
          display_name: {
              required: true,
              normalizer: function(value) {
                return value.trim();
              }
          },
          description: {
              required: true,
              normalizer: function(value) {
                return value.trim();
              }
          },
          "permissions[]": {
              required: true,
              minlength: 1
            },
          }, 
          messages: {
              "permissions[]": {
                required: '<span class="f-12">' + jsLang('Please give at least one permission') + '</span>',
              },
          },                
    });
  
    $(document).on('ifChanged', '.view-check', function(event){
      var isChecked = $(this).is(':checked');
      var status    = $(this).attr('status');
      var key       = $(this).attr('key');
      var id        = $(this).attr('id');  
      if (isChecked == true && status == 'view') {
          $('#own_view_'+key).iCheck('disable');
      } else if (isChecked == false && status == 'view') {
          $('#own_view_'+key).iCheck('enable');
      } else if (isChecked == true && status == 'own_view') {
          $('#view_'+key).iCheck('disable');
      } else if (isChecked == false && status == 'own_view') {
          $('#view_'+key).iCheck('enable');
      }
    }); 
}

// Role edit settings js here
if ($('.main-body .page-wrapper').find('#roleEdit-settings-container').length) {
    $("#dataTableBuilder").DataTable({
    "autoWidth":false,
    "columnDefs": [
        { "width": "350px", "targets": 0 },
        { "width": "350px", "targets": 1, "orderable": false },
        { "width": "350px", "targets": 2, "orderable": false },
        { "width": "350px", "targets": 3, "orderable": false },
        { "width": "350px", "targets": 4, "orderable": false },
        { "width": "350px", "targets": 5, "orderable": false },
      ],
    "paging": false,
    "info": false,

    });

    //Remove search option from datatable
    $('#dataTableBuilder_filter').remove();

    $.validator.setDefaults( {
        errorPlacement: function (error, element) {
          if (element.prop('type') === 'checkbox') {
              $('.errors').html(error);
            } else {
              error.insertAfter(element);
            }
        }

    });

    $('#addRole').validate({
      rules: {
        name: {
            required: true,
            remote  : {
                url: SITE_URL + "/role-valid",
                type: "get",
                data: {
                  role_id: function() {
                  return $('input[name=id]').val();
                  }
                }
            },
            normalizer: function(value) {
              return value.trim();
            }
        },
        display_name: {
            required: true,
            normalizer: function(value) {
              return value.trim();
            }
        },
        description: {
            required: true,
            normalizer: function(value) {
              return value.trim();
            }
        },
        "permissions[]": {
            required: true,
            minlength: 1
          },
        },
        messages: {
            "permissions[]": {
              required: '<span class="f-12">' + jsLang('Please give at least one permission') + '</span>',
            },
        },            
    });

    $('.view-check').on('ifChanged', function(event){
        var isChecked = $(this).is(':checked');
        var status    = $(this).attr('status');
        var key       = $(this).attr('key');
        var id        = $(this).attr('id');  
        if(isChecked == true && status == 'view'){
          $('#own_view_'+key).iCheck('disable');
        }else if(isChecked == false && status == 'view'){
          $('#own_view_'+key).iCheck('enable');
        }else if(isChecked == true && status == 'own_view'){
          $('#view_'+key).iCheck('disable');
        }else if(isChecked == false && status == 'own_view'){
          $('#view_'+key).iCheck('enable');
        }
    }); 
}

// Location settings js here
if ($('.main-body .page-wrapper').find('#location-settings-container').length) {
    $("#dataTableBuilder").DataTable({
        "columnDefs": [ {
            "targets": 5,
            "orderable": false
        } ],
        "language": {
            "url": app_locale_url
          },
        "pageLength": row_per_page
    });        
    
    $('#confirmDelete').on('show.bs.modal', function (e) {
      var button = $(e.relatedTarget);
      var modal = $(this);
      $('#confirmDeleteSubmitBtn').attr('data-task', '').removeClass('delete-task-btn');
      if (button.data("label") == 'Delete'){
        modal.find('#confirmDeleteSubmitBtn').addClass('delete-task-btn').attr('data-task', button.data('id')).text(jsLang('Delete')).show();
        modal.find('#confirmDeleteLabel').text(button.data('title'));
        modal.find('.modal-body').text(button.data('message'));
      }
      $('#confirmDeleteSubmitBtn').on('click', function () {
        $('#delete-location-'+$(this).data('task')).trigger('submit');
      });
    });

    $('.btn-group').hide();

    $("#dataTableBuilder").addClass('location');
}

// location add js here
if ($('.main-body .page-wrapper').find('#locationAdd-settings-container').length) {
    let locCode;
    $(".js-example-basic-single").select2();

    $('#loc_code').on('keyup', function(){
        locCode = $('#loc_code').val();
    });
    
    $('#myform1').validate({
        rules: {
          location_name: {
              required: true,
              normalizer: function(value) {
                return value.trim();
              }
          },
          loc_code:{
            required: true,
            remote: SITE_URL + "/loc_code-valid",
            normalizer: function(value) {
              return value.trim();
            }
          },
          delivery_address: {
              required: true,
              normalizer: function(value) {
                return value.trim();
              }
          },
          phone:{
            required:false,
            regxPhone : true
          },
          fax:{
            required:false,
            regxFax : true
          },
          email:{
            required:false,
            regxEmail : true
          }                        
        }
    });

    jQuery.validator.addMethod("regxPhone", function(value, element) {
      var regExp = new RegExp(/^((\+\d{1,4}(-| )?\(?\d\)?(-| )?\d{1,9})|(\(?\d{2,9}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/);
      var regExp2 = new RegExp(/^[+0-9 () \-]{8,20}$/);
      return this.optional(element) || regExp.test(value) || regExp2.test(value);
    }, jsLang('Enter a valid phone number'));

    jQuery.validator.addMethod("regxFax", function(value, element) {
      var regExp = new RegExp(/^(\+?\d{1,}(\s?|\-?)\d*(\s?|\-?)\(?\d{2,}\)?(\s?|\-?)\d{3,}\s?\d{3,})$/); 
      return this.optional(element) || regExp.test(value);
    }, jsLang('Enter a valid fax number'));

    jQuery.validator.addMethod("regxEmail", function(value, element) {
      var regExp = new RegExp(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/); 
      return this.optional(element) || regExp.test(value);
    }, jsLang('Enter a valid email'));
}

// location edit js here
if ($('.main-body .page-wrapper').find('#locationEdit-settings-container').length) {

    let locID = $("input[name=loc_code]").attr('location-data');
    $(".js-example-basic-single").select2();
    
  $('#myform1').validate({
      rules: {
        location_name: {
            required: true,
            normalizer: function(value) {
              return value.trim();
            }
        },
        loc_code:{
           required: true,
           remote: SITE_URL + "/loc_code-valid?locID="+locID,
           normalizer: function(value) {
            return value.trim();
          }
        },
        delivery_address: {
            required: true,
            normalizer: function(value) {
              return value.trim();
            }
        },
        phone:{
          required:false,
          regxPhone : true
        },
        fax:{
          required:false,
          regxFax : true
        },
        email:{
          required:false,
          regxEmail : true
        }                     
      }
  });

  jQuery.validator.addMethod("regxPhone", function(value, element) {
    var regExp = new RegExp(/^((\+\d{1,4}(-| )?\(?\d\)?(-| )?\d{1,9})|(\(?\d{2,9}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/);
    var regExp2 = new RegExp(/^[+0-9 () \-]{8,20}$/);
    return this.optional(element) || regExp.test(value) || regExp2.test(value);
  }, jsLang('Enter a valid phone number'));

  jQuery.validator.addMethod("regxFax", function(value, element) {
    var regExp = new RegExp(/^(\+?\d{1,}(\s?|\-?)\d*(\s?|\-?)\(?\d{2,}\)?(\s?|\-?)\d{3,}\s?\d{3,})$/); 
    return this.optional(element) || regExp.test(value);
  }, jsLang('Enter a valid fax!'));

  jQuery.validator.addMethod("regxEmail", function(value, element) {
    var regExp = new RegExp(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/); 
    return this.optional(element) || regExp.test(value);
  }, jsLang('Enter a valid email'));
}