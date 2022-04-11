// Purchase list
'use strict';
if ($('.main-body .page-wrapper').find('#sales-quotation-view-details-container').length || $('.main-body .page-wrapper').find('#sales-invoice-view-details-container').length || $('.main-body .page-wrapper').find('#purchase-view-details-container').length) {
  jQuery.validator.addMethod("regxEmailValidation", function(value, element) {
		return this.optional(element) || validateEmail(value);
	}, jsLang('Enter a valid email'));
  //Email modal validation
  $('#sendOrderInfo').validate({
    rules: {
      email: {
        required: true,
        regxEmailValidation: true
      },
      subject: {
        required: true,
      },
      message: {
        required: true,
      }
    }
  });
  if ($('.main-body .page-wrapper').find('#sales-quotation-view-details-container').length || $('.main-body .page-wrapper').find('#sales-invoice-view-details-container').length) {
    // SMS modal validation
    $('#sendOrderInfoSMS').validate({
      rules: {
        phoneno: {
          required: true
        },
        message: {
          required: true
        }
      }
    });
  }
}
// Common Js
let global_exchangeRate;
$(document).on("change", "#inv-exchange-rate", function () {
  var newExchangeRate = parseFloat(validateNumbers($("#inv-exchange-rate").val()));
  if (global_exchangeRate == '' || global_exchangeRate == null || global_exchangeRate === 'undefined') {
    global_exchangeRate = $("#global_exchangeRate").val();
  }
  $.each($('.inputPrice'), function (index, value) {
    var updatedValue = validateNumbers(value.value) / global_exchangeRate * newExchangeRate;
    $(value).val(getDecimalNumberFormat(updatedValue));
  });
  global_exchangeRate = newExchangeRate;
  $('.inputPrice').trigger('keyup');
});

function editPurchaseReceive(flag) {
  $("#submit-button").on("click", function () {
    $.ajax({
      type: "POST",
      url: $('#editReceive').attr("action"),
      data: {
        "_token": token, "id": $('#receive-id').val(), "date": $('#date').val(),
      },
      beforeSend: function() {
        if(flag == "list") {
          /* load spinner */
          $("#submit-button").html(spinner);
          /* end of spinner */
        }
      },
      success: function(response) {
        if (response.status == true) {
          $('#editModal').modal('toggle');
          $('#dataTableBuilder').DataTable().ajax.reload( null, false);
        } else {
          $("#error-msg").css("display", 'flex').text(jsLang('Update failed, please try again.'));
        }
        return false;
      },
      error: function(err) {
        swal(jsLang('Oops! Something went wrong, please try again.'), {
          icon: "error",
          buttons: [false, jsLang('Ok')],
        });
      }
    });
  });
}
// End Common Js

// Purchase list
if ($('.main-body .page-wrapper').find('#purchase-list-container').length) {
  $(document).on("click", "#csv, #pdf", function(event) {
    event.preventDefault();
    window.location = SITE_URL+"/purchase-" + this.id + "?to=" + $('#endto').val() + "&from=" + $('#startfrom').val() + "&supplier=" + $('#supplier').val() + "&currency=" + $('#currency').val() + "&location=" + $('#location').val() + "&status=" + $('#status').val();
    });
  $('#dataTableBuilder').addClass('purchase-list');
}
// End Purchase list

// Purchase Add
if ($('.main-body .page-wrapper').find('#purchase-add-container').length) {
  var stack = [];
  var nums = [];
  var symbol = "";
  var defaultCurrencySymbol = currencySymbol;
  var refNo = 'PO-' + $("#reference_no").val();
  $("#reference_no_write").val(refNo);
  $(".select2").select2();
  setModalFieldsValue();
  resetEverything();
  triggerAllChanges();
  generateAllTotal();
  $('.inputPrice').trigger('keyup');
  generateSortingNumber();
  $('.addRowContainer').hide().last().show();
  $("#myModal").on('show.bs.modal', function () {
    $('#myModal .select2-container--default').not(":first").remove();
    $(".js-example-basic-single2").select2({
      dropdownParent: $('#myModal-body')
    });
  })
  customerOrSupplierModal('btn_add_supplier', 'add-supplier', jsLang('Add Supplier'));
  submitCustomerOrSupplierModal('btn_add_supplier', '#addSupplier');
  $("#btnSubmit").on("click", function () {
    return checkItemSelected(jsLang('Please select at least one item to create purchase.'))
  });
  $("#purchaseForm").validate({
    rules: {
      'supplier_id': {
        required: true,
      },
      'order_date': {
        required: true,
      },
      'reference': {
        required: true,
      },
      'item_qty[]': {
        required: true,
      },
      'custom_item_qty[]': {
        required: true,
      },
      'item_price[]': {
        required: true,
      },
      'custom_item_price[]': {
        required: true,
      },
      'item_name[]': {
        required: true
      },
      'custom_item_name[]': {
        required: true
      },
      'inv_exchange_rate': {
        required: true,
      },
      'custom_amount_title': {
        required: true
      }
    },
    messages: {
      "order_date" : {
        required: jsLang('Order date required'),
      },
      "reference": {
        required: jsLang('Reference required'),
      },
      "item_name[]": {
        required: jsLang('Required'),
      },
      "custom_item_name[]": {
        required: jsLang('Required'),
      },
      "item_qty[]": {
        required: jsLang('Required'),
      },
      "custom_item_qty[]": {
        required: jsLang('Required'),
      },
      "item_price[]": {
        required: jsLang('Required'),
      },
      "custom_item_price[]": {
        required: jsLang('Required'),
      },
      'custom_amount_title': {
        required: jsLang('Required')
      }
    },
  });
  customItemValidation('#purchaseForm');
  hideNoDiv();
  referenceNo('PO-', SITE_URL + "/purchase/reference-validation");
  customItem("add", '#supplier', jsLang('Please select supplier first'));
  onChangeLocation();
  $('#supplier').on('change', function () {
    onChangeSupplierOrCustomer("#supplier");
  });
  showExchangeRate('#supplier');
  $(".inputDiscountType").select2();
  $('#datepicker').daterangepicker(dateSingleConfig());
  $( "#search" ).autocomplete({
    delay: 500,
    position: { my: "left top", at: "left bottom", collision: "flip" },
    source: function(request, response) {
      autoCompleteSource(request, response, SITE_URL + '/purchase/item-search', '#supplier');
    },
    select: function(event, ui) {
      var e = ui.item;
      if (e.id) {
        if (!in_array(e.id, stack)) {
          autoCompleteSelect("add", e, '#supplier');
          //noinspection JSAnnotator
          var new_row=`<tbody id="rowId-${rowNo}">
                          <input type="hidden" name="item_id[]" value="${e.id}">
                          <input type="hidden" class="sorting_no" name="sorting_no[]" value="${rowNo}">
                          <tr class="itemRow rowNo-${rowNo}" id="itemId-${e.id}"  data-row-no="${rowNo}">
                              <td class="pl-1">
                                  <input id="item_name_${rowNo}" name="item_name[]" placeholder="${jsLang('Item Name')}" value="${e.value}" type="text" class="inputDescription form-control">
                              </td>
                              <td class="itemHSN">
                                  <input name="item_hsn[]" class="inputHSN form-control text-center" id="item_hsn_${rowNo}" type="text" placeholder="${jsLang('HSN')}" value="${e.hsn}">
                              </td>
                              <td class="itemQty">
                                  <input name="item_qty[]" id="item_qty_${rowNo}" class="inputQty form-control text-center positive-float-number" type="text" value="1">
                              </td>
                              <td class="itemPrice">
                                <input id="item_price_${rowNo}" name="item_price[]" value="${getDecimalNumberFormat(e.price)}" class="inputPrice form-control text-center positive-float-number" type="text" placeholder="0.00">
                              </td>
                              <td class="itemDiscount">
                                <input name="item_discount[]" id="item_discount_${rowNo}" class="inputDiscount form-control text-center positive-float-number" type="text" placeholder="0.00">
                              </td>
                              <td class="itemDiscount">
                                  <input type="hidden" class="indivisualDiscount" value="0">
                                  <select name="item_discount_type[]" class="inputDiscountType select2 form-control">
                                      <option value="%">&nbsp;% &nbsp;</option>
                                      <option value="$">Flat</option>
                                  </select>
                              </td>
                              <td class="itemTax min-width-145">
                                  <input  type="hidden" class="indivisualTax" value="0">${taxSelect}
                              </td>
                              <td class="itemAmount">
                                  <span class="indivisualTotal">0</span>
                              </td>
                              <td class="text-center">
                                  <button type="button" class="closeRow btn btn-xs btn-danger" data-row-id="${rowNo}"><i class="feather icon-trash-2"></i></button>
                              </td>
                          </tr>
                          <tr id="des-row-${rowNo}">
                              <td colspan="${rowNo}" class="des-col">
                                  <textarea name="item_description[]" placeholder="${jsLang('Item Description')}" class="inputItemDescription form-control">${(e.description == null || e.description == '') ? '' : e.description}</textarea>
                              </td>
                              <td colspan="3" class="des-col"></td>
                          </tr>
                      </tbody>`;
          $('#product-table').append(new_row);
          onChangeTax('.inputTax');
        } else {
          var quantity = $('#itemId-'+e.id).find('.inputQty').val();
          quantity = validateNumbers(quantity);
          quantity++;
          $('#itemId-'+e.id).find('.inputQty').val(getDecimalNumberFormat(quantity));
        }
        $('#itemId-'+e.id).find('.inputQty').trigger("blur");
        resetEverythingExcept();
        onChangeInvType();
        generateSortingNumber();
        triggerSomeChanges();
        $(".select2").select2();
        checkStack(rowNo, "purchase_add");
        this.value = "";
        return false;
      }
    },
    minLength: 1,
    autoFocus: true
  });
  $('.selectpicker').selectpicker();
  $(document).on('change','.inputTax', function () {
    onChangeTax('.inputTax');
  });
  allTax('.inputTax.form-control', '.inputTax');
  calculateHiddenTax($(this));
  $('#otherDiscountType').trigger('change');
  generateAllTotal();
  deleteAttachment(SITE_URL + '/file/remove');
  uploadAttachment(SITE_URL + '/file/upload', '#supplier');
  $(document).on('click', '#btnSubmit', function() {
    if (checkDiscountAmount() == false) {
      return false;
    }
    if (checkIsAvailable("invoice") == false) {
      return false;
    } else if ($("#purchaseForm").valid() == true) {
      /* load spinner */
        $(".spinner").show();
        $(".spinner").css('line-height', '0');
        $(".spinner").css('display', 'inline-block');
        $("#spinnerText").text(jsLang('Please wait...'));
        /* end of spinner */
        $(this).attr('disabled', 'disabled');
        // return false;
        $("#purchaseForm").trigger('submit');
    }
  });
}
// End Purchase Add

// Purchase Edit
if ($('.main-body .page-wrapper').find('#purchase-edit-container').length) {
  var nums = [];
  global_exchangeRate = exchangeVal.toFixed(decimal_digits);
  resetEverything();
  onChangeInvType();
  $('#invItemTax, #invItemDiscount, #invItemDetails, #invItemHSN, #invShipping, #invCustomAmount, #invOtherDiscount, #discount-on, #tax-type').trigger('change');
  setModalFieldsValue();
  generateAllTotal();
  hideNoDiv();
  $('.inputPrice').trigger('keyup');
  generateSortingNumber();
  $('.addRowContainer').hide().last().show();
  $("#myModal").on('show.bs.modal', function () {
    $('#myModal .select2-container--default').not(":first").remove();
    $(".js-example-basic-single").select2({
      dropdownParent: $('#myModal-body')
    });
  })
  $("#btnSubmit").on("click", function () {
    return checkItemSelected(jsLang('Please select at least one item to purchase'));
  })
  $('#purchaseForm').validate({
    rules: {
      'supplier_id': {
        required: true,
      },
      'order_date': "required",
      'reference': "required",
      'custom_item_name[]': {
        required: true,
      },
      'item_name[]': {
        required: true,
      },
      'old_item_name[]': {
        required: true,
      },
      'item_qty[]': {
        required: true,
      },
      'old_item_qty[]': {
        required: true,
      },
      'custom_item_qty[]': {
        required: true,
      },
      'item_price[]': {
        required: true,
      },
      'old_item_price[]': {
        required: true,
      },
      'custom_item_price[]': {
        required: true,
      },
      'inv_exchange_rate': {
        required: true,
      },
      "custom_amount_title": {
        required: true
      },
      "shipping": {
        required: true
      },
      "custom_amount": {
        required: true
      }
    },
    messages: {
      "order_date" : {
        required: jsLang('Order date required'),
      },
      "old_item_name[]": {
        required: jsLang('Required'),
      },
      "item_name[]": {
        required: jsLang('Required'),
      },
      "custom_item_name[]": {
        required: jsLang('Required'),
      },
      "item_qty[]": {
        required: jsLang('Required'),
      },
      "old_item_qty[]": {
        required: jsLang('Required'),
      },
      "custom_item_qty[]": {
        required: jsLang('Required'),
      },
      "item_price[]": {
        required: jsLang('Required'),
      },
      "old_item_price[]": {
        required: jsLang('Required'),
      },
      "custom_item_price[]": {
        required: jsLang('Required'),
      },
      'custom_amount_title': {
        required: jsLang('Required')
      },
      "shipping": {
        required: jsLang('Required')
      },
      "custom_amount": {
        required: jsLang('Required')
      }
    },
  });
  $(document).on('click', '.addRow', function () {
    changeCustomItemText();
  });
  exchangeRateValue(exchangeVal, '#inv-exchange-rate');
  onChangeLocation();
  $(".select2, .inputDiscountType").select2();
  if ($('#datepicker').val() != '') {
    var purchase_date = $('#datepicker').val();
  }
  $('#datepicker').daterangepicker(dateSingleConfig($('#datepicker').val()));
  $( "#search" ).autocomplete({
    delay: 500,
    position: { my: "left top", at: "left bottom", collision: "flip" },
    source: function(request, response) {
      autoCompleteSource(request, response, SITE_URL + '/purchase/item-search', "#supplier", $("#sales_type_id").val());
    },
    select: function(event, ui) {
      var e = ui.item;
      if(e.id) {
        if(!in_array(e.id, stack)) {
          autoCompleteSelect("add", e, "#supplier");
          //noinspection JSAnnotator
          var new_row2=`<tbody id="rowId-${rowNo}">
                          <input type="hidden" name="item_id[]" value="${e.id}">
                          <input type="hidden" class="sorting_no" name="sorting_no[]" value="${rowNo}">
                          <tr class="itemRow rowNo-${rowNo}" id="itemId-${e.id}">
                            <td class="pl-1">
                              <input id="item_name_${rowNo}" name="item_name[]" placeholder="${jsLang('Item Name')}" value="${e.value}" type="text" class="inputDescription form-control">
                            </td>
                            <td class="itemHSN">
                              <input name="item_hsn[]" class="inputHSN form-control text-center" type="text" placeholder="${jsLang('HSN')}" value="${e.hsn}">
                            </td>
                            <td class="itemQty">
                              <input name="item_qty[]" class="inputQty form-control text-center positive-float-number" id="item_qty_${rowNo}" type="text" value="1" min="0">
                            </td>
                            <td class="itemPrice">
                              <input id="item_price_${rowNo}" name="item_price[]" value="${getDecimalNumberFormat(e.price)}" class="inputPrice form-control text-center positive-float-number" type="text" placeholder="0.00" min="0">
                            </td>
                            <td class="itemDiscount">
                              <input name="item_discount[]" id="item_discount_${rowNo}" class="inputDiscount form-control text-center positive-float-number" type="text" placeholder="0.00" min="0">
                            </td>
                            <td class="itemDiscount">
                              <input type="hidden" class="indivisualDiscount" value="0">
                              <select name="item_discount_type[]" class="inputDiscountType form-control">
                                  <option value="%">%</option>
                                  <option value="$">Flat</option>
                              </select>
                            </td>
                            <td class="itemTax min-width-145">
                              <input  type="hidden" class="indivisualTax" value="0">${taxSelect}
                            </td>
                            <td class="itemAmount">
                              <span class="indivisualTotal">0</span>
                            </td>
                            <td class="text-center">
                              <button type="button" class="closeRow btn btn-xs btn-danger" data-row-id="${rowNo}"><i class="feather icon-trash-2"></i></button>
                            </td>
                          </tr>
                          <tr id="des-row-${rowNo}">
                            <td colspan="4" class="des-col">
                              <textarea name="item_description[]" placeholder="${jsLang('Item Description')}" class="inputItemDescription form-control"></textarea>
                            </td>
                            <td colspan="3" class="des-col"></td>
                          </tr>
                        </tbody>`;
          $('#product-table').append(new_row2);
        } else {
          var quantity = validateNumbers($('#itemId-'+e.id).find('.inputQty').val());
          quantity++;
          $('#itemId-'+e.id).find('.inputQty').val(getDecimalNumberFormat(quantity));
        }
        triggerSomeChanges();
        resetEverythingExcept();
        onChangeInvType();
        generateSortingNumber();
        checkStack(rowNo);
        this.value = "";
        return false;
      }
    },
    minLength: 1
  });
  $('.selectpicker').selectpicker();
  $(document).on('changed.bs.select','.selectpicker', function (e, clickedIndex, newValue, oldValue) {
    onChangeTax('.selectpicker');
  });
  allTax('.inputTax.form-control.selectpicker', '.selectpicker');
  deleteAttachment(SITE_URL + '/file/remove');
  uploadAttachment(SITE_URL + '/file/upload', '#supplier');
  $(".inputQty").trigger("change");
  $(document).on('click', '#btnSubmit', function() {
    if (checkDiscountAmount() == false) {
      return false;
    }
    if (checkIsAvailable("invoice") == false) {
      return false;
    }
  });
}
// End Purchase Edit

// Purchase View Details
if ($('.main-body .page-wrapper').find('#purchase-view-details-container').length) {
  $(".spinner").css('display', 'none');
  var accountNo = '', paymentMethod = '', paymentMethodName = '', currencyId = '', currencyName = '', currencyOption = '';
  $('#payment_date').daterangepicker(dateSingleConfig());
  $('#payModal').on('hidden.bs.modal', function () {
    $('#account_div').css('display', 'none')
    payModal();
  });
  $('#payModal').on('show.bs.modal', function () {
    $('#account_div').css('display', 'none');
    $('#currency').val(invoiceCurrency).trigger('change');
  });
  $('.js-example-basic').select2({
    dropdownParent: $('#payModal')
  });
  ClassicEditor.create(document.querySelector('.editor'));
  $("#payForm").validate({
    rules: {
      amount: {
        required: true,
      },
      incoming_amount: {
        required: false,
      },
      payment_date: {
        required: true,
      },
      currency: {
        required: true,
      }
    },
    submitHandler: function() {
      payFormAjaxCall();
    }
  });
  deleteModal();
  $('#theModalSubmitBtn').on('click', function () {
    $("#delete-purchase").trigger('submit');
  });
  $(document).on('change', '#payment_method', function () {
    $('#account_currency_div').css('display', 'none');
    onChangePaymentMethod("purchase");
  });
  $("#currency").on('change', function () {
    onChangeCurrency(Number(dflt_currency_id), Number($('#currency').val()));
  });
  $(document).on('keyup', '#amount, #exchange_rate', function () {
    onKeyUpAmountExchangeRate();
  });
  $("#account_no").on('change', function () {
    onChangeAccountNo("purchase");
  });
  deleteAttachment(SITE_URL + '/file/remove?type=purchase');
  uploadAttachment(SITE_URL + '/file/upload?type=payment', '#customer_id');
  $('#modalBtn').on('click', function(){
    $('#payModal').modal({
      backdrop: 'static',
      keyboard: false
    });
  });
}
// End Purchase View Details

// Purchase Receive List
if ($('.main-body .page-wrapper').find('#purchase-receive-list-container').length) {
  $(document).on('click', '.edit-btn', function () {
    $("#receive-id").val($(this).attr('data-id'));
    $("#date").val($(this).attr('data-date'));
  });
  $(document).on('show.bs.modal', "#editModal", function () {
      $('#date').daterangepicker(dateSingleConfig(), function(start, end) {
        $('#date').val(moment(start, 'MMMM D, YYYY').format(dateFormat));
      });
  });
  editPurchaseReceive("list");
  $(document).on("click", "#csv, #pdf", function(event) {
    event.preventDefault();
    window.location = SITE_URL + "/purchase/receive/" + this.id + "?to=" + $('#endto').val() + "&from=" + $('#startfrom').val() + "&supplier=" + $('#supplier').val();
  });
  $('#dataTableBuilder').addClass('purchase-receive-list')
}
// End Purchase list

// Purchase Receive View Details
if ($('.main-body .page-wrapper').find('#purchase-recieve-details-container').length) {
  $('#date').daterangepicker(dateSingleConfig(editDate));
    deleteModal();
    $('#theModalSubmitBtn').on('click', function () {
      $("#delete-purchase-receive").trigger('submit');
    });
    editPurchaseReceive("details");
}
// End Purchase Receive View Details

// Purchase Payment List
if ($('.main-body .page-wrapper').find('#purchase-payment-list-container').length) {
  $('.select2').select2({});
    $(document).on("click", "#csv, #pdf", function(event) {
      event.preventDefault();
      window.location = SITE_URL + "/payment/supplier-" + this.id + "?to=" + $('#endto').val() + "&from=" + $('#startfrom').val() + "&supplier=" + $('#supplier').val() + "&method=" + $('#method').val() + "&currency=" + $('#currency').val();
    });
    $('#dataTableBuilder').addClass('purchase-payment-list');
}
// End Purchase Payment List

// Purchase Payment edit
if ($('.main-body .page-wrapper').find('#purchase-payment-edit-container').length) {
  $("#payment_date").attr('readonly','readonly');
  deleteAttachment(SITE_URL + '/file/remove');
  uploadAttachment(SITE_URL + '/file/upload', '#customers');
  $(window).on('load', function() {
    if ($(window).width() < 650) {
      $('.col-sm-2').addClass('col-sm-3');
      $('.col-sm-3').removeClass('col-sm-2');
      $('.col-sm-7').addClass('col-sm-8');
      $('.col-sm-8').removeClass('col-sm-7');
    }
  });
}
// End Purchase Payment edit

// Purchase Payment View Details
if ($('.main-body .page-wrapper').find('#purchase-payment-view-details-container').length) {
  ClassicEditor.create(document.querySelector('.editor'));
  $('#sendPaymentReceipt').validate({
    rules: {
      email: {
        required: true
      },
      subject:{
        required: true,
      },
      message:{
        required: true,
      }
    }
  });
  deleteModal();
  $('#theModalSubmitBtn').on('click', function () {
    $("#delete-purchase-payment").trigger('submit');
  })
}
// Purchase receive
if ($('.main-body .page-wrapper').find('#add-purchase-receive-container').length) {
  $('#datepicker').daterangepicker(dateSingleConfig());
  $(document  ).on('click', '.delete_item', function(event) {
    event.preventDefault();
    $(this).closest("tr").remove();
    var rowCount = $('tr.tblRows').length;
    if(rowCount==0){
      $("#btnSubmit").prop('disabled',true);
    }
  });

  let quantityId, maxQuantity, quantity;
  $('.inputQty').on('keyup', function() {
    $(this).each(function() {
      quantityId = $(this).attr('data-id');
      quantity = $('#rowId-'+ quantityId).val();
      maxQuantity = $(this).attr('data-max');
      if (!$.isNumeric(quantity)) {
        if (quantity == '') {
          $('#error_'+ quantityId).addClass('errorClass').text(jsLang('Quantity can not be zero or empty')).show();
        }
      } else if ($.isNumeric(quantity)) {
        if (quantity != '' && parseFloat(validateNumbers(quantity)) > parseFloat(maxQuantity)) {
          $('#error_'+ quantityId).addClass('errorClass').text(jsLang('Quantity can not be more than') + ' ' + getDecimalNumberFormat(maxQuantity)).show();
        } else if (quantity == 0 || quantity == '') {
          $('#error_'+ quantityId).addClass('errorClass').text(jsLang('Quantity can not be zero or empty')).show();
        } else {
          $('#error_'+ $(this).attr('data-id')).removeClass('errorClass').text('').hide();
        }
      }
    });
  });
  $(document).on('click', '.delete_item', function(event) {
    event.preventDefault();
    $(this).closest("tr").remove();
  });
  $('#btnSubmit').on('click', function() {
    if ($('tr.tblRows').length == 0 || $('.spanClass').hasClass("errorClass")) {
      return false;
    }
    return true;
  })
}
// End Purchase Payment View Details
