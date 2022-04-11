'use strict';
$(".error").hide();
// Stock transfer add js here
if ($('.main-body .page-wrapper').find('#stock-transfer-add').length) {

    var count_rows;
    var stack = [];
    $(".js-example-basic-single").select2();

    $("#transferTbl").DataTable({
        "paging": false,
        "searching": false,
        "bInfo": false,
        "ordering": false,
        "language": {
            "url": app_locale_url
        },
    });

    $(document).on('click', function (e) {
        if (e.target.id === 'no_div') {
            $('#no_div').hide(); 
        } else {
            $('#no_div').hide();
        }
    });

    $('#datepicker').daterangepicker(dateSingleConfig(), function(start, end){
        $('#datepicker').val(moment(start, 'MMMM D, YYYY').format(dateFormat.toUpperCase()));
    });
    
    function in_array(search, array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == search) {
                return true;
            }
        }
        return false;
    }


    // Item form validation
    $('#transferForm').validate({
        rules: {
            source: {
                required: true
            },
            destination: {
                required: true
            },
            transfer_date: {
                required: true
            },
            'quantity[]': {
                required: true,
            }
        },
        messages: {
            'quantity[]': {
                required: "",
            }
        },
        // Checking if any item has been added before submit adn showing error
        submitHandler: function () {
            var destination = $('#destination').val();
            if (destination.trim() == "") {
                $('#destination-error').show();
            }
            var source = $('#source').val();
            if (source.trim() == "") {
                $('#source-error').show();
            }
            var x = document.getElementsByClassName("addedRow");
            if (x.length == 0) {
                swal({
                    text: jsLang('Please select at least one item to transfer'),
                    icon: "error",
                    buttons: [false, jsLang('Ok')],
                    dangerMode: true,
                });
                return false;
            }
            return true;
        }
    });

    $(document).on('click', '#btnSubmit', function () {
        $("input[type=text]").each(function () {
            if ($(this).hasClass('error')) {
                $(this).focus();
                return false;
            }
        });
    });

    /**
     * Calcualte Total Qty 
     *@return Total
    */
    function calculateTotalQty() {
        var total = 0;
        $('.no_units').each(function () {
            total += parseFloat($(this).val() ? validateNumbers($(this).val()) : 0);
        });
        if (total == 0) {
            $('#btnSubmit').attr('disabled', 'true');
        } else if (total > 0) {
            $('#btnSubmit').removeAttr('disabled');
        }
        return total;
    }

    $(window).keydown(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });

    // Delete item row
    $('#transferTbl').on('click', '.delete_item', function () {
        var v = $(this).attr("id");
        stack = jQuery.grep(stack, function (value) {
            return value != v;
        });

        $(this).closest("tr").remove();
        var totalQty = calculateTotalQty();
        $('#total_qty').text(getDecimalNumberFormat(totalQty));

        // enable and disable submit btn
        count_rows = $(".insufficient").length;
        if (count_rows == 0) {
            $("#errorMessage").hide();
        }
    });

   

    let preQuantity = 0;
    $(document).on("keydown", ".no_units", function (e) {
        preQuantity = $(this).val();
    });

    $("#search").autocomplete({
        delay: 500,
        position: { my: "left top", at: "left bottom", collision: "flip" },
        source: function (request, response) {
            var source_id = $('#source').val();
            var destination_id = $('#destination').val();
            if (!source_id) {
                $('#error_message').html(jsLang("Please select Source and Destination"));
                $("#source").select2('open');
                $('html, body').animate({
                    scrollTop: 0
                }, 500);
                return false;
            } else {
                $('#error_message').html('');
            }
            if (source_id && !destination_id) {
                $('#error_message').html(jsLang("Please select Destination"));
                $('#destination').select2('open');
                return false;
            }
            $.ajax({
                url: SITE_URL + '/stock_transfer/search',
                type: "post",
                dataType: "json",
                data: {
                    _token: token,
                    search: request.term,
                    location: source_id
                },
                success: function (data) {
                    //Start
                    if (data.status_no == 1) {
                        $('#error_message').html('');
                        $("#val_item").html();
                        var data = data.items;
                        $('#no_div').css('display', 'none');
                        response($.map(data, function (item) {
                            return {
                                id: item.id,
                                value: item.name,
                                available: item.available,
                                is_stock_managed: item.is_stock_managed,
                            }
                        }));
                    } else {
                        $('.ui-menu-item').remove();
                        $("#no_div").css('display', 'block');
                    }
                }
            })
        },

        select: function (event, ui) {
            var e = ui.item;
            if (e.id) {
                if (e.is_stock_managed == 1 && e.available <= 0) {
                    swal(e.available + jsLang(' item(s) available in stock'), {
                        icon: "error",
                        buttons: [false, jsLang('Ok')],
                    });
                    return false;
                }
                if (!in_array(e.id, stack)) {
                    var new_row2 = '<tr class="addedRow" id="rowid' + e.id + '">' +
                        '<td class="text-center">' + e.value + '<input type="hidden" name="description[]" value="' + e.value + '"><input type="hidden" name="stock[]" value="' + e.id + '"></td>' +
                        '<td><input class="form-control text-center no_units m-b-5 positive-float-number" stock-id="' + e.id + '" id="qty_' + e.id + '" data-id="' + e.id + '" type="text" required name="quantity[]" value="1">' +

                        '<label id="qty_' + e.id + '-error" class="error labelMinMax" for="qty_' + e.id + '"></label>' +

                        '<div class="availableStock color_red f-bold" id="errorMessage-' + e.id + '"' + '></div>' + '<input type="hidden" name="id[]" value="' + e.id + '"></td>' +
                        '<td class="text-center"><button id="' + e.id + '" class="btn btn-xs btn-danger delete_item"><i class="feather icon-trash-2"></i></button></td>' +
                        '</tr>';
                    if (stack.length <= 0) {
                        $(".dataTables_empty").parent().remove();
                    }
                    $("#item-body").append(new_row2);
                    stack.push(e.id);
                } else {
                    $('#qty_' + e.id).val(function (i, oldval) {
                        oldval = validateNumbers(oldval);
                        if (parseFloat(e.available) < parseFloat(oldval) + 1) {
                            swal(e.available + jsLang(' item(s) available in stock'), {
                                icon: "error",
                                buttons: [false, jsLang('Ok')],
                            });
                            return (getDecimalNumberFormat(oldval))
                        } else if (Number.isInteger(parseFloat(oldval))) {
                            $('#qty_' + e.id).trigger("change");
                            return parseFloat(++oldval);
                        } else {
                            $('#qty_' + e.id).trigger("change");
                            return getDecimalNumberFormat(++oldval);
                        }
                    });
                }
                $(this).val('');
                // Check item Quantity
                $.ajax({
                    method: "POST",
                    url: SITE_URL + "/stock_transfer/check-item-qty",
                    data: { "item_id": e.id, "_token": token, source: $('#source').val() }
                })
                    .done(function (data) {
                        var data = JSON.parse(data);
                        $("#qty_" + data.item_id).attr("data-max", data.qty);
                        var addedQty = $("#qty_" + e.id).val();
                        if (addedQty > data.qty) {
                            $("#qty_" + e.id).val(addedQty);
                            $("#qty_" + e.id).attr("data-max", data.qty);
                            $('#qty_' + e.id).trigger("input");
                            $("#errorMessage").html(data.message);
                            var totalQty = calculateTotalQty();
                            $('#total_qty').text(getDecimalNumberFormat(totalQty));
                        }
                    });
                // End ehcking quantity
                var totalQty = calculateTotalQty();
                $('#total_qty').text(getDecimalNumberFormat(totalQty));
                return false;
            }
        },
        minLength: 1,
        autoFocus: true
    }).on('focus', function () { $(this).autocomplete("search"); })
        .autocomplete("instance")._renderItem = function (ul, item) {
            var available;
            if (item.is_stock_managed == 1) {
                available = item.available;
            } else {
                available = "-";
            }
            return $("<li>")
                .append("<div>" + item.value + "<br>Available: " + available + "</div>")
                .appendTo(ul);
        };

    // calculate amount with item quantity
    $(document).on('keyup change input', '.no_units', function (ev) {
        var stock_id = $(this).attr("stock-id");
        var qty = parseFloat(validateNumbers($(this).val()));
        var old_qty = parseFloat($(this).attr("old-qty"));
        var token = $("#token").val();
        var source = $("#source").val();
        var id = $(this).attr("data-id");
        // check item quantity in store location
        var value = $("#qty_" + id).val();
        var regex_cell = /^\.|[^\d\.]/g;
        var new_value = value.replace(regex_cell, '');

        if (new_value == '') {
            $("#qty_" + id).val("");
        }
        $.ajax({
            method: "POST",
            url: SITE_URL + "/stock_transfer/check-item-qty",
            data: { "item_id": id, "source": source, "_token": token }
        })
            .done(function (data) {
                var data = JSON.parse(data);
                if (qty < 0) {
                    $("#qty_" + id).val('');
                    $("#errorMessage-" + id).html('');
                }
                if (typeof old_qty == "undefined" || old_qty == null || isNaN(old_qty)) {
                    old_qty = 0;
                    if (qty > data.qty) {
                        $("#qty_" + id).attr("data-max", Number(old_qty) + Number(data.qty));
                        var maxQty = $("#qty_" + id).attr("data-max");
                        if (Number(qty) > Number(maxQty)) {
                            $("#qty_" + id).val(preQuantity);
                            swal(data.qty + jsLang(' item(s) available in stock'), {
                                icon: "error",
                            });
                            $("#qty_" + id).val(preQuantity);
                            totalQty = calculateTotalQty();
                            $('#total_qty').text(getDecimalNumberFormat(totalQty));
                            return getDecimalNumberFormat(preQuantity);
                        }
                        var totalQty = calculateTotalQty();
                        $('#total_qty').text(getDecimalNumberFormat(totalQty));
                        $("#errorMessage-" + id).html(data.message);
                    } else {
                        $("#errorMessage-" + id).html('');
                    }
                } else {
                    if (Number(data.qty) >= (Number(qty) - Number(old_qty))) {
                        $("#qty_" + id).val(qty);
                        $("#errorMessage-" + id).html('');
                    } else {
                        if (!isNaN($("#qty_" + id).val())) {
                            if ($("#qty_" + id).val() == "") {
                                $("#qty_" + id).val("");
                            } else {
                                $("#qty_" + id).val(old_qty);
                            }
                        } else {
                            $("#qty_" + id).val(1);
                        }
                        $("#errorMessage-" + id).html(data.message);
                    }
                    var totalQty = calculateTotalQty();
                    $('#total_qty').text(getDecimalNumberFormat(totalQty));
                }
            });
        var totalQty = calculateTotalQty();
        $('#total_qty').text(getDecimalNumberFormat(totalQty));
    });

     let global_source_id;
    $("#source").on("change", function () {
        stack = [];
        $('.error').hide();
        $("#errorMessage").text(' ');
        var source = $(this).val();
        if (source.trim() == "") {
            $('#source-error').show();
        } else {
            $('#source-error').hide();
        }
        var destination = $('#destination').val();
        if (global_source_id != null && $('#transferTbl tr').hasClass('addedRow') == true) {
            swal({
                title: jsLang('Are you sure'),
                text: jsLang('Change of location will reset added products/services, please confirm you really want to do this.'),
                icon: "warning",
                buttons: [jsLang('Cancel'), jsLang('Ok')],
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        $('.closeRow').trigger('click');
                        deleteAddedRows();
                        $('#total_qty').text('0');
                        if (global_source_id != "") {
                            $("#source-error").css("display", 'none');
                        }
                        $.ajax({
                            method: "POST",
                            url: SITE_URL + "/stock_transfer/get-destination",
                            data: { "source": source, "_token": token }
                        })
                            .done(function (data) {
                                var data = JSON.parse(data);
                                if (data.status_no == 1) {
                                    $("#destination").html(data.destination);
                                    $("#destination").select2('open');
                                }
                            });
                    } else {
                        $("#source").val(global_source_id);
                        $("#source").trigger('change.select2');
                    }
                });
        } else {
            global_source_id = $("#source").val();
            $.ajax({
                method: "POST",
                url: SITE_URL + "/stock_transfer/get-destination",
                data: { "source": source, "_token": token }
            })
                .done(function (data) {
                    var data = JSON.parse(data);
                    if (data.status_no == 1) {
                        $("#destination").html(data.destination);
                        $("#destination").select2('open');
                    }
                });
        }
    });

    $("#destination").on("change", function () {
        var destination = $('#destination').val();
        var source = $('#source').val();
        if (destination.trim() == "") {
            $('#destination-error').show();
        }
        if (source && destination) {
            $('#error_message').html('');
            if ($('#search').val() != '') {
                $('#search').trigger("focus");
            }
            $('#destination-error').hide();
        }
    });

    function deleteAddedRows() {
        $('.addedRow').each(function () {
            $(this).closest("tr").remove();
        });
    }

    jQuery.extend(jQuery.validator.messages, {
        number: jQuery.validator.format(""),
    });

    $(document).on('click', '.no_units', function (e) {
        $('.labelMinMax').css('display', 'none');
    });

    $(document).on('click', function (event) {
        $('.labelMinMax').css('display', 'none');
        $('.labelMinMax').css('position', 'fixed');
    });

    $('#btnSubmit').on('click', function () {
        if ($("form#transferForm").valid() == true) {
            $('#btnSubmit').attr('disabled', 'disabled');
            $("form#transferForm").trigger('submit');
        }
    });
}

// Stock transfer details js here
if ($('.main-body .page-wrapper').find('#stock-transfer-details').length) {
    $("#transferTbl").DataTable({
        responsive: true,
        "language": {
            "url": app_locale_url
        },
        "paging": false,
        "searching": false,
        "bInfo": false,
        "ordering": false
    });
}

// Stock transfer list js here
if ($('.main-body .page-wrapper').find('#orderListFilter').length) {

    $(document).on("click", "#csv, #pdf", function (event) {
        event.preventDefault();
        window.location = SITE_URL + "/stock/transfer-" + this.id + "?to=" + $('#endto').val() + "&from=" + $('#startfrom').val() + "&source=" + $('#source').val() + "&destination=" + $('#destination').val();
    });

    // Source and Destination can not be same in filter
    let global_source_id;

    $("#source").on("change", function () {
        var stack = [];
        $('.error').hide();
        $("#errorMessage").text(' ');
        var source = $(this).val();
        if (source.trim() == "") {
            $('#source-error').show();
        } else {
            $('#source-error').hide();
        }
        var destination = $('#destination').val();
        if (global_source_id != null) {
            $.ajax({
                method: "POST",
                url: SITE_URL + "/stock_transfer/get-destination",
                data: { "source": source, "_token": token }
            })
                .done(function (data) {
                    var data = JSON.parse(data);
                    if (data.status_no == 1) {
                        $("#destination").html(data.destination);
                        $("#destination").select2('open');
                    }
                });
        } else {
            global_source_id = $("#source").val();
            $.ajax({
                method: "POST",
                url: SITE_URL + "/stock_transfer/get-destination",
                data: { "source": source, "_token": token }
            })
                .done(function (data) {
                    var data = JSON.parse(data);

                    if (data.status_no == 1) {
                        $("#destination").html(data.destination);
                        $("#destination").select2('open');
                    }
                });
        }
    });

    $("#destination").on("change", function () {
        var destination = $('#destination').val();
        var source = $('#source').val();
        if (destination.trim() == "") {
            $('#destination-error').show();
        }
        if (source && destination) {
            $('#error_message').html('');
            if ($('#search').val() != '') {
                $('#search').trigger("focus");
            }
            $('#destination-error').hide();
        }
    });
    $('#dataTableBuilder').addClass('stock-transfer-list');
}

// Stock transfer edit js here
if ($('.main-body .page-wrapper').find('#card-with-header-buttons').length) {
    let preQty = 0;
    var oldQuantity = 0;
    $(".js-example-basic-single").select2();
    $('select').prop('disabled', true);

    $("#transferTbl").DataTable({
        responsive: true,
        "language": {
            "url": app_locale_url
        },
        "paging": false,
        "searching": false,
        "bInfo": false,
        "ordering": false
    });

    $(document).on('click', function (e) {
        if (e.target.id === 'no_div') {
            $('#no_div').hide();
        } else {
            $('#no_div').hide();
        }
    });

    if (stack == 0) {
        $.ajax({
            url: SITE_URL + '/stock_transfer/delete',
            type: "post",
            dataType: "json",
            data: {
                '_token': token,
                'id': $('#transfer_id').val()
            },
            success: function (response) {
                window.location.replace(SITE_URL + "/stock_transfer/list");
            }
        });
    }

    $('#transferTbl').on('click', '.delete_item', function () {
        var v = $(this).attr("data-id");
        stack = jQuery.grep(stack, function (value) {
            return value != v;
        });
        stack.pop(v);
        $(this).closest("tr").remove();
        stack.splice($(this).attr("data-id"));
        var totalQty = calculateTotalQty();
        $('#total_qty').text(getDecimalNumberFormat(totalQty));
    });

    function in_array(search, array) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == search) { 
                return true; 
            }
        }
        return false;
    }

    $("#search").autocomplete({
        source: function (request, response) {
            var source_id = $('#source').val();
            $.ajax({
                url: SITE_URL + '/stock_transfer/search',
                type: "post",
                dataType: "json",
                data: {
                    _token: token,
                    transfer_id: info_id,
                    search: request.term,
                    location: source_id
                },
                success: function (data) {
                    //Start
                    if (data.status_no == 1) {
                        $("#val_item").html();
                        var data = data.items;
                        $('#no_div').css('display', 'none');
                        response($.map(data, function (item) {
                            return {
                                id: item.id,
                                value: item.name,
                                available: item.available,
                                is_stock_managed: item.is_stock_managed
                            }
                        }));
                    } else {
                        $('.ui-menu-item').remove();
                        $("#no_div").css('display', 'block');
                    }
                    //end
                }
            })
        },

        select: function (event, ui) {
            var e = ui.item;
            if (e.id) {
                if (e.is_stock_managed == 1 && e.available <= 0) {
                    swal(e.available + jsLang(' item(s) available in stock'), {
                        icon: "error",
                        buttons: [false, jsLang('Ok')],
                    });
                }
                if (!in_array(e.id, stack)) {
                    var new_row2 = '<tr class="addedRow" id="rowid' + e.id + '">' +
                        '<td class="text-center">' + e.value + '<input type="hidden" name="new_description[]" value="' + e.value + '"><input type="hidden" name="new_stock[]" value="' + e.id + '"></td>' +
                        '<td> <input class="form-control text-center no_units positive-float-number" data-id="' + e.id + '" data-rate="' + e.price + '" type="text" id="qty_' + e.id + '" value="1" name="new_item_quantity[]">' +

                        '<label id="qty_' + e.id + '-error" class="error labelMinMax" for="qty_' + e.id + '"></label>' +

                        '<div class="availableStock color_red f-bold" id="errorMessage-' + e.id + '"' + '>' + '</div>' + '<input type="hidden" name="new_item_id[]" value="' + e.id + '"></td>' +
                        '<td class="text-center"><button id="' + e.id + '" data-id="' + e.id + '" class="btn btn-xs btn-danger delete_item"><i class="feather icon-trash-2"></i></button></td>' +
                        '</tr>';
                    $("#item-body").append(new_row2);
                    stack.push(e.id);
                } else {
                    var availableItem = $('#qty_' + e.id).attr("data-max");
                    var quantity = validateNumbers($('#qty_' + e.id).val());
                    if (e.is_stock_managed == 1 && availableItem < parseFloat(quantity) + 1) {
                        swal(availableItem + jsLang(' item(s) available in stock'), {
                            icon: "error",
                            buttons: [false, jsLang('Ok')],
                        });
                    }
                    else if (Number.isInteger(parseFloat(quantity))) {
                        $('#qty_' + e.id).val(parseInt(++quantity));
                    } else {
                        $('#qty_' + e.id).val(getDecimalNumberFormat(++quantity));
                    }
                }

                $(this).val('');
                $('#qty_' + e.id).trigger("change");
                var totalQty = calculateTotalQty();
                $('#total_qty').text(getDecimalNumberFormat(totalQty));
                return false;
            }
        },
        minLength: 1,
        autoFocus: true
    }).on('focus', function () { $(this).autocomplete("search"); })
        .autocomplete("instance")._renderItem = function (ul, item) {
            var available;
            if (item.is_stock_managed == 1) {
                available = item.available;
            } else {
                available = "-";
            }
            return $("<li>")
                .append("<div>" + item.value + "<br>Available: " + available + "</div>")
                .appendTo(ul);
        };

    $(window).keydown(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });

    let preQuantity = 0;
    $(document).on("keydown", ".no_units", function (e) {
        preQuantity = $(this).val();
    });

    /**
    * Calcualte Total Qty 
    *@return Total
    */
    function calculateTotalQty() {
        var total = 0;
        $('.no_units').each(function () {
            total += parseFloat($(this).val() ? validateNumbers($(this).val()) : 0);
        });
        if (total == 0) {
            swal(jsLang('Please select at least one item.'), {
                icon: "error",
                buttons: [false, jsLang('Ok')],
            });
            $('#btnSubmit').attr('disabled', 'true');
        } else if (total > 0) {
            $('#btnSubmit').removeAttr('disabled');
        }
        return total;
    }

    $(document).on('keyup change input', '.no_units', function (e) {
        var stock_id = $(this).attr("stock-id");
        var qty = parseFloat(validateNumbers($(this).val()));
        var old_qty = parseFloat($(this).attr("old-qty"));
        var token = $("#token").val();
        var source = $("#source").val();
        var id = $(this).attr("data-id");
        // check item quantity in store location
        var value = $("#qty_" + id).val();
        var regex_cell = /^\.|[^\d\.]/g;
        var new_value = value.replace(regex_cell, '');
        var totalQty = 0;
        if (new_value == '') {
            $("#qty_" + id).val("");
        }
        $.ajax({
            method: "POST",
            url: SITE_URL + "/stock_transfer/check-item-qty",
            data: { "item_id": id, "source": source, "_token": token }
        })
            .done(function (data) {
                var data = JSON.parse(data);
                if (typeof old_qty == "undefined" || old_qty == null || isNaN(old_qty)) {
                    old_qty = 0;
                    $("#qty_" + id).attr("data-max", Number(old_qty) + Number(data.qty));
                    var maxQty = $("#qty_" + id).attr("data-max");
                    if (Number(qty) > Number(maxQty)) {
                        $("#qty_" + id).val(preQuantity);
                        swal(data.qty + jsLang(' item(s) available in stock'), {
                            icon: "error",
                            buttons: [false, jsLang('Ok')],
                        });
                        $("#qty_" + id).val(preQuantity);
                        $("#qty_" + id).trigger("change");
                        return getDecimalNumberFormat(preQuantity);
                    }
                    totalQty = calculateTotalQty();
                    $('#total_qty').text(getDecimalNumberFormat(totalQty));
                } else {
                    $("#qty_" + id).attr("data-max", Number(old_qty) + Number(data.qty));
                    var maxQty = $("#qty_" + id).attr("data-max");
                    if (Number(qty) > Number(maxQty)) {
                        $("#qty_" + id).val(preQuantity);
                        swal(data.qty + jsLang(' item(s) available in stock'), {
                            icon: "error",
                            buttons: [false, jsLang('Ok')],
                        });
                        $("#qty_" + id).val(preQuantity);
                        totalQty = calculateTotalQty();
                        $('#total_qty').text(getDecimalNumberFormat(totalQty));
                        return getDecimalNumberFormat(preQuantity);
                    }
                    totalQty = calculateTotalQty();
                    $('#total_qty').text(getDecimalNumberFormat(totalQty));
                    $("#errorMessage-" + id).html(data.message);

                    if (Number(data.qty) >= (Number(qty) - Number(old_qty))) {
                        $("#errorMessage-" + id).html('');
                    } else {
                        if (!isNaN($("#qty_" + id).val())) {
                            if ($("#qty_" + id).val() == "") {
                                $("#qty_" + id).val("");
                            }
                        } else {
                            $("#qty_" + id).val(qty);
                        }
                        $("#errorMessage-" + id).html(data.message);
                    }
                    totalQty = calculateTotalQty();
                    $('#total_qty').text(getDecimalNumberFormat(totalQty));
                    $('#btnSubmit').removeAttr('disabled');
                }
                var maxQty = $("#qty_" + id).attr("data-max");
                if (Number(qty) > Number(maxQty)) {
                    swal(data.qty + jsLang(' item(s) available in stock'), {
                        icon: "error",
                        buttons: [false, jsLang('Ok')],
                    });
                    return false;
                }
            });
        totalQty = calculateTotalQty();
        $('#total_qty').text(getDecimalNumberFormat(totalQty));
    });

    function deleteAddedRows() {
        $('.addedRow').each(function () {
            $(this).closest("tr").remove();
        });
    }

    $('#transferForm').validate({
        rules: {
            source: {
                required: true
            },
            destination: {
                required: true
            },
            transfer_date: {
                required: true
            },
            'new_item_quantity[]': {
                required: true,
            },
            'item_quantity[]': {
                required: true,
            },
        },
        // Checking if any item has been added before submit adn showing error
        submitHandler: function () {
            var x = document.getElementsByClassName("addedRow");
             if (x.length == 0) {
                swal({
                    text: jsLang('Please select at least one item to transfer'),
                    icon: "error",
                    buttons: [false, jsLang('Ok')],
                    dangerMode: true,
                });
                return false;
            }
            return true;
        }
    });

    $(document).on('click', '.no_units', function (e) {
        $('.labelMinMax').css('display', 'none');
    });

    $(document).on('click', function (event) {
        $('.labelMinMax').css('display', 'none');
        $('.labelMinMax').css('position', 'fixed');
    });

    $('#transferTbl').addClass('stock-transfer-edit');
}