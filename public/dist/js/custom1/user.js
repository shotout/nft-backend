"use strict";

if ($('.main-body .page-wrapper').find('#user-add-container').length || $('.main-body .page-wrapper').find('#team-member-profile-container').length) {

    jQuery.validator.addMethod("regxPhone", function(value, element) {
        var regExp = new RegExp(/^((\+\d{1,4}(-| )?\(?\d\)?(-| )?\d{1,9})|(\(?\d{2,9}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/);
        var regExp2 = new RegExp(/^[+0-9 () \-]{8,20}$/);
        return this.optional(element) || regExp.test(value) || regExp2.test(value);
    }, jsLang('Enter a valid phone number'));

    jQuery.validator.addMethod("regxEmailValidation", function(value, element) {
        return validateEmail(value, this.optional(element));
    }, jsLang('Enter a valid email'));
}

// User add js here
if ($('.main-body .page-wrapper').find('#user-add-container').length) {
    $(".js-example-basic-single").select2();
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            $('#prvw, #imgAnchor').removeAttr('hidden');
            $('#divNote').hide();
            reader.onload = function(e) {
            $('#blah').attr('src', e.target.result);
            $('#imgAnchor').attr('href', e.target.result);
            $('#imgAnchor').attr('data-toggle', 'lightbox');            
            $('#note_txt_2, #note_txt_1').hide();
            }            
            reader.readAsDataURL(input.files[0]);
        }
    }
    
    $("#validatedCustomFile").on('change', function() {
        //get uploaded filename
        var files = [];
        for (var i = 0; i < $(this)[0].files.length; i++) {
            files.push($(this)[0].files[i].name);
        }
        $(this).next('.custom-file-label').html(files.join(', '));

        //image validation
        var file = this.files[0];
        var fileType = file["type"];
        var validImageTypes = ["image/gif", "image/jpeg", "image/png", "image/bmp"];
        if ($.inArray(fileType, validImageTypes) < 0) {          
            $('#divNote').show();
            $('#note_txt_1').hide();
            $('#note_txt_2').html('<h6> <span class="text-danger font-weight-bolder">' +jsLang('Invalid file extension') + '</span> </h6> <span class="badge badge-danger">' + jsLang('Note') + '!</span> ' + jsLang('Allowed File Extensions: jpg, png, gif, bmp'));
            $('#note_txt_2').show();
            $('#prvw').hide();
            $("#btnSubmit").attr('disabled',true);
        } else {
            $("#btnSubmit").removeAttr('disabled');
            $('#prvw').show();
            $('#note_txt_2, #note_txt_1').hide();
            readURL(this);
        }
    });

    $('#role_id').on('change', function() {
        var role = $(this).val();
        if (role == '') {
            $('#role_id-error').show();
        } else {
            $('#role_id-error').hide();
        }
    });

    $('#status_id').on('change', function() {
        var status = $(this).val();
        if (status == '') {
            $('#status_id-error').show();
        } else {
            $('#status_id-error').hide();
        }
    });

    $('#userAdd').validate({
        rules: {
            first_name: {
                required: true,
                maxlength: 30
            },
            last_name: {
                required: true,
                maxlength: 30
            },
            email:{
            required: true,
            remote  : SITE_URL + "/email-valid-user",
            regxEmailValidation: true
            },
            role_id: {
                required: true
            },
            status_id: {
                required: true
            },
            phone: {
                required: false,
                regxPhone: true
            },
            password: {
                required: true,
                minlength: 5
            },
        }
    });

    $('#btnSubmit').on('click', function() {
        if ($("#userAdd").valid() == true) {
            $(".spinner").show().css('line-height', '0');
			$("#spinnerText").text(jsLang('Please wait...'));
			$(this).attr("disabled", true);
			$("#userAdd").trigger('submit');
        }
    });
}

// change password js here
if ($('.main-body .page-wrapper').find('#change-password-container').length) {
    $('#myform1').on('submit',function(e) {
        var n = $('#n_pass').val();
        var r = $('#r_pass').val();
        if (n != r) { 
          $('#val_r_pass').html(jsLang('Password not match'));
          e.preventDefault();
        }
    });

    $(".valdation_check").on('keypress keyup',function() {
        var nm = $(this).attr("id");
        $('#val_'+nm).html("");
    });
}

if ($('.main-body .page-wrapper').find('#change-password-container').length || $('.main-body .page-wrapper').find('#user-edit-container').length || $('.main-body .page-wrapper').find('#user-import-container').length) {
    $('#myform1').on('submit',function(e) {
        var flag = 0;
        $('.valdation_check').each(function() {
            var id = $(this).attr('id');
            if ($('#'+id).val() == '') {
                $('#val_'+id).html(jsLang('This field is required'));
                flag = 1;
            }
        });

        if (flag == 1) {
            e.preventDefault();
        }
    });
}

// User edit js here
if ($('.main-body .page-wrapper').find('#user-edit-container').length) {
    $(".valdation_check").on('keypress keyup',function() {
        var nm = $(this).attr("id");
        $('#val_'+nm).html("");
    });
}

// User import js here
if ($('.main-body .page-wrapper').find('#user-import-container').length) {

    $('#myform1').validate({
        rules: {
          item_image: {
            required: true
          }
        }
    });
    $('#myform1').on('submit',function(e) {
        $('.valdation_select').each(function() {
            var id = $(this).attr('id');
            if ($('#'+id).val() == '') {
                $('#val_'+id).html(jsLang('This field is required'));
                flag = 1;
            }
        });
    });

    $(".valdation_check").on('keypress keyup',function() {
        var nm = $(this).attr("id");
        $('#val_'+nm).html("");
    });

    $(".valdation_select").on('click',function() {
        var nm = $(this).attr("id");
        $('#val_'+nm).html("");
    });

    $(".notifications.btn").trigger( "click" );
    
    $("#fileRequest").on("click", function() {
        window.location = SITE_URL + "/public/dist/downloads/user_sheet.csv";
    });

    $('.error, #note_txt_2').hide();
    $("#validatedCustomFile").on('change', function() {
      //get uploaded filename
      var files = [];
      for (var i = 0; i < $(this)[0].files.length; i++) {
          files.push($(this)[0].files[i].name);
      }
      $(this).next('.custom-file-label').html(files.join(', '));

      //image validation
      var fileName = files.toString();
      var ext      = fileName.split('.').pop();
      if ($.inArray(ext, ['csv']) == -1) {
            $('#note_txt_1, .error').hide();
            $('#note_txt_2').show();
            $('#note_txt_2').html('<h6> <span class="text-danger font-weight-bolder">' + jsLang('Invalid file extension') +' </span> </h6> <span class="badge badge-info note-style">' + jsLang('Note') +'</span><small class="text-info"> ' + jsLang('Allowed File Extensions: csv')) + '</small>';     
            $("#submit").attr('disabled',true);
      } else {
            $("#submit").removeAttr('disabled');
            $('#note_txt_1, #note_txt_2').hide();
      }
    });
}

// User list js here
if ($('.main-body .page-wrapper').find('#user-list-container').length) {

    $(document).on('click', '.status', function() {
        var status = $(this).is(":checked") ? 1 : 0;
        var id     = $(this).attr('data-id');
        $.ajax({
          url: SITE_URL + "/user/change-active-status",
          method: "POST",
          data: {'id':id, 'status':status, '_token':token},
          success: function(data) { 
            if(data.status == 'success') {
                $('#userCount').html(data.userCount);
                $('#userActive').html(data.userActive); 
                $('#userInActive').html(data.userInActive);
            } else {
                $("#alert").fadeTo(2000, 500).slideUp(500, function() {
                    $("#alert").slideUp(500);
                });
            }
          }
        });
    });
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
            $('#delete-user-'+$(this).data('task')).trigger('submit');
        });
    });

    // For export csv
    $(document).on("click", "#csv, #pdf", function(event) {
        event.preventDefault();
        window.location = SITE_URL + "/team_member_list_" + this.id;  
    });
  
    $('body').tooltip({selector: '[data-toggle="tooltip"]'});
    $('#dataTableBuilder').addClass('user_list_table');
}

// team member profile js here
if ($('.main-body .page-wrapper').find('#team-member-profile-container').length) {
    $('.select2').select2();
  
    $('.error').hide();
  
    if (user_id == 1) {
      $('#role_id, #status_id').attr('disabled', true);
    }
    //Start Image and file handle
    $('#validatedCustomFile').on('change', function (e) {
        var files = [];
        for (var i = 0; i < $(this)[0].files.length; i++) {
            files.push($(this)[0].files[i].name);
        }
        $(this).next('.custom-file-label').html(files.join(', '));
    });
  
    $("#validatedCustomFile").on('change', function() {
    //get uploaded filename
    var files = [];
    for (var i = 0; i < $(this)[0].files.length; i++) {
        files.push($(this)[0].files[i].name);
    }
    $(this).next('.custom-file-label').html(files.join(', '));

    //image validation
    var file = this.files[0];
    var fileType = file["type"];
    var validImageTypes = ["image/gif", "image/jpeg", "image/png", "image/bmp"];
    if ($.inArray(fileType, validImageTypes) < 0) {
        $('#divNote').show();
        $('#note_txt_1').hide();
        $('#note_txt_2').html('<h6> <span class="text-danger font-weight-bolder"> ' + jsLang('Invalid file extension') + ' </span> </h6> <span class="badge badge-danger">' + jsLang('Note') +'!</span> ' + jsLang('Allowed File Extensions: jpg, png, gif, bmp'));
        $('#note_txt_2').show();
        $('#prvw').hide();
        $("#btnSubmit").attr('disabled',true);
    } else {
        $("#btnSubmit").removeAttr('disabled');
        $('#prvw').show();
        $('#divNote, #note_txt_2, #note_txt_1').hide();
    }
      });
  
    $('#role_id').on('change', function() {
        var role = $(this).val();
        if (role == '') {
          $('#role_id-error').show();
        } else {
          $('#role_id-error').hide();
        }
    });
  
    $('#status_id').on('change', function() {
        var status = $(this).val();
        if (status == '') {
          $('#status_id-error').show();
        } else {
          $('#status_id-error').hide();
        }
    });
  
    $('#userAdd').validate({
      rules: {
          first_name: {
              required: true,
              maxlength: 30
          },
          last_name: {
              required: true,
              maxlength: 30
          },
          email:{
            regxEmailValidation: true,
            remote: {
                url: SITE_URL + "/email-valid-user",
                type: "GET",
                data: {
                  userId: function() {
                    return $('input[name=customer_id]').val();
                  }
                }
              },
            required: true
          },
          phone: {
            required: false,
            regxPhone: true
          },
          role_id: {
              required: true
          },
          status_id: {
              required: true
          },
        }
    });
  
    $('#password-form').validate({
        rules: {
          new_pass: {
            required: true,
            minlength: 5  
          },
          con_new_pass: {
            required: true,
            minlength: 5,
            equalTo: "#password"
          }
        }
    });
  
    $('#btnSubmit').on('click', function() {
      if ($("form#userAdd").valid() == true) {
          $('#btnSubmit').attr('disabled',true);
          $("form#userAdd").trigger('submit');
      } else {
          event.preventDefault();
      }
    });
}

if ($('.main-body .page-wrapper').find('#user-purchase-container').length || $('.main-body .page-wrapper').find('#user-inv-payment-container').length || $('.main-body .page-wrapper').find('#user-quotation-container').length || $('.main-body .page-wrapper').find('#user-invoice-container').length || $('.main-body .page-wrapper').find('#user-purch-payment-container').length || $('.main-body .page-wrapper').find('#user-project-container').length) {
    $(".select2").select2({});
    
    $('#daterange-btn').daterangepicker(daterangeConfig(startDate, endDate), cbRange);
    cbRange(startDate, endDate);

    $(document).on("click", "#tablereload", function(event) {
        event.preventDefault();
        $("#dataTableBuilder").DataTable().ajax.reload();
  });
}

// User purchase order js here
if ($('.main-body .page-wrapper').find('#user-purchase-container').length) {
    
    $(document).on("click", "#csv, #pdf", function(event) {
        event.preventDefault();
        window.location = SITE_URL+"/user/purchase-list-"+ this.id + "?to=" + $('#endto').val() + "&from="+ $('#startfrom').val() + "&location=" + $('#location').val() + "&supplier=" + $('#supplier').val() + "&team_member=" + team_member + "&status=" + $('#status').val();
    });

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
            $('#delete-purchaseOrder-'+$(this).data('task')).trigger('submit');
        });
    });
}

// User quotation js here
if ($('.main-body .page-wrapper').find('#user-quotation-container').length) {
    $(document).on("click", "#csv, #pdf", function(event) {
        event.preventDefault();
        window.location = SITE_URL+"/user/quotation-list-"+ this.id +"?to="+ $('#endto').val() + "&from=" + $('#startfrom').val() + "&location=" + $('#location').val() + "&customerId=" + $('#customer').val() + "&team_member=" + team_member;
    });

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
            $('#delete-purchaseOrder-'+$(this).data('task')).trigger('submit');
        });
    });
    $('#dataTableBuilder').addClass('user-quotation-list');
}

// User invoice js here
if ($('.main-body .page-wrapper').find('#user-invoice-container').length) {
    $(document).on("click", "#csv, #pdf", function(event) {
      event.preventDefault();
      window.location = SITE_URL+"/user/invoice-list-" + this.id + "?to=" + $('#endto').val() + "&from=" + $('#startfrom').val() + "&location=" + $('#location').val() + "&customerId=" + $('#customer').val() + "&team_memberId=" + team_member + "&status=" + $('#status').val();
    });
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
            $('#delete-invoice-'+$(this).data('task')).trigger('submit');
        });
    });
}

// User invoice payment js here
if ($('.main-body .page-wrapper').find('#user-inv-payment-container').length) {
    $(document).on("click", "#csv, #pdf", function(event){
        event.preventDefault();
        window.location = SITE_URL + "/user/invoice-payment-list-" + this.id + "?to=" + $('#endto').val() + "&from=" + $('#startfrom').val() + "&customerId=" + $('#customer').val() + "&team_memberId=" + team_memberId + "&method=" + $('#method').val() + "&currency=" + $('#currency').val();
    });

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
            $('#delete-invoicePayments-'+$(this).data('task')).trigger('submit');
        })
    });
}

// User purchase payment js here
if ($('.main-body .page-wrapper').find('#user-purch-payment-container').length) {
    $(document).on("click", "#csv, #pdf", function(event) {
        event.preventDefault();
        window.location = SITE_URL + "/user/purchase-payment-list-" + this.id + "?to=" + $('#endto').val()+"&from=" + $('#startfrom').val() + "&supplierId=" + $('#supplier').val() + "&team_memberId=" + team_memberId + "&method=" + $('#method').val() + "&currency=" + $('#currency').val();
    });

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
            $('#delete-purchasePayments-'+$(this).data('task')).trigger('submit');
        })
    });
}

// User transfer js here
if ($('.main-body .page-wrapper').find('#user-transfer-container').length) {
    $(".valdation_select").select2();

    $('#daterange-btn').daterangepicker(daterangeConfig(startDate, endDate), cbRange);
    cbRange(startDate, endDate);

    $(document).on("click", "#csv, #pdf", function(event) {
      event.preventDefault();
      window.location = SITE_URL + "/stock/transfer-" + this.id + "?to=" + $('#endto').val() + "&from=" + $('#startfrom').val() + "&source=" + $('#source').val() + "&destination=" + $('#destination').val();
    });

    $('#theModal').on('show.bs.modal', function (e) {
        var button = $(e.relatedTarget);
        var modal = $(this);
        $('#theModalSubmitBtn').attr('data-task', '').removeClass('delete-task-btn');
        
        if (button.data("label") == 'Delete') {
            modal.find('#theModalSubmitBtn').addClass('delete-task-btn').attr('data-task', button.data('id')).text(jsLang('Delete')).show();
            modal.find('#theModalLabel').text(button.data('title'));
            modal.find('.modal-body').text(button.data('message'));
        } else {
            // load content from value of data-remote url
            modal.find('.modal-body').load(button.data("remote"));
        }
    });

    $('#theModalSubmitBtn').on('click', function () {
        $('#delete-item-'+$(this).data('task')).trigger('submit');
    });

    // Source and Destination can not be same in filter
    var global_source_id;
    $("#source").on("change", function() {
        var stack = [];
        $('.error').hide();
        $("#errorMessage").text(jsLang(' '));
        var source = $(this).val();
        if (source.trim()  == "") {
            $('#source-error').show();
        } else {
            $('#source-error').hide();
        }
        var destination = $('#destination').val();
        if (global_source_id != null) {
            $.ajax({
                method: "POST",
                url: SITE_URL+"/stock_transfer/get-destination",
                data: { "source": source,"_token": token }
            })
            .done(function( data ) {
                var data = JSON.parse(data);
                if (data.status_no == 1) {
                    $("#destination").html(data.destination);
                    $("#destination").select2('open');
                }
            });
        } else {
            global_source_id = $("#source").val();
            $.ajax({
                method: "POST",
                url: SITE_URL+"/stock_transfer/get-destination",
                data: { "source": source,"_token": token }
            })
            .done(function( data ) {
                var data = JSON.parse(data);
                if (data.status_no == 1) {
                    $("#destination").html(data.destination);
                    $("#destination").select2('open');
                }
            });
        }
    });

    $("#destination").on("change", function() {
        var destination = $('#destination').val();
        var source = $('#source').val();
        if (destination.trim()  == "") {
            $('#destination-error').show();
        }
        if (source && destination) {
            $('#error_message').html('');
            if ($('#search').val() != '') {
                $('#search').trigger("focus"); 
            }
            $('#destination-error').hide();
        } 
    });
}

// User project js here
if ($('.main-body .page-wrapper').find('#user-project-container').length) {

    $('.select2').select2();

    $('#daterange-btn').daterangepicker(daterangeConfig(startDate, endDate), cbRange);
    cbRange(startDate, endDate);

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
            $('#delete-projects-'+$(this).data('task')).trigger('submit');
        });
    });

    $(document).on("click", "#csv, #pdf", function(event){
        event.preventDefault();
        window.location = SITE_URL + "/user/project-list-" + this.id + "?to=" + $('#endto').val() + "&from=" + $('#startfrom').val() + "&status=" + $('#status').val() + "&userId=" + userId + "&project_type=" + $('#project_type').val();
    });
}

// user task js here
if ($('.main-body .page-wrapper').find('#user-task-container').length) {
    $('[data-toggle="tooltip"]').tooltip();
    $(".js-example-basic-single").select2();
    $('.selectpicker').selectpicker();
    
    $('#daterange-btn').daterangepicker(daterangeConfig(startDate, endDate), cbRange);
    cbRange(startDate, endDate);

    $(document).on("click", "#tablereload", function(event){
        event.preventDefault();
        $("#dataTableBuilder").DataTable().ajax.reload();
    });

    if (startDate=='' && endDate=='') {
        $('#daterange-btn span').html('<i class="fa fa-calendar"></i> ' + jsLang('Pick a date range'));
    } else if (startDate=='all' && endDate=='all') {
        $('#daterange-btn span').html("Any time");
    } else {
        $('#daterange-btn span').html(startDate + ' - ' +endDate );
    }

    $(document).on("click", "#csv, #pdf", function(event) {
        event.preventDefault();
        window.location = SITE_URL + "/user/tasks_" + this.id + "?from=" + $('#startfrom').val() + "&to=" + $('#endto').val() + "&priority=" + $('#priority').val() + "&status=" + $('#status').val() + "&userId=" + userId;
    });

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
            $('#delete-task-'+$(this).data('task')).trigger('submit');
        });
    });

    $('#theModal').on('show.bs.modal', function (e) {
        var button = $(e.relatedTarget);
        var modal = $(this);
        $('#theModalSubmitBtn').attr('data-task', '').removeClass('delete-task-btn');

        if (button.data("label") == 'Delete') {
            modal.find('#theModalSubmitBtn').addClass('delete-task-btn').attr('data-task', button.data('id')).text(jsLang('Delete')).show();
            modal.find('#theModalLabel').text(button.data('title'));
            modal.find('.modal-body').text(button.data('message'));
        } else {
            /* load spinner */
            var spinner = '<div class="spinner">'+
                    '<div class="bounce1"></div>'+
                    '<div class="bounce2"></div>'+
                    '<div class="bounce3"></div>'+
                    '</div>';
            modal.find('.modal-body').html(spinner);
            /* end of spinner */

            // load content from value of data-remote url
            modal.find('.modal-body').load(button.data("remote"));
        }
    });

    $('#theModalSubmitBtn').on('click', function () {
        $('#delete-item-'+$(this).data('task')).trigger('submit');
    });

    $('body').tooltip({selector: '[data-toggle="tooltip"]'});
}