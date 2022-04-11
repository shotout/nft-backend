'use strict';
//for custom option dropdown
function dropdownClick() {
    document.getElementById("inv-dropdown-content").classList.show();
}

let zero = 0;

var global_inv_type;
var previous, allowToTriggerClickOnClose = false;
$('#inv-type').on('change', function () {
    var textTypeVal;
    if ($(".itemRow").length > 0) {
        if ($(this).attr('data-type') == "invoice") {
            textTypeVal = "Change of invoice type will reset added products, please confirm you really want to do this.";
        } else {
            textTypeVal = "Change of purchase type will reset added products, please confirm you really want to do this.";
        }
        swal({
            title: "Are you sure?",
            text: textTypeVal,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                global_inv_type = $("#inv-type").val();
                $(".closeRow").trigger("click");
                resetEverythingExcept();
                onChangeInvType();
            } else {
                $("#inv-type").val(global_inv_type);
                $("#inv-type").trigger('change.select2');
            }
        });
    } else {
        global_inv_type = $("#inv-type").val();
        resetEverything();
        onChangeInvType();
    }
});

$("#purchase-receive-type").on('change', function () {
    $("#purchase_receive_type").val($("#purchase-receive-type").val());
})

$('#invItemTax').on('change', function () {
    if ($(this).is(':checked')) {
        $('.itemTax').show();
        $('#tax_type_div').show();
        $('.itemTaxExtra').show();
        $("#invItem-Tax").val("on");
    } else {
        $('#tax_type_div').hide();
        $('.itemTaxExtra').hide();
        $('.itemTax').hide();
        $('.taxRow').hide();
        $('.inputTax').val(getDecimalNumberFormat(zero));
        $('.selectpicker').selectpicker('render');
        $('.indivisualTax').val(getDecimalNumberFormat(zero));
        $('.inputPrice').trigger('keyup');
        $("#invItem-Tax").val("");
    }
    itemDescriptionColspan();
    $('.inputPrice').trigger('keyup');
});

$('#invItemDiscount').on('change', function () {
    if ($(this).is(':checked')) {
        $('.itemDiscount').show();
        $("#invItem-Discount").val("on");
        $('.inputDiscount').val(getDecimalNumberFormat(zero)).show();
    } else {
        $('.itemDiscount').hide();
        $('.inputDiscount').val(getDecimalNumberFormat(zero));
        $('.indivisualDiscount').val(getDecimalNumberFormat(zero));
        $('.inputPrice').trigger('keyup');
        $("#invItem-Discount").val("");
    }
    itemDescriptionColspan()
    $('.inputPrice').trigger('keyup');
});

$('#invItemDetails').on('change', function () {
    if ($(this).is(':checked')) {
        $('.inputItemDescription').show();
        $("#invItem-Details").val("on");
    } else {
        $('.inputItemDescription').hide().val('');
        $("#invItem-Details").val("");
    }
});

$('#invItemHSN').on('change', function () {
    if ($(this).is(':checked')) {
        $('.itemHSN').show();
        $("#invItem-hsn").val("on");
    } else {
        $('.itemHSN').hide();
        $('.inputHSN').val('');
        $("#invItem-hsn").val("");
    }
    itemDescriptionColspan()
});

function itemDescriptionColspan() {
    var colspan = $("#colspan").val();
    if ($("#invItemHSN").is(':checked')) {
        colspan = parseInt(colspan) + 1;
    }
    if ($("#invItemDiscount").is(':checked')) {
        colspan = parseInt(colspan) + 2;
    }
    if ($("#invItemTax").is(':checked')) {
        colspan = parseInt(colspan) + 1;
    }
    $(".inputItemDescription").parent().attr("colspan", colspan)
}

$('#invOtherDiscount').on('change', function () {
    if ($(this).is(':checked')) {
        $('.otherDiscount').show();
        $("#inv-other-discount").val("on");
    } else {
        $('.otherDiscount').hide();
        $("#inputOtherDiscount").val(getDecimalNumberFormat(zero)).trigger('keyup');
        $("#inv-other-discount").val("");
    }
    $('.inputPrice').trigger('keyup');
});

$('#invShipping').on('change', function () {
    if ($(this).is(':checked')) {
        $('.shippingAmount').show();
        $("#inv-shipping").val("on");
    } else {
        $('.shippingAmount').hide();
        $('#inputShipping').val(getDecimalNumberFormat(zero)).trigger('keyup');
        $("#inv-shipping").val("");
    }
    $('.inputPrice').trigger('keyup');
});

$('#invCustomAmount').on('change', function () {
    if ($(this).is(':checked')) {
        $('.customAmount').show();
        $("#inv-custom-amount").val("on");
    } else {
        $('.customAmount').hide();
        $('#invoiceForm label.error').hide();
        $('#inputCustomAmount').val(getDecimalNumberFormat(zero)).trigger('keyup');
        $('#customAmountDescription').val('');
        $("#inv-custom-amount").val("");
        $('#customAmountDescription-error').text("");
        $('#inputCustomAmount-error').text("");
    }
    $('.inputPrice').trigger('keyup');
});

$('#inv-currency').on('change', function () {
    var defaultCurrencySymbol = $('option:selected', this).attr('data-symbol');
    $('.currencySymbol').text(defaultCurrencySymbol);
});

$('#discount-on').on('change', function () {
    $("#discount_on").val($("#discount-on").val());
    $('.inputPrice').trigger('keyup');
});

$('#tax-type').on('change',function(){
   $("#tax_type").val($("#tax-type").val());
   $('.inputPrice').trigger('keyup');
});

$(document).on('change', '.inputQty', function () {
    var total = validateNumbers($(this).val()) * validateNumbers($(this).parent().parent().find('.inputPrice').val());
    if (isNaN(total)) total = 0;
    $(this).parent().parent().find('.indivisualTotal').text(decimalNumberFormatWithCurrency(total));
    $(".inputPrice").trigger("keyup");
});

$(document).on('keyup', '.inputPrice', function () {
    var total = validateNumbers($(this).val()) * validateNumbers($(this).parent().parent().find('.inputQty').val());
    if (isNaN(total)) total = 0;
    $(this).parent().parent().find('.indivisualTotal').text(decimalNumberFormatWithCurrency(total));
    $.each($(".inputPrice"), function () {
        calculateHiddenDiscount($(this));
        calculateHiddenTax($(this));
    })
    generateAllTotal();
    generateOtherDiscount();
});

var prevDiscountAmount = 0;

$(document).on('focus', '.inputDiscount', function () {
    prevDiscountAmount = $(this).val();
    if (prevDiscountAmount == "") {
        prevDiscountAmount = getDecimalNumberFormat(0);
    }
});

$(document).on('change', '.inputDiscount', function () {
    var isValidated = true;
    var discountType = $(this).parent().next().children().eq(1).val();
    var discountAmount = parseFloat(validateNumbers($(this).val()));
    var totalAmount = $(this).parent().siblings('.itemAmount').text();
    if (discountType == "%" && discountAmount > 100) {
        isValidated = false;
        swal(jsLang("Discount amount can not be more than 100%"), {
            icon: "error"
        });
    } else if (discountType == "$") {
        if (parseFloat(discountAmount) > parseFloat(validateNumbers(totalAmount))) {
            isValidated = false;
            swal(jsLang("Discount amount can not be more than") + totalAmount, {
                icon: "error"
            });
        }
    }
    if (!isValidated) {
        prevDiscountAmount = getDecimalNumberFormat(validateNumbers(0));
        $(this).val(prevDiscountAmount);
    }
    calculateHiddenDiscount($(this));
    calculateHiddenTax($(this));
    generateAllTotal();
});

$(document).on('change', '.inputDiscountType', function () {
    var isValidated = true;
    var discountType = $(this).val();
    var discountAmount = parseFloat(validateNumbers($('.inputDiscount').val()));
    var totalAmount = $('.inputDiscount').parent().siblings().eq(6).text();
    if (discountType == "%" && discountAmount > 100) {
        isValidated = false;
        swal("Discount amount can't be more than 100%", {
            icon: "error"
        });
    } else if (discountType == "$") {
        if (parseFloat(discountAmount) > parseFloat(validateNumbers(totalAmount))) {
            isValidated = false;
            swal("Discount amount can't be more than "+totalAmount, {
                icon: "error"
            });
        }
    }
    if (!isValidated) {
        prevDiscountAmount = getDecimalNumberFormat(validateNumbers(0));
        $('.inputDiscount').val(prevDiscountAmount);
    }

    $(this).parent().parent().find('.inputTax').trigger("change");
});

$(document).on('change', '.inputTax', function () {
    $(".inputPrice").trigger("keyup");
    if ($('#inv-type option:selected').val() == "quantity" && $('.indivisualTax').val() == 0) {
        $('.filter-option-inner-inner').text(jsLang('Nothing Selected'))
    }
});

let prevOtherDiscountAmount = 0;

$(document).on('change', '#otherDiscountType', function () {
    if ($(this).val() == "%") {
        prevOtherDiscountAmount = 100;
    } else {
        var totalAmount = $("#subTotal").text();
        prevOtherDiscountAmount = getDecimalNumberFormat(validateNumbers(totalAmount));
    }
    $('#inputOtherDiscount').trigger("change");
});

$('#inputOtherDiscount').on('change', function () {
    var isOtherDiscountValidated = true;
    var otherDiscountType = $('#otherDiscountType').val();
    var otherDiscountAmount = parseFloat(validateNumbers($("#inputOtherDiscount").val()));
    if (otherDiscountType == "%" && otherDiscountAmount > 100) {
        isOtherDiscountValidated = false;
        swal("Discount amount can't be more than 100%", {
            icon: "error"
        });
    } else if (otherDiscountType == "$") {
        var totalBill =  $("#subTotal").text();
        if (otherDiscountAmount > parseFloat(validateNumbers(totalBill))) {
            isOtherDiscountValidated = false;
            swal("Discount amount can't be more than "+totalBill, {
                icon: "error"
            });
        }
    }
    if (!isOtherDiscountValidated) {
        if (prevOtherDiscountAmount > parseFloat(validateNumbers($("#subTotal").text()))) {
            prevOtherDiscountAmount = parseFloat(validateNumbers($("#subTotal").text()));
        }
        $(this).val(prevOtherDiscountAmount);
    } else {
        prevOtherDiscountAmount = $(this).val();
    }
    $(".inputPrice").trigger("keyup");
});

$('#inputShipping').on('keyup', function () {
    var shippingAmount = $(this).val() == '' ? 0 : validateNumbers($(this).val());
    $('#shippingTotal').text(decimalNumberFormatWithCurrency(shippingAmount));
    $('.inputPrice').trigger('keyup');
});

$('#inputCustomAmount').on('keyup', function () {
    var customAmountTotalTemp = $(this).val() == '' ? 0 : validateNumbers($(this).val());
    $('#customAmountTotal').text(decimalNumberFormatWithCurrency(customAmountTotalTemp));
    $('.inputPrice').trigger('keyup');
})


//close or delete row
$(document).on('click', '.closeRow', function () {
    var isDeletable = $(this).attr('data-deletable');
    if(isDeletable == "false") {
        var message = $(this).attr('data-alert');
        swal(message, {
            icon: "error",
        });
    } else {
        var currentRowNo = $(this).attr('data-row-id');
        var itemId = $('.rowNo-'+ currentRowNo).attr('id');
        if (itemId) {
            var itemIdArray=itemId.split("-");
            var currentId=itemIdArray[1];
            var idIndex = stack.indexOf(parseInt(currentId));
           delete(idIndex, 1);
        }
        var totalRow = $('.closeRow').length;
        $('#rowId-' + currentRowNo).remove();
        generateAllTotal();
        generateOtherDiscount();
        /*
        Don't remove untill you're sure
        need to test more
        */

        if ($(".itemRow").length < 1) {
            $(".taxRow").css('display', 'none');
        }
        $('.inputPrice').trigger('keyup');
        $('.inputTax').trigger('change');
        generateSortingNumber();
        if ($(".custom-item").length < 1) {
            if ($("#inv-type").val() == 'hours') {
                $(".addRow").text(jsLang("Add custom service"));
            }  else {
                $(".addRow").text(jsLang("Add custom item"));
            }
        }
    }
});

function checkBlank() {
    var rflag = false;
    $.each($('.custom-item'), function (index, value) {
        if ($(value).val() == "") {
            $(value).focus();
            rflag = true;
        }
    });
    return rflag;
}

function addNewRow() {
    var nums = [];
    var rowNo = -1;
    if ($('.itemRow').length > 0) {
        $(".itemRow").each( function() {
          nums.push( $(this).attr('data-row-no') );
        });
        rowNo = Math.max.apply(Math, nums);
    }
    rowNo++;
    var taxes = window.taxes;
    var taxOptions = '';
    var taxStart = '<select id="itemtaxrow-'+rowNo+'" name="custom_item_tax[' + rowNo + '][]" class="inputTax form-control bootstrap-select selectpicker" multiple>';
    var taxEnd = '</select>';
    var taxHiddenField = '';
    $.each(taxes, function (index, x) {
        taxHiddenField += "<input type='hidden' class='itemTaxAmount itemTaxAmount-" + x.id + "'>";
        taxOptions += "<option title='" + getDecimalNumberFormat(x.tax_rate) + "%' value='" + x.id + "' taxrate='" + getDecimalNumberFormat(x.tax_rate) + "'>" + x.name + "(" + getDecimalNumberFormat(x.tax_rate) + ")</option>";
    });
    var taxSelect = taxStart + taxOptions + taxEnd + taxHiddenField;
    //noinspection JSAnnotator
    var html = window.rowHtml = `<tbody id="rowId-${rowNo}">
            <tr class="itemRow rowNo-${rowNo}" data-row-no="${rowNo}">
            <input type="hidden" name="row_no[]" value="${rowNo}">
            <input type="hidden" class="sorting_no" name="custom_sorting_no[]" value="${rowNo}">
                <td class="pl-1"><input id="item_name_${rowNo}" name="custom_item_name[]" placeholder="Item Name" type="text" class="inputDescription form-control custom-item"></td>
                <td class="itemHSN"><input name="custom_item_hsn[]" class="inputHSN form-control text-center" type="text" placeholder="HSN"></td>
                <td class="itemQty"><input name="custom_item_qty[]" id="custom_item_qty_${rowNo}" class="inputQty form-control text-center positive-float-number" type="text" value="1"></td>
                <td class="itemPrice"><input id="item_price_${rowNo}" name="custom_item_price[]" class="inputPrice form-control text-center positive-float-number" type="text" value="0"></td>
                <td class="itemDiscount"><input name="custom_item_discount[]" id="custom_item_discount_${rowNo}" class="inputDiscount form-control text-center positive-float-number" type="text" placeholder="0.00">
                </td>
                <td class="itemDiscount">
                    <input type="hidden" class="indivisualDiscount" value="0">
                    <select name="custom_item_discount_type[]" class="inputDiscountType form-control js-example-basic-single2">
                        <option value="%">&nbsp;% &nbsp;</option>
                        <option value="$">Flat</option>
                    </select>
                </td>

                <td class="itemTax"><input type="hidden" class="indivisualTax" value="0">${taxSelect}</td>
                <td class="itemAmount"><span class="currencySymbol"></span><span class="indivisualTotal">0</span>
                </td>
                <td class="text-center"><button type="button" class="closeRow btn btn-xs btn-danger" data-row-id="${rowNo}"><i class="feather icon-trash-2"></i></button></td>
            </tr>
            <tr>
                <td colspan="4" class="des-col">
                    <textarea name="custom_item_description[]" placeholder="Item Description" class="inputItemDescription form-control"></textarea>
                </td>
              <td colspan="3" class="des-col"></td>
            </tr>
            </tbody>`;
    $(".addRowContainer").attr("id", rowNo);
    $(".addRow").attr("data-row-no", rowNo);
    $("#product-table").append(html);
    triggerSomeChanges();
    resetEverythingExcept();
    onChangeInvType();
    generateSortingNumber();
    $(".js-example-basic-single2").select2();
}

function onChangeInvType() {
    $('.itemQty').show();
    var invoiceType = $('#inv-type').val();
    if (invoiceType == "hours") {
        $('.hourTh').show();
        $('.hourPriceTh').show();
        $('.searchItemTh').text(jsLang('Service'));
        $('.itemName').text(jsLang('Services'));
        $('.addRow').text(jsLang('Add custom service'));
    } else if (invoiceType == "amount") {
        $('.itemQty').hide();
        $('.itemAmount').hide();
        $('.itemPrice').show();
        $('.amountTh').show();
    } else {
        $('.qtyTh').show();
        $('.qtyPriceTh').show();
        $('.searchItemTh').text(jsLang('Item'));
        $('.itemName').text(jsLang('Items'));
        $('.addRow').text(jsLang('Add custom item'));
    }
    $('.inputPrice').trigger('keyup');
}

function resetEverything() {
    $('.itemQty').hide();
    $('.qtyTh').hide();
    $('.hourTh').hide();
    $('.itemDiscount').hide();
    $('.itemTax').hide();
    $('.qtyPriceTh').hide();
    $('.hourPriceTh').hide();
    $('.amountTh').hide();
    $('.itemAmount').show();
}
function resetEverythingExcept() {
    $('.itemQty').hide();
    $('.qtyTh').hide();
    $('.hourTh').hide();
    $('.qtyPriceTh').hide();
    $('.hourPriceTh').hide();
    $('.amountTh').hide();
    $('.itemAmount').show();
}

function triggerAllChanges() {
    $('#inv-type').trigger('change');
    $('#invItemTax').trigger('change');
    $('#invItemDiscount').trigger('change');
    $('#invItemDetails').trigger('change');
    $('#invItemHSN').trigger('change');
    $('#invOtherDiscount').trigger('change');
    $('#invShipping').trigger('change');
    $('#invCustomAmount').trigger('change');
    $('#inv-currency').trigger('change');
    $('#inputOtherDiscount').trigger('change');
    $('#inputShipping').trigger('keyup');
    $('#inputCustomAmount').trigger('keyup');
    onChangeInvType();
}

function triggerSomeChanges() {
    $('#invItemTax').trigger('change');
    $('#invItemDiscount').trigger('change');
    $('#invItemDetails').trigger('change');
    $('#invItemHSN').trigger('change');
    $('#invOtherDiscount').trigger('change');
    $('#invShipping').trigger('change');
    $('#invCustomAmount').trigger('change');
    $('#inv-currency').trigger('change');
    $('#inputOtherDiscount').trigger('change');

}

function resetCurrencySymbol() {
    $('#subTotal').text(decimalNumberFormatWithCurrency(0));
    $('#taxTotal').text(decimalNumberFormatWithCurrency(0));
    $('#itemDiscountTotal').text(decimalNumberFormatWithCurrency(0));
    $('#otherDiscountTotal').text(decimalNumberFormatWithCurrency(0));
    $('#shippingTotal').text(decimalNumberFormatWithCurrency(0));
    $('#customAmountTotal').text(decimalNumberFormatWithCurrency(0));
    $('#grandTotal').text(decimalNumberFormatWithCurrency(0));
}

function calculateTotalQuantity() {
    var totalQty = 0;
    $('.inputQty').each(function (index, value) {
        totalQty += parseFloat(validateNumbers($(value).val()));
    });
    return totalQty;
}

function calculateTotalPrice() {
    var totalPrice = 0;
    $('.inputPrice').each(function (index, value) {
        var tempQty = parseFloat(validateNumbers($(this).parent().parent().find(".inputQty").val()));
        var tempDisc = parseFloat(validateNumbers($(this).parent().parent().find(".inputDiscount").val()));
        var tempDiscountType = $(this).parent().parent().find(".inputDiscountType").val();
        var tempDiscount = 0;
        var asdf = $("#invItem-Discount").val();
        if ($("#invItem-Discount").val() == "on") {
            if (tempDiscountType == "$") {
                tempDiscount = tempDisc;
            } else {
                tempDiscount = tempQty * parseFloat(validateNumbers(value.value)) * tempDisc / 100;
            }
        }
        totalPrice += (tempQty * parseFloat(validateNumbers(value.value))) - tempDiscount;
    });
    $("#indivisual-discount-price").val(totalPrice);
    return totalPrice;
}

function calculateIndivisualTotalTax() {
    var totalTax = 0;
    $('.itemTaxAmount').each(function (index, value) {
        totalTax += parseFloat(validateNumbers($(value).val()));
    });
    if (isNaN(totalTax)) totalTax = 0;
    return totalTax;
}

function calculateIndivisualTotalAmount() {
    var totalAmount = 0;
    $('.indivisualTotal').each(function (index, value) {
        var indAmount = $(value).text();
        indAmount = validateNumbers($(value).text());
        totalAmount += parseFloat(validateNumbers($(value).text()));
    });
    if (isNaN(totalAmount)) totalAmount = 0;
    return totalAmount;
}

function calculateIndivisualTotalDiscount() {
    var totalDiscount = 0;
    $('.indivisualDiscount').each(function (index, value) {
        totalDiscount += parseFloat(validateNumbers($(value).val()));
    });
    if (isNaN(totalDiscount)) totalDiscount = 0;
    return totalDiscount;
}

function calculateHiddenDiscount(obj) {
    var discountType = obj.parent().parent().find('.inputDiscountType').val();
    var discount = validateNumbers(obj.parent().parent().find('.inputDiscount').val());
    if(isNaN(discount) || discount == "") {
        discount = 0;
    }
    var total = validateNumbers(obj.parent().parent().find('.inputQty').val()) * validateNumbers(obj.parent().parent().find('.inputPrice').val());
    var discountOn = $('#discount-on');
    var itemDiscount = $('#invItemDiscount');
    if (itemDiscount.is(":checked")) {
        if (discountType == "%") {
            discount = total * discount / 100;
        }
    }
    obj.parent().parent().find('.indivisualDiscount').val(getDecimalNumberFormat(discount));
}

function calculateHiddenTax(obj) {
    var taxPercent = 0;
    var total = validateNumbers(obj.parent().parent().find('.inputQty').val()) * validateNumbers(obj.parent().parent().find('.inputPrice').val());
    var discountType = obj.parent().parent().find(".inputDiscountType").val();
    var discountAmount = parseFloat(validateNumbers(obj.parent().parent().find(".inputDiscount").val()));
    var discountPrice = calculateTotalPrice();

    if(isNaN(discountAmount) || discountAmount == "") {
        discountAmount = 0;
    }
    obj.parent().parent().find('.inputTax option').each(function () {
        obj.parent().parent().parent().find('.itemTaxAmount-' + $(this).val()).val('');
    });

    //new add
    obj.parent().parent().find('.inputTax :selected').each(function () {
        taxPercent += parseFloat(validateNumbers($(this).attr('taxrate')));
    });

    //tax type check
    var calculatedTax = 0;
    var indDiscount = 0;
    if (discountType == "$") {
        indDiscount = discountAmount;
    } else {
        indDiscount = total * discountAmount / 100;
    }

    var otherDiscountType = $('#otherDiscountType').val();
    var otherDiscount = validateNumbers($('#inputOtherDiscount').val());
    if (isNaN(otherDiscount) || otherDiscount == "") {
        var indOtherDiscount = 0;
    } else {
        if (otherDiscountType == "$") {
            var indOtherDiscount = otherDiscount * (total - indDiscount) / discountPrice;
        } else {
            var indOtherDiscount = (total - indDiscount) * otherDiscount / 100;
        }
    }

    if ($("#discount_on").val() == "after") {
        var tempTotal = total - indDiscount - indOtherDiscount;
        if ($('#tax-type').val() == 'exclusive') {
            calculatedTax = tempTotal * taxPercent / 100;
        } else  if ($('#tax-type').val() == 'inclusive') {
            calculatedTax = tempTotal - (tempTotal / ((taxPercent / 100) + 1));
        }
    } else if ($("#discount_on").val() == "before") {
        if ($('#tax-type').val() == 'exclusive') {
            calculatedTax = total * taxPercent / 100;
        } else if ($('#tax-type').val() == 'inclusive') {
            calculatedTax = total - ( total / ((taxPercent / 100) + 1));
        }
    }
    if (isNaN(calculatedTax)) calculatedTax = 0;
    obj.parent().parent().find('.indivisualTax').val(getDecimalNumberFormat(calculatedTax));

    //test
    obj.parent().parent().find('.inputTax :selected').each(function () {
        if ($("#discount_on").val() == "after") {
            var tempTotal = total - indDiscount - indOtherDiscount;
            if ($('#tax-type').val() == 'exclusive') {
                var itemTaxAmount = tempTotal * parseFloat(validateNumbers($(this).attr('taxrate'))) / 100;
            } else if ($('#tax-type').val() == 'inclusive') {
                var itemTaxAmount = tempTotal - (tempTotal / ((parseFloat(validateNumbers($(this).attr('taxrate'))) / 100) + 1));
            }
        } else if ($("#discount_on").val() == "before") {
            if ($('#tax-type').val() == 'exclusive') {
                var itemTaxAmount = (total * parseFloat(validateNumbers($(this).attr('taxrate')))) / 100;
            } else if ($('#tax-type').val() == 'inclusive') {
                var itemTaxAmount = total - ( total / ((parseFloat(validateNumbers($(this).attr('taxrate'))) / 100) + 1));
            }
        }
        obj.parent().parent().parent().find('.itemTaxAmount-' + $(this).val()).val(getDecimalNumberFormat(itemTaxAmount));
    });
}

function generateSeparatedTaxAmount() {
    $.each(window.taxes, function (index, tax) {
        var totalTax = 0;
        $.each($('.itemTaxAmount-' + tax.id), function (i, row) {
            var value = validateNumbers($(this).val()) == '' ? 0 : $(this).val();
            totalTax += parseFloat(validateNumbers(value));
        });
        $("#taxTotalValue-" + tax.id).text(decimalNumberFormatWithCurrency(totalTax));
    });
}

function generateSortingNumber(){
    $.each($('.sorting_no'),function(index,value){
        $(this).val(++index);
    });
}

function generateOtherDiscount() {
    var discountType = $('#otherDiscountType').val();
    var discount = validateNumbers($('#inputOtherDiscount').val());
    if (isNaN(discount) || discount == "") {
        discount = 0;
    }
    var totalDiscount = 0;
    $.each($(".indivisualDiscount"), function (index, value) {
        totalDiscount += parseFloat(validateNumbers(value.value));
    })
    var total    = parseFloat(validateNumbers($('#subTotal').text()));
    if (discountType == "$") {
        var calculatedDiscount = discount;
    } else {
        var calculatedDiscount = (total - totalDiscount) * discount / 100;
    }
    if (calculatedDiscount == '') calculatedDiscount = 0;
    $('#otherDiscountTotal').text(decimalNumberFormatWithCurrency(calculatedDiscount));
}

function generateAllTotal() {
    generateOtherDiscount();
    var amount = calculateIndivisualTotalAmount();
    var tax = calculateIndivisualTotalTax();
    var itemDiscount = calculateIndivisualTotalDiscount();
    var otherDiscountTotal = parseFloat(validateNumbers($('#otherDiscountTotal').text()));
    var shippingTotal = parseFloat(validateNumbers($('#shippingTotal').text()));
    var customAmountTotal = parseFloat(validateNumbers($('#customAmountTotal').text()));
    generateSeparatedTaxAmount();
    $('#subTotal').text(decimalNumberFormatWithCurrency(amount));
    $('#taxTotal').text(decimalNumberFormatWithCurrency(tax));
    $('#itemDiscountTotal').text(decimalNumberFormatWithCurrency(itemDiscount));
    if($('#tax-type').val() == 'exclusive'){
        var grandTotal = (amount + tax - itemDiscount - otherDiscountTotal + shippingTotal + customAmountTotal);
        $('#grandTotal').text(decimalNumberFormatWithCurrency(parseFloat(grandTotal)));
        $('#grandTotalInput').val(decimalNumberFormatWithCurrency(parseFloat(grandTotal)));
        $('#totalValue').val(getDecimalNumberFormat(parseFloat(grandTotal)));
    } else {
        var grandTotal = (amount - itemDiscount - otherDiscountTotal + shippingTotal + customAmountTotal);
        $('#grandTotal').text(decimalNumberFormatWithCurrency(parseFloat(grandTotal)));
        $('#grandTotalInput').val(decimalNumberFormatWithCurrency(parseFloat(grandTotal)));
        $('#totalValue').val(getDecimalNumberFormat(parseFloat(grandTotal)));
    }
    $('.selectpicker').selectpicker();
}

function setModalFieldsValue() {
    $("#discount_on").val($("#discount-on").val());
    $("#tax_type").val($("#tax-type").val());
    $("#sales_type").val($("#sales_type_id").val());
    isChecked("#invItemTax", "#invItem-Tax");
    isChecked("#invItemDetails", "#invItem-Details");
    isChecked("#invItemDiscount", "#invItem-Discount");
    isChecked("#invItemHSN", "#invItem-hsn");
    isChecked("#invOtherDiscount", "#inv-other-discount");
    isChecked("#invShipping", "#inv-shipping");
    isChecked("#invCustomAmount", "#inv-custom-amount");
}

function isChecked(checkField, setField) {
    if ($(checkField).is(":checked")) {
        $(setField).val("on");
    } else {
        $(setField).val("");
    }
}
