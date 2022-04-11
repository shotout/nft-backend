'use strict';
$('#theModal').on('shown.bs.modal', function () {
  $('#customerAdd').validate().resetForm();
  $('#theModalSubmitBtn').prop('disabled', false);
});
if ($('#theModalBody').hasClass('modal-body-content')) {
  $(".select2-dropdown").select2({
    dropdownParent: $('#theModalBody')
  });

  $('#customerAdd').validate({
    ignore: "ui-tabs-hide",
    rules: {
      first_name: {
        required: true,
        minlength: 3,
        maxlength: 30
      },
      last_name: {
        required: true,
        minlength: 3,
        maxlength: 30
      },
      email: {
        regxEmailValidation: true
      },
      currency_id: {
        required: true
      },
      phone: {
        required: false,
        regxPhone: true
      },
    },
    highlight: function() {
      $('[href="#home"]').tab('show');
    },
    submitHandler: function() {
      $.ajax({
        type: "POST",
        url: $('#customerAdd').attr("action"),
        data: $('#customerAdd').serialize(),
        dataType: "json",
        success: function(response) {
          if (response.status == true) {
            if ($('#customers').hasClass('invoice-customers')) {
              $('#customers').append(' <option value="' + response.customer['id'] + '" data-currency_id="' + response.customer['currency_id'] + '" data-symbol="' + response.customer['currency_symbol'] + '" data-name="' + response.customer['currency_name'] + '" selected>' + response.customer['name'] + ' (' + response.customer['currency_name'] + ')</option>').trigger("change");
              $('#show_currency').val(response.customer['currency_name']);
              $('#inv-currency').val(response.customer['currency_id']);
            } else {
              $('#customers').append(' <option selected value="' + response.customer['id'] + '">' + response.customer['name'] + '</option>').trigger("change");
            }
            $('#holdModal').modal('toggle');
            $('#theModal').modal('toggle');
          } else {
            swal(response.errors, {
              icon: "error",
              buttons: [false, jsLang('Ok')],
            });
          }
        },
        error: function() {
          swal(jsLang('Oops! Something went wrong, please try again.'), {
            icon: "error",
            buttons: [false, jsLang('Ok')],
          });
        }
      });
    }
  });

  $("#email").on('keyup', function() {
    if ($('#email-error').val() == null) {
      $("#email-error").html("");
    }
  });
  jQuery.validator.addMethod("regxPhone", function(value, element) {
    var regExp = new RegExp(/^((\+\d{1,4}(-| )?\(?\d\)?(-| )?\d{1,9})|(\(?\d{2,9}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/);
    var regExp2 = new RegExp(/^[+0-9 () \-]{8,20}$/);
    return this.optional(element) || regExp.test(value) || regExp2.test(value);
  }, jsLang('Enter a valid phone number'));

  $(document).ready(function() {
    $("#email").on('keyup', function() {
      $('#email-error').html("");
      if ($(this).val() != '') {
        emailValidation();
      } else {
        $('#theModalSubmitBtn').prop('disabled', false);
      }

    });
  });

  function emailValidation() {
    var result;
    var url = SITE_URL + "/email-valid-customer";
    var email = $("#email").val();
    var token = $("#token").val();

    if (validateEmail(email)) {
      $('#email-error').html("");
      $.ajax({
        url: url,
        data: { // data that will be sent
          _token: token,
          email: email
        },
        type: "POST", // type of submision
        success: function(data) {
          if (data != "true") {
            $("#email-error").css('display', 'block').text(jsLang('This email is already existed.'));
            $('#theModalSubmitBtn').prop('disabled', true);
            result = 0;
          } else {
            $("#email-error").html('');
            $('#theModalSubmitBtn').prop('disabled', false);
            result = 1;
          }
        },
        error: function(xhr, desc, err) {
          return 0;
        }
      });
    }
    return result;
  }

  $('#copy').on('click', function() {
    $('#ship_street').val($('#bill_street').val());
    $('#ship_city').val($('#bill_city').val());
    $('#ship_state').val($('#bill_state').val());
    $('#ship_zipCode').val($('#bill_zipCode').val());
    $("#ship_country_id").val($('#bill_country_id').val()).trigger('change');
  });

  $('#currency').on('change', function() {
    var currency = $(this).val();
    if (currency == '') {
      $("#currency-error").css("display", "flex");
    } else {
      $('#currency-error').hide();
    }
  });

  $(document).on("change", "#bill_country_id", function() {
    if ($("#bill_country_id  option:selected").val() != '' && $("#bill_country_id  option:selected").val() != null) {
      $("#bill_country_id-error").css("display", "none");
    } else {
      $("#bill_country_id-error").css("display", "flex");
    }
  })

  jQuery.validator.addMethod("regxEmailValidation", function(value, element) {
    return this.optional(element) || validateEmail(value);
  }, jsLang('Enter a valid email'));
}

if ($('#add-shipping-modal').hasClass('modal-body-content')) {
  var customerID = $("#customers").val();
  $(document).ready(function() {
    var shippingDetail = localStorage.getItem('shippingDetail');
    if (shippingDetail.length != "0") {
      shippingDetail = JSON.parse(shippingDetail);
      $("#name").val(shippingDetail.name);
      $("#ship_email").val(shippingDetail.ship_email);
      $("#ship_street").val(shippingDetail.ship_street);
      $("#ship_city").val(shippingDetail.ship_city);
      $("#ship_state").val(shippingDetail.ship_state);
      $("#ship_zipCode").val(shippingDetail.ship_zipCode);
      $("#ship_country_id").val(shippingDetail.ship_country_id).trigger("change");
    }
  })

  $('.btn_add_shipping').on("click", function() {
    $('#holdModal').modal('hide');
  });

  $("#ship_country_id").select2({
    disabled: true,
    dropdownParent: $('#holdModal-body')
  });

  if (customerID != '') {
    getBranchAddress(token, customerID);
  }

  function getBranchAddress(token, customerID) {
    $.ajax({
      type: "POST",
      url: SITE_URL + "/pos/customer-branch",
      data: {
        '_token': token,
        'id': customerID
      },
      success: function(response) {
        localStorage.setItem('shippingDetail', response);
        var data = JSON.parse(response);
        if (data) {
          $("#name").val(data.name);
          $("#ship_email").val(data.email);
          $("#ship_street").val(data.customer_branch.shipping_street);
          $("#ship_city").val(data.customer_branch.shipping_city);
          $("#ship_state").val(data.customer_branch.shipping_state);
          $("#ship_zipCode").val(data.customer_branch.shipping_zip_code);
          $("#ship_country_id").val(data.customer_branch.shipping_country_id).trigger('change');
        }
      }
    })
  }
}

if ($('#discountModalBody').hasClass('modal-body-content')) {
  $("#discount_type").select2({
    dropdownParent: $("#discountModalBody")
  });
  $("#discount_amount").val($("#net_discount").val());
  $("#discount_type").val($("#net_discount_type").val());
  $("#discount_type").trigger('change');
  $("#discount_type").on('change', function() {
    $(".discount-type-prepend").text($('#discount_type :selected').val());
  });

  $("#discount_amount").on('keyup', function() {
    if ($('#discount_type :selected').val() == '%' && parseFloat(validateNumbers($("#discount_amount").val())) > 100) {
      swal(jsLang('Discount amount can not be more than 100%'), {
          icon: "error"
      });
      $("#discount_amount").val('');
    }

    if ($('#discount_type :selected').val() == '$' && $("#discount_amount").val() > parseFloat(validateNumbers($("#net_payable_no_currency").text()))) {
      swal(jsLang('Discount amount can not be more than the total amount'), {
          icon: "error"
      });
      $("#discount_amount").val('');
    }
  });
}

if ($('#payment-modal').hasClass('modal-body-content')) {
  $(document).ready(function() {
    $(".card-section").hide();
    $(".cheque-section").hide();
    $("#payment_type").select2({
      dropdownParent: $("#payment-modal")
    });
  })
  var totalAmount = 0;
  if ($("#holdModalResetBtn").hasClass("btn_hold_pay")) {
    totalAmount = $("#holdModal").find(".btn_hold_pay").attr("hold_total_amount");
    var order_id = $("#holdModal").find(".btn_hold_pay").attr("hold_order_id");
    $("#holdPayModalSubmitBtn").attr("order_amount", totalAmount);
    $("#holdPayModalSubmitBtn").attr("order_id", order_id);
  } else {
    totalAmount = $('#net_payable').text();
  }
  $('.order_amount').val(totalAmount);

  var input_amount = 0;

  $(document).on('change', '.payment_type', function(e) {
    var type = $(this).val();
    if (type == 'card') {
      $(".cheque-section").hide();
      $(".card-section").show();
      $("#cheque_number").val("");
    } else if (type == 'cheque') {
      $(".card-section").hide();
      $(".cheque-section").show();
      $("#card_number").val("");
    } else {
      $(".card-section").hide();
      $(".cheque-section").hide();
      $("#cheque_number").val("");
      $("#card_number").val("");
    }
  })

  $(document).keyup('#amount_received', delay(function(e) {
    var back = parseFloat(validateNumbers($("#amount_received").val())) - parseFloat(validateNumbers(totalAmount));
    if (back < 0) {
      back = 0;
    }
    $(".return_amount").val(getDecimalNumberFormat(back));
  }, 300));

  $('.order_payment').on("click", function() {
    var payment_type = $("#payment_type").val();
    var additional_data = $("#additional_data").val();
    var card_number = $("#card_number").val();
    var cheque_number = $("#cheque_number").val();

    if (payment_type == "card" && card_number === '') {
      $("#card_number").focus();
      swal(jsLang('Card number can not be empty'), {
        icon: "error",
        buttons: [false, jsLang('Ok')],
      });
      return false;
    }

    if (payment_type == "cheque" && cheque_number === '') {
      $("#cheque_number").focus();
      swal(jsLang('Cheque number can not be empty'), {
        icon: "error",
        buttons: [false, jsLang('Ok')],
      });
      return false;
    }

    if ((payment_type == "card" || payment_type == "cheque") && additional_data === '') {
      $("#additional_data").focus();
      swal(jsLang('Additional data can not be empty'), {
        icon: "error",
        buttons: [false, jsLang('Ok')],
      });
      return false;
    }
  });

  $('#payment_date').daterangepicker(dateSingleConfig());
}

if ($('#order-hold-modal').hasClass('modal-body-content')) {
  var orderResponse = '';
  $('#holdModal').on('shown.bs.modal', function(e) {
    e.preventDefault();;
  });
  $(document).ready(function() {
    $('#holdModal').find('.single_hold_item').first().trigger('click');
  });
  $(document).on('click', '.single_hold_item', function(e) {
    e.preventDefault();
    $('.single_hold_items').removeClass('hold_item_active');
    $(this).parent().addClass("hold_item_active");
    var orderId = $(this).parent().attr('data-order_id');
    var orderName = $(this).text();
    var url = SITE_URL + "/pos/getHoldOrderDetails";
    $.ajax({
      type: "POST",
      url: url,
      data: {
        _token: token,
        orderId: orderId,
      },
      success: function(response) {
        if (response.status == 1) {
          orderResponse = response;
          $("#hold_name").text(jsLang('Order Details') + " - " + orderName);
          $('.author').text(response.user);
          $('.orderDate').text(moment(orderResponse.order.order_date).format(dateFormat.replace(/M/g, "MMM").toUpperCase()));
          if (orderResponse.order.customer_id != null) {
            $('.customer_name').text(orderResponse.order.customer.first_name + " " + orderResponse.order.customer.last_name);
          } else {
            $('.customer_name').text(jsLang('Walking customer'))
          }
          $('.orderNo').text(orderResponse.order.reference)
          $('.total_order_amount').text(orderResponse.order.total)

          let orderDetails = orderResponse.order.sale_order_details;
          let order = orderResponse.order;
          var singleOrder = '';
          var orderFooter = '';
          var itemQuantity = '';
          for (var i = 0; i < orderDetails.length; i++) {
            if (Number.isInteger(orderDetails[i]['quantity'])) {
              itemQuantity = orderDetails[i]['quantity'];
            } else {
              itemQuantity = getDecimalNumberFormat(orderDetails[i]['quantity']);
            }
            singleOrder = singleOrder + "<tr><td>" + orderDetails[i]['item_name'] + "</td><td class='text-right'>" + getDecimalNumberFormat(orderDetails[i]['unit_price']) + "</td><td align='right'>" + itemQuantity + "</td><td align='right'>" + getDecimalNumberFormat(orderDetails[i]['quantity'] * orderDetails[i]['unit_price']) + "</td></tr>";

          }
          orderFooter = "<tr align='right'><td colspan='3'>" + jsLang('Tax') + "</b></td><td class='total_tax'>" + decimalNumberFormatWithCurrency(order['total_tax_amount']) + "</td></tr><tr align='right'><td colspan='3'><b>" + jsLang('Shipping') + "</b></td><td class='shipping_cost'>" + decimalNumberFormatWithCurrency(order['shipping_charge']) + "</td></tr><tr align='right'><td colspan='3'><b>" + jsLang('Discount') + "</b></td><td class='discount_on_cart'>" + decimalNumberFormatWithCurrency(order['total_discount_amount']) + "</td></tr><tr align='right'><td colspan='3'><b>" + jsLang('Total Amount') + "</b></td><td class='total_order_amount'>" + decimalNumberFormatWithCurrency(response.order.total) + "</td></tr>";
          $('.hold_order_details table tbody').html(singleOrder);
          $('.hold_order_details table tfoot').html(orderFooter);
          $(".btn_hold_pay").attr('hold_total_amount', response.order.total);
          $(".btn_hold_pay").attr('hold_order_id', response.order.id);
        } else {
          swal(jsLang('failed'), {
            icon: "error",
            buttons: [false, jsLang('Ok')],
          });
        }
      },
      error: function() {
        swal(jsLang('Oops! Something went wrong, please try again.'), {
          icon: "error",
          buttons: [false, jsLang('Ok')],
        });
      }
    });
  });

  $(document).on("click", ".delete_hold_item", function(e) {
    e.preventDefault();
    var row = $(this).parent();
    var orderId = parseInt($(this).parent().attr('data-order_id'));
    var url = SITE_URL + "/pos/delete-hold-item";
    swal({
        title: jsLang('Are you sure to delete this?'),
        icon: "warning",
        buttons: [jsLang('Cancel'), jsLang('Ok')],
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          $.ajax({
            url: url,
            method: "POST",
            data: {
              "id": orderId,
              "_token": token
            },
            success: function(data) {
              if (data > 0) {
                $('#order_hold_search').trigger('keyup');
                row.remove();
                if ($(".hold_item_active").length == 0) {
                  resetForm();
                }
                if ($('.hold_items').find('.single_hold_item').length == 0) {
                    $('#holdModalSubmitBtn, #holdModalResetBtn').attr('disabled', true);
                 }
              } else {
                swal({
                  title: jsLang('Delete failed'),
                  icon: "warning",
                  buttons: [jsLang('Ok')],
                  dangerMode: true,
                })
              }
            }
          })
        }
      });
  })

  $('#order_hold_search').keyup(delay(function(e) {
    e.preventDefault();
    var keyword = $(this).val();
    var url = SITE_URL + "/pos/hold-item-search";
    $.ajax({
      method: "POST",
      url: url,
      data: {
        "keyword": keyword,
        "_token": token
      },
      success: function(data) {
        var items = JSON.parse(data);
        var row = "";
        $.each(items, function(key, value) {
          var title = "";
          if (value.pos_order_title != null) {
            title = value.pos_order_title;
          } else {
            title = jsLang('Unknown');
          }
          row += '<div class="single_hold_items row" data-order_id="' + value.id + '">' +
            '<div class="single_hold_item">' +
            title +
            '</div>' +
            '<div class="delete_hold_item">' +
            '<span class="feather icon-trash-2 text-danger" title="Delete"></span>' +
            '</div>' +
            '</div>';
        });
        $(".hold_items").html(row);
      }
    })
  }, 500));

  function resetForm() {
    $("#hold_name").text(jsLang('Order Details'));
    $('.author').text("")
    $('.orderDate').text("")
    $('.customer_name').text("");
    $('.orderNo').text("")
    $('.total_order_amount').text("")
    $('.hold_order_details table tbody').html("");
    $('.hold_order_details table tfoot').html("");
  }

  if ($('.hold_items').find('.single_hold_item').length == 0) {
      $('#holdModalSubmitBtn, #holdModalResetBtn').attr('disabled', true);
   }
}

if ($('#settingsModalBody').hasClass('modal-body-content')) {
  var storageTaxType = localStorage.getItem('taxType');
  var discountOn = localStorage.getItem('discountOn');
  $("#discount_on").select2({
    dropdownParent: $("#settingsModalBody")
  });
  $("#tax_type").select2({
    dropdownParent: $("#settingsModalBody")
  });
  if (storageTaxType == '' || storageTaxType == null) {
    storageTaxType = 'exclusive';
  }
  if (discountOn == '' || discountOn == null) {
    discountOn = 'before';
  }
  $("[data-label='pos-settings']").attr('data-settings-tax', storageTaxType);
  $("[data-label='pos-settings']").attr('data-settings-discount', discountOn);
  $('#discount_on').val(discountOn);
  $('#tax_type').val(storageTaxType);
  $('#discount_on').trigger('change');
  $('#tax_type').trigger('change');
}

if ($('#add-note-modal').hasClass('modal-body-content')) {
  $('#order_note').val(localStorage.getItem('order_note'));
}

if ($('#put-order-on-hold').hasClass('modal-body-content')) {
  $('.order_amount').val($('#net_payable').text());
  $('#order_title').val('');
}
