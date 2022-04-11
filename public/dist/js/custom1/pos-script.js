'use strict';
/* load spinner */
var spinner = '<div class="spinner">' +
	'<div class="bounce1"></div>' +
	'<div class="bounce2"></div>' +
	'<div class="bounce3"></div>' +
	'</div>';
window.addEventListener('resize', windowResize);

function windowResize() {
	var sh = window.innerHeight - 390;
	$('.scrollable').css({
		'height': sh + 'px'
	});
}
windowResize();

localStorage.setItem("order_note", "");
localStorage.setItem("shippingDetail", "");
var storageTaxType = localStorage.getItem('taxType');
var discountOn = localStorage.getItem('discountOn');
if (storageTaxType == '' || storageTaxType == null) {
	storageTaxType = 'exclusive';
	localStorage.setItem('taxType', storageTaxType)
}
if (discountOn == '' || discountOn == null) {
	discountOn = 'before';
	localStorage.setItem('discountOn', discountOn)
}
$("[data-label='pos-settings']").attr('data-settings-tax', storageTaxType);
$("[data-label='pos-settings']").attr('data-settings-discount', discountOn);
// [ Single Select ] start
$("#customers").select2();
$("#add-discount-type").select2({
	dropdownParent: $("#add-item-body")
});

var stack = [];

$(document).on('click', '.item-edit', function(e) {
	$('.modal-dialog').removeClass('modal-lg');
	var tax_id = $(this).parent().siblings().eq(0).children().eq(1).val();
	var tax = $(this).parent().siblings().eq(2).children().children('input').attr('data-item_tax');
	var discount = $(this).attr('data-discount');
	var discount_type = $(this).attr('data-discount-type');
	var item_name = $(this).parent().siblings().eq(0).children().eq(2).val();
	var item_total_price = $(this).parent().siblings().eq(3).children().val();
	var item_desc = $(this).parent().siblings().eq(0).children().eq(2).attr('data-desc');
	tax_id = tax_id.split(",");
	$("#edit-item-name").val(item_name);
	$("#edit-item-desc").val(item_desc);
	$("#edit-item-discount").val(discount);
	$("#edit-discount-type").val(discount_type);
	$("#edit-discount-type").trigger('change');

	$("#edit-item-discount").on('keyup', function() {
	  if ($('#edit-discount-type :selected').val() == '%' && parseFloat(validateNumbers($("#edit-item-discount").val())) > 100) {
	    swal(jsLang('Discount amount can not be more than 100%'), {
	        icon: "error"
	    });
	    $("#edit-item-discount").val('');
	  }

	  if ($('#edit-discount-type :selected').val() == '$' && parseFloat(validateNumbers($("#edit-item-discount").val())) > item_total_price) {
	    swal(jsLang('Discount amount can not be more than the total amount'), {
	        icon: "error"
	    });
	    $("#edit-item-discount").val('');
	  }
	});

	$("#individual_tax").selectpicker('val', tax_id);
	$(this).parent().parent().attr("modal", "on");
})

$("#editItemModal").on('show.bs.modal', function() {

    $("#individual_tax").on('change', function () {
	    if ( $('#individual_tax').val() == 0) {
	        $('.filter-option-inner-inner').text(jsLang('Nothing Selected'))
	    }
	});
	$("#edit-discount-type").select2({
		dropdownParent: $("#editItemModalBody")
	});
})
$(".add-item").on('show.bs.modal', function() {
	$("#discount-type").select2({
		dropdownParent: $("#add-item-body")
	});
})

$("#editItemModal").on('hide.bs.modal', function(e) {
	$("#itemAdded tr").removeAttr("modal");
})

$(document).on("click", "#editItemModalSubmitBtn", function(e) {
	editItem();
	$("#editItemModal").modal('toggle');
})

$("#holdPayModal").on('show.bs.modal', function(e) {
	var button = $(e.relatedTarget);
	var modal = $(this);
	modal.find('.modal-body').html(spinner);
	modal.find('.modal-dialog').removeClass("modal-lg");
	modal.find('#holdPayModalLabel').text(jsLang('Payment'));
	modal.find('.modal-body').load(button.data("remote"));
})

$(document).on('click', '#holdPayModalSubmitBtn', function(e) {
	var order_id = $(this).attr("order_id")
	var order_amount = $(this).attr("order_amount");
	var amount_received = $("#amount_received").val();
	var payment_type = $('#payment_type').val();
	var params = "";
	if (payment_type == 'card') {
		params = JSON.stringify({
			number: $("#card_number").val(),
			additional_data: $("#additional_data").val()
		})
	} else if (payment_type == 'cheque') {
		params = JSON.stringify({
			number: $("#cheque_number").val(),
			additional_data: $("#additional_data").val()
		})
	}
	var url = SITE_URL + "/pos/hold-order-payment";
	if (amount_received == "" || parseFloat(amount_received) < parseFloat(order_amount)) {
		swal(jsLang('Paid amount can not be less than bill.'), {
			icon: "error",
		});
		return false;
	}
	$.ajax({
		type: "POST",
		url: url,
		data: {
			_token: token,
			order_id: order_id,
			order_amount: order_amount,
			payment_type: payment_type,
			params: params,
			amount_received: amount_received,
			payment_date: $("#payment_date").val(),
			reference_no: $("#reference_no").val(),
		},
		success: function(response) {
			var result = JSON.parse(response);
			if (result.status == 1) {
				$(".hold_item_active").remove();
				$("#holdModal").find('.single_hold_item').first().trigger('click');
				if ($(".single_hold_item").length == 0) {
					$("#hold_name").text(jsLang('Order Details'));
					$('.author').text("")
					$('.orderDate').text("")
					$('.customer_name').text("");
					$('.orderNo').text("")
					$('.total_order_amount').text("")
					$('.hold_order_details table tbody').html("");
					$('.hold_order_details table tfoot').html("");
				}
				window.open(SITE_URL + "/pos/print-receipt/" + result.id, '_blank');
			} else {
				swal(jsLang('fail'), {
	            	icon: "error",
	            	buttons: [false, jsLang('Ok')],
	            });
			}
			$('#holdPayModal').modal('toggle');
		},
		error: function(err) {
			swal(jsLang('Oops! Something went wrong, please try again.'), {
            	icon: "error",
            	buttons: [false, jsLang('Ok')],
            });
		}
	})
})

$('#holdModal').on('show.bs.modal', function(e) {
	var button = $(e.relatedTarget);
	var modal = $(this);
	modal.find('.modal-body').html(spinner);
	/* end of spinner */
	$('#holdModalSubmitBtn, #holdModalResetBtn').attr('disabled', false);
	$('#holdModalSubmitBtn').removeClass('btn_add_customer btn_add_note btn_add_shipping btn_add_discount order_hold edit_order order_payment pos_settings');
	$('#holdModalResetBtn').removeClass('btn_reset_shipping btn_hold_pay btn-primary btn-warning').removeAttr('data-target data-toggle data-remote').css('display', 'none');
	$('.modal-dialog').removeClass('modal-lg');

	if (button.data("label") == 'add-customer') {
		modal.find('#holdModalSubmitBtn').text(jsLang('Submit')).addClass('btn_add_customer');
		$('.modal-dialog').addClass('modal-lg');
		modal.find('#holdModalLabel').text(jsLang('Add Customer'));
	} else if (button.data("label") == 'add-note') {
		modal.find('#holdModalSubmitBtn').text(jsLang('Submit')).addClass('btn_add_note');
		modal.find('#holdModalLabel').text(jsLang('Add note to the order'));
	} else if (button.data("label") == 'add-shipping') {
		modal.find('#holdModalResetBtn').text(jsLang('Reset')).addClass('btn_reset_shipping btn-warning').hide();
		modal.find('#holdModalSubmitBtn').text(jsLang('Submit')).addClass('btn_add_shipping');
		modal.find('#holdModalLabel').text(jsLang('Shipping'));
	} else if (button.data("label") == 'add-discount') {
		modal.find('#holdModalSubmitBtn').text(jsLang('Add Discount')).addClass('btn_add_discount');
		modal.find('#holdModalLabel').text(jsLang('Discount'));
	} else if (button.data("label") == 'order-onhold') {
		modal.find('#holdModalSubmitBtn').text(jsLang('Put on hold')).addClass('order_hold');
		modal.find('#holdModalLabel').text(jsLang('Order On Hold'));
	} else if (button.data("label") == 'getHold-items') {
		$('.modal-dialog').addClass('modal-lg');
		modal.find('#holdModalSubmitBtn').text(jsLang('Edit the order')).addClass('edit_order');
		modal.find('#holdModalLabel').text(jsLang('Orders history'));
		modal.find('#holdModalResetBtn').addClass("btn-primary btn_hold_pay").text(jsLang('Pay')).attr('data-toggle', 'modal').attr('data-target', '#holdPayModal').attr('data-remote', SITE_URL + "/pos/order-payment").css("display", "block");
	} else if (button.data("label") == 'order-payment') {
		modal.find('#holdModalSubmitBtn').text(jsLang('Pay')).addClass('order_payment');
		modal.find('#holdModalLabel').text(jsLang('Payment'));
	} else if (button.data("label") == 'pos-settings') {
		modal.find('#holdModalSubmitBtn').text(jsLang('Submit')).addClass('pos_settings');
		modal.find('#holdModalLabel').text(jsLang('Settings'));
	}
	// load content from value of data-remote url
	modal.find('.modal-body').load(button.data("remote"));
});

$('#shipping_cost').on('blur', function() {
	generateAllTotal();
});

//Hold the cart
var totalDiscount = 0;

function putOnHold(orderTitle) {
	var isWrong = false;
	let item_data = $('#itemAdded').serialize();
	let customerId = $('#customers').val() ? $('#customers').val() : 1;
	let comment = localStorage.getItem('order_note');
	let shippingDetail = localStorage.getItem('shippingDetail');
	let shipping_charge = $('#shipping_cost').val();
	var discount_type = $('#net_discount_type').val();
	var discount_percent = $('#net_discount').val();
	var net_discount = $('#discount').text();
	var net_payable = $('#net_payable').text();
	let total_tax = $('#item_tax').text();
	let order_id = $('#order_id').val();
	var tax_type = localStorage.getItem('taxType');
	var discount_on = localStorage.getItem('discountOn');
	var indivisual_discount_price = $("#indivisual-discount-price").val();
	let url = SITE_URL + "/pos/hold";
	if ($('.input_qty').length == 0) {
		swal("List empty", {
			icon: "error",
			buttons: [false, jsLang('Ok')],
		});
		return false;
	}

	var isItemNameEmpty = false;
	$('td input[name^="item_name"],td input[name^="custom_item_name"]').each(function(index, element) {
		if ($(element).val() == '') {
			isItemNameEmpty = true;
		}
	});
	if (isItemNameEmpty) {
		swal(jsLang('Item name can not be empty.'), {
			icon: "error",
		});
		return false;
	}

	$('.input_qty').each(function(index, value) {
		var max_quantity = parseFloat($(value).attr('max'));
		var item_quantity = parseFloat($(value).val());
		if (item_quantity <= 0) {
			swal("Quantity can not be zero", {
				icon: "error",
				buttons: [false, jsLang('Ok')],
			});
			isWrong = true;
			return false;
		} else if (max_quantity < item_quantity) {
			swal(jsLang('Stock not available.'), {
				icon: "error",
				buttons: [false, jsLang('Ok')],
			});
			isWrong = true;
			return false;
		}
	});
	if (isWrong) {
		return false;
	}
	$.ajax({
		type: "POST",
		url: url,
		data: {
			_token: token,
			item_data: item_data,
			invoice_type: invoice_type,
			customer_id: customerId,
			tax_type: tax_type,
			discount_on: discount_on,
			comment: comment,
			has_comment: 'on',
			discount_on: discount_on,
			shipping_charge: shipping_charge,
			pos_shipping: shippingDetail,
			pos_order_title: orderTitle,
			totalValue: net_payable,
			total_tax: total_tax,
			order_id: order_id,
			net_discount: net_discount,
			other_discount_type: discount_type,
			other_discount_amount: discount_percent,
			indivisual_discount_price: indivisual_discount_price
		},
		success: function(response) {
			if (response == 1) {
				localStorage.setItem("order_note", $('#order_note').val());
				$('#holdModal').modal('toggle');
				location.reload();
			} else {
				$('#holdModal').modal('toggle');
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

// Order payment
var paymentDiscount = 0;

function orderPayment() {
	var isWrong = false;
	var item_data = $('#itemAdded').serialize();
	var customerId = $('#customers').val();
	var payment_date = $("#payment_date").val();
	var comment = localStorage.getItem('order_note');
	var shippingDetail = localStorage.getItem('shippingDetail');
	var shippingCost = $('#shipping_cost').val();
	var discount_type = $('#net_discount_type').val();
	var discount_percent = $('#net_discount').val();
	var net_discount = $('#discount').text();
	var reference_no = $('#reference_no').val();
	var net_payable = $('#net_payable').text();
	var totalValue = $("#net_payable_no_currency").text();
	var amount_received = $("#amount_received").val();
	var total_tax = $('#item_tax').text();
	var order_id = $('#order_id').val();
	var payment_type = $('#payment_type').val();
	var tax_type = localStorage.getItem('taxType');
	var discount_on = localStorage.getItem('discountOn');
	var indivisual_discount_price = $("#indivisual-discount-price").val();
	var customerCurrency = $("#customers option:selected").attr('data-currency_id');
	var params = "";
	if (payment_type == 'card') {
		params = JSON.stringify({
			number: $("#card_number").val(),
			additional_data: $("#additional_data").val()
		})
	} else if (payment_type == 'cheque') {
		params = JSON.stringify({
			number: $("#cheque_number").val(),
			additional_data: $("#additional_data").val()
		})
	}
	var url = SITE_URL + "/pos/payment";
	if ($('.input_qty').length == 0) {
		$('.order_payment').attr('disabled', false);
		swal("List empty.", {
			icon: "error",
			buttons: [false, jsLang('Ok')],
		});
		return false;
	}
	$('.input_qty').each(function(index, value) {
		var max_quantity = parseFloat($(value).attr('max'));
		var item_quantity = parseFloat($(value).val());
		if (item_quantity <= 0) {
			$('.order_payment').attr('disabled', false);
			swal(jsLang('Quantity can not be zero.'), {
				icon: "error",
				buttons: [false, jsLang('Ok')],
			});
			isWrong = true;
			return false;
		} else if (max_quantity < item_quantity) {
			$('.order_payment').attr('disabled', false);
			swal(jsLang('Stock not available.'), {
				icon: "error",
				buttons: [false, jsLang('Ok')],
			});
			isWrong = true;
			return false;
		}
	});
	if (isWrong) {
		return false;
	}
	if (amount_received == "" || parseFloat(validateNumbers(amount_received)) < parseFloat(validateNumbers(net_payable))) {
		$('.order_payment').attr('disabled', false);
		swal(jsLang('Paid amount can not be less than bill.'), {
			icon: "error",
			buttons: [false, jsLang('Ok')],
		});
		return false;
	}
	$.ajax({
		type: "POST",
		url: url,
		data: {
			_token: token,
			item_data: item_data,
			invoice_type: invoice_type,
			customer_id: customerId,
			payment_date: payment_date,
			payment_type: payment_type,
			params: params,
			comment: comment,
			shipping_charge: shippingCost,
			shippingDetail: shippingDetail,
			other_discount_type: discount_type,
			net_discount: net_discount,
			other_discount_amount: discount_percent,
			reference_no: reference_no,
			totalValue: totalValue,
			paid: totalValue,
			amount_received: amount_received,
			total_tax: total_tax,
			tax_type: tax_type,
			discount_on: discount_on,
			order_id: order_id,
			indivisual_discount_price: indivisual_discount_price,
			dflt_currency_id: dflt_currency_id,
			customerCurrency: customerCurrency,
		},
		success: function(response) {
			var result = JSON.parse(response);
			if (result.status == 1) {
				$('.order_payment').attr('disabled', false);
				localStorage.setItem("order_note", $('#order_note').val());
				localStorage.setItem("order_note", "");
				localStorage.setItem("shippingDetail", "");
				$('#holdModal').modal('toggle');
				window.open(SITE_URL + "/pos/print-receipt/" + result.id, '_blank');
				location.reload();
			} else if (result.status == 2) {
				swal(jsLang('Customer currency and system currency must have to be same.'), {
					icon: "error",
					buttons: [false, jsLang('Ok')],
				});
			} else {
				swal(jsLang('fail.'), {
					icon: "error",
					buttons: [false, jsLang('Ok')],
				});
				$('#holdModal').modal('toggle');
			}
		},
		error: function() {
			swal(jsLang('Oops! Something went wrong, please try again.'), {
				icon: "error",
				buttons: [false, jsLang('Ok')],
			});
		}
	})
}

//Delay function for onkey up item search box
function delay(callback, ms) {
	var timer = 0;
	return function() {
		var context = this,
			args = arguments;
		clearTimeout(timer);
		timer = setTimeout(function() {
			callback.apply(context, args);
		}, ms || 0);
	};
}

//Get items when search on search box
$('#search').keyup(delay(function(e) {
	getItems($(this).val(), 'keyup');
}, 500));


// Get item when category clicked
$('.item_category').on('click', function() {
	$(".item_category").removeClass('item_category_active');
	$(this).addClass('item_category_active');
	getItems($(this).attr('id'), 'category');
});
$('#refresh-btn').on('click', function() {
	$(".item_category").removeClass('item_category_active');
	getItems("", 'category');
});

//get items according to category clicked or search field
function getItems(data, searchType) {
	var activeCategoryId = '';
	if ($(".item_category").hasClass('item_category_active')) {
		activeCategoryId = $(".item_category_active").attr('id');
	}
	$.ajax({
		url: SITE_URL + "/pos-item/search",
		dataType: "json",
		type: "POST",
		data: {
			_token: token,
			data: data,
			searchType: searchType,
			activeCategoryId: activeCategoryId
		},
		success: function(data) {
			//Start
			if (data.status_no == 1) {
				var items = JSON.parse(data.items);
				var sale_prices = JSON.parse(data.sale_prices);
				var tax_type_id = JSON.parse(data.tax_type_id);
				var tax_rates = JSON.parse(data.tax_rates);
				var row = '';
				if (items.length > 0) {
					$("#items_list").removeClass("no-display");
					$("#empty_items_list").addClass("no-display");
					for (var i = 0; i < items.length; i++) {
						var taxRate = 0;
						if (tax_rates[i] != null) {
							taxRate = tax_rates[i];
						}
						var image_path = SITE_URL + items[i].file_name;
						var outOfStock = '';
						if (items[i].is_stock_managed == 1 && items[i].available <= 0) {
							outOfStock = '<span class="feather icon-alert-octagon stock-out text-danger p-1"></span>'
						}
						var item_description = (items[i].description == null) ? '' : items[i].description;
						row = row + '<div class="single_item">' +
							outOfStock +
							'<img src="' + image_path + '" alt="">' +
							'<div class="item_info" data-id="' + items[i].id + '" data-tax="' + getDecimalNumberFormat(taxRate) + '" data-tax-type="' + tax_type_id[i] + '" data-stock-management="' + items[i].is_stock_managed + '" data-stock="' + items[i].available + '">' +
							'<p class="item_name" data-desc="'+ item_description +'">' + items[i].name + '</p>' +
							'<p class="item_price">' + getDecimalNumberFormat(sale_prices[i]) + '</p>' +
							'</div>' +
							'</div>';
					}
					$("#items_list").html(row);
				} else {
					$("#items_list").html("");
					$("#items_list").addClass("no-display");
					$("#empty_items_list").removeClass("no-display");
				}
			} else {
				$("#items_list").addClass("no-display");
				$("#empty_items_list").removeClass("no-display");
				swal(jsLang('No Item Found'), {
					icon: "error",
					buttons: [false, jsLang('Ok')],
				});
			}
		}
	})
}

// Add item in listbox
var rowNo = 0;
$(document).on('click', '.single_item', function() {
	let item_id = $(this).children('div').eq(0).attr('data-id');
	let item_tax = $(this).children('div').eq(0).attr('data-tax');
	let item_tax_type_id = $(this).children('div').eq(0).attr('data-tax-type');
	let item_stock_management = $(this).children('div').eq(0).attr('data-stock-management');
	let item_stock = parseFloat($(this).children('div').eq(0).attr('data-stock'));
	let item_name = $(this).children().children('p').eq(0).html();
	let item_desc = $(this).children().children('p').eq(0).attr('data-desc');
	let item_price = $(this).children().children('p').eq(1).html();
	if (item_stock_management == '1' && item_stock <= 0) {
		swal(jsLang('Stock not available.'), {
			icon: "error",
			buttons: [false, jsLang('Ok')],
		});
		return;
	}
	$('.please_add').remove();
	if (stack.indexOf(+item_id) < 0) {
		rowNo++;
		stack.push(+item_id); //plus sign for string to number conversion

		var max = '';
		var input_value = 1;
		var input_danger = '';
		let qtySpinnerStart = '<div class="qty_spinner"><button type="button" class="decrease">-</button>';
		let qtySpinnerEnd = '<button type="button" class="increase">+</button></div>';
		if (item_stock_management == '1') {
			max = "max = " + item_stock;
			if (item_stock <= 0) {
				input_value = 0;
				qtySpinnerStart = '<div class="qty_spinner"><button type="button" class="decrease danger-button">-</button>';
				qtySpinnerEnd = '<button type="button" class="increase danger-button">+</button></div>';
				input_danger = " input_danger";
			}
		}

		var item = '<tr id="rowId_' + item_id + '">' +
			'<td width="3%" class="pr-0 pt-2">' +
			'<span id="item_edit_' + item_id + '" data-id="' + item_id + '" data-discount="0" data-discount-type="$" class="feather icon-edit cursor-pointer item-edit" data-toggle="modal" data-target="#editItemModal"></span>' +
			'</td>' +
			'<td width="35%">' +
			'<input type="hidden" name="item_id[]" value="' + item_id + '">' +
			'<input type="hidden" name="item_tax_type_id[' + item_id + '][]" value="' + item_tax_type_id + '">' +
			'<input type="text" id="item_name_' + item_id + '" class="form-control hold_item_active" data-desc="' + item_desc + '" name="item_name[]" value="' + item_name + '">' +
			'<input type="hidden" name="item_desc[]" value="' + item_desc + '">' +
			'<input type="hidden" name="item_discount[]" class="item-discount" value="0">' +
			'<input type="hidden" name="item_discount_type[]" class="item-discount-type" value="$">' +
			'<input type="hidden" name="item_tax[' + item_id + '][]" value="' + item_tax + '">' +
			'</td>' +
			'<td width="18%">' +
			'<input type="text" class="form-control hold_item_active input_price positive-float-number" id="item_price_' + item_id + '" min="0" name="item_price[]" value="' + item_price + '">' +
			'</td>' +
			'<td width="22%">' + qtySpinnerStart +
			'<input type="text" data-item_tax="' + item_tax + '" id="input_qty_' + item_id + '" class="text-right form-control input_qty' + input_danger + ' positive-float-number" name="item_qty[]" min="0" ' + max + ' value="' + input_value + '">' + qtySpinnerEnd +
			'</td>' +
			'<td width="20%">' +
			'<input type="text" class="form-control indivisualTotal positive-float-number" id="indivisualTotal_' + item_id + '" name="indivisiual_item_total_price[]" readonly value="' + item_price + '">' +
			'</td>' +
			'<td>' +
			'<button type="button" class="btn custom-btn-small delete_row" data-rowId="' + item_id + '"><i class="feather icon-trash-2"></i>' +
			'</button>' +
			'</td>' +
			'</tr>';
		$('.scrollable').children().children().append(item);
	} else {
		let quantity = validateNumbers($('#input_qty_' + item_id).val());
		quantity++;
		if (item_stock_management == '1' && item_stock < quantity) {
			swal(jsLang('Stock not available.'), {
				icon: "error",
				buttons: [false, jsLang('Ok')],
			});
		} else {
			if (Number.isInteger(quantity)) {
				$('#input_qty_' + item_id).val(quantity);
				$(".input_qty").trigger("keyup");
			} else {
				$('#input_qty_' + item_id).val(getDecimalNumberFormat(quantity));
				$(".input_qty").trigger("keyup");
			}
		}
	}
	calculate_item_qty();
	generateAllTotal();
});

var custom_row_no = 0;

$(document).on('click', "#custom-product-add", function(e) {
	$('.please_add').remove();
	var name = jsSanitize($("#item-name").val());
	var desc = jsSanitize($("#item-desc").val());
	var price = $("#unit-price").val();
	var quantity = $("#quantity-price").val();
	var disc = $("#add-item-discount").val();
	var type = $("#add-discount-type").val();
	var tax = $("#add_individual_tax").val();
	var tax_value = $("[data-id='add_individual_tax']").attr('title') == "Nothing selected" ? "" : $("[data-id='add_individual_tax']").attr('title');
	if (name == "") {
		swal(jsLang('Item name can not be empty.'), {
			icon: "error",
			buttons: [false, jsLang('Ok')],
		});
		$("#item-name").focus();
		return false;
	}
	if (price == "" || parseFloat(price) < 0) {
		$("#unit-price").focus();
		swal(jsLang('Price can not be negative or empty.'), {
			icon: "error",
			buttons: [false, jsLang('Ok')],
		});
		return false;
	}
	if (quantity == "" || parseFloat(quantity) <= 0) {
		$("#quantity-price").focus();
		swal(jsLang('Quantity can not be zero or empty.'), {
			icon: "error",
			buttons: [false, jsLang('Ok')],
		});
		return false;
	}

	let qtySpinnerStart = '<div class="qty_spinner"><button type="button" class="decrease">-</button>';
	let qtySpinnerEnd = '<button type="button" class="increase">+</button></div>';
	var item = '<tr id="rowId_0">' +
		'<td width="3%" class="pr-0 pt-2">' +
		'<span id="item_edit_0" data-id="0" data-discount="' + disc + '" data-discount-type="' + type + '" class="feather icon-edit cursor-pointer item-edit" data-toggle="modal" data-target="#editItemModal"></span>' +
		'</td>' +
		'<td width="35%">' +
		'<input type="hidden" name="custom_item_id[]" value="">' +
		'<input type="hidden" name="custom_item_tax_type_id[]" value="' + tax + '">' +
		'<input type="text" class="form-control hold_item_active" data-desc="' + desc + '" name="custom_item_name[]" value="' + name + '">' +
		'<input type="hidden" name="custom_item_desc[]" value="' + desc + '">' +
		'<input type="hidden" name="custom_item_discount[]" class="item-discount" value="' + disc + '">' +
		'<input type="hidden" name="custom_item_discount_type[]" class="item-discount-type" value="' + type + '">' +
		'<input type="hidden" name="custom_item_tax[]" value="' + tax_value + '">' +
		'<input type="hidden" name="custom_row_no[]" value="' + custom_row_no + '">' +
		'</td>' +
		'<td width="18%">' +
		'<input type="text" class="form-control hold_item_active input_price positive-float-number" min="0" name="custom_item_price[]" value="' + price + '">' +
		'</td>' +
		'<td width="22%">' + qtySpinnerStart +
		'<input type="text" data-item_tax="' + tax_value + '" class="form-control input_qty positive-float-number text-right" name="custom_item_qty[]" id="input_qty_0" value="' + quantity + '">' + qtySpinnerEnd +
		'</td>' +
		'<td width="20%">' +
		'<input type="text" class="form-control indivisualTotal positive-float-number" name="custom_indivisiual_item_total_price[]" readonly value="' + getDecimalNumberFormat(validateNumbers(price) * validateNumbers(quantity)) + '">' +
		'</td>' +
		'<td>' +
		'<button type="button" class="btn custom-btn-small delete_row" data-rowId="0"><i class="feather icon-trash-2"></i>' +
		'</button>' +
		'</td>' +
		'</tr>';
	$('.scrollable').children().children().append(item);
	generateAllTotal();
	custom_row_no++;
	var name = $("#item-name").val("");
	var desc = $("#item-desc").val("");
	var price = $("#unit-price").val("");
	var quantity = $("#quantity-price").val("");
	var disc = $("#add-item-discount").val("");
	var type = $("#add-discount-type").val("%");
	var tax = $("#add_individual_tax").val("").trigger("change");
	$('.add-item').modal('toggle');
})

$("#holdModalResetBtn").on('click', function(e) {
	if ($(this).hasClass('btn_reset_shipping')) {
		localStorage.setItem('shippingDetail', '');
		$("#name,#ship_email,#ship_street,#ship_city,#ship_state,#ship_zipCode").val("");
	    $("#ship_country_id").val("").trigger("change");
	    $("#addPosShipping").validate().resetForm();
		$('button[data-label="add-shipping"]').removeClass('fill-background').addClass('btn-outline-secondary');
	}
})

$('#holdModalSubmitBtn').on('click', function(e) {
	if ($(this).hasClass('btn_add_note')) {
		localStorage.setItem("order_note", $('#order_note').val());
		if (localStorage.getItem("order_note") == '') {
			$('button[data-label="add-note"]').removeClass('fill-background').addClass('btn-outline-secondary');
		} else {
			$('button[data-label="add-note"]').addClass('fill-background').removeClass('btn-outline-secondary');
		}
		$('#holdModal').modal('toggle');
	} else if ($(this).hasClass('btn_add_customer')) {
		$('#customerAdd').trigger('submit');
	} else if ($(this).hasClass('btn_add_discount')) {
		let value = validateNumbers($('#discount_amount').val());
		$("#net_discount").val(getDecimalNumberFormat(value));
		$("#net_discount_type").val($('#discount_type').val());
		generateAllTotal();
		$('#holdModal').modal('toggle');
	} else if ($(this).hasClass('btn_add_shipping')) {
		var form = $('#addPosShipping').serializeArray();
		var formData = {};
		if (emailValidator($("#ship_email").val()) == false) {
			return false;
		}
		for (var i = 0; i < form.length; i++) {
			if ($("#" + form[i]['name']).val() == "") {
				formData = {};
				$("#" + form[i]['name'] + "-error").show();
				return false;
			} else {
				$("#" + form[i]['name'] + "-error").hide();
			}
			formData[form[i]['name']] = form[i]['value'];
		}
		var jsonEncodedData = JSON.stringify(formData);
		localStorage.setItem('shippingDetail', jsonEncodedData);
		$('button[data-label="add-shipping"]').addClass('fill-background').removeClass('btn-outline-secondary');
		$('#holdModal').modal('toggle');
	} else if ($(this).hasClass('order_hold')) {
		putOnHold($('#order_title').val());
	} else if ($(this).hasClass('order_payment')) {
		var isItemNameEmpty = false;
		$('td input[name^="item_name"],td input[name^="custom_item_name"]').each(function(index, element) {
			if ($(element).val() == '') {
				isItemNameEmpty = true;
			}
		});
		if (isItemNameEmpty) {
			swal(jsLang('Item name can not be empty.'), {
				icon: "error",
			});
		} else {
			$('.order_payment').attr('disabled', true);
			orderPayment();
		}
	} else if ($(this).hasClass('pos_settings')) {
		$("[data-label='pos-settings']").attr('data-settings-tax', $("#tax_type").val());
		$("[data-label='pos-settings']").attr('data-settings-discount', $("#discount_on").val());
		localStorage.setItem('taxType', $("#tax_type").val());
		localStorage.setItem('discountOn', $("#discount_on").val());
		if ($('.input_qty').length > 0) {
			generateAllTotal();
		}
		$('#holdModal').modal('toggle');
	} else if ($(this).hasClass('edit_order')) {
		$('.please_add').remove();

		if (orderResponse !== '') {
			let orderDetails = orderResponse.order.sale_order_details;
			$('#customers').append('<option value="' + orderResponse.customer.id + '" data-currency_id="' + orderResponse.customer.currency_id + '" selected>' + orderResponse.customer.first_name + ' ' + orderResponse.customer.last_name + '</option>').trigger("change");

			var item = '';
			stack = [];
			for (var i = 0; i < orderDetails.length; i++) {
				var unitPrice = orderDetails[i]['unit_price'];
				var unitQuantity = orderDetails[i]['quantity'];
				stack.push(orderDetails[i]['item_id']);
				var max = "";
				var input_danger = '';
				let qtySpinnerStart = '<div class="qty_spinner"><button type="button" class="decrease">-</button>';
				let qtySpinnerEnd = '<button type="button" class="increase">+</button></div>';
				var taxes = "";
				$.each(orderDetails[i].tax_rates, function(index, tax) {
					taxes += getDecimalNumberFormat(tax) + "%";
					if (index < (orderDetails[i].tax_rates).length - 1) {
						taxes += ", ";
					}
				})
				if (orderDetails[i].item && orderDetails[i].item_id != null && orderDetails[i].item.is_stock_managed == 1 && orderDetails[i].item.stock < orderDetails[i]['quantity']) {
					qtySpinnerStart = '<div class="qty_spinner"><button type="button" class="decrease danger-button">-</button>';
					qtySpinnerEnd = '<button type="button" class="increase danger-button">+</button></div>';
					max = " max = " + orderDetails[i].stock;
					input_danger = ' input_danger';
				}
				if (orderDetails[i]['item_id'] == null) {
					item += '<tr id="rowId_0">' +
						'<td width="3%" class="pr-0 pt-2">' +
						'<span id="item_edit_0" data-id="0" data-discount="' + getDecimalNumberFormat(orderDetails[i]['discount']) + '" data-discount-type="' + orderDetails[i]['discount_type'] + '" class="feather icon-edit cursor-pointer item-edit" data-toggle="modal" data-target="#editItemModal"></span>' +
						'</td>' +
						'<td width="35%">' +
						'<input type="hidden" name="custom_item_id[]" value="">' +
						'<input type="hidden" name="custom_item_tax_type_id[]" value="' + orderDetails[i]['tax_ids'] + '">' +
						'<input type="text" class="form-control hold_item_active" data-desc="' + orderDetails[i]['description'] + '" name="custom_item_name[]" value="' + orderDetails[i]['item_name'] + '">' +
						'<input type="hidden" name="custom_item_desc[]" value="' + orderDetails[i]['description'] + '">' +
						'<input type="hidden" name="custom_item_discount[]" class="item-discount" value="' + getDecimalNumberFormat(orderDetails[i]['discount']) + '">' +
						'<input type="hidden" name="custom_item_discount_type[]" class="item-discount-type" value="' + orderDetails[i]['discount_type'] + '">' +
						'<input type="hidden" name="custom_item_tax[]" value="' + taxes + '">' +
						'<input type="hidden" name="order_id" value="' + orderResponse.order.id + '">' +
						'<input type="hidden" name="custom_row_no[]" value="' + custom_row_no + '">' +
						'</td>' +
						'<td width="18%">' +
						'<input type="text" class="form-control hold_item_active input_price positive-float-number text-right" name="custom_item_price[]" value="' + getDecimalNumberFormat(unitPrice) + '">' +
						'</td>' +
						'<td width="22%">' + qtySpinnerStart +
						'<input type="text" data-item_tax="' + taxes + '" class="form-control input_qty positive-float-number" name="custom_item_qty[]" min="0" value=' + getDecimalNumberFormat(unitQuantity) + '>' + qtySpinnerEnd +
						'</td>' +
						'<td width="20%">' +
						'<input type="text" class="form-control indivisualTotal positive-float-number" name="custom_indivisiual_item_total_price[]" readonly value=' + getDecimalNumberFormat(unitPrice * unitQuantity) + '>' +
						'</td>' +
						'<td>' +
						'<button type="button" class="btn custom-btn-small delete_row" data-rowId="0"><i class="feather icon-trash-2"></i>' +
						'</button>' +
						'</td>' +
						'</tr>';
				} else {
					item += '<tr id="rowId_' + orderDetails[i]['item_id'] + '">' +
						'<td width="3%" class="pr-0 pt-2">' +
						'<span id="item_edit_' + orderDetails[i]['item_id'] + '" data-id="' + orderDetails[i]['item_id'] + '" data-discount="' + getDecimalNumberFormat(orderDetails[i]['discount']) + '" data-discount-type="' + orderDetails[i]['discount_type'] + '" class="feather icon-edit cursor-pointer item-edit" data-toggle="modal" data-target="#editItemModal"></span>' +
						'</td>' +
						'<td width="35%">' +
						'<input type="hidden" name="item_id[]" value="' + orderDetails[i]['item_id'] + '">' +
						'<input type="hidden" name="item_tax_type_id[' + orderDetails[i]["item_id"] + '][]" value="' + orderDetails[i]['tax_ids'] + '">' +
						'<input type="text" id="item_name_' + orderDetails[i]['item_id'] + '" class="form-control hold_item_active" data-desc="' + orderDetails[i]['description'] + '" name="item_name[]" value="' + orderDetails[i]['item_name'] + '">' +
						'<input type="hidden" name="item_desc[]" value="' + orderDetails[i]['description'] + '">' +
						'<input type="hidden" name="item_discount[]" class="item-discount" value="' + getDecimalNumberFormat(orderDetails[i]['discount']) + '">' +
						'<input type="hidden" name="item_discount_type[]"  class="item-discount-type" value="' + orderDetails[i]['discount_type'] + '">' +
						'<input type="hidden" name="item_tax[' + orderDetails[i]["item_id"] + '][]" value="' + taxes + '">' +
						'<input type="hidden" name="order_id" value="' + orderResponse.order.id + '">' +
						'</td>' +
						'<td width="20%">' +
						'<input type="text" class="form-control hold_item_active input_price positive-float-number text-right" id="item_price_' + orderDetails[i]['item_id'] + '" min="0" name="item_price[]" value=' + unitPrice + '>' +
						'</td>' +
						'<td width="20%">' + qtySpinnerStart +
						'<input type="text" data-item_tax="' + taxes + '" id="input_qty_' + orderDetails[i]['item_id'] + '" class="form-control input_qty ' + input_danger + ' positive-float-number text-right" name="item_qty[]" min="0"' + max + ' value=' + unitQuantity + '>' + qtySpinnerEnd +
						'</td>' +
						'<td width="20%">' +
						'<input type="text" class="form-control indivisualTotal" id="indivisualTotal_' + orderDetails[i]['item_id'] + ' positive-float-number" name="indivisiual_item_total_price[]" readonly value=' + (unitPrice * unitQuantity) + '>' +
						'</td>' +
						'<td>' +
						'<button type="button" class="btn custom-btn-small delete_row" data-rowId="' + orderDetails[i]['id'] + '"><i class="feather icon-trash-2"></i>' +
						'</button>' +
						'</td>' +
						'</tr>';
				}
			}
			$("#net_discount").val(getDecimalNumberFormat(orderResponse.order['other_discount_amount']));
			$("#net_discount_type").val(orderResponse.order['other_discount_type']);
			$("#shipping_cost").val(getDecimalNumberFormat(orderResponse.order['shipping_charge']));
			$('#order_id').val(orderResponse.order.id);
			$('.scrollable').children().children().html(item);
			calculate_item_qty();
			generateAllTotal();
			$('#holdModal').modal('toggle');
		}
	}
});

function emailValidator(email) {
	var regExp = new RegExp(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/);
	return regExp.test(email);
}

var count;
var interval;
$("#scroll-start").on('mouseover', function() {
	var div = $('.slides');
	interval = setInterval(function() {
		count = count || 1;
		var pos = div.scrollLeft();
		div.scrollLeft(pos - count);
		count = count + 1;
	}, 150);
}).on("click", function() {
	if (count < 6) {
		count = count + 1;
	}
}).on('mouseout', function() {
	// reset the speed on out
	count = 0;
	clearInterval(interval);
});

$("#scroll-end").on('mouseover', function() {
	interval = setInterval(function() {
		count = count || 1;
		var pos = $('.slides').scrollLeft();
		$('.slides').scrollLeft(pos + count);
		count = count + 1;
	}, 150);
}).on("click", function() {
	if (count < 6) {
		count = count + 1;
	}
}).on('mouseout', function() {
	// reset the speed on out
	count = 0;
	clearInterval(interval);
});

window.addEventListener('resize', windowResize);

function windowResize() {
	var wh = window.innerHeight;
	var lsh = wh - 390;
	$('.scrollable').css({
		'height': lsh + 'px'
	});
	var rsh = wh - 190;
	$('.item_section').css({
		'height': rsh + 'px'
	});
}
windowResize();



$(document).on("keyup", '.input_qty', function() {
	if (parseFloat(validateNumbers($(this).val())) <= 0) {
		$(this).val(0);
		$(this).addClass('input_danger');
		$(this).siblings('.increase').addClass('danger-button');
		$(this).siblings('.decrease').addClass('danger-button');
	} else {
		$(this).removeClass('input_danger');
		$(this).siblings('.increase').removeClass('danger-button');
		$(this).siblings('.decrease').removeClass('danger-button');
	}
	if ($(this).attr("max")) {
		if (parseFloat(validateNumbers($(this).val())) > parseFloat($(this).attr('max'))) {
			$(this).addClass('input_danger');
			$(this).siblings('.increase').addClass('danger-button');
			$(this).siblings('.decrease').addClass('danger-button');
			$(document).attr("data-label")
			$("#myForm :input").prop("disabled", true);
			swal(jsLang('Stock not available.'), {
				icon: "error",
			});
		} else {
			$(this).removeClass('input_danger');
			$(this).siblings('.increase').removeClass('danger-button');
			$(this).siblings('.decrease').removeClass('danger-button');
		}
	}
	var qty = $(this).val();
	var unit_price = $(this).parent().parent().prev().children().eq(0).val();
	var total = $(this).parent().parent().next().children().eq(0).val(getDecimalNumberFormat(validateNumbers(qty) * validateNumbers(unit_price)));
	calculate_item_qty();
});

$(document).on("blur", '.input_price', function(e) {
	var unit_price = $(this).val();
	var qty = $(this).parent().next().children().eq(0).children().eq(1).val();
	var total = $(this).parent().next().next().children().eq(0).val(getDecimalNumberFormat(validateNumbers(qty) * validateNumbers(unit_price)));
	generateAllTotal();
})

//decrease the value when click on spinner
$(document).on('click', '.decrease', function(e) {
	let qty = validateNumbers($(this).siblings('input').val());
	let item_id = $(this).siblings().attr('id').substring(10, this.length);
	let item_tax = $(this).siblings().attr('data-item_tax');
	if (parseFloat(qty) > 0) {
		if (Number.isInteger(parseFloat(qty))) {
			$(this).siblings('input').val(--qty);
		} else {
			if (qty < 1) {
				$(this).siblings('input').val(0);
			} else {
				$(this).siblings('input').val(getDecimalNumberFormat(--qty));
			}
		}
		$(this).siblings('input').removeClass('input_danger');
		$(this).siblings('.increase').removeClass('danger-button');
		$(this).removeClass('danger-button');
	}
	$(this).siblings('input').trigger("keyup");
});

//Increase the value when click on spinner
$(document).on('click', '.increase', function(e) {
	var inStock = true;
	let qty = parseFloat(validateNumbers($(this).prev('input').val()));
	let item_id = $(this).prev().attr('id').substring(10, this.length);
	if (parseFloat($("#input_qty_" + item_id).attr('max')) <= (qty + 1)) {
		inStock = false;
		swal(jsLang('Stock not available.'), {
			icon: "error",
		});
	} else {
		let item_tax = $(this).prev().attr('data-item_tax');
		if (Number.isInteger(qty)) {
			$(this).prev('input').val(++qty);
		} else {
			$(this).prev('input').val(getDecimalNumberFormat(++qty));
		}
	}
	if ($("#input_qty_" + item_id).val() > 0) {
		$(this).siblings('input').removeClass('input_danger');
		$(this).siblings('.decrease').removeClass('danger-button');
		$(this).removeClass('danger-button');
		$(this).prev('input');
	}
	if (inStock) {
		$(this).prev('input').trigger("keyup");
	}
});

//Delete the row of order when click the delete button3
$(document).on('click', '.delete_row', function() {
	$(this).parent().parent().remove();
	//Remove the id from stack
	var rowId = $(this).attr('data-rowId');
	stack = stack.filter(item => item != rowId);
	generateAllTotal();
	calculate_item_qty();
});

var global_customer_id = "";

$(document).on('change', '#customers', function(e) {
	let currency_id = $("#customers option:selected").attr('data-currency_id');
	if (currency_id != dflt_currency_id) {
		swal(jsLang('Customer currency and system currency must have to be same.'), {
			icon: "error",
		});
		$("#customers").val(global_customer_id);
		$("#customers").trigger('change.select2');
	} else {
		global_customer_id = $("#customers option:selected").val();
	}
	$("#name").val('');
	$("#ship_email").val('');
	$("#ship_street").val('');
	$("#ship_city").val('');
	$("#ship_state").val('');
	$("#ship_zipCode").val('');
	$("#ship_country_id").val('');
	localStorage.setItem('shippingDetail', '');
	$('button[data-label="add-shipping"]').removeClass('green');
})

function editItem() {
	var name = $("#edit-item-name").val();
	var desc = $("#edit-item-desc").val();
	var disc = $("#edit-item-discount").val();
	var type = $("#edit-discount-type").val();
	var tax = $("#individual_tax").val();
	var row = $("tr[modal='on']");
	var tax_value = $("#individual_tax").siblings().eq(0).attr('title') == "Nothing selected" ? "0" : $("#individual_tax").siblings().eq(0).attr('title');
	var price = row.children().eq(4).children().eq(0).val();
	row.children().eq(0).children().eq(0).attr('data-discount', disc).attr('data-discount-type', type);
	row.children().eq(1).children().eq(1).val(tax);
	row.children().eq(1).children().eq(2).attr('data-desc', desc).val(name);
	row.children().eq(1).children().eq(3).val(desc);
	row.children().eq(1).children().eq(4).val(disc);
	row.children().eq(1).children().eq(5).val(type);
	row.children().eq(1).children().eq(6).val(tax_value);
	row.children().eq(3).children().children().eq(1).attr('data-item_tax', tax_value);
	generateAllTotal();
}

//Calculate total item quantity
function calculate_item_qty() {
	let item_quantity = 0;
	$('.input_qty').each(function(index, value) {
		item_quantity += parseFloat(validateNumbers($(value).val()));
	});
	if (Number.isInteger(item_quantity)) {
		$('.item_count').text(item_quantity);
	} else {
		$('.item_count').text(getDecimalNumberFormat(item_quantity));
	}
	generateAllTotal();
}


function generateAllTotal() {
	var totalTax = 0;
	var indDiscount = 0;
	var subTotal = 0;
	var netPayable = 0;
	var netTotal = calculateTotalPrice();
	$("#indivisual-discount-price").val(netTotal);
	var taxType = $("[data-label='pos-settings']").attr('data-settings-tax');
	var netDiscount = $("#net_discount").val() == "" ? 0 : parseFloat(validateNumbers($("#net_discount").val()));
	if ($("#net_discount_type").val() == '%') {
		netDiscount = netTotal * netDiscount / 100;
	}
	if ($('.input_qty').length > 0) {
		$('#itemAdded tr').each(function() {
			var unitPrice = validateNumbers($(this).children().eq(2).children().eq(0).val());
			var quantity = validateNumbers($(this).children().eq(3).children().eq(0).children().eq(1).val());
			var taxes = $(this).children().eq(3).children().eq(0).children().eq(1).attr('data-item_tax');
			taxes = taxes.split("%, ");
			taxes[taxes.length - 1] = taxes[taxes.length - 1].split("%")[0];
			var disc = validateNumbers($(this).children().eq(0).children().eq(0).attr('data-discount'));
			var discType = $(this).children().eq(0).children().eq(0).attr('data-discount-type');
			var discount = individualDiscount(unitPrice * quantity, disc, discType);

			var result = individualTaxPrice(unitPrice * quantity, taxes, discount, netTotal);
			var price = result.price;
			totalTax += parseFloat(getDecimalNumberFormat(result.tax));
			subTotal += unitPrice * quantity;
			indDiscount += parseFloat(discount);
		});
		$("#discountBtn").removeAttr("disabled");
		$("#paymentBtn").removeAttr("disabled");
		$("#holdBtn").removeAttr("disabled");
	} else {
		$("#discountBtn").prop("disabled", true);
		$("#paymentBtn").prop("disabled", true);
		$("#holdBtn").prop("disabled", true);
	}
	indDiscount += netDiscount;
	if (taxType == "exclusive") {
		netPayable = subTotal + totalTax - indDiscount;
	} else {
		netPayable = subTotal - indDiscount;
	}

	var shipping = validateNumbers($("#shipping_cost").val());
	netPayable += parseFloat(shipping);
	$("#subTotal").text(decimalNumberFormatWithCurrency(subTotal));
	$("#item_tax").text(decimalNumberFormatWithCurrency(totalTax));
	$("#discount").text(decimalNumberFormatWithCurrency(indDiscount));
	$("#net_payable_no_currency").text(netPayable);
	$("#net_payable").text(decimalNumberFormatWithCurrency(netPayable));
}

function individualTaxPrice(price, taxes, discount, totalPrice) {
	var otherDiscount = $("#net_discount").val() == "" ? 0 : parseFloat(validateNumbers($("#net_discount").val()));
	var otherDiscountType = $("#net_discount_type").val();
	var totalTax = calculateTaxPercent(taxes);
	var taxType = $("[data-label='pos-settings']").attr('data-settings-tax');
	var discountOn = $("[data-label='pos-settings']").attr('data-settings-discount');
	var taxAmount = 0;
	var itemPrice = 0;
	var otherDiscountAmount = 0;
	if (otherDiscountType == "%") {
		otherDiscountAmount = (price - discount) * otherDiscount / 100;
	} else if (otherDiscountType == "$") {
		otherDiscountAmount = (price - discount) / totalPrice * otherDiscount;
	}
	if (discountOn == "after") {
		var tempTotal = price - discount - otherDiscountAmount;
		if (taxType == "exclusive") {
			taxAmount = tempTotal * totalTax / 100;
			itemPrice = price;
		} else if (taxType == "inclusive") {
			taxAmount = tempTotal - (tempTotal / ((totalTax / 100) + 1));
			itemPrice = tempTotal / ((totalPrice / 100) + 1);
		}
	} else if (discountOn == "before") {
		if (taxType == "exclusive") {
			taxAmount = price * (totalTax / 100);
			itemPrice = price;
		} else if (taxType == "inclusive") {
			taxAmount = price - (price / ((totalTax / 100) + 1));
			itemPrice = price / ((totalTax / 100) + 1);
		}
	}
	if (isNaN(parseFloat(taxAmount))) {
		taxAmount = 0;
	}
	return {
		tax: taxAmount,
		price: itemPrice
	};
}

function individualDiscount(price, disc, discType) {
	if (discType == "$") {
		return parseFloat(disc);
	} else if (discType == "%") {
		return parseFloat(disc) * parseFloat(price) / 100;
	}
}

function calculateTaxPercent(taxes) {
	var sum = 0;
	if (taxes != "" && taxes != undefined) {
		$.each(taxes, function(index, value) {
			sum += parseFloat(validateNumbers(value));
		})
	}
	return sum;
}

function calculateTotalPrice() {
	var totalPrice = 0;
	$('.input_price').each(function(index, value) {
		var tempQty = parseFloat(validateNumbers($(this).parent().parent().find(".input_qty").val()));
		var tempDisc = parseFloat(validateNumbers($(this).parent().parent().find(".item-discount").val()));
		var tempDiscountType = $(this).parent().parent().find(".item-discount-type").val();
		var tempDiscount = 0;
		if (tempDiscountType == "$") {
			tempDiscount = tempDisc;
		} else {
			tempDiscount = tempQty * parseFloat(validateNumbers(value.value)) * tempDisc / 100;
		}
		totalPrice += (tempQty * parseFloat(validateNumbers(value.value))) - tempDiscount;
	});
	return totalPrice;
}

if (($('.main-body .page-wrapper').find('#get-pos-location').length)) {
	$(".select2").select2();
}

$(document).on('click', '#paymentBtn', function(e) {
	let currency_id = $("#customers option:selected").attr('data-currency_id');
	if (currency_id != dflt_currency_id) {
		swal(jsLang('Customer currency and system currency must have to be same.'), {
			icon: "error",
		});
		$("#holdModalSubmitBtn").prop("disabled", true);
		setTimeout(function() { 
			$('#holdModal').modal('toggle');
		}, 1000);
	} else {
		global_customer_id = $("#customers option:selected").val();
	}
})