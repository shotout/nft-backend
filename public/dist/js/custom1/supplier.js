"use strict";
if ($('.main-body .page-wrapper').find('#supplier-edit-container').length || $('.main-body .page-wrapper').find('#supplier-add-container').length) {

    jQuery.validator.addMethod("regxPhone", function(value, element) {
        var regExp = new RegExp(/^((\+\d{1,4}(-| )?\(?\d\)?(-| )?\d{1,9})|(\(?\d{2,9}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/);
        var regExp2 = new RegExp(/^[+0-9 () \-]{8,20}$/);
        return this.optional(element) || regExp.test(value) || regExp2.test(value);
    }, jsLang('Enter a valid phone number'));

    jQuery.validator.addMethod("regxEmailValidation", function(value, element) {
      return this.optional(element) || validateEmail(value);
    }, jsLang('Enter a valid email'));

}

if ($('.main-body .page-wrapper').find('#supplier-add-container').length) {
    $(".js_select2").select2();
    $(".error").hide();
  
    $('#addSupplier').validate({
      rules: {
        supp_name: {
          required: true,
          maxlength: 30
        },
        email:{
          remote: SITE_URL + "/email-valid-supplier",
          regxEmailValidation: true
        },
        currency_id: {
          required: true
        },
        contact: {
          required: false,
          regxPhone: true
        }
      }
    });
  
    $('#submitBtn').on('click', function() {
      var currency = $('#currency_id').val();
      if ($("#addSupplier").valid() == true && currency != '') {
          $(".spinner").show().css('line-height', '0');
          $("#spinnerText").text(jsLang('Please wait...'));
          $('#submitBtn').attr("disabled", true);
          $("form#addSupplier").trigger('submit');
      }
    });
  
  
    $('#currency_id').on('change', function() {
        var currency = $(this).val();
        if (currency == '') {
          $('#currency_id-error').show();
        } else {
          $('#currency_id-error').hide();
        }
    });
  
}

// Supplier edit js here
if ($('.main-body .page-wrapper').find('#supplier-edit-container').length) {
    $(".js_select2").select2();
    
    $(document).on('change', '#currency_id', function() {
      var currency = $('#currency_id :selected').val();
      if (currency == '') {
        $('#currency_id-error').show();
      } else {
        $('#currency_id-error').hide();
      }
    });

    $('#editSupplier').validate({
      rules: {
          supp_name: {
              required: true,
              maxlength: 30
          },
          email:{
            remote: {
              url: SITE_URL + "/email-valid-supplier",
              type: "GET",
              data: {
                supplierId: function() { return $('input[name=supplier_id]').val(); }
              }
            },
            regxEmailValidation: true
          },
          currency_id: {
              required: true
          },
          contact: {
            required: false,
            regxPhone: true
          }
      }
  });

  $('#submitBtn').on('click', function() {
    var currency = $('#currency_id :selected').val();
    if (currency == '') {
      event.preventDefault();
    } else {
      if ($("form#editSupplier").valid() == true) {
          $('#submitBtn').attr('disabled','disabled');
          $("form#editSupplier").trigger('submit');
      }
    }
  });
}

// Supplier import js here
if ($('.main-body .page-wrapper').find('#supplier-import-container').length) {
    $('#myform1').validate({
      rules: {
        csv_file: {
          required: true
        }
      }
    });
    $('#myform1').on('submit',function(e) {
        var flag = 0;
        $('.valdation_check').each(function() {
            var id = $(this).attr('id');
            if ($('#'+id).val() == '') {
                $('#val_'+id).html(jsLang('This field is required.'));
                flag = 1;
            }
        });

        $('.valdation_select').each(function() {
            var id = $(this).attr('id');
            if ($('#'+id).val() == '') {
            
                $('#val_'+id).html(jsLang('This field is required.'));
                flag = 1;
            }
        });

        if (flag == 1) {
            e.preventDefault();
        }
    });

    $(".valdation_check").on('keypress keyup',function() {
      var nm = $(this).attr("id");
      $('#val_'+nm).html("");
    });

    $(".valdation_select").on('click',function() {
      var nm = $(this).attr("id");
      $('#val_'+nm).html("");
    });
    
    $("#fileRequest").on('click', function() {
      window.location = SITE_URL + "/public/dist/downloads/supplier_sheet.csv";
    });

    $('.error, #note_txt_2').hide();
    $("#validatedCustomFile").on("change", function() {
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
            $('#note_txt_1').hide(); 
            $('#note_txt_2').show();  
            $('#note_txt_2').html('<h6> <span class="text-danger font-weight-bolder">' + jsLang('Invalid file Extension.') + '</span> </h6> <span class="badge badge-info note-style">' + jsLang('Note') + '</span><small class="text-info">' + jsLang('Allowed File Extensions: csv')) + '</small>';     
            $("#submit").attr('disabled','disabled');
        } else {
            $("#submit").removeAttr('disabled');
            $('#note_txt_1, #note_txt_2').hide();
        }
    });
}

if ($('.main-body .page-wrapper').find('#supplier-ledger-container').length || $('.main-body .page-wrapper').find('#supplier-order-container').length) {
    $(document).on("click", "#tablereload", function(event) {
        event.preventDefault();
        $("#dataTableBuilder").DataTable().ajax.reload();
    });
}

// Supplier ledger js here
if ($('.main-body .page-wrapper').find('#supplier-ledger-container').length) {
    var p     = $('#total_purchase_amount').val();
    var q     = $('#paid_amount').val();
    var r     = $('#balance_amount').val();
    
    $('#total_purchase_amount1').html(p);
    $('#paid_amount1').html(q);
    $('#balance_amount1').html(r);

    $("#ledger").DataTable({
    "order": [],
    "language": {
            "url": app_locale_url
            },
    "pageLength": row_per_page
    });

    $('#daterange-btn').daterangepicker(daterangeConfig(startDate, endDate), cbRange);
    cbRange(startDate, endDate);
    
    $(document).on("click", "#csv, #pdf", function(event) {
        event.preventDefault();
        window.location = SITE_URL + "/supplier/ledger-report-" + this.id + "?to=" + $('#endto').val() + "&from=" + $('#startfrom').val() + "&supplier=" + supplier + "&supplier_id=" + supplier_id;
    });
}

// supplier order js here
if ($('.main-body .page-wrapper').find('#supplier-order-container').length) {

    $('#daterange-btn').daterangepicker(daterangeConfig(startDate, endDate), cbRange);
    cbRange(startDate, endDate);

    $('#confirmDelete').on('show.bs.modal', function (e) {
      var button = $(e.relatedTarget);
      var modal = $(this);
      $('#confirmDeleteSubmitBtn').attr('data-task', '').removeClass('delete-task-btn');
      if (button.data("label") == 'Delete') {
        modal.find('#confirmDeleteSubmitBtn').addClass('custom-btn-small btn-danger').attr('data-task', button.data('id')).text(jsLang('Delete')).show();
        modal.find('#confirmDeleteLabel').text(button.data('title'));
        modal.find('.modal-body').text(button.data('message'));
      }
      $('#confirmDeleteSubmitBtn').on('click', function () {
        $('#delete-purchase-'+$(this).data('task')).trigger('submit');
      });
    });
    
    $(document).on("click", "#csv, #pdf", function(event) {
      event.preventDefault();
      window.location = SITE_URL + "/supplier/purchase-report-" + this.id + "?to=" + $('#endto').val() + "&from=" + $('#startfrom').val() + "&supplier=" + supplier + "&supplier_id=" + supplier_id;
    });
}

// Supplier payment js here
if ($('.main-body .page-wrapper').find('#supplier-payment-container').length) {

    $('#daterange-btn').daterangepicker(daterangeConfig(startDate, endDate), cbRange);
    cbRange(startDate, endDate);

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
        $('#delete-purchaseOrderPayment-'+$(this).data('task')).trigger('submit');
      });
    });

    $(document).on("click", "#csv, #pdf", function(event) {
        event.preventDefault();
        window.location = SITE_URL + "/supplier/payment-" + this.id + "?to="  + $('#endto').val() + "&from=" + $('#startfrom').val() + "&supplier_id=" + supplier_id;
    });
}

// Supplier list js here
if ($('.main-body .page-wrapper').find('#supplier-list-container').length) {
    //Supplier Status
    $('#dataTableBuilder').on( 'change', '.status', function (){
      var id     = $(this).attr('data-supplier_id');
      var status = $(this).is(":checked") ? 1 : 0;
      var url    = SITE_URL + "/supplier/change-status"; 
      $.ajax({
        url:url, 
        method:"POST",
        data:{'id':id,'status':status,'_token':token},
        dataType:"json",
        success:function(data){
          if (data.status == 'success') {
            $('#supplierCount').html(data.supplierCount);
            $('#supplierActive').html(data.supplierActive); 
            $('#supplierInActive').html(data.supplierInActive);
          } 
        }
      });  
    });

    $(document).on("click", "#pdf, #csv", function(event){
      window.location = SITE_URL + "/supplier_list_"+this.id;  
    });
    $('#dataTableBuilder').addClass('supplier-list-styles');
}