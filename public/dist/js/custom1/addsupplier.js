'use strict';
$(document).ready(function(){
  $(".js-example-basic-single").select2({
    dropdownParent: $('#myTabContent')
  });
  $(".error").hide();
});

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
  },
  submitHandler: function() {
    $.ajax({
      type: "POST",
      url: $('#addSupplier').attr("action"),
      data: $('#addSupplier').serialize(),
      dataType: "json",
      success: function (response) {
        if (response.status == true) {
          $("#supplier").append('<option selected value="'+response.supplier['id']+'" data-currency_id="'+response.supplier['currency_id']+'"  data-symbol="'+response.supplier['currency_symbol']+'" data-name="'+response.supplier['currency_name']+'">'+response.supplier['name']+'('+response.supplier['currency_name']+')</option>').trigger("change");
          $('#inv-currency').val(response.supplier['currency_id']);
          $('#theModal').modal('toggle');
        } else {
          swal({
            text: response.message,
            icon: "error",
            buttons: [false, jsLang('Ok')],
          });
        }
      },
      error: function (err) {
        swal({
          text: err,
          icon: "error",
          buttons: [false, jsLang('Ok')],
        });
      }
    })
  }
});

$("#theModalSubmitBtn").on('click', function(e){
  var currency_id = $("#currency_id").val();
  if(currency_id == ""){
    $("#currency_id-error").css('display','block').text(jsLang('Please select currency'));
    e.preventDefault();
  }
});

$("#currency_id").on('change', function(e){
  $("#currency_id-error").css('display','block').text('');
});

jQuery.validator.addMethod("regxPhone", function(value, element) {
  var regExp = new RegExp(/^((\+\d{1,4}(-| )?\(?\d\)?(-| )?\d{1,9})|(\(?\d{2,9}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/);
  var regExp2 = new RegExp(/^[+0-9 () \-]{8,20}$/);
  return this.optional(element) || regExp.test(value) || regExp2.test(value);
}, jsLang('Enter a valid phone number'));

jQuery.validator.addMethod("regxEmailValidation", function(value, element) {
  return this.optional(element) || validateEmail(value);
}, jsLang('Enter a valid email'));