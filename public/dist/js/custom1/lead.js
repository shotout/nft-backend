'use strict';

if (!$('.main-body .page-wrapper').find('#lead-container').length) {
  jQuery.validator.addMethod("regxEmailValidation", function(value, element) {
    return this.optional(element) || validateEmail(value);
  }, jsLang('Enter a valid email'));

  jQuery.validator.addMethod("regxPhone", function (value, element) {
    var regExp = new RegExp(/^((\+\d{1,4}(-| )?\(?\d\)?(-| )?\d{1,9})|(\(?\d{2,9}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/);
    var regExp2 = new RegExp(/^[+0-9 () \-]{8,20}$/);
    return this.optional(element) || regExp.test(value) || regExp2.test(value);
  }, jsLang('Enter a valid phone number'));
}

$('.error').hide();
$('input').on('keyup', function () {
    $(this).valid();
});

function emailValidation() {
    var result;
    var customerId = $('input[name=customer_id]').val();
    var url = SITE_URL + "/email-valid-customer";
    var email = $("#email").val();
    var token = $("#token").val();

    if (validateEmail(email)) {
        $('#val_email').html("");
        $.ajax({
          url: url,
          data: {
              _token: token,
              email: email,
              customerId: customerId
          },
          type: "POST",
          success: function (data) {
            if (data != "true") {
                $("#val_email").css('display', 'block').text(jsLang('This email is already existed.'));
                $('#submitBtn').on("click", function (e) {
                  e.preventDefault();
                });
                result = 0;

            } else {
                $("#val_email").html('');
                $('#submitBtn').off('click');
                result = 1;
            }
          },
          error: function (xhr, desc, err) {
              return 0;
          }
        });
    }
    return result;
}
// Lead list js here
if ($('.main-body .page-wrapper').find('#lead-container').length) {
    $(".selectpicker").selectpicker({
      // by this default 'Nothing selected' -->will change to Please Select
      noneSelectedText: jsLang('All Lead Status'),
    });
    $('body').tooltip({ selector: '[data-toggle="tooltip"]' });
    $(document).on("click", "#csv, #pdf", function (event) {
      event.preventDefault();
      window.location = SITE_URL + "/leads-list-"+this.id+"?from=" + $('#startfrom').val() + "&to=" + $('#endto').val() + "&assignee=" + $('#assignee').val() + "&leadSource=" + $('#leadSource').val() + "&leadStatus=" + $('#leadStatus').val();
    });
    $('#dataTableBuilder').addClass('lead-list');
}

// lead edit js here
if ($('.main-body .page-wrapper').find('#leadEdit-container').length) {

    $(".select").select2({
      // your options here
    }).on('change', function () {
      $(this).valid();
    });

    $(".js-example-responsive").select2({
      tags: true,
    });

    // Item form validation
    $('#leadEdit').validate({
      rules: {
        lead_status: {
          required: true
        },
        lead_source: {
          required: true
        },
        first_name: {
          required: true
        },
        assigned: {
          required: true
        },
        phone: {
          regxPhone: true,
        },
        last_name: {
          required: true
        }
      }
    });

    $('#lead_status').attr("disabled", true);

    var status = $('#lead_status :selected').val();

    if (status == '') {
        $('#lead_status').val(1).trigger('change');
    }

    $('#tags').hide();

}

if ($('.main-body .page-wrapper').find('#leadEdit-container').length || $('.main-body .page-wrapper').find('#leadAdd-container').length) {
  if ($('#contact_date').val() != '') {
    $('#contact_date').daterangepicker(dateSingleConfig($('#contact_date').val()));
  } else {
    $('#contact_date').daterangepicker(dateSingleConfig()); 
    $('#contact_date').val('');
  }

    $("#email").on('blur', function () {
      $('#val_email').html("");
      if ($(this).val() != '') {
        emailValidation();
      } else {
          $('#submitBtn').off('click');
      }

    });

    $("#email").on('keyup', function () {
      if ($('#email-error').val() == null) {
          $("#val_email").html("");
      }
    });
}

// lead add js here
if ($('.main-body .page-wrapper').find('#leadAdd-container').length) {
    $(".select").select2({
      // your options here
    }).on('change', function () {
      $(this).valid();
    });

    $(".js-example-responsive").select2({
      tags: true,
    });

    // Item form validation
    $('#leadAdd').validate({
      rules: {
        lead_status: {
          required: true
        },
        lead_source: {
          required: true
        },
        assigned: {
          required: true
        },
        phone: {
          regxPhone: true,
        },
        first_name: {
          required: true
        },
        last_name: {
          required: true
        },
        email: {
          regxEmailValidation: true
        }
      }
    });

    $('#btnSubmit').on('click', function() {
      if ($("#leadAdd").valid() == true) {
        $(".spinner").show().css('line-height', '0');
        $("#spinnerText").text(jsLang('Please wait...'));
        $(this).attr("disabled", true);
        $("#leadAdd").trigger('submit');
      }
    });
}

// Lead convert to customer js here
if ($('.main-body .page-wrapper').find('#convert-customer-container').length) {

    // [ Single Select ] start
    $(".js-example-basic-single").select2();
    $('.error').hide();

    $('#copy').on('click', function() {
      $('#ship_street').val($('#bill_street').val());
      $('#ship_city').val($('#bill_city').val());
      $('#ship_state').val($('#bill_state').val());
      $('#ship_zipCode').val($('#bill_zipCode').val());
      var bill_country = $('#bill_country_id').val();
      $("#ship_country_id").val(bill_country).trigger('change');
    });
    // Item form validation
    $('#customerAdd').validate({
      rules: {
          first_name: {
              required: true
          },
          last_name: {
              required: true
          },
          email:{
            regxEmailValidation: true
          },
          phone: {
            required: false,
            regxPhone: true
          },
          currency_id:{
            required:true 
          }
        },
        highlight : function () {
          $('[href="#home"]').tab('show');
        },
    });

    $("#email").on('blur', function(){
      $('#val_email').html("");
        if ($(this).val() != '') {
          emailValidation();
        } else {
          $("#btnSubmit").off('click');
        }
    });

    $("#email").on('keyup', function(){
      if($('#email-error').val() == null){
        $("#val_email").html("");
      }
    });

    $('#currency_id').on('change', function(){
      $('#currency_id_error').text('');
    });

    $('#submit').on('click', function(e) {
      var firstName = $('#first_name').val();
      var lastName = $('#last_name').val();
      var currency_id = $('#currency_id').val();
      if ( firstName == '' || lastName == '' || currency_id == '') {
        $('#home').addClass('active show');
        $('[href="#home"]').tab('show').addClass('active');
        $('#profile').removeClass('active show');
        $('#home').attr('aria-labelledby').val('home-tab');
        e.preventDefault();
      }
    });
}