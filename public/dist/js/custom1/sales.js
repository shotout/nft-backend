'use strict';
if ($('.main-body .page-wrapper').find('#sales-quotation-view-details-container').length || $('.main-body .page-wrapper').find('#sales-invoice-view-details-container').length || $('.main-body .page-wrapper').find('#purchase-view-details-container').length) {
	jQuery.validator.addMethod("regxEmailValidation", function(value, element) {
		return this.optional(element) || validateEmail(value);
	}, jsLang('Enter a valid email'));
	//Email modal validation for quotation
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

	// Email modal validation for invoice
	$('#sendVoiceInfo').validate({
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
// Common js
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
function copyAddress() {
	$('#copy').on('click', function() {
	    $('#ship_street').val($('#bill_street').val());
	    $('#ship_city').val($('#bill_city').val());
	    $('#ship_state').val($('#bill_state').val());
	    $('#ship_zipCode').val($('#bill_zipCode').val());
	    var bill_country = $('#bill_country_id').val();
	    $("#ship_country_id").val(bill_country).trigger('change');
  	});
}
function preQuantity() {
	let preQuantity = 0;
    $(document).on("keydown", ".inputQty", function (e) {
      	preQuantity = $(this).val();
    })
}
function smsModal(phoneNumber) {
	$('#smsOrder').on('hidden.bs.modal', function (e) {
		$('#sendOrderInfoSMS').validate().resetForm();
		$('#phoneno').val(phoneNumber);
		$('#phoneno').removeClass('error');
	});
}
function showAvailableItem(ul, item) {
	var available;
	if (item.is_stock_managed == 1) {
  		available = getDecimalNumberFormat(item.available);
	} else {
  		available = "-";
	}
	return $( "<li>" ).append("<div>" + item.value + "<br>Available: " + available + "</div>").appendTo(ul);
}
function showAvavilableStock() {
	$(document).on("keyup", ".inputQty", function (e) {
      	var currentQuantity = $(this).val();
      	var availableQuantity = $(this).attr('data-max');
      	if ($(this).attr('data-is_stock_managed') == 1 && parseFloat(availableQuantity) < parseFloat(validateNumbers(currentQuantity))) {
        	swal(availableQuantity + jsLang(' item(s) available in stock'), {
          		icon: "error",
          		buttons: [false, jsLang('Ok')],
        	});
        	$(this).val(preQuantity);
      	}
	})
}
function statusChangePayment() {
	$(document).on('click',".status", function () {
	    var status = $(this).attr('data-id');
	    var customer_transaction_id = $(this).data('trans_id');
	    var transaction_detatils = JSON.stringify(customer_transaction_id);
	    var url   = SITE_URL + '/payment/customer_payment/verification';
	    $.ajax({
	        url:url,
	        method:"POST",
	        data:{'status':status, 'customer_transaction_id':transaction_detatils, '_token':token},
	        dataType:"json",
	        success:function(data) {
	            if (data.status == 1) {
	              	location.reload();
	            } else {
	            	swal(jsLang('Something went wrong, please try again.'), {
                		icon: "error",
                		buttons: [false, jsLang('Ok')],
              		});
	            }
	        }
	    });
  	});
}
// End Common js

// Sales Quotation list
if ($('.main-body .page-wrapper').find('#sales-quotation-list-container').length) {
	$(document).on("click", "#csv, #pdf", function(event) {
	    event.preventDefault();
	    window.location = SITE_URL + "/sales_orders_" + this.id +"?to=" + $('#endto').val() + "&from=" + $('#startfrom').val() + "&location=" + $('#location').val() + "&customerId=" + $('#customer').val() + "&currency=" + $('#currency').val();
  	});
  	$('#dataTableBuilder').addClass('quotation-list');
}
// End Sales Quotation list

// Sales Quotation Add
if ($('.main-body .page-wrapper').find('#sales-quotation-add-container').length) {
  	var defaultCurrencySymbol = currencySymbol;
  	var stack = [];
  	var nums = [];
  	var symbol;
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
  	});
	customerOrSupplierModal('btn_add_customer', 'add-customer', jsLang('Add Customer'));
	submitCustomerOrSupplierModal('btn_add_customer', '#customerAdd');
  	$("#btnSubmit").on("click", function () {
  		return checkItemSelected('Please select at least one item to create quotation');
  	});
  	$('#quotationForm').validate({
    	errorClass: 'error display_block',
	    rules: {
	      	'customer_id': {
	        	required: true,
	      	},
	      	'order_date': "required",
	      	'reference': "required",
	      	'exchange_rate': {
		        required: true,
	      	},
	      	'custom_item_name[]': {
		        required: true,
	      	},
	      	'item_name[]': {
	        	required: true
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
	      	'custom_charge_title': {
	        	required: true
	      	},
	    },
	    messages: {
      		"order_date" : {
	        	required: jsLang('Order date required'),
	      	},
	      	"reference": {
	        	required: jsLang('Reference required'),
	      	},
	      	"exchange_rate" : {
	        	required : jsLang('Required'),
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
	      	'custom_charge_title': {
	        	required: jsLang('Required')
	      	},
	    }
  	});
  	//add new custom row
  	customItem("add", '#customers', jsLang('Please select customer first'));
  	customItemValidation("#quotationForm");
  	hideNoDiv();
  	referenceNo('QN-', SITE_URL+"/invoice/reference-validation");
	var refNo = 'QN-' + $("#reference_no").val();
	$("#reference_no_write").val(refNo);
	onChangeLocation();
	let global_id;
  	$('#customers').on('change', function () {
  		onChangeSupplierOrCustomer("#customers");
  	});
  	$(".select2, .inputDiscountType").select2();
  	$('#datepicker').daterangepicker(dateSingleConfig());
  	$('.ref').val(Math.floor((Math.random() * 100) + 1));
  	$( "#search" ).autocomplete({
    	delay: 500,
    	position: { my: "left top", at: "left bottom", collision: "flip" },
    	source: function(request, response) {
    		autoCompleteSource(request, response, SITE_URL + '/order/search-item', '#customers');
    	},
	    select: function(event, ui) {
	      	var e = ui.item;
	      	if(e.id) {
		        if(!in_array(e.id, stack)) {
		          	autoCompleteSelect("add", e, '#customers');
		          	//noinspection JSAnnotator
		          	var new_row2 = `<tbody id="rowId-${rowNo}">
		                          	<input type="hidden" name="item_id[]" value="${e.id}">
		                          	<input type="hidden" class="sorting_no" name="sorting_no[]" value="${rowNo}">
		                          	<tr class="itemRow rowNo-${rowNo}" id="itemId-${e.id}"  data-row-no="${rowNo}">
		                              	<td class="pl-1">
		                                  	<input id="item_name_${rowNo}" name="item_name[]" placeholder = "${jsLang('Item Name')}" value="${e.value}" type="text" class="inputDescription form-control">
		                              	</td>
		                              	<td class="itemHSN">
		                                  	<input name="item_hsn[]" class="inputHSN form-control text-center" type="text" placeholder="${jsLang('HSN')} value="${e.hsn}">
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
		                              	<td colspan="4" class="des-col">
		                                  	<textarea name="item_description[]" placeholder="${jsLang('Item Description')}" class="inputItemDescription form-control"></textarea>
		                              	</td>
		                              	<td colspan="3" class="des-col"></td>
		                          	</tr>
		                      	</tbody>`;
		          	$('#product-table').append(new_row2);
		        } else {
		          	var quantity = $('#itemId-'+e.id).find('.inputQty').val();
		          	quantity++;
		          	$('#itemId-'+e.id).find('.inputQty').val(quantity);
		        }
		        triggerSomeChanges();
		        $(".inputTax").trigger("change");
		        resetEverythingExcept();
		        onChangeInvType();
		        generateSortingNumber();
		        checkStack(rowNo);
		        $(".select2").select2();
		        this.value = "";
    			return false;
	      	}
	    },
	    minLength: 1
  	});
    $('.selectpicker').selectpicker();
    $(document).on('change','.inputTax', function (e, clickedIndex, newValue, oldValue) {
    	onChangeTax('.inputTax');
    });
    allTax('.inputTax.form-control', '.inputTax');
    calculateHiddenTax($(this));
    $('#otherDiscountType').trigger('change');
    generateAllTotal();
    copyAddress();
	deleteAttachment(SITE_URL + '/file/remove?type=order');
  	uploadAttachment(SITE_URL + '/file/upload?type=order', '#customers');
  	$(document).on('click', '#btnSubmit', function() {
  		if (checkDiscountAmount() == false) {
    		return false;
    	}
  		if (checkIsAvailable("invoice") == false) {
    		return false;
    	} else if ($("#quotationForm").valid() == true) {
	  		/* load spinner */
	        $(".spinner").show();
	        $(".spinner").css('line-height', '0');
	        $(".spinner").css('display', 'inline-block');
	        $("#spinnerText").text(jsLang('Please wait...'));
	        /* end of spinner */
	        $(this).attr('disabled', 'disabled');
	        $("#quotationForm").trigger('submit');
  		}
    });
}
// End Sales Quotation Add

// Sales Quotation Edit
if ($('.main-body .page-wrapper').find('#sales-quotation-edit-container').length) {
	var exchange_rate = $('#inv-exchange-rate').val();
  	$('.inv-exchange-rate').append('<input type="hidden" name="global_exchangeRate" id="global_exchangeRate" value="' + exchange_rate + '">');
    exchangeRateValue(exchange_rate, '#inv-exchange-rate');
	var stack = [];
  	var nums = [];
    resetEverything();
    onChangeInvType();
    $('#invItemTax, #invItemDiscount, #invItemDetails, #invItemHSN, #invShipping, #invCustomAmount, #invOtherDiscount, #discount-on, #tax-type').trigger('change');
    setModalFieldsValue();
    generateAllTotal();
    $('.inputPrice').trigger('keyup');
    generateSortingNumber();
    $('.addRowContainer').hide().last().show();
    $("#myModal").on('show.bs.modal', function () {
	    $('#myModal .select2-container--default').not(":first").remove();
	    $(".js-example-basic-single").select2({
	      	dropdownParent: $('#myModal-body')
	    });
  	});
  	$("#btnSubmit").on("click", function () {
  		if (checkIsAvailable("invoice") == false) {
    		return false;
    	} else if (checkItemSelected(jsLang('Please select at least one item to create quotation')) == false) {
    		return false;
    	}
  	})
  	var currency_id = $('#customers').attr('data-currency_id');
    if (currency_id == defaultCurrencyId) {
      	$('#exchangeRateBlock').hide();
      	$('#inv-exchange-rate').val(1);
    } else {
      	$('#exchangeRateBlock').css('display', 'flex');
    }
  	$('#invoiceForm').validate({
	    rules: {
	      	'customer_id': {
		        required: true,
	      	},
	      	'order_date': "required",
	      	'reference': "required",
	      	'item_name[]': {
	        	required: true,
	      	},
	      	'old_item_name[]': {
	        	required: true,
	      	},
	      	'custom_item_name[]': {
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
	      	'exchange_rate': {
	        	required: true,
	      	},
	    },
	    messages: {
	      	"order_date" : {
	        	required: jsLang('Order date required'),
	      	},
	      	"reference": {
	        	required: jsLang('Reference required'),
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
	      	"old_item_price[]": {
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
	      	},
	    },
  	});
  	hideNoDiv();
  	customItem("edit", '#customers', jsLang('Please select customer first'));
	onChangeLocation();
  	$(".select2").select2();
  	$(".inputDiscountType").select2();
  	$('#datepicker').daterangepicker(dateSingleConfig($('#datepicker').val()));
  	$( "#search" ).autocomplete({
	    delay: 500,
	    position: { my: "left top", at: "left bottom", collision: "flip" },
	    source: function(request, response) {
	    	autoCompleteSource(request, response, SITE_URL + '/invoice/item-search', '#customers');
	    },
	    select: function(event, ui) {
	      	var e = ui.item;
	      	if(e.id) {
		        if(!in_array(e.id, stack)) {
		          	autoCompleteSelect("edit", e, '#customers');
		          	//noinspection JSAnnotator
		          	var new_row2 = `<tbody id="rowId-${rowNo}">
		                          		<input type="hidden" name="item_id[]" value="${e.id}">
		                          		<input type="hidden" class="sorting_no" name="sorting_no[]" value="${rowNo}">
		                          		<tr class="itemRow rowNo-${rowNo}" id="itemId-${e.id} "data-row-no="${rowNo}">
		                              		<td class="pl-1">
		                                  		<input id="item_name_${rowNo}" name="item_name[]" placeholder="${jsLang('Item Name')}" value="${e.value}" type="text" class="inputDescription form-control">
		                              		</td>
		                              		<td class="itemHSN">
		                                  		<input name="item_hsn[]" class="inputHSN form-control text-center" type="text" placeholder="${jsLang('HSN')}" value="${e.hsn}">
		                              		</td>
		                              		<td class="itemQty">
		                                  		<input name="item_qty[]" class="inputQty form-control text-center positive-float-number" id="item_qty_${rowNo}" type="text" value="1">
		                              		</td>
			                              	<td class="itemPrice">
			                                  	<input id="item_price_${rowNo}" name="item_price[]" value="${e.price}" class="inputPrice form-control text-center positive-float-number" type="text" placeholder="0.00">
			                              	</td>
			                              	<td class="itemDiscount">
			                                  	<input name="item_discount[]" id="item_discount_${rowNo}" class="inputDiscount form-control text-center positive-float-number" type="text" placeholder="0.00">
			                              	</td>
			                              	<td class="itemDiscount">
			                                  	<input type="hidden" class="indivisualDiscount positive-float-number" value="0">
			                                  	<select name="item_discount_type[]" class="inputDiscountType form-control js-example-basic-single">
			                                      	<option value="%">%</option>
			                                      	<option value="$">${jsLang('Flat')}</option>
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
		          	var quantity = $('#itemId-'+e.id).find('.inputQty').val();
		          	if (Number.isInteger(parseFloat(quantity))) {
		            	$('#itemId-'+e.id).find('.inputQty').val(parseInt(++quantity));
		          	} else {
		            	$('#itemId-'+e.id).find('.inputQty').val(getDecimalNumberFormat(++quantity));
		          	}
		        }
		        $(".inputTax").trigger('change');
		        triggerSomeChanges();
		        resetEverythingExcept();
		        onChangeInvType();
		        generateSortingNumber();
		        $(".js-example-basic-single").select2();
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
  	deleteAttachment(SITE_URL + '/file/remove?type=order');
  	uploadAttachment(SITE_URL + '/file/upload?type=order', '#customers');
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
// End Sales Quotation Edit

// Sales Quotation View Details
if ($('.main-body .page-wrapper').find('#sales-quotation-view-details-container').length) {
	smsModal(phoneNumber);
  	deleteModal();
 	$('#theModalSubmitBtn').on('click', function () {
    	$("#delete-quotation").trigger('submit');
  	})
	document.getElementById('previewTxt').innerHTML = document.getElementById('messageTxt').value;
	document.getElementById('previewTxt').contentEditable = true;
  	$('#previewTxt').keyup(function(event) {
    	$('#messageTxt').val($('#previewTxt').html());
  	});
}
// End Sales Quotation View Details

// Sales Quotation Convert To Invoice
if ($('.main-body .page-wrapper').find('#sales-quotation-convert-invoice-container').length) {
	var exchange_rate = $('#inv-exchange-rate').val();
  	$('.inv-exchange-rate').append('<input type="hidden" name="global_exchangeRate" id="global_exchangeRate" value="' + exchange_rate + '">');
	var stack = [];
  	var nums = [];
	resetEverything();
	onChangeInvType();
	exchangeRateValue(exchange_rate, '#inv-exchange-rate');
	$('#invItemTax, #invItemDiscount, #invItemDetails, #invItemHSN, #invShipping, #invCustomAmount, #invOtherDiscount, #discount-on, #tax-type').trigger('change');
	setModalFieldsValue();
	generateAllTotal();
	$('.inputPrice').trigger('keyup');
	generateSortingNumber();
	$('.addRowContainer').hide().last().show();
	$("#myModal").on('show.bs.modal', function () {
	    $('#myModal .select2-container--default').not(":first").remove();
	    $(".js-example-basic-single").select2({
	      	dropdownParent: $('#myModal-body')
	    });
  	})
  	$('#invoiceForm').validate({
	    rules: {
	      'order_date': "required",
	      'reference': "required",
	      'custom_item_name[]': {
	        required: true,
	      },
	      'item_name[]': {
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
	      'inv_exchange_rate': {
	        required: true,
	      },
	      "old_item_name[]": {
	        required: true,
	      },
	      "old_item_qty[]": {
	        required: true,
	      },
	      "old_item_price[]": {
	        required: true,
	      },
	      'custom_amount_title': {
	        required: true
	      },
	    },
	    messages: {
	      "order_date" : {
	        required: jsLang('Order date required'),
	      },
	      "reference": {
	        required: jsLang('Order date required'),
	      },
	      "old_item_name[]": {
	        required: jsLang('Required'),
	      },
   		  'item_name[]': {
	        required: jsLang('Required'),
	      },
	      'item_qty[]': {
	        required: jsLang('Required'),
	      },
	      'item_price[]': {
	        required: jsLang('Required'),
	      },
	      "custom_item_name[]": {
	        required: jsLang('Required'),
	      },
	      "old_item_qty[]": {
	        required: jsLang('Required'),
	      },
	      "custom_item_qty[]": {
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
	    }
  	});
  	hideNoDiv();
  	$(document).on('click', '.addRow', function () {
    	changeCustomItemText();
  	});
  	$(".select2, .inputDiscountType").select2();
    $('#datepicker').daterangepicker(dateSingleConfig($('#datepicker').val()));
  	$('.ref').val(Math.floor((Math.random() * 100) + 1));
  	$( "#search" ).autocomplete({
	    source: function(request, response) {
	    	autoCompleteSource(request, response, SITE_URL + '/invoice/item-search', "#customers");
	    },
	    select: function(event, ui) {
	      var e = ui.item;
	      if(e.id) {
	      	if (e.is_stock_managed == 1 &&  e.available <= 0) {
		          	swal(e.available + jsLang(' item(s) available in stock'), {
		            	icon: "error",
		            	buttons: [false, jsLang('Ok')],
		          	});
	        	}
	        else if(!in_array(e.id, stack)) {
	          stack.push(e.id);
	          autoCompleteSelect("add", e, "#customers");
	          var max = "";
	          var available = "";
	          if (e.is_stock_managed == 1) {
	            max = "data-max ="+e.available;
	            available = e.available;
	          }
	          var new_row2=`<tbody id="rowId-${rowNo}">
	                          <input type="hidden" name="item_id[]" value="${e.id}">
	                          <input type="hidden" class="sorting_no" name="sorting_no[]" value="${rowNo}">
	                          <tr class="itemRow rowNo-${rowNo}" id="itemId-${e.id} "data-row-no="${rowNo}">
	                            <td class="pl-1">
	                              <input id="item_name_${rowNo}" name="item_name[]" placeholder="${jsLang('Item Name')}" value="${e.value}" type="text" class="inputDescription form-control">
	                            </td>
	                            <td class="itemHSN">
	                              <input name="item_hsn[]" class="inputHSN form-control text-center" type="text" placeholder="${jsLang('HSN')}" value="${e.hsn}">
	                            </td>
	                            <td class="itemQty">
	                              <input name="item_qty[]" class="inputQty form-control text-center positive-float-number" id="item_qty_${rowNo}" type="text" value="1" ${max}>
	                            </td>
	                            <td class="itemPrice">
	                              <input id="item_price_${rowNo}" name="item_price[]" value="${getDecimalNumberFormat(e.price)}" class="inputPrice form-control text-center positive-float-number" type="text" placeholder="0.00">
	                            </td>
	                            <td class="itemDiscount">
	                              <input name="item_discount[]" id="item_discount_${rowNo}" class="inputDiscount form-control text-center positive-float-number" type="text" placeholder="0.00">
	                            </td>
	                            <td class="itemDiscount">
	                              <input type="hidden" class="indivisualDiscount" value="0">
	                              <select name="item_discount_type[]" class="inputDiscountType form-control js-example-basic-single">
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
	          	var quantity = $('#itemId-'+e.id).find('.inputQty').val();
	          	quantity = validateNumbers(quantity);
	          	quantity++;
	          	$('#itemId-'+e.id).find('.inputQty').val(getDecimalNumberFormat(quantity));
	        }
	        $('.inputQty').trigger('blur');
	        triggerSomeChanges();
	        resetEverythingExcept();
	        onChangeInvType();
	        generateSortingNumber();
	        $(".js-example-basic-single").select2();
	        checkStack(rowNo);
         	this.value = "";
			return false;
	      }
	    },
	    minLength: 1
  	})
  	.autocomplete( "instance" )._renderItem = function( ul, item ) {
	    return showAvailableItem(ul, item);
  	};
    $('.selectpicker').selectpicker();
    preQuantity();
   	showAvavilableStock();
    $(document).on('changed.bs.select','.selectpicker', function (e, clickedIndex, newValue, oldValue) {
    	onChangeTax('.selectpicker');
    });
    allTax('.inputTax.form-control.selectpicker', '.selectpicker');
    deleteAttachment(SITE_URL + '/file/remove');
    uploadAttachment(SITE_URL + '/file/upload', "#customers");
 	var currency_id = $('#customers').attr('data-currency_id');
    if (currency_id == defaultCurrencyId) {
      	$('#exchangeRateBlock').hide();
      	$('#inv-exchange-rate').val(1);
    } else {
      	$('#exchangeRateBlock').css('display', 'flex');
    }
    $(".inputQty").trigger("change");
    $(document).on('click', '#btnSubmit', function() {
    	if (checkDiscountAmount() == false) {
    		return false;
    	}
    	if (checkIsAvailable("invoice") == false) {
    		return false;
    	} else if (checkItemSelected(jsLang('Please select at least one item to create invoice')) == false) {
    		return false;
    	} else if ($("#invoiceForm").valid() == true) {
	  		/* load spinner */
	        $(".spinner").show();
	        $(".spinner").css('line-height', '0');
	        $(".spinner").css('display', 'inline-block');
	        $("#spinnerText").text(jsLang('Please wait...'));
	        /* end of spinner */
	        $(this).attr('disabled', 'disabled');
	        $("#invoiceForm").trigger('submit');
  		}
    });
}
// End Sales Quotation Convert To Invoice

// Sales Invoice List
if ($('.main-body .page-wrapper').find('#sales-invoice-list-container').length) {
	$(document).on("click", "#csv, #pdf", function(event) {
	    event.preventDefault();
	    window.location = SITE_URL+"/sales-list-" + this.id + "?to=" + $('#endto').val() + "&from=" + $('#startfrom').val() + "&customer=" + $('#customer').val() + "&location=" + $('#location').val() + "&currency="+ $('#currency').val() +"&status=" + $('#status').val();
  	});
  	$('#dataTableBuilder').addClass('invoice-list');
}
// End Sales Invoice List

// Sales Invoice Add
if ($('.main-body .page-wrapper').find('#sales-invoice-add-container').length) {
  	var stack = [];
  	var nums = [];
 	var symbol;
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
  	customerOrSupplierModal('btn_add_customer', 'add-customer', jsLang('Add Customer'));
  	submitCustomerOrSupplierModal('btn_add_customer', '#customerAdd');
  	$("#btnSubmit").on("click", function () {
  		return checkItemSelected(jsLang('Please select at least one item to create invoice'));
  	})
  	$('#invoiceForm').validate({
	    rules: {
	      	'customer_id': {
		        required: true,
	      	},
	      	'order_date': "required",
	      	'reference': "required",
	      	'exchange_rate': {
		        required: true,
	      	},
	      	'custom_item_name[]': {
		        required: true,
	      	},
	      	'item_name[]': {
	        	required: true
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
	      	'custom_charge_title': {
	        	required: true
	      	},
	    },
	    messages: {
	      	"order_date" : {
	        	required: jsLang('Order date required'),
	      	},
	      	"reference": {
	       	 	required: jsLang('Reference required'),
	      	},
	      	"exchange_rate" : {
	        	required : jsLang('Required'),
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
	      	'custom_charge_title': {
	        	required: jsLang('Required')
	      	},
	    }
  	});
  	//add new custom row
  	customItem("add", '#customers', jsLang('Please select customer first'));
  	customItemValidation('#invoiceForm');
  	hideNoDiv();
  	referenceNo('INV-', SITE_URL+"/invoice/reference-validation");
    var refNo = 'INV-' + $("#reference_no").val();
    $("#reference_no_write").val(refNo);
  	onChangeLocation();
  	if (customer_id != '') {
  		onChangeSupplierOrCustomer("#customers");
  	}
  	$('#customers').on('change', function () {
  		onChangeSupplierOrCustomer("#customers");
  	});
  	$(".select2").select2();
  	$(".inputDiscountType").select2();
  	$('#datepicker').daterangepicker(dateSingleConfig());
  	$('.ref').val(Math.floor((Math.random() * 100) + 1));
  	$( "#search" ).autocomplete({
	    delay: 500,
	    position: { my: "left top", at: "left bottom", collision: "flip" },
	    source: function(request, response) {
	    	autoCompleteSource(request, response, SITE_URL + '/invoice/item-search', "#customers");
	    },
	    select: function(event, ui) {
	      	var e = ui.item;
	      	if(e.id) {
	        	if (e.is_stock_managed == 1 &&  e.available <= 0) {
		          	swal(e.available + jsLang(' item(s) available in stock'), {
		            	icon: "error",
		            	buttons: [false, jsLang('Ok')],
		          	});
	        	}
		        else if(!in_array(e.id, stack)) {
		          	autoCompleteSelect("add", e, '#customers');
		          	if (e.is_stock_managed == 1) {
			            var max = "data-max ="+e.available;
		          	} else {
		            	var max = "";
		          	}
		          	//noinspection JSAnnotator
		          	var new_row2 = `<tbody id="rowId-${rowNo}">
		                          	<input type="hidden" name="item_id[]" value="${e.id}">
		                          	<input type="hidden" class="sorting_no" name="sorting_no[]" value="${rowNo}">
		                          	<tr class="itemRow rowNo-${rowNo}" id="itemId-${e.id}"  data-row-no="${rowNo}">
		                              	<td class="pl-1">
		                                	<input id="item_name_${rowNo}" name="item_name[]" placeholder="${jsLang('Item Name')}" value="${e.value}" type="text" class="inputDescription form-control">
		                              	</td>
		                              	<td class="itemHSN">
		                                	<input name="item_hsn[]" class="inputHSN form-control text-center"  id="item_hsn_${rowNo}" type="text" placeholder="${jsLang('HSN')}" value="${e.hsn}">
		                              	</td>
		                              	<td class="itemQty">
		                                	<input name="item_qty[]" id="item_qty_${rowNo}" class="inputQty form-control text-center positive-float-number" type="text" value="1" data-is_stock_managed=${e.is_stock_managed} ${max}>
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
		                            	<td colspan="4" class="des-col">
		                              		<textarea name="item_description[]" placeholder="${jsLang('Item Description')}"class="inputItemDescription form-control">${e.description == null ? "" : e.description}</textarea>
		                            	</td>
		                            	<td colspan="3" class="des-col"></td>
		                          </tr>
		                      	</tbody>`;
		          	$('#product-table').append(new_row2);
		        } else {
		          	var availableItem = $('#itemId-'+e.id).find('.inputQty').attr("data-max");
		          	var quantity = validateNumbers($('#itemId-'+e.id).find('.inputQty').val());
		          	if (e.is_stock_managed == 1 && availableItem < parseFloat(quantity) + 1) {
			            swal(availableItem + jsLang(' item(s) available in stock'), {
			              	icon: "error",
			              	buttons: [false, jsLang('Ok')],
			            });
		          	}
		          	else if (Number.isInteger(parseFloat(quantity))) {
		            	$('#itemId-'+e.id).find('.inputQty').val(parseInt(++quantity));
		          	} else {
		            	$('#itemId-'+e.id).find('.inputQty').val(getDecimalNumberFormat(++quantity));
		          	}
		        }
	        	resetEverythingExcept();
	        	onChangeInvType();
	        	generateSortingNumber();
	        	triggerSomeChanges();
	        	$(".inputTax").trigger('change');
	        	$(".select2").select2();
	        	checkStack(rowNo, "invoice_add");
        	 	this.value = "";
    			return false;
	      	}
	    },
    	minLength: 1
  	})
  	.autocomplete( "instance" )._renderItem = function( ul, item ) {
		return showAvailableItem(ul, item);
	};
    $('.selectpicker').selectpicker();
    preQuantity();
    showAvavilableStock();
    $(document).on('change','.inputTax', function () {
    	onChangeTax('.inputTax');
    });
	allTax('.inputTax.form-control', '.inputTax');
    calculateHiddenTax($(this));
    $('#otherDiscountType').trigger('change');
    generateAllTotal();
    copyAddress();
  	deleteAttachment(SITE_URL + '/file/remove?type=order');
  	uploadAttachment(SITE_URL + '/file/upload?type=invoice', '#customers');
  	$(document).on('click', '#btnSubmit', function() {
  		if (checkDiscountAmount() == false) {
    		return false;
    	}
    	if (checkIsAvailable("invoice") == false) {
    		return false;
    	} else if ($("#invoiceForm").valid() == true) {
	  		/* load spinner */
	        $(".spinner").show();
	        $(".spinner").css('line-height', '0');
	        $(".spinner").css('display', 'inline-block');
	        $("#spinnerText").text(jsLang('Please wait...'));
	        /* end of spinner */
	        $(this).attr('disabled', 'disabled');
	        $("#invoiceForm").trigger('submit');
  		}
    });
}
// End Sales Invoice Add

// Sales Invoice Edit
if ($('.main-body .page-wrapper').find('#sales-invoice-edit-container').length) {
	var exchange_rate = $('#inv-exchange-rate').val();
  	$('.inv-exchange-rate').append('<input type="hidden" name="global_exchangeRate" id="global_exchangeRate" value="' + exchange_rate + '">');
	exchangeRateValue(exchange_rate, '#inv-exchange-rate');
    resetEverything();
    onChangeInvType();
    $('#invItemTax, #invItemDiscount, #invItemDetails, #invItemHSN, #invShipping, #invCustomAmount, #invOtherDiscount, #discount-on, #tax-type').trigger('change');
    setModalFieldsValue();
    generateAllTotal();
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
  		return checkItemSelected('Please select at least one item to create invoice');
  	})
  	$('#invoiceForm').validate({
	    rules: {
	      	'customer_id': {
	        	required: true,
	      	},
	      	'order_date': "required",
	      	'reference': "required",
	      	'custom_item_name[]': {
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
	      	'exchange_rate': {
	        	required: true,
	      	},
	      	'custom_charge_title': {
	        	required: true
	      	},
	    },
	    messages: {
	      	"order_date" : {
	        	required: jsLang('Order date required'),
	      	},
	      	"reference": {
	        	required: jsLang('Reference required'),
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
	      	"old_item_qty[]": {
	        	required: jsLang('Required'),
	      	},
	      	"item_qty[]": {
	        	required: jsLang('Required'),
	      	},
	      	"custom_item_qty[]": {
	        	required: jsLang('Required'),
	      	},
	      	"old_item_price[]": {
	        	required: jsLang('Required'),
	      	},
	      	"item_price[]": {
	        	required: jsLang('Required'),
	      	},
	      	"custom_item_price[]": {
	        	required: jsLang('Required'),
	      	},
	      	'custom_charge_title': {
	        	required: jsLang('Required'),
	      	},
	    }
	  });
  	hideNoDiv();
  	customItem("edit", '#customers', jsLang('Please select customer first'));
  	onChangeLocation();
  	$(".select2").select2();
  	$(".inputDiscountType").select2();
  	$('#datepicker').daterangepicker(dateSingleConfig($('#datepicker').val()));
  	$( "#search" ).autocomplete({
	    delay: 500,
	    position: { my: "left top", at: "left bottom", collision: "flip" },
	    source: function(request, response) {
	    	autoCompleteSource(request, response, SITE_URL + '/invoice/item-search', "#customers");
	    },
	    select: function(event, ui) {
	      	var e = ui.item;
	      	if (e.id) {
		        if (e.is_stock_managed == 1 &&  e.available <= 0) {
		          	swal(e.available + jsLang('item(s) available in stock'), {
			            icon: "error",
			            buttons: [false, jsLang('Ok')],
		          	});
		        } else if (!in_array(e.id, stack)) {
		          	autoCompleteSelect("add", e, '#customers');
		          	if (e.is_stock_managed == 1) {
		            	var max = "data-max ="+ e.available;
		          	} else {
		            	var max = "";
		          	}
		          	//noinspection JSAnnotator
		          	var new_row2 = `<tbody id="rowId-${rowNo}">
		                          	<input type="hidden" name="item_id[]" value="${e.id}">
		                          	<input type="hidden" class="sorting_no" name="sorting_no[]" value="${rowNo}">
		                          	<tr class="itemRow rowNo-${rowNo}" id="itemId-${e.id}" data-row-no="${rowNo}">
			                            <td class="pl-1">
			                              <input id="item_name_${rowNo}" name="item_name[]" placeholder="${jsLang('Item Name')}" value="${e.value}" type="text" class="inputDescription form-control">
			                            </td>
			                            <td class="itemHSN">
			                              <input name="item_hsn[]" class="inputHSN form-control text-center" type="text" placeholder="${jsLang('HSN')}" value="${e.hsn}">
			                            </td>
			                            <td class="itemQty">
			                              <input name="item_qty[]" class="inputQty form-control text-center positive-float-number" id="item_qty_${rowNo}" type="text" value="1" data-is_stock_managed=${e.is_stock_managed} ${max}>
			                            </td>
			                            <td class="itemPrice">
			                              <input id="item_price_${rowNo}" name="item_price[]" value="${e.price}" class="inputPrice form-control text-center positive-float-number" type="text" placeholder="0.00">
			                            </td>
			                            <td class="itemDiscount">
			                              <input name="item_discount[]" id="item_discount_${rowNo}" class="inputDiscount form-control text-center positive-float-number" type="text" placeholder="0.00">
			                            </td>
			                            <td class="itemDiscount">
			                              <input type="hidden" class="indivisualDiscount" value="0">
			                              <select name="item_discount_type[]" class="inputDiscountType form-control js-example-basic-single2">
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
		          	var availableItem = $('#itemId-'+e.id).find('.inputQty').attr("data-max");
		          	var quantity = validateNumbers($('#itemId-'+e.id).find('.inputQty').val());
		          	if (e.is_stock_managed == 1 && availableItem < parseFloat(quantity) + 1) {
			            swal(availableItem + jsLang(' item(s) available in stock'), {
			              	icon: "error",
			              	buttons: [false, jsLang('Ok')],
			            });
		          	} else if (Number.isInteger(parseFloat(quantity))) {
		            	$('#itemId-'+ e.id).find('.inputQty').val(parseInt(++quantity));
		          	} else {
		            	$('#itemId-'+ e.id).find('.inputQty').val(getDecimalNumberFormat(++quantity));
		          	}
		        }
		        $(".inputTax").trigger('change');
		        resetEverythingExcept();
		        onChangeInvType();
		        generateSortingNumber();
		        triggerSomeChanges();
		        $(".js-example-basic-single2").select2();
		        checkStack(rowNo);
	         	this.value = "";
    			return false;
	      	}
	    },
	    minLength: 1
  	})
  	.autocomplete( "instance" )._renderItem = function( ul, item ) {
	    return showAvailableItem(ul, item);
  	};
    $('.selectpicker').selectpicker();
    preQuantity();
    showAvavilableStock();
    var currency_id = $('#customers').attr('data-currency_id');
    if (currency_id == defaultCurrencyId) {
      	$('#exchangeRateBlock').hide();
      	$('#inv-exchange-rate').val(1);
    } else {
      	$('#exchangeRateBlock').css('display', 'flex');
    }
    $(document).on('changed.bs.select','.selectpicker', function (e, clickedIndex, newValue, oldValue) {
    	onChangeTax('.selectpicker');
    });
	allTax('.inputTax.form-control.selectpicker', '.selectpicker');
  	deleteAttachment(SITE_URL + '/file/remove');
  	uploadAttachment(SITE_URL + '/file/upload?type=order', '#customers');
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
// End Sales Invoice Edit

// Sales Invoice View Details
if ($('.main-body .page-wrapper').find('#sales-invoice-view-details-container').length) {
	$(".spinner").css('display', 'none');
	var amountBill = 0;
  	var exhangeRateBill = 0;
  	$('#payModal').on('hidden.bs.modal', function () {
  		$('#account_div').css('display', 'none')
  		payModal();
  	});
  	$('#payModal').on('show.bs.modal', function () {
  		$('#account_div').css('display', 'none')
    	$('#currency').val(invoiceCurrency).trigger('change');
  	});
  	$('.js-example-basic').select2({
	    dropdownParent: $('#payModal')
  	});

  	$('#payment_date').daterangepicker(dateSingleConfig());
  	$("#payForm").validate({
	    rules: {
	      	amount: {
	        	required: true,
	      	},
	      	exchange_rate: {
	        	required: true,
	      	},
	      	incoming_amount: {
	        	required: true,
	      	},
	      	payment_date: {
	        	required: true
	      	}
	    },
	    submitHandler: function() {
	      	payFormAjaxCall();
	    }
  	});
  	smsModal(phoneNo);
  	deleteModal();
  	$('#theModalSubmitBtn').on('click', function () {
    	$("#delete-invoice").trigger('submit');
  	});
	$('#account_currency_div').css('display', 'none');
  	$(document).on('change', '#payment_method', function () {
    	$('#account_currency_div').css('display', 'none');
		onChangePaymentMethod("sales");
	});
	$("#currency").on('change', function () {
  		onChangeCurrency(Number(dflt_currency_id), Number($('#currency').val()));
  	});
  	$(document).on('keyup', '#amount, #exchange_rate', function () {
  		onKeyUpAmountExchangeRate();
  	});
  	$("#account_no").on('change', function () {
  		onChangeAccountNo("invoice");
  	});
  	uploadAttachment(SITE_URL + '/file/upload?type=payment', '#customers');
  	deleteAttachment(SITE_URL + '/file/remove?type=order');
	amountBill = $('#amount').val();
    exhangeRateBill = $('#exchange_rate').val();
    $('#amount').val(getDecimalNumberFormat(amountBill));
    $('#exchange_rate').val(getDecimalNumberFormat(exhangeRateBill));
    statusChangePayment();
	document.getElementById('previewTxt').innerHTML = document.getElementById('messageTxt').value;
	document.getElementById('previewTxt').contentEditable = true;
  	$('#previewTxt').keyup(function(event) {
	    $('#messageTxt').val($('#previewTxt').html());
  	});
}
// End Sales Invoice View Details

// Sales Invoice Copy
if ($('.main-body .page-wrapper').find('#sales-invoice-copy-container').length) {
	var exchange_rate = $('#inv-exchange-rate').val();
  	$('.inv-exchange-rate').append('<input type="hidden" name="global_exchangeRate" id="global_exchangeRate" value="' + exchange_rate + '">');
	exchangeRateValue(exchange_rate, '#inv-exchange-rate');
  	var nums = [];
    resetEverything();
    onChangeInvType();
    $('#invItemTax, #invItemDiscount, #invItemDetails, #invItemHSN, #invShipping, #invCustomAmount, #invDiscount, #discount-on, #tax-type').trigger('change');
    $('.inputQty').trigger('keyup');
    setModalFieldsValue();
    generateAllTotal();
    $('.inputPrice').trigger('keyup');
    generateSortingNumber();
    $('.addRowContainer').hide().last().show();
    $("#myModal").on('show.bs.modal', function () {
	    $('#myModal .select2-container--default').not(":first").remove();
	    $(".js-example-basic-single").select2({
	      	dropdownParent: $('#myModal-body')
	    });
  	});
  	$('#invoiceForm').validate({
	    rules: {
	      	'customer_id': {
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
	      	'exchange_rate': {
	        	required: true,
	      	},
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
	      	},
	    }
  	});
  	hideNoDiv();
  	customItem("edit", '#customers', jsLang('Please select customer first'));
  	$(".select2").select2();
  	$(".inputDiscountType").select2();
  	$('#datepicker').daterangepicker(dateSingleConfig());
  	$('.ref').val(Math.floor((Math.random() * 100) + 1));
  	$( "#search" ).autocomplete({
    	delay: 500,
    	position: { my: "left top", at: "left bottom", collision: "flip" },
    	source: function(request, response) {
    		autoCompleteSource(request, response, SITE_URL + '/invoice/item-search', "#customers");
    	},
	    select: function(event, ui) {
	      	var e = ui.item;
	      	if (e.id) {
	        	if (e.is_stock_managed == 1 &&  e.available <= 0) {
	          		swal(e.available + jsLang(' item(s) available in stock'), {
	            		icon: "error",
	            		buttons: [false, jsLang('Ok')],
	          		});
		        } else if (!in_array(e.id, stack)) {
		          	autoCompleteSelect("edit", e, '#customers');
		          	var max = "";
		          	if (e.manage_stock_level == 1) {
		            	max = "max ="+e.available;
		          	}
		          	//noinspection JSAnnotator
		          	var new_row2 = `<tbody id="rowId-${rowNo}">
		                          	<input type="hidden" name="row_counter[]" value="${rowNo}">
		                          	<input type="hidden" name="item_id[]" value="${e.id}">
		                          	<input type="hidden" class="sorting_no" name="sorting_no[]" value="${rowNo}">
		                          	<tr class="itemRow rowNo-${rowNo}" id="itemId-${e.id}" data-row-no="${rowNo}">
			                            <td class="pl-1">
		                              		<input id="item_name_${rowNo}" name="item_name[]" placeholder="${jsLang('Item Name')}" value="${e.value}" type="text" class="inputDescription form-control">
			                            </td>
			                            <td class="itemHSN">
			                              	<input name="item_hsn[]" class="inputHSN form-control text-center" type="text" placeholder="${jsLang('HSN')}" value="${e.hsn}">
			                            </td>
			                            <td class="itemQty">
			                              	<input name="item_qty[]" class="inputQty form-control text-center positive-float-number" id="item_qty_${rowNo}" type="text" value="1" data-is_stock_managed=${e.is_stock_managed} ${max}>
			                            </td>
			                            <td class="itemPrice">
			                              	<input id="item_price_${rowNo}" name="item_price[]" value="${e.price}" class="inputPrice form-control text-center positive-float-number" type="text" placeholder="0.00">
			                            </td>
			                            <td class="itemDiscount">
			                              	<input name="item_discount[]" id="item_discount_${rowNo}" class="inputDiscount form-control text-center positive-float-number" type="text" placeholder="0.00">
			                            </td>
			                            <td class="itemDiscount">
			                              	<input type="hidden" class="indivisualDiscount" value="0">
			                              	<select name="item_discount_type[]" class="inputDiscountType form-control js-example-basic-single">
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
		          	var availableItem = $('#itemId-'+e.id).find('.inputQty').attr("data-max");
		          	var quantity = validateNumbers($('#itemId-'+e.id).find('.inputQty').val());
		          	if (e.is_stock_managed == 1 && availableItem < parseFloat(quantity) + 1) {
		            	swal(e.available + jsLang(' item(s) available in stock'), {
		              	icon: "error",
		              	buttons: [false, jsLang('Ok')],
		            	});
		          	}
		          	else if (Number.isInteger(parseFloat(quantity))) {
		            	$('#itemId-'+e.id).find('.inputQty').val(parseInt(++quantity));
		          	} else {
		            	$('#itemId-'+e.id).find('.inputQty').val(getDecimalNumberFormat(++quantity));
		          	}
		        }
		        $('.inputQty').trigger('keyup');
		        triggerSomeChanges();
		        resetEverythingExcept();
		        onChangeInvType();
		        generateSortingNumber();
		        $(".js-example-basic-single").select2();
		        checkStack(rowNo);
	         	this.value = "";
    			return false;
	      	}
	    },
	    minLength: 1
  	})
  	.autocomplete( "instance" )._renderItem = function( ul, item ) {
    	return showAvailableItem(ul, item);
  	};

    $('.selectpicker').selectpicker();
    preQuantity();
    showAvavilableStock();
    $(document).on('changed.bs.select','.selectpicker', function (e, clickedIndex, newValue, oldValue) {
    	onChangeTax('.selectpicker');
    });
	allTax('.inputTax.form-control.selectpicker', '.selectpicker');
  	deleteAttachment(SITE_URL + '/file/remove?type=order');
  	uploadAttachment(SITE_URL + '/file/upload?type=order', '#customers');
    var currency_id = $('#customers').attr('data-currency_id');
    if (currency_id == defaultCurrencyId) {
      	$('#exchangeRateBlock').hide();
      	$('#inv-exchange-rate').val(1);
    } else {
      	$('#exchangeRateBlock').css('display', 'flex');
    }
    $(".inputQty").trigger("change");
    $(document).on('click', '#btnSubmit', function() {
    	if (checkDiscountAmount() == false) {
    		return false;
    	}
    	if (checkIsAvailable("invoice") == false) {
    		return false;
    	} else if (checkItemSelected(jsLang('Please select at least one item to create invoice')) == false) {
    		return false;
    	} else if ($("#invoiceForm").valid() == true) {
	  		/* load spinner */
	        $(".spinner").show();
	        $(".spinner").css('line-height', '0');
	        $(".spinner").css('display', 'inline-block');
	        $("#spinnerText").text(jsLang('Please wait...'));
	        /* end of spinner */
	        $(this).attr('disabled', 'disabled');
	        $("#invoiceForm").trigger('submit');
  		}
    });
}
// End Sales Invoice Copy

// Sales Payment List
if ($('.main-body .page-wrapper').find('#sales-payment-list-container').length) {
	$(document).on("click", "#csv, #pdf", function(event) {
	    event.preventDefault();
	    window.location = SITE_URL + "/payment/customer-" + this.id + "?to="+ $('#endto').val() +"&from="+ $('#startfrom').val() +"&customer="+ $('#customer').val() +"&method="+ $('#method').val() + "&currency=" + $('#currency').val() + "&currency=" + $('#currency').val();
  	});
  	statusChangePayment();
  	$('#dataTableBuilder').addClass('sales-payment-list');
}
// End Sales Payment List

// Sales Edit Payment
if ($('.main-body .page-wrapper').find('#sales-edit-payment-container').length) {
	$("#payment_date").attr('readonly','readonly');
  	deleteAttachment(SITE_URL + '/file/remove?type=order');
  	uploadAttachment(SITE_URL + '/file/upload?type=order', '#customers');
	$(window).on('load', function() {
		if ($(window).width() < 650) {
	        $('.col-sm-2').addClass('col-sm-3');
	        $('.col-sm-3').removeClass('col-sm-2');

	        $('.col-sm-7').addClass('col-sm-8');
	        $('.col-sm-8').removeClass('col-sm-7');
	  	}
	});
}
// End Sales Edit Payment

// Sales Payment View Details
if ($('.main-body .page-wrapper').find('#sales-payment-view-details-container').length) {
	ClassicEditor.create(document.querySelector('.editor'));
	jQuery.validator.addMethod("regxEmailValidation", function(value, element) {
		return this.optional(element) || validateEmail(value);
	}, jsLang('Enter a valid email'));
  	$('#sendPaymentReceipt').validate({
	    rules: {
	      email: {
			required: true,
			regxEmailValidation: true
	      },
	      subject:{
	        required: true,
	      },
	      message:{
	        required: true,
	      }
	    }
  	});
  	$(document).on('click',".status", function () {
	    var status = $(this).attr('data-id');
	    var customer_transaction_id = $(this).data('trans_id');
	    var transaction_detatils = JSON.stringify(customer_transaction_id);
	    var url   = SITE_URL + '/payment/customer_payment/verification';
	    $.ajax({
	        url:url,
	        method:"POST",
	        data:{'status':status, 'customer_transaction_id':transaction_detatils, '_token':token},
	        dataType:"json",
	        success:function(data) {
	            if (data.status == 1) {
	              	location.reload();
	            } else {
	            	swal(jsLang('Something went wrong, please try again.'), {
                		icon: "error",
                		buttons: [false, jsLang('Ok')],
              		});
	            }
	        }
	    });
  	});
  	deleteModal();
  	$('#theModalSubmitBtn').on('click', function () {
	    $("#delete-payment").trigger('submit');
  	});
  	document.getElementById('previewTxt').innerHTML = document.getElementById('messageTxt').value;
	document.getElementById('previewTxt').contentEditable = true;
  	$('#previewTxt').keyup(function(event) {
	    $('#messageTxt').val($('#previewTxt').html());
  	});
}
// End Sales Payment View Details
