'use strict';
var spinner = '<div class="spinner">'+
              '<div class="bounce1"></div>'+
              '<div class="bounce2"></div>'+
              '<div class="bounce3"></div>'+
            '</div>';
var taxSelect = '';
/**
 * AutoComplete Source
 * @param  object request
 * @param  function response
 * @param  string url
 * @param  string selector
 * @param  salesTypeId number
 * @return void
 */
function autoCompleteSource(request, response, url, selector, salesTypeId = 1) {
	var invoiceType = $('#inv-type').val(), type = '';
	var id = $(selector).val();
	var currency_id = $(selector + 'option:selected').attr('data-currency_id');
	var exchange_rate = $('#inv-exchange-rate').val();
  	$('.inv-exchange-rate').append('<input type="hidden" name="global_exchangeRate" id="global_exchangeRate" value="' + exchange_rate + '">');
	if(!id) {
		if (selector == "#customers") {
  		$('#error_message').html(jsLang('Please select customer first'));
		} else {
			$('#error_message').html(jsLang('Please select supplier first'));
		}
      $('html, body').animate({
        	scrollTop: 0
      }, 500);
      $(selector).select2('open');
  	return false;
	} else {
  	$('#error_message').html('');
	}
	if(invoiceType == 'quantity') {
  	type = 'product';
	} else {
  	type = 'service';
	}
	$.ajax({
    url: url,
    dataType: "json",
    type: "POST",
    data: {
      _token:token,
      search: request.term,
      currency_id: currency_id,
      type:type,
      exchange_rate: exchange_rate,
      salesTypeId: salesTypeId,
      loc_code: $("#location").val(),
    },
    success: function(data) {
    	if(data.status_no == 1) {
      	var data = data.items;
        $('#no_div').css('display','none');
        response($.map( data, function( item ) {
        	return {
            id: item.id,
            stock_id: item.stock_id,
            description: item.description,
            value: item.name,
            units: item.units,
            price: item.price,
            tax_rate: item.tax_rate,
            tax_id: item.tax_id,
            qty:item.qty,
            hsn:item.hsn,
        		is_stock_managed:item.is_stock_managed,
        		available:item.available
        	}
      	}));
    	} else {
        $('.ui-menu-item').remove();
        $("#no_div").css('top',$("#search").position().top+35);
        $("#no_div").css('left',$("#search").position().left);
        $("#no_div").css('width',$("#search").width());
        $("#no_div").css('display','block');
    	}
    //end
    }
	})
}
/**
 * Add AutoComplete Rows
 * @param  string type
 * @param  object e
 * @param  string selector
 * @return void
 */
function autoCompleteSelect(type, e, selector) {
  var totalRow = $('.itemRow').length;
  var nums = [];
  if (type == "add") {
    rowNo = -1;
    if (totalRow > 0) {
      itemRowEach(nums)
      rowNo = Math.max.apply(Math, nums);
    }
  } else if (type == "edit") {
    itemRowEach(nums);
  }
  var preRow = rowNo;
  rowNo++;
  var taxOptions = '';
  var taxStart = '<select name="item_tax[' + e.id + '][' + rowNo + '][]" class="inputTax form-control bootstrap-select selectpicker" multiple>';
  var taxEnd = '</select>';
  var taxHiddenField='';
  if (type == "add") {
    $.each(taxes, function(index, x) {
    var is_selected = '';
    if (e.tax_id == x.id) {
        is_selected = 'selected'
    }
    var formattedTaxRate = getDecimalNumberFormat(x.tax_rate);
    taxHiddenField += "<input type='hidden' class='itemTaxAmount itemTaxAmount-" + x.id + "'>";
    taxOptions += "<option title='" + formattedTaxRate + "%' value='" + x.id + "' " + is_selected + " taxrate='" + formattedTaxRate + "'>" + x.name + "(" + formattedTaxRate + ")</option>";
    });
  } else if (type == "edit") {
    $.each(taxes,function(index, x) {
      taxHiddenField+="<input type='hidden' class='itemTaxAmount itemTaxAmount-"+x.id+"'>";
      taxOptions+="<option title='"+x.tax_rate+"%' value='"+x.id+"' taxrate='"+x.tax_rate+"'>"+x.name+"("+ x.tax_rate+")</option>";
    });
  }
  taxSelect = taxStart + taxOptions + taxEnd + taxHiddenField;
  var symbol = $('option:selected', selector).data('symbol');
  if (!e.hsn) {
    e.hsn = "";
  }
}
/**
 * Add an attribute
 * @param  array nums
 * @return void
 */
function itemRowEach(nums) {
  $(".itemRow").each( function() {
    nums.push( $(this).attr('data-row-no') );
  });
}
/**
 * All Tax Options
 * @param  string selector
 * @param  string findSelector
 * @return void
 */
function allTax(selector, findSelector) {
  $.each($(selector), function(index,value) {
    var taxes = $(this).attr('data-taxes');
    var id = $(this).attr('id');
    var idarray = id.split('-');
    if(taxes) {
      $('#rowId-' + idarray[1]).find(findSelector).selectpicker('val',JSON.parse(taxes));
    }
  });
}
/**
 * AutoComplete Stack is empty or not
 * @param  int rowNo
 * @param  string type
 * @return boolean
 */
function checkStack(rowNo, type = null) {
  if(stack && stack.length != 0) {
    if (type == "invoice_add" || type == "purchase_add") {
      if ($('#reference_no').val() != null && $('#reference_no').val() != '') {
        $("#btnSubmit").prop("disabled",false);
      }
    } else {
      $("#btnSubmit").prop("disabled", false);
    }
  }
  $(".addRow").attr("data-row-no", rowNo);
  $(".addRowContainer").attr("id", "addRow-" + rowNo);
  return false;
}
/**
 * User selected any item or not
 * @param  string message
 * @param  string selector
 * @return boolean
 */
function checkItemSelected(message, selector = ".itemRow") {
  if ($(selector).length < 1) {
    swal(jsLang(message), {
      icon: "error",
      buttons: [false, jsLang('Ok')],
    });
    return false;
  }
}
/**
 * Add new custom item
 * @param  string type
 * @param  string idSelector
 * @param  string errorMsg
 * @param  String selector
 * @return void
 */
function customItem(type, idSelector, errorMsg, selector = ".addRow") {
  $(document).on('click', selector, function () {
    if (type == "add") {
      var id = $(idSelector).val();
        if(!id) {
          $('#error_message').html(errorMsg);
          $('html, body').animate({
            scrollTop: 0
          }, 500);
          $(idSelector).select2('open');
          return false;
        } else {
          $('#error_message').html('');
          changeCustomItemText();
        }
    } else if (type == "edit") {
      changeCustomItemText();
    }
  });
}
/**
 * Cutom Item Validation Rules
 * @param  string formId
 * @return void
 */
function customItemValidation(formId) {
  if ($('#inv-type').val() == 'quantity') {
    $(formId).validate({
      rules: {
        'custom_item_qty[]': {
          required: true,
          number: true
        }
      }
    });
  }
}
/**
 * Dynamic custom item text
 * @return void
 */
function changeCustomItemText() {
  var blank = checkBlank();
  if (blank == false || $(".custom-item").length < 1) {
    addNewRow();
    $(".inputDiscountType").select2();
  }
  if ($(".custom-item").length >= 1) {
    if ($("#inv-type").val() == 'hours') {
      $(".addRow").text(jsLang('Add more custom service'));
    }  else {
      $(".addRow").text(jsLang('Add more custom item'));
    }
  }
}
/**
 * Show customer or supplier modal
 * @param string className
 * @param string label
 * @param string text
 * @return void
 */
function customerOrSupplierModal(className, label, text) {
  $('#theModal').on('show.bs.modal', function (e) {
    var button = $(e.relatedTarget);
    var modal = $(this);
    /* load spinner */
    modal.find('.modal-body').html(spinner);
    /* end of spinner */
    $('#theModalSubmitBtn').removeClass(className).removeClass('btn_add_note').removeClass('btn_add_shipping').removeClass('btn_add_discount').removeClass('order_hold').removeClass('edit_order');
    $('.modal-dialog').removeClass('modal-lg');
    if (button.data("label") == label) {
        modal.find('#theModalSubmitBtn').text(jsLang('Submit')).addClass(className);
        $('.modal-dialog').addClass('modal-lg');
        modal.find('#theModalLabel').text(text);
    }
    // load content from value of data-remote url
    modal.find('.modal-body').load(button.data("remote"));
  });
}
/**
 * Delete Modal
 * @return void
 */
function deleteModal() {
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
      modal.find('.modal-body').html(spinner);
      /* end of spinner */
      modal.find('.modal-body').load(button.data("remote"));
    }
  });
}
/**
 * Format Exchangerate value
 * @param  string global_exchangeRate
 * @param  string selector
 * @return void
 */
function exchangeRateValue(global_exchangeRate, selector) {
  var num = parseFloat(global_exchangeRate).toFixed(exchange_rate_decimal_digits);
  if (thousand_separator == '.') {
    num = numberWithDot(num);
  } else if (thousand_separator == ',') {
    num = numberWithCommas(num);
  }
  $(selector).val(num);
}
/**
 * On change account format equivalent amount
 * @return void
 */
function formatEquivalentAmount() {
  if ($('#account_currency').is(':visible')) {
    var currency_id = Number($('option:selected', '#account_currency').val());
  } else {
    var currency_id = Number($('option:selected', '#currency').val());
  }
  var exchange_rate = Number($("#exchange_rate").val());
  if (isNaN(exchange_rate)) {
    exchange_rate = validateNumbers($("#exchange_rate").val());
  }
  if (currency_id && (currency_id != dflt_currency_id)) {
    $.ajax({
      method: "POST",
      url: SITE_URL + "/get-currency-exchange-rate",
      data: { "fromCurrency" : currency_id, "toCurrency" : dflt_currency_id, "_token" : token },
      dataType:"json",
      success:function(data) {
        exchangeRateValue(data, "#exchange_rate");
        var exchange_rate = data;
        var bill = due;
        $("#incoming_amount").val(getDecimalNumberFormat(bill));
        if (exchange_rate > 0) {
          $("#amount").val(getDecimalNumberFormat(bill / exchange_rate));
        } else if (exchange_rate < 0) {
          $("#amount").val(getDecimalNumberFormat(bill * data));
          $("#exchange_rate").val(getDecimalNumberFormat(data));
        }
      }
    });
  } else {
    $("#amount").val(getDecimalNumberFormat(due));
    $("#incoming_amount").val(getDecimalNumberFormat(due));
  }
}
/**
 * Get Today Exchange Rate
 * @param  string currency_id
 * @param  string date
 * @return void
 */
function getTodayExchangeRate(currency_id, date) {
  $.ajax({
    method: "POST",
    url: SITE_URL + "/get-currency-exchange-rate",
    data: {
      "toCurrency" : currency_id,
      "date" : date,
      "fromCurrency" : defaultCurrencyId,
      "_token" : token
    },
    dataType:"json",
    success:function(data) {
      $("#search").removeAttr("disabled");
      var global_exchangeRate = data.toFixed(exchange_rate_decimal_digits);
      exchangeRateValue(global_exchangeRate, '#inv-exchange-rate');
    }
  });
}
/**
 * Hide a div
 * @return void
 */
function hideNoDiv() {
  $(document).on('click', function(e) {
    $('#no_div').hide();
  });
}
/**
 * in_array functionalities
 * @param  string search
 * @param  array array
 * @return void
 */
function in_array(search, array) {
  var i;
  for (i = 0; i < array.length; i++) {
    if(array[i] ==search ) {
      return true;
    }
  }
  return false;
}
/**
 * Location OnChange Event
 * @param  string} selector
 * @return void
 */
function onChangeLocation(selector = "#location") {
  let global_location = $(selector).val();
  $(selector).on('change', function () {
    if ($(".itemRow").length > 0) {
      swal({
        title: jsLang('Are you sure?'),
        text: jsLang('Change of location will reset added products/services, please confirm you really want to do this.'),
        icon: "warning",
        buttons: [jsLang('Cancel'), jsLang('Ok')],
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          $('.closeRow').trigger('click');
          global_location = $(selector).val();
        } else {
          $(selector).val(global_location);
          $(selector).trigger('change.select2');
        }
      });
    }
    if ($("#search").val() != '') {
      $("#search").trigger("keydown");
    }
  })
}
/**
 * Supplier Or Customer OnChange Event
 * @param  string selector
 * @return void
 */
function onChangeSupplierOrCustomer(selector) {
  let global_id;
    $("#search").val('');
    var textVal;
    var currency_id = $('option:selected', this).data('currency_id');
    var defaultCurrencySymbol = currencySymbol = $('option:selected', this).data('symbol');
    var name = $('option:selected', this).data('name');
    if (selector == "#supplier") {
      textVal = 'Change of supplier will reset added products/services, please confirm you really want to do this.';
    } else {
      textVal = 'Change of customer will reset added products/services, please confirm you really want to do this.';
    }
    if ($(".itemRow").length > 0) {
      swal({
        title: jsLang('Are you sure?'),
        text: jsLang(textVal),
        icon: "warning",
        buttons: [jsLang('Cancel'), jsLang('Ok')],
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          if (selector == "#customers") {
            $("#inputOtherDiscount").val("0");
            $("#inputShipping").val("0");
            $("#customAmountDescription").val("");
            $("#inputCustomAmount").val("0");
          }
          global_id = $(selector).val();
          $('.closeRow').trigger('click');
        } else {
          $(selector).val(global_id);
          $(selector).trigger('change.select2');
        }
        if (selector == "#customers") {
          $('.currencySymbol').text(defaultCurrencySymbol);
          currency_id = $('option:selected', this).data('currency_id');
          defaultCurrencySymbol = currencySymbol = $('option:selected', this).data('symbol');
          name = $('option:selected', this).data('name');
          resetCurrencySymbol();
        }
      });
    } else {
      if (selector == "#customers") {
        $('.currencySymbol').text(defaultCurrencySymbol);
      }
      global_id = $(selector).val();
      resetCurrencySymbol();
    }
    if (global_id != "") {
      $('#error_message').html('');
      $(selector + "-error").css("display", 'none');
    }
    if (selector == "#supplier") {
      resetCurrencySymbol();
    }
    var date  = $('#datepicker').val();
    $('#error_message').html('');
    if (global_id != '') {
      if ($("#inv-currency").val() != currency_id) {
        getTodayExchangeRate(currency_id, date);
      }
      $('#inv-currency').val(currency_id);
      if (selector == "#supplier") {
        showExchangeRate('#supplier');
      } else {
        showExchangeRate('#customers');
      }
      $('.currencySymbol').text(defaultCurrencySymbol);
      $.ajax({
          method: "POST",
          url: SITE_URL + "/customer/billing-address",
          data: { "id": global_id, "type": selector, "_token":token }
      })
      .done(function(response) {
          var data = JSON.parse(response);
          var address = "";
          var customerOrSupplier = (selector == "#customers") ? "#customer" : selector;
          if (data.status == 1) {
              if (data.supplier.city != null) {
                address += data.supplier.city;
              }
              if (data.supplier.zipcode != null) {
                address += "-" + data.supplier.zipcode;
              }
              if (data.supplier.state != null) {
                address += ", " + data.supplier.state;
              }
              if (data.supplier.country != null) {
                address += ", " + data.supplier.country.name;
              }
              $(customerOrSupplier + "-address").html(address);
              $(customerOrSupplier + "-address").css('display', 'flex');
              $(customerOrSupplier + "-address-left").css('display', 'flex');
          }
          else if (data.status == 2) {
              if (data.customer.billing_city != null) {
                  address += data.customer.billing_city;
              }
              if (data.customer.billing_zip_code != null) {
                  address += "-" + data.customer.billing_zip_code;
              }
              if (data.customer.billing_state != null) {
                  address += ", " + data.customer.billing_state;
              }
              if (data.customer.billing_country != null) {
                  address += ", " + data.customer.billing_country.name;
              }
              $(customerOrSupplier + "-address").html(address);
              $(customerOrSupplier + "-address").css('display', 'flex');
              $(customerOrSupplier + "-address-left").css('display', 'flex');
          }
          else {
              $(customerOrSupplier + "-address").html("");
              $(customerOrSupplier + "-address").css('display', 'none');
              $(customerOrSupplier + "-address-left").css('display', 'none');
          }
          if ($("#search").val() != '') {
              $("#search").focus().trigger("keydown").trigger("keyup");
          }
      });
    } else {
      $('#exchangeRateBlock').hide();
      $(customerOrSupplier + "-address").html("");
    }
}
/**
 * Tax OnChange Event
 * @param  string selector
 * @return void
 */
function onChangeTax(selector) {
  $('.taxRow').hide();
  $.each($(selector), function(index, value) {
    if ($(this).val() != 0) {
      $.each($(this).val(), function(index, value) {
        var block = $('#taxRow-' + value);
        block.show();
      });
    }
  });
}
/**
 * Payment Method OnChange Event
 * @param  string type
 * @return void
 */
function onChangePaymentMethod(type) {
    paymentMethod = $(this).val();
    paymentMethodName = $('option:selected', this).attr('data-methodName');
    if(type == "sales") {
      $("#account_div, #incoming_amount_div, #exchange_rate_div").css('display', 'flex');
    } else {
      $("#account_div, #incoming_amount_div, #account_balance, #exchange_rate_div").hide();
    }
    $('#amount_message').removeClass('text-danger').html('');
    $('#account_no').val('');
    $('#currency').val('').attr("disabled", false);
    $('#select2-currency-container, #select2-account_no-container').text(jsLang('Select One'));
    $('#set_account_balance').val(null);
    $('#currency').val(invoiceCurrency).trigger('change');
    $('#currency_div').css('display', 'flex');
    if (paymentMethodName) {
      $('#setPaymentMethodName').val(paymentMethodName);
      paymentMethodName = paymentMethodName.toLowerCase();
      if (paymentMethodName == "bank") {
        $('#account_div').css('display', 'flex').removeClass("mb-0");
      } else {
        $('#account_div').css('display', 'none');
      }
    }
    $('#amount').removeClass('error');
    $('#amount-error').text('');
}
/**
 * Currency OnChange Event
 * @param  string systemCurr
 * @param  string currentCurr
 * @return void
 */
function onChangeCurrency(systemCurr, currentCurr) {
  $("#exchange_rate").val(1);
  if (($('option:selected', '#currency').val()) == '' || ($('option:selected', '#currency').text()) == 'undefined') {
    $('#incoming_amount_div').css('display', 'none');
    $('#exchange_rate_div').css('display', 'none');
    formatEquivalentAmount();
  } else {
    $('#incoming_amount_div').css('display', 'flex');
    $('#exchange_rate_div').css('display', 'flex');
  }
  $('#amount_currency_code').text(($('option:selected', '#currency').text()));
  $('#incoming_currency').text(invoiceCurrencyName);
  $('#exchange_rate_currency_code').text(invoiceCurrencyName);
  if ($('#currency').val()) {
    $('#setCurrency').val($('#currency').val());
  }
  $('#account_div').removeClass("mb-0");
  if (systemCurr != currentCurr) {
    if (paymentMethodName != 'bank') {
      var currency_id = $("#currency").val();
      var token = $("#token").val();
      if (currency_id != '') {
        $("#account_no-error").hide();
        $('#incoming_amount_div').css('display', 'flex');
        $('#exchange_rate_div').css('display', 'flex');
        formatEquivalentAmount();
      }
    } else {
      formatEquivalentAmount();
    }
    $('#incoming_amount_div').css('display', 'flex');
    $('#exchange_rate_div').css('display', 'flex');
  } else {
    $("#incoming_amount").val(null);
    $('#incoming_amount_div').css('display', 'none');
    $('#exchange_rate_div').css('display', 'none');
    formatEquivalentAmount();
  }
  $('#amount').removeClass('error');
  $('#amount-error').text('');
}
/**
 * Amount Exchange Rate OnKeyUp Event
 * @return void
 */
function onKeyUpAmountExchangeRate() {
  $(document).on('keyup', '#amount, #exchange_rate', function () {
    $('#setCurrency').val($('#currency').val());
    var currency_id = Number($('option:selected', '#currency').val());
    var exchange_rate = Number($("#exchange_rate").val());
    var amount = parseFloat(validateNumbers($("#amount").val()));
    if (isNaN(exchange_rate)) {
      exchange_rate = validateNumbers($("#exchange_rate").val());
    }
    if (paymentMethodName == "bank") {
      if ($('#account').val() != "" && amount != 0) {
        $.ajax({
          method: "POST",
          url: SITE_URL+"/transfer/check-balance",
          data: {"account_no": $("#account_no").val(), "_token": token}
        })
        .done(function( balance ) {
          var checkBalance = Number(balance);
          var checkAmount = validateNumbers($("#amount").val());
          if (checkAmount > checkBalance) {
            $('#amount_message').addClass('text-danger').html('<strong>' + jsLang('Not sufficent balance in the account') + '</strong>');
            $('#pay-button').attr('disabled', 'disabled');
          } else {
            $('#pay-button').removeAttr('disabled');
            $('#amount_message').removeClass('text-danger').html('');
          }
        });
      }
    }
    if (exchange_rate == 0) {
      $("#incoming_amount").val(getDecimalNumberFormat(0));
    } else {
      $("#incoming_amount").val(getDecimalNumberFormat(amount * exchange_rate));
    }
  });
}
/**
 * Account OnChange Event
 * @param  string type
 * @return void
 */
function onChangeAccountNo(type) {
  $('#amount_message').removeClass('text-danger').html('');
  var currency_id = $("#account_no option:selected").attr("data-currency");
  $('#setCurrency').val(currency_id);
  var symbol = $("#account_no option:selected").attr("data-code");
  $('#amount_currency_code').text(symbol);
  $('#incoming_currency').text(invoiceCurrencyName);
  var token = $("#token").val();
  var date = $('#datepicker').val();
  if (currency_id != '') {
    $("#account_no-error").hide();
    $('#incoming_amount_div').css('display', 'flex');
    $('#exchange_rate_div').css('display', 'flex');
  }

  if (Number($("#account_no option:selected").attr("data-currency")) === Number(dflt_currency_id)) {
    $('#incoming_amount_div').css('display', 'none');
    $('#exchange_rate_div').css('display', 'none');
    $("#exchange_rate").trigger("input");
  }
  if (typeof symbol == 'undefined') {
    symbol = $('#currency-symbol').val();
    $('#incoming_amount_div').css('display', 'none');
    $('#exchange_rate_div').css('display', 'none');
    formatEquivalentAmount();
  }
  var paymentMethod = $('#payment_method').val();
  var currencyId = $('option:selected', '#account_no').attr('data-currency');
  var currencyName = $('option:selected', '#account_no').attr('data-code');
  var currencyOption = `<option selected value="`+ currencyId + `">` + currencyName + `</option>`;
  var account_no = $("#account_no").val();
  var amount = validateNumbers($("#incoming_amount").val());
  if (type == "purchase") {
    $.ajax({
      method: "POST",
      url: SITE_URL+"/transfer/check-balance",
      data: {"account_no": account_no, "_token": token}
    })
    .done(function(balance) {
      var accountCurrencySymbol = $("#account_no option:selected").attr("currency-symbol");
      var checkAmount = Number(amount);
      var checkBalance = Number(balance);
      $('#set_account_balance').val(checkBalance ? checkBalance : 0);
      if (checkBalance == 0 && account_no == "") {
        $('#account_div').removeClass("mb-0");
        $('#account_balance_div').hide();
        $('#account_balance').css('display', 'flex');
      } else {
        $('#account_balance_div').css('display', 'flex');
        if(checkBalance > 0) {
            $('#account_balance').css('display', 'flex');
            $('#account_div').addClass("mb-0");
        }
        $('#account_balance').text(jsLang('Available Balance :') + accountCurrencySymbol + getDecimalNumberFormat(checkBalance));
        if (checkAmount > parseFloat(checkBalance)) {
          $("#errorMessage").html(jsLang('Insufficient balance'));
        }
        if (checkAmount <= parseFloat(checkBalance)) {
          $("#errorMessage").html('');
        }
      }
    });
  }
  if (paymentMethodName == "bank") {
    $('#account_currency').attr("disabled", true).append(currencyOption);
    $('#setCurrency').val($('#account_currency').val());
    if (account_no == '') {
      $('#account_div').css('display', 'flex');
      $('#account_currency_div').css('display', 'none');
      $('#currency_div').hide();
    } else if (account_no != '') {
      $('#account_currency_div').css('display', 'flex');
      $('#currency_div').css('display', 'none');
    } else {
      $('#account_currency_div').css('display', 'none');
      $('#currency_div').css('display', 'flex');
      $('#account_div').removeClass("mb-0");
      $('.message').removeClass('text-danger').html('');
    }
    $('#currency-error').hide();
  }
  var systemCurr = Number($('#account_currency').val());
  var currentCurr = Number(dflt_currency_id);
  if (systemCurr == currentCurr) {
    $("#incoming_amount").val(null);
    $('#incoming_amount_div').css('display', 'none');
    $('#exchange_rate_div').css('display', 'none');
    formatEquivalentAmount();
  } else {
    $('#incoming_amount_div').css('display', 'flex');
    $('#exchange_rate_div').css('display', 'flex');
    formatEquivalentAmount();
  }
  if (! account_no) {
    $('#currency').val(invoiceCurrency).trigger('change');
    $('#currency').attr("disabled", false);
    $('#currency_div').css('display', 'flex');
  } else {
    formatEquivalentAmount();
  }
}
/**
 * Pay Modal
 * @return void
 */
function payModal() {

    $('#payModal form')[0].reset();
    $('#payment_method').val('').trigger('change');
    $('#payment_date').daterangepicker(dateSingleConfig(), function(start, end) {
      $('#payment_date').val(moment(start, 'MMMM D, YYYY').format(dateFormat.toUpperCase()));
    });
    var amount = $('#amount').val();
    var exhangeRate = $('#exchange_rate').val();
    $('#amount').removeClass('error').val(getDecimalNumberFormat(amount));
    $('#amount-error').text('');
    $('#exchange_rate').val(getDecimalNumberFormat(exhangeRate));

}
/**
 * Pay Form Ajax
 * @return void
 */
function payFormAjaxCall() {
  $.ajax({
    type: "POST",
    url: $('#payForm').attr("action"),
    data: $('#payForm').serialize(),
    dataType: "json",
    success: function(response) {
      if (response.status == true) {
        $('#payModal').modal('toggle');
        $(".spinner").show();
        $(".spinner").css('line-height', '0');
        swal(response.message, {
          icon: "success",
          buttons: [false, jsLang('Ok')],
        });
      location.reload();
      } else {
        $(".spinner").hide();
        swal(response.message, {
          icon: "error",
          buttons: [false, jsLang('Ok')],
        });
      }
    },
    error: function(err) {
      $(".spinner").hide();
      swal(jsLang('Oops! Something went wrong, please try again.'), {
        icon: "error",
        buttons: [false, jsLang('Ok')],
      });
    }
  });
}
/**
 * Set Reference Value
 * @param  string type
 * @param  string url
 * @return void
 */
function referenceNo(type, url) {
  $(document).on('keyup', '#reference_no', function () {
    var val = $(this).val();
    $(this).val(val.replace(/[^0-9]/g, ""));
    if(val == null || val == '') {
      $("#errMsg").html(jsLang('This field is required.')).removeClass('text-success').addClass('text-danger');
      $('#btnSubmit').attr('disabled', 'disabled');
      return;
    } else {
      $("#errMsg").html("").removeClass('text-danger');
      $('#btnSubmit').removeAttr('disabled');
    }
    var ref = type + $(this).val();
    $("#reference_no_write").val(ref);
    if (val != null || val != '') {
      $.ajax({
        method: "POST",
        url: url,
        data: { "ref": ref, "_token": token }
      })
      .done(function( data ) {
        var data = JSON.parse(data);
        if(data.status_no == 1) {
          $("#errMsg").html(jsLang('Reference exist')).removeClass('text-success').addClass('text-danger');
          $('#btnSubmit').attr('disabled', 'disabled');
        } else if (data.status_no == 2) {
          $("#errMsg").html("");
          $("#errMsg").removeClass("text-danger");
          $('#btnSubmit').removeAttr('disabled');
        } else {
          $("#errMsg").html(jsLang('This field is required.')).removeClass('text-success').addClass('text-danger');
          $('#btnSubmit').attr('disabled', 'disabled');
        }
      });
    }
  });
}
/**
 * Submit Customer Or Supplier Modal
 * @param  string className
 * @param  string selectorId
 * @return void
 */
function submitCustomerOrSupplierModal(className, selectorId) {
  $('#theModalSubmitBtn').on('click', function(e) {
    if ($(this).hasClass(className)) {
      $(selectorId).trigger('submit');
    }
  });
}
/**
 * Show Exhange Rate Div
 * @param  string selector
 * @return void
 */
function showExchangeRate(selector) {
  var date        = $('#datepicker').val();
  var currency_id = $('option:selected', selector).data('currency_id');
  if(currency_id == defaultCurrencyId) {
    $('#exchangeRateBlock').hide();
    $('#inv-exchange-rate').val(1);
  } else {
    $('#exchangeRateBlock').css('display', 'block');
  }
}
function checkIsAvailable(type) {
  let noError = true;
  $('.inputQty').each(function(index, value) {
      var currentQuantity = $(this).val();
      var availableQuantity = $(this).attr('data-max');
      if (type == "invoice") {
        if (parseFloat(validateNumbers(currentQuantity)) == 0) {
          swal(jsLang('Quantity can not be zero'), {
            icon: "error",
            buttons: [false, jsLang('Ok')],
          });
          $(this).addClass("error");
          noError = false;
          return false;
        }
      }
      if ($(this).attr('data-is_stock_managed') == 1 && parseFloat(availableQuantity) < parseFloat(validateNumbers(currentQuantity))) {
        swal(availableQuantity + jsLang(' item(s) available in stock'), {
          icon: "error",
          buttons: [false, jsLang('Ok')],
        });
        $(this).addClass("error");
        noError = false;
      }
  });
  return noError;
}

function checkDiscountAmount() {
  var totalValue = $('#totalValue').val();
  var shippingTotal = validateNumbers($('#shippingTotal').text());
  if (totalValue != "" && totalValue != undefined) {
    if (thousand_separator == ".") {
      totalValue = (totalValue.toString()).replace(".", "");
    } else {
      totalValue =  (totalValue.toString()).replace(",", "");
    }
  }
  if (totalValue - shippingTotal < 0) {
    swal(jsLang('"Discount amount can not be more than the total amount'), {
      icon: "error",
      buttons: [false, jsLang('Ok')],
    });
    return false;
  }
}
