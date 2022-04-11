'use strict';
function toggleWholeSalePrice() {
	if ($("#wholesalePrice").is(":checked")) {
		$("#wholesalePriceField").hide();
	} else {
		$("#wholesalePriceField").show();
	}
}

function toggleMultiVariants() {
	if ($("#multi_variants").is(":checked")) {
		$("#multiVariantsBlock").show();
		$("#rdoAttribute").html(jsLang('Attributes'));
	} else {
		$("#multiVariantsBlock").hide();
		$("#rdoAttribute").html(jsLang('Enable Attribute'));
	}
}

function toggleManageStock() {
	if ($('#manageStock').is(":checked")) {
		$('#initialStockBlock').show();
		$("#rdoStock").html(jsLang('Current Stocks'));
	} else {
		$('#initialStockBlock').hide();
		$("#rdoStock").html(jsLang('Manage Stock Level'));
	}
}

function toggleItemType() {
	if ($('#itemType').val() == 'service') {
		$('#variant-tab').hide();
		$('#multiVariantsBlock').hide();
		$('#stock-tab').hide();
		$('#initialStockBlock').hide();
		$("#manageStock").prop("checked", false);
		$("#multi_variants").prop("checked", false);
	} else {
		$('#variant-tab').show();
		$('#stock-tab').show();
	}
}

function toggleSizeVariant() {
	if ($('#sizeVariant').is(':checked')) {
		var doc_val_check = $('#sizeInput').val().trim();
		$('#sizeInput').val(doc_val_check);
		$('#sizeInput').removeAttr('disabled');
	} else {
		$('#sizeInput').val(' ');
		$('#sizeInput').trigger('keyup');
		$('#sizeInput').attr('disabled', 'true');
	}
}

function toggleColorVariant() {
	if ($('#colorVariant').is(':checked')) {
		var doc_val_check = $('#colorInput').val().trim();
		$('#colorInput').val(doc_val_check);
		$('#colorInput').removeAttr('disabled');
	} else {
		$('#colorInput').val(' ');
		$('#colorInput').trigger('keyup');
		$('#colorInput').attr('disabled', 'true');
	}
}

function toggleWeightVariant() {
	if ($('#weightVariant').is(':checked')) {
		$('#weightInput').removeAttr('disabled');
		$('#weightUnit').removeAttr('disabled');
		if (!$('#weightInput').hasClass('positive-float-number')) {
			$('#weightInput').addClass('positive-float-number');
		}
		var doc_val_check = $('#weightInput').val().trim();
		$('#weightInput').val(doc_val_check);
	} else {
		$('#weightInput').removeClass('positive-float-number');
		$('#weightInput').val(' ');
		$('#weightInput').trigger('keyup');
		$('#weightInput').attr('disabled', 'true');
		$('#weightUnit').attr('disabled', 'true');
	}
}

// add item view
if (($('.main-body .page-wrapper').find('#add-item-container').length)) {
	$('.select2').select2();
	toggleMultiVariants();
	toggleManageStock();
	toggleItemType();
	toggleSizeVariant();
	toggleColorVariant();
	toggleWeightVariant();

	function readURL(input) {
		if (input.files && input.files[0]) {
			var reader = new FileReader();
			$('#prvw').removeAttr('hidden');
			$('#blah').removeAttr('hidden');
			reader.onload = function(e) {
				$('#blah').attr('src', e.target.result);
			}
			reader.readAsDataURL(input.files[0]);
		}
	}

	var purchase_price = $('#purchase_price').val();
	var retail_price = $('#retail_price').val();
	var costPrice = $('#costPrice').val();
	var initialStock = $('#initialStock').val();
	var alert_quantity = $('#alert_quantity').val();
	$('#purchase_price').val(getDecimalNumberFormat(purchase_price));
	$('#retail_price').val(getDecimalNumberFormat(retail_price));
	$('#costPrice').val(getDecimalNumberFormat(costPrice));
	$('#initialStock').val(getDecimalNumberFormat(initialStock));
	$('#alert_quantity').val(getDecimalNumberFormat(alert_quantity));

	$("#validatedCustomFile").on('change', function () {
	  $(this).next('.custom-file-label').html($(this)[0].files[0].name);
	});

	$('#itemAddForm').validate({
		rules: {
			item_id: {
				required: true,
				remote: {
					url: SITE_URL + "/item/stock_id_validation",
					type: "GET",
					data: {
						stock_id: function() {
							return $('input[name=item_id]').val();
						}
					}
				}
			},
			item_name: {
				required: true,
				remote: {
					url: SITE_URL + "/item/name_validation",
					type: "GET",
					data: {
						description: function() {
							return $('input[name=item_name]').val();
						}
					}
				}
			},
			category_id: {
				required: true
			},
			purchase_price: {
				required: true,
			},
			tax_type_id: {
				required: true
			},
			units: {
				required: true
			},
			initial_stock: {
				required: true,
			},
			size: {
				customSize: true
			},
			color: {
				customColor: true,
			},
			weight: {
				customWeight: true,
			},
			alert_quantity: {
				required: false,
			},
			cost_price: {
				required: true,
			},
			item_image: {
				fileType: "jpg|png|gif",
		        remote: function(element){
		        	if (element.files.length != 0) {
		        		return { url : SITE_URL + "/is-valid-file-size", data: { filesize: element.files[0].size }}
		        	}
		        },
			},
		},
	});

	$('#validatedCustomFile').on('change', function() {
		$('#validatedCustomFile').valid();
	});

	jQuery.validator.addMethod("customSize", function(value, element) {
		if ($('#multi_variants').is(':checked')) {
			if (value == '') {
				return false;
			} else {
				return true;
			}
		} else {
			return true;
		}
	}, jsLang('This field is required.'));

	jQuery.validator.addMethod("customColor", function(value, element) {
		if ($('#multi_variants').is(':checked')) {
			if (value == '') {
				return false;
			} else {
				return true;
			}
		} else {
			return true;
		}
	}, jsLang('This field is required.'));

	jQuery.validator.addMethod("customWeight", function(value, element) {
		if ($('#multi_variants').is(':checked')) {
			if (value == '') {
				return false;
			} else {
				return true;
			}
		} else {
			return true;
		}
	}, jsLang('This field is required.'));

	$('#item_id').on('keyup', function() {
		var item_id = $(this).val().trim();
		if (item_id != '') {
			$.ajax({
					method: "GET",
					url: SITE_URL + "/item/stock_id_validation",
					data: {
						"item_id": item_id
					}
				})
				.done(function(data) {
					var data = JSON.parse(data);
					if (data.status_no == 1) {
						$("#errMsg").html("");
						$('#errMsg').removeClass('text-success');
						$('#errMsg').addClass('text-danger');
					} else if (data.status_no == 0) {
						$("#errMsg").html(jsLang('Available'));
						$('#errMsg').removeClass('text-danger');
						$('#errMsg').addClass('text-success');
					}
				});
		} else {
			$("#errMsg").html("");
			$('#errMsg').removeClass('text-success');
			$('#errMsg').addClass('text-danger');
		}
	});

	$('#item_name').on('keyup', function() {
		var item_name = $(this).val().trim();
		if (item_name != '') {
			$.ajax({
					method: "GET",
					url: SITE_URL + "/item/name_validation",
					data: {
						"description": item_name
					}
				})
				.done(function(data) {
					var data = JSON.parse(data);
					if (data.status_no == 1) {
						$("#checkMsg").html("");
						$('#checkMsg').removeClass('text-success');
						$('#checkMsg').addClass('text-danger');
					} else if (data.status_no == 0) {
						$("#checkMsg").html(jsLang('This name is available to use'));
						$('#checkMsg').removeClass('text-danger');
						$('#checkMsg').addClass('text-success');
					}
				});
		} else {
			$("#checkMsg").html("");
			$('#checkMsg').removeClass('text-success');
			$('#checkMsg').addClass('text-danger');
		}
	});

	$('#manageStock').on('change', function() {
		toggleManageStock();
	});
	$('#multi_variants').on('change', function(e) {
		toggleMultiVariants();
	});
	$('#sizeVariant').on('change', function() {
		toggleSizeVariant();
	});
	$('#colorVariant').on('change', function() {
		toggleColorVariant();
	});
	$('#weightVariant').on('change', function() {
		toggleWeightVariant();
	});

	var rowid = 1;
	$('#customVariantBtn').on('click', function(e) {
		e.preventDefault();
		var isEmpty = false;
		if ($(".custom-variant-title").length > 0) {
			$.each($(".custom-variant-title"), function(index, value) {
				if (value.value == "") {
					value.focus();
					isEmpty = true;
					return false;
				}
			})
		}

		if ($(".custom-variant-value").length > 0) {
			$.each($(".custom-variant-value"), function(index, value) {
				if (value.value == "") {
					value.focus();
					isEmpty = true;
					return false;
				}
			})
		}
		var customVariantHtml = `
    <div class="form-group row customVariantDiv" id="rowid-${rowid}">
      <div class="col-md-2 col-sm-3">
        <input  data-rel="${rowid}" data-text="extra-variant-title" name="variant_title[]" type="text" class="form-control custom-variant-title" id="variant-title-${rowid}">
        <span id="extra-variant-title-${rowid}" class="validationMsg"></span>
      </div>
      <div class="col-md-7 col-sm-5">
        <input type="text" data-rel="${rowid}" data-text="extra-variant-value" id="variant-value-${rowid}" name="variant_value[]" class="form-control custom-variant-title">
        <span id="extra-variant-value-${rowid}" class="validationMsg"></span>
      </div>
      <div class="col-md-1 col-sm-2 text-right">
        <button type="button" data-row-id="${rowid}" class="btn btn-xs btn-danger m-t-5 deleteCustomVariant"><i class="fa fa-trash"></i></button>
      </div>
    </div>`;
		if (!isEmpty) {
			$('#customVariantBlock').append(customVariantHtml);
			rowid++;
		}
	});

	$(document).on('click', '.deleteCustomVariant', function(e) {
		e.preventDefault();
		var idtodelete = $(this).attr('data-row-id');
		$('#rowid-' + idtodelete).remove();
	});

	$('#itemType').on('change', function() {
		toggleItemType()
	});

	$(document).on('keyup focus', '.custom-variant-title', function() {
		customVariantTitleValidation();
	});

	$('#itemAddForm').on('submit', function() {
		customVariantTitleValidation();
	});

	function customVariantTitleValidation() {
		var count = 0;
		var temp = 0;
		var fl = 0,
			text_input_check;
		$('.customVariantDiv').each(function() {
			count++;
		});
        var rowIds = [];
        $('.customVariantDiv').each(function() {
            rowIds.push($(this).attr('id').split('-').pop());
        });

            $.each(rowIds, function(index, i){
			text_input_check = 0;
			var txt_value_title = 0;
			$.each($("#variant-value-" + i), function() {
				if ($(this).val()) {
					text_input_check = 1;
				}
				if ($("#variant-title-" + i).val()) {
					txt_value_title = 1;
				}
			});

			if (text_input_check == 0) {
				$("#variant-value-" + i).addClass('err1');
				$('#extra-variant-value-' + i).text(jsLang('This field is required.'));
				fl = 1;
			} else {
				$("#variant-value-" + i).removeClass('err1');
				$('#extra-variant-value-' + i).text('');
			}

			if (txt_value_title == 0) {
				$("#variant-title-" + i).addClass('err1');
				$('#extra-variant-title-' + i).text(jsLang('This field is required.'));
				temp = 1;
			} else {
				$("#variant-title-" + i).removeClass('err1');
				$('#extra-variant-title-' + i).text('');
			}
            });

		if (fl == 1 || temp == 1) {
			event.preventDefault();
			return false;
		} else {
			return true;
		}
	}

	$(window).on('load', function() {
		if ($(window).width() <= 575) {
			$('#weightUnitDiv').addClass('mt-1');
			$('#weightUnitDiv').addClass('itemWeightForSmallDevice');
			$('#note_txt_2').addClass('mt-1');
		}
	});
}

// edit item view
if (($('.main-body .page-wrapper').find('#edit-item-container').length)) {
	$('.select2').select2();
	toggleWholeSalePrice();
	$('#wholesalePriceCheck').on('change', function(e) {
		toggleWholeSalePrice();
	});
	$('.dataTable').addClass('item-datatable');

	//Start Image and file handle
	$('#validatedCustomFile').on("change", function(e) {
		var files = [];
		for (var i = 0; i < $(this)[0].files.length; i++) {
			files.push($(this)[0].files[i].name);
		}
		$(this).next('.custom-file-label').html(files.join(', '));
	});

	function readURL(input) {
		if (input.files && input.files[0]) {
			var reader = new FileReader();
			reader.onload = function(e) {
				$('#blah_1').attr('src', e.target.result);
				$('#blah_2').attr('src', e.target.result);
			}
			reader.readAsDataURL(input.files[0]);
		}
	}

	var purchase_price = $('#purchase_price').val();
	var retail_price = $('#retail_price').val();
	var weightInput = $('#weightInput').val();
	$('#purchase_price').val(getDecimalNumberFormat(purchase_price));
	$('#retail_price').val(getDecimalNumberFormat(retail_price));
	if (weightInput) {
		$('#weightInput').val(getDecimalNumberFormat(weightInput));
	}

	function toggleWholeSalePrice() {
		if ($("#wholesalePriceCheck").is(":checked")) {
			$("#wholesalePriceField").hide();
		} else {
			$("#wholesalePriceField").show();
		}
	}

	$('#confirmDelete').on('show.bs.modal', function(e) {
		var button = $(e.relatedTarget);
		var modal = $(this);
		$('#confirmDeleteSubmitBtn').attr('data-task', '').removeClass('delete-task-btn');
		if (button.data("label") == 'Delete') {
			modal.find('#confirmDeleteSubmitBtn').addClass('delete-task-btn').attr('data-id', button.data('id')).text(jsLang('Delete')).show();
			modal.find('#confirmDeleteLabel').text(button.data('title'));
			modal.find('.modal-body').text(button.data('message'));
		}
		$('#confirmDeleteSubmitBtn').on('click', function() {
			$('#delete-item-' + $(this).attr('data-id')).trigger('submit');
		})
	});

	$('#statusManage').on('change', function() {
		var flag = $(this).is(':checked') ? 1 : 0;
		flag = (flag) ? 1 : 0;
		var item_id = itemID;
		$.ajax({
			url: SITE_URL + "/item/stock-update-ajax",
			method: "POST",
			data: {
				id: item_id,
				flag: flag,
				_token: token
			},
			success: function(data) {
				var msg = JSON.parse(data);
				if (msg == '1') {
					$('#msgStatus').fadeIn();
					$('#msgStatus').html('').css('color', 'white');
				} else {
					$('#msgStatus').fadeIn();
					$('#msgStatus').html(jsLang('Stock Management Disabled')).css('color', 'red');
				}
			}
		});
	});

	// Item form validation
	$('#itemEditForm').validate({
		rules: {
			stock_id: {
				required: true,
				remote: {
					url: SITE_URL + "/item/stock_id_validation",
					type: "GET",
					data: {
						stock_id: function() {
							return $('input[name=stock_id]').val();
						},
						id: currentItemId
					},
				}
			},
			item_name: {
				required: true,
				remote: {
					url: SITE_URL + "/item/name_validation",
					type: "GET",
					data: {
						description: function() {
							return $('input[name=item_name]').val();
						},
						id: currentItemId
					}
				}
			},
			item_type: "required",
			category_id: "required",
			units: "required",
			tax_type_id: "required",
			retail_price: {
				required: false,
			},
			wholesale_price: {
				required: false,
			},
			purchase_price: {
				required: true,
			},
			size: "required",
			color: "required",
			weight: {
				required: true,
			},
			item_image: {
				fileType: "jpg|png|gif",
		        remote: function(element){
		          if (element.files.length != 0) {
		        		return { url : SITE_URL + "/is-valid-file-size", data: { filesize: element.files[0].size }}
		        	}
		        },
			},
		},
		onfocusout: function(element, event) {
			this.element(element);
		},
	});

	$('#validatedCustomFile').on('change', function() {
		$('#validatedCustomFile').valid();
	});

	jQuery.extend(jQuery.validator.messages, {
		min: jQuery.validator.format("Minimum 0.")
	});

	$('#item_name').on('keyup', function() {
		$("#checkMsg").html("");
		var item_name = $(this).val().trim();
		var old_name = $("#old_item_name").val().trim();
		// Check item name if available
		if (item_name != '' && item_name != old_name) {
			$.ajax({
					method: "GET",
					url: SITE_URL + "/item/name_validation",
					data: {
						"description": item_name
					}
				})
				.done(function(data) {
					var data = JSON.parse(data);
					if (data.status_no == 1) {
						$("#checkMsg").html("");
						$('#checkMsg').removeClass('text-success');
						$('#checkMsg').addClass('text-danger');
					} else if (data.status_no == 0) {
						$("#checkMsg").html(jsLang('This name is available to use'));
						$('#checkMsg').removeClass('text-danger');
						$('#checkMsg').addClass('text-success');
					}
				});
		} else {
			$("#checkMsg").html("");
			$('#checkMsg').removeClass('text-success');
			$('#checkMsg').addClass('text-danger');
		}
	});

	$('#itemType').on('change', function() {
		if ($(this).val() == 'service') {
			$('#fullVariantBlock').hide();
		} else {
			$('#fullVariantBlock').show();
		}
	});

	// For export csv
	$('#transaction-variant-list-info_length').css('color', 'red');
	$(document).on("click", "#csv, #pdf", function(event) {
		window.location = SITE_URL + "/variant-item-download" + this.id + "/" + itemID;
	});

	$(document).on('keyup focus', '.custom-variant-value', function() {
		customVariantTitleValidation();
	});

	$('#itemEditForm').on('submit', function(e) {
		customVariantTitleValidation();
	});

	function customVariantTitleValidation() {
		var count = 0;
		var fl = 0,
			text_input_check;
		$('.text_box').each(function() {
			count++;
		});
		for (var i = 1; i <= count; i++) {
			text_input_check = 0;
			$.each($("#variant-value-" + i), function() {
				if ($(this).val()) {
					text_input_check = 1;
				}
			});

			if (text_input_check == 0) {
				$("#variant-value-" + i).addClass('err1');
				$('#extra-variant-value-' + i).text(jsLang('This field is required.'));
				fl = 1;
			} else {
				$("#variant-value-" + i).removeClass('err1');
				$('#extra-variant-value-' + i).text('');
			}
		}

		var isEmpty = false;
		if ($(".custom-variant-value").length > 0) {
			$.each($(".custom-variant-value"), function(index, value) {
				if (value.value == "") {
					value.focus();
					isEmpty = true;
					return false;
				}
			})
		}

		if (fl == 1 || isEmpty == true) {
			event.preventDefault();
			return false;
		} else {
			return true;
		}
	}

	$(window).on('load', function() {
		if ($('#itemType').val() == 'service') {
			$('#stock_management').hide();
			$('#status-tab').hide();
			$('#transactions-tab').hide();
		} else {
			$('#stock_management').show();
			$('#status-tab').show();
			$('#transactions-tab').show();
		}
	});
	$('form#itemEditForm').trigger('submit');
}

// import item view
if (($('.main-body .page-wrapper').find('#import-item-container').length)) {
	$('#myform1').on('submit', function(e) {
		var flag = 0;
		$('.valdation_check').each(function() {
			var id = $(this).attr('id');
			if ($('#' + id).val() == '') {
				$('#val_' + id).html(jsLang('This field is required.'));
				flag = 1;
			}
		});
		$('.valdation_select').each(function() {
			var id = $(this).attr('id');
			if ($('#' + id).val() == '') {

				$('#val_' + id).html(jsLang('This field is required.'));
				flag = 1;
			}
		});
		if (flag == 1) {
			e.preventDefault();
		}
	});

	$(".valdation_check").on('keypress keyup', function() {
		var nm = $(this).attr("id");
		$('#val_' + nm).html("");
	});

	$(".valdation_select").on('click', function() {
		var nm = $(this).attr("id");
		$('#val_' + nm).html("");
	});

	$("#fileRequest").on('click', function() {
		window.location = SITE_URL + '/public/dist/downloads/ItemImport.csv';
	});

	$('.error').hide();
	$('#note_txt_2').hide();
	$("#validatedCustomFile").on("change", function() {
		var files = [];
		for (var i = 0; i < $(this)[0].files.length; i++) {
			files.push($(this)[0].files[i].name);
		}
		$(this).next('.custom-file-label').html(files.join(', '));
		var fileName = files.toString();
		var ext = fileName.split('.').pop();
		if ($.inArray(ext, ['csv']) == -1) {
			$('#note_txt_1').hide();
			$('#note_txt_2').show();
			$('#note_txt_2').html('<h6> <span class="text-danger font-weight-bolder"> ' + jsLang('Invalid file Extension.') + ' </span> </h6> <span class="badge badge-danger">' + jsLang('Note') + '!</span>' + jsLang('Allowed File Extensions: csv'));
			$("#submit").attr('disabled', 'disabled');
		} else {
			$("#submit").removeAttr('disabled');
			$('#note_txt_1').hide();
		}
	});
}

// list item view
if (($('.main-body .page-wrapper').find('.list-container').length)) {
	$('#confirmDelete').on('show.bs.modal', function(e) {
		var button = $(e.relatedTarget);
		var modal = $(this);
		$('#confirmDeleteSubmitBtn').attr('data-task', '').removeClass('delete-task-btn');
		if (button.data("label") == 'Delete') {
			modal.find('#confirmDeleteSubmitBtn').addClass('delete-task-btn').attr('data-task', button.data('id')).text(jsLang('Delete')).show();
			modal.find('#confirmDeleteLabel').text(button.data('title'));
			modal.find('.modal-body').text(button.data('message'));
		} else {
			var spinner = '<div class="spinner">' +
				'<div class="bounce1"></div>' +
				'<div class="bounce2"></div>' +
				'<div class="bounce3"></div>' +
				'</div>';
			modal.find('.modal-body').html(spinner);
			modal.find('.modal-body').load(button.data("remote"));
		}
	});

	$('#confirmDeleteSubmitBtn').on('click', function() {
		$('#delete-item-' + $(this).data('task')).trigger('submit');
	})

	$('#dataTableBuilder').on('change', '.status', function() {
		var id = $(this).attr('data-customer_id');
		if ($(this).is(":checked")) {
			var status = '0';
		} else {
			var status = '1';
		}
		var url = SITE_URL + "/customer/change-status";
		$.ajax({
			url: url,
			method: "POST",
			data: {
				'id': id,
				'status': status,
				'_token': token
			},
			dataType: "json",
			success: function(data) {
				if (data.status == 'success') {
					$("#dataTableBuilder").DataTable().ajax.reload(null, false);
				}
			}
		});
	});

	$(document).on("click", "#pdf", function(event) {
		window.location = SITE_URL + "/itemdownloadpdf";
	});

	$(document).on("click", "#csv", function(event) {
		window.location = SITE_URL + "/itemdownloadcsv/csv";
	});
	$('#dataTableBuilder').addClass('item-datatable');
}

// Item variant add
if (($('.main-body .page-wrapper').find('#item-variant-container').length)) {
	$('.custom_select_2').select2();
	toggleWholeSalePrice();
    toggleManageStock();
	function readURL(input) {
		if (input.files && input.files[0]) {
			var reader = new FileReader();
			$('#prvw').removeAttr('hidden');
			$('#blah').removeAttr('hidden');
			reader.onload = function(e) {
				$('#blah').attr('src', e.target.result);
			}

			reader.readAsDataURL(input.files[0]);
		}
	}

	$('#validatedCustomFile').on('change', function() {
		$('#validatedCustomFile').valid();
	});

	var purchase_price = $('#purchase_price').val();
	var retail_price = $('#retail_price').val();
	var costPrice = $('#costPrice').val();
	var initialStock = $('#initialStock').val();
	var alert_quantity = $('#alert_quantity').val();
	$('#purchase_price').val(getDecimalNumberFormat(purchase_price));
	$('#retail_price').val(getDecimalNumberFormat(retail_price));
	$('#costPrice').val(getDecimalNumberFormat(costPrice));
	$('#initialStock').val(getDecimalNumberFormat(initialStock));
	$('#alert_quantity').val(getDecimalNumberFormat(alert_quantity));

	$("#validatedCustomFile").on('change', function () {
	    $(this).next('.custom-file-label').html($(this)[0].files[0].name);
	 });

	$('#variantAddForm').validate({
		rules: {
			stock_id: {
				required: true,
				remote: {
					url: SITE_URL + "/item/stock_id_validation",
					type: "GET",
					data: {
						stock_id: function() {
							return $('input[name=stock_id]').val();
						}
					}
				}
			},
			item_name: {
				required: true,
				remote: {
					url: SITE_URL + "/item/name_validation",
					type: "GET",
					data: {
						description: function() {
							return $('input[name=item_name]').val();
						}
					}
				}
			},
			purchase_price: {
				required: true,
			},
			wholesale_price: {
				required: false,
			},
			retail_price: {
				required: false,
			},
			size: {
				required: true
			},
			color: {
				required: true
			},
			weight: {
				required: true,
			},
			initial_stock: {
				required: true,
			},
			alert_quantity: {
				required: false,
			},
			cost_price: {
				required: true,
			},
			item_image: {
				fileType: "jpg|png|gif",
		        remote: function(element){
		          if (element.files.length != 0) {
		        		return { url : SITE_URL + "/is-valid-file-size", data: { filesize: element.files[0].size }}
		        	}
		        },
			},
		},
	});

	$('#stock_id').on('keyup', function() {
		var item_id = $(this).val().trim();
		if (item_id != '') {
			$.ajax({
					method: "GET",
					url: SITE_URL + "/item/stock_id_validation",
					data: {
						"item_id": item_id
					}
				})
				.done(function(data) {
					var data = JSON.parse(data);
					if (data.status_no == 1) {
						$("#errMsg").html("");
						$('#errMsg').removeClass('text-success');
						$('#errMsg').addClass('text-danger');
					} else if (data.status_no == 0) {
						$("#errMsg").html(jsLang('Available'));
						$('#errMsg').removeClass('text-danger');
						$('#errMsg').addClass('text-success');
					}
				});
		} else {
			$("#errMsg").html("");
		}
	});

	$('#item_name').on('keyup', function() {
		var item_name = $(this).val().trim();
		if (item_name != '') {
			$.ajax({
					method: "GET",
					url: SITE_URL + "/item/name_validation",
					data: {
						"description": item_name
					}
				})
				.done(function(data) {
					var data = JSON.parse(data);
					if (data.status_no == 1) {
						$("#checkMsg").html("");
						$('#checkMsg').removeClass('text-success');
						$('#checkMsg').addClass('text-danger');
					} else if (data.status_no == 0) {
						$("#checkMsg").html(jsLang('Available'));
						$('#checkMsg').removeClass('text-danger');
						$('#checkMsg').addClass('text-success');
					}
				});
		} else {
			$("#checkMsg").html("");
		}
	});

	$('#wholesalePrice').on('change', function(e) {
		toggleWholeSalePrice();
	});

	function toggleWholeSalePrice() {
		if ($("#wholesalePrice").is(":checked")) {
			$("#wholesalePriceField").hide();
		} else {
			$("#wholesalePriceField").show();
		}
	}

	$('#manageStock').on('change', function() {
		toggleManageStock();
	});

	function toggleManageStock() {
		if ($('#manageStock').is(":checked")) {
			$('#initialStockBlock').show();
		} else {
			$('#initialStockBlock').hide();
		}
	}

	$('#sizeVariant').on('change', function() {
		if ($(this).is(':checked')) {
			$('#sizeInput').removeAttr('disabled');
		} else {
			$('#sizeInput').attr('disabled', 'true');
		}
	});
	$('#colorVariant').on('change', function() {
		if ($(this).is(':checked')) {
			$('#colorInput').removeAttr('disabled');
		} else {
			$('#colorInput').attr('disabled', 'true');
		}
	});
	$('#weightVariant').on('change', function() {
		if ($(this).is(':checked')) {
			$('#weightInput').removeAttr('disabled');
			$('#weightUnit').removeAttr('disabled');
		} else {
			$('#weightInput').attr('disabled', 'true');
			$('#weightUnit').attr('disabled', 'true');
		}
	});
	var rowid = 1;

	$(document).on('click', '.deleteCustomVariant', function(e) {
		e.preventDefault();
		var idtodelete = $(this).attr('data-row-id');
		$('#rowid-' + idtodelete).remove();
	});

	$(document).on('keyup focus', '.custom-variant-value', function() {
		customVariantTitleValidation();
	});

	$('#variantAddForm').on('submit', function(e) {
		customVariantTitleValidation();
	});

	function customVariantTitleValidation() {
		var count = 0;
		var fl = 0,
			text_input_check;
		$('.variantDiv').each(function() {
			count++;
		});
		for (var i = 1; i <= count; i++) {
			text_input_check = 0;
			$.each($("#variant-value-" + i), function() {
				if ($(this).val()) {
					text_input_check = 1;
				}
			});

			if (text_input_check == 0) {
				$("#variant-value-" + i).addClass('err1');
				$('#extra-variant-value-' + i).text(jsLang('This field is required.'));
				fl = 1;
			} else {
				$("#variant-value-" + i).removeClass('err1');
				$('#extra-variant-value-' + i).text('');
			}
		}
		if (fl == 1) {
			event.preventDefault();
			return false;
		} else {
			return true;
		}
	}

	$(window).on('load', function() {
		if ($(window).width() <= 575) {
			$('#weightUnitDiv').addClass('mt-1');
		}
	});
}
