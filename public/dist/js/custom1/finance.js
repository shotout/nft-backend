'use strict';
$(document).on( 'init.dt', function () {
  $(".dataTables_length").remove();
  $('#dataTableBuilder').removeAttr('style');
});
function card(collapse) {
    var collapse_id = collapse.id;
    $("#" + collapse_id).addClass('display_contents');
}
// tax list js
if (!($('.main-body .page-wrapper').find('#emailTemplate-settings-container').length || $('.main-body .page-wrapper').find('#smsTemplate-settings-container').length)) {
    $("#dataTableBuilder").DataTable({
        "columnDefs": [{
            "targets": 3,
            "orderable": false
        }],
        "language": {
            "url": app_locale_url
        },
        "pageLength": row_per_page
    });

}

if ($('.main-body .page-wrapper').find('#tax-settings-container').length) {
    $('.js-example-basic-single-1').select2({
        dropdownParent: $('#add-tax')
    });

    $('.js-example-basic-single-2').select2({
        dropdownParent: $('#edit-tax')
    });

    $('#addTex').validate({
        rules: {
            name: {
                required: true,
                remote: SITE_URL + "/tax-valid"
            },
            tax_rate: {
                required: true,
            }
        }
    });

    $('#add-tax').on('hidden.bs.modal', function() {
        $('input[name=name]').removeClass('error');
        $('input[name=tax_rate]').removeClass('error');
    });

    $('#editTex').validate({
        rules: {
            name: {
                required: true,
                remote: {
                    url: SITE_URL + "/tax-valid",
                    type: "GET",
                    data: {
                        tax_id: function () { return $('input[name=tax_id]').val(); }
                    }
                }
            },
            tax_rate: {
                required: true,
            }
        }
    });

    $(document).on('click', '.edit_tax', function () {
        var id = $(this).attr("id");
        $('#tax_id').val($(this).attr("id"));
        $.ajax({
            url: SITE_URL + "/edit-tax",
            data: {
                id: id,
                "_token": token
            },
            type: 'POST',
            dataType: 'JSON',
            success: function (data) {

                $('#tax_nm').val(data.name);
                var taxRateFormate = getDecimalNumberFormat(data.tax_rate);
                $('#tax_rate').val(taxRateFormate);
                $('#tax_id').val(data.id);
                $('#defaults').val(data.defaults).trigger('change');

                $('#edit-tax').modal();
            }
        });
    });

    jQuery.extend(jQuery.validator.messages, {
        min: jQuery.validator.format("Minimum 0.")
    });

    $('#add-tax').on('hidden.bs.modal', function (e) {
        $(this).find('input[name = name]').val('');
        $(this).find('input[name = tax_rate]').val('');
        $('#addTex').validate().resetForm();
    });

    $('#edit-tax').on('show.bs.modal', function (e) {
        $('#editTex').validate().resetForm();
    });

    $('#edit-tax').on('hidden.bs.modal', function (e) {
        $('input[name=name]').removeClass('error');
        $('input[name=tax_rate]').removeClass('error');
    });

    $('#confirmDelete').on('show.bs.modal', function (e) {
        var button = $(e.relatedTarget);
        var modal = $(this);
        $('#confirmDeleteSubmitBtn').attr('data-task', '').removeClass('delete-task-btn');
        if (button.data("label") == 'Delete') {
            modal.find('#confirmDeleteSubmitBtn').addClass('delete-task-btn').attr('data-task', button.data('id')).text(jsLang('Delete')).show();
            modal.find('#confirmDeleteLabel').text(button.data('title'));
            modal.find('.modal-body').text(button.data('message'));
        }
        $('#confirmDeleteSubmitBtn').on('click', function () {
            $('#delete-tax-' + $(this).data('task')).trigger('submit');
        });
    });

    $("#dataTableBuilder").addClass('taxes');
}

$('input').on('keyup', function () {
    $(this).valid();
});

// currency settings js
if ($('.main-body .page-wrapper').find('#currency-settings-container').length) {
    $('.js-example-basic-single-1').select2({
        dropdownParent: $('#add-unit')
    });

    $('.js-example-basic-single-2').select2({
        dropdownParent: $('#edit-unit')
    });

    $('#addUnit').validate({
        rules: {
            name: {
                required: true,
                remote: SITE_URL + "/currency-valid"
            },
            symbol: {
                required: true
            },
            exchange_rate: {
                required: true,
            }
        }
    });

    $('#add-unit').on('hidden.bs.modal', function() {
        $('input[name=name]').removeClass('error');
        $('input[name=symbol]').removeClass('error');
        $('input[name=exchange_rate]').removeClass('error');
    });

    $('#editUnit').validate({
        rules: {
            name: {
                required: true,
                remote: {
                    url: SITE_URL + "/currency-valid",
                    type: "GET",
                    data: {
                        currency_id: function () { return $('input[name=curr_id]').val(); }
                    }
                }
            },
            symbol: {
                required: true
            },
            exchange_rate: {
                required: true,
            }
        }
    });

    $("#edit-unit").on("show.bs.modal", function () {
        $("#curr_name, #curr_symbol, #exchange_rate").removeClass("error");
        $("#curr_name-error, #curr_symbol-error, #exchange_rate-error").hide();
    });

    $(document).on('click', '.edit_unit', function () {
        var id = $(this).attr("id");
        $.ajax({
            url: SITE_URL + "/edit-currency",
            data: {
                id: id,
                "_token": token
            },
            type: 'POST',
            dataType: 'JSON',
            success: function (data) {
                $('#curr_name').val(data.name);
                $('#curr_symbol').val(data.symbol);
                $('#curr_id').val(data.id);
                var exchangeRateFormate = getDecimalNumberFormat(data.exchange_rate);
                $('#exchange_rate').val(exchangeRateFormate);
                $('#edit_exchange_from').val(data.exchange_from).trigger('change');
                $('#edit-unit').modal();
            }
        });
    });

    $('#add-unit').on('hidden.bs.modal', function (e) {
        $(this).find('input[name = name]').val('');
        $(this).find('input[name = symbol]').val('');
        $(this).find('input[name = exchange_rate]').val('');
        $('#addUnit').validate().resetForm();
    });

    $('.btn-group').hide();

    $('#confirmDelete').on('show.bs.modal', function (e) {
        var button = $(e.relatedTarget);
        var modal = $(this);
        $('#confirmDeleteSubmitBtn').attr('data-task', '').removeClass('delete-task-btn');

        if (button.data("label") == 'Delete') {
            modal.find('#confirmDeleteSubmitBtn').addClass('delete-task-btn').attr('data-task', button.data('id')).text(jsLang('Delete')).show();
            modal.find('#confirmDeleteLabel').text(button.data('title'));
            modal.find('.modal-body').text(button.data('message'));
        }

        $('#confirmDeleteSubmitBtn').on('click', function () {
            $('#delete-currency-' + $(this).data('task')).trigger('submit');
        });
    });

    $("#dataTableBuilder").addClass('taxes');

    $('#add_exchange_from').on('change', function() {
        if ($(this).find('option:selected').text() == "api" && currencyConverter == 0) {
            $('#note').show();
        } else {
            $('#note').hide();
        }
    }) 

    $('#edit_exchange_from').on('change', function() {
        if ($(this).find('option:selected').text() == "api" && currencyConverter == 0) {
            $('#note_edit').show();
        } else {
            $('#note_edit').hide();
        }
    })

    $("#currency-converter").on("show.bs.modal", function () {
        $('#add-unit').modal('hide');
        $('#edit-unit').modal('hide');
    });

}

// payment term finance js here
if ($('.main-body .page-wrapper').find('#paymentTerm-finance-container').length) {

    $('.js-example-basic-single-1').select2({
        dropdownParent: $('#add-unit')
    });

    $('.js-example-basic-single-2').select2({
        dropdownParent: $('#edit-unit')
    });

    $('#addUnit').validate({
        rules: {
            terms: {
                required: true,
                remote: SITE_URL + "/payment-term-valid"
            },
            days_before_due: {
                required: true
            }
        }
    });

    $('#add-unit').on('hidden.bs.modal', function() {
        $('input[name=terms]').removeClass('error');
        $('input[name=days_before_due]').removeClass('error');
    });

    $(document).on('click', '.edit_unit', function () {
        var id = $(this).attr("id");

        $.ajax({
            url: SITE_URL + "/payment/terms/edit",
            data: {
                id: id,
                "_token": token
            },
            type: 'POST',
            dataType: 'JSON',
            success: function (data) {
                $('#term_id').val(data.id);
                $('#terms').val(data.terms);
                $('#days_before_due').val(data.days_before_due);
                $('#defaults').val(data.defaults).trigger('change');
                $('#edit-unit').modal();
            }
        });

        $('#editUnit').validate({
            rules: {
                terms: {
                    required: true,
                    remote: {
                        url: SITE_URL + "/payment-term-valid",
                        type: "GET",
                        data: {
                            term_id: function () { return $('input[name=id]').val(); }
                        }
                    }
                },
                days_before_due: {
                    required: true
                }
            }
        });
    });

    $('input[name = days_before_due]').on('keyup', function() {
        $('.zero-day-note').addClass('display_none');
        var dueDateValue = parseInt($(this).val());
        if (dueDateValue == 0) {
            $('.zero-day-note').addClass('display_block');
            $('.note-message').text(jsLang('Zero date denotes instant payment'));
        } else {
            $('.zero-day-note').removeClass('display_block');
        }
    });

    $('#add-unit').on('hidden.bs.modal', function () {
        $(this).find('input[name = terms]').val('');
        $(this).find('input[name = days_before_due]').val('');
        $('#addUnit').validate().resetForm();
    });

    $('#edit-unit').on('hidden.bs.modal', function () {
        $('#editUnit').validate().resetForm();
        $('input[name=terms]').removeClass('error');
        $('input[name=days_before_due]').removeClass('error');
    });

    $(document).ready(function () {
        $('.btn-group').hide();

        $('#confirmDelete').on('show.bs.modal', function (e) {
            var button = $(e.relatedTarget);
            var modal = $(this);
            $('#confirmDeleteSubmitBtn').attr('data-task', '').removeClass('delete-task-btn');

            if (button.data("label") == 'Delete') {
                modal.find('#confirmDeleteSubmitBtn').addClass('delete-task-btn').attr('data-task', button.data('id')).text(jsLang('Delete')).show();
                modal.find('#confirmDeleteLabel').text(button.data('title'));
                modal.find('.modal-body').text(button.data('message'));
            }

            $('#confirmDeleteSubmitBtn').on('click', function () {
                $('#delete-term-' + $(this).data('task')).trigger('submit');
            });
        });
    });

    jQuery.validator.addMethod("regxForDays", function (value, element) {
        var regExp = new RegExp(/^[1-9]\d*$/);
        return this.optional(element) || regExp.test(value);
    }, jsLang('Enter a valid day'));

    $("#dataTableBuilder").addClass('taxes');
}

// Payment method finance js here
if ($('.main-body .page-wrapper').find('#paymentMethod-finance-container').length) {

    $('.js-example-basic-single-1').select2({
        dropdownParent: $('#settings')
    });

    $('.js-example-basic-single-2').select2({
        dropdownParent: $('#edit-unit')
    });

    $('.js-example-basic-single-3').select2({
        dropdownParent: $('#account')
    });

    $(document).on('click', '.edit_unit', function () {
        var id = $(this).attr("id");

        $.ajax({
            url: SITE_URL + "/payment/method/edit",
            data: {
                id: id,
                "_token": token
            },
            type: 'POST',
            dataType: 'JSON',
            success: function (data) {

                $('#name').val(data.name);
                $('#defaults').val(data.defaults).trigger('change');
                $('#status').val(data.is_active).trigger('change');
                $('#m_id').val(data.id);

                $('#edit-unit').modal();
            }
        });

        $('#editUnit').validate({
            rules: {
                name: {
                    required: true,
                }
            }
        });
    });

    $(document).on('click', '.settings', function () {
        var id = $(this).attr("id");
        if (id == 1) {
            $('#modalTitle').text(jsLang('Paypal Settings'));
            $('#mode, #client, #secret').css('display', 'flex');
            $('#key, #bankAccount, #accountInfo').css('display', 'none');
        } else if (id == 3) {
            $('#modalTitle').text(jsLang('Stripe Settings'));
            $('#mode, #client, #bankAccount, #accountInfo').css('display', 'none');
            $('#key, #secret').css('display', 'flex');
        } else {
            $('#modalTitle').text(jsLang('Bank Settings'));
            $('#secret, #key, #client, #mode, #accountInfo').css('display', 'none');
            $('#bankAccount').css('display', 'flex');

            $(document).on('change', '#account', function () {
                $('#accountInfo').css('display', 'block');
                var bank = $('#account :selected').attr('data-bank') != '' ? $('#account :selected').attr('data-bank') : '-';
                var branch = $('#account :selected').attr('data-branch') != '' ? $('#account :selected').attr('data-branch') : '-';
                var city = $('#account :selected').attr('data-city') != '' ? $('#account :selected').attr('data-city') : '-';
                var code = $('#account :selected').attr('data-code') != '' ? $('#account :selected').attr('data-code') : '-';;
                var address = $('#account :selected').attr('data-address') != '' ? $('#account :selected').attr('data-address') : '-';
                $('#bank').text(bank);
                $('#branch').text(branch);
                $('#city').text(city);
                $('#code').text(code);
                $('#address').text(address);
                $('#paymentId').val(id);

            });

        }
        $.ajax({
            url: SITE_URL + "/payment/method/settings",
            data: {
                id: id,
                "_token": token
            },
            type: 'POST',
            dataType: 'JSON',
            success: function (data) {
                if (id == 1) {
                    $('#client_id').rules('add', 'required');
                    $('#consumer_secret').rules('add', 'required');
                    $('#client_id').val(data.client_id);
                    $('#consumer_secret').val(data.consumer_secret);
                    $('#modeVal').val(data.mode).trigger('change');
                    $('#paymentId').val(id);
                } else if (id == 3) {
                    $('#consumer_key').val(data.consumer_key);
                    $('#consumer_key').rules('add', 'required');
                    $('#consumer_secret').rules('add', 'required');
                    $('#consumer_secret').val(data.consumer_secret);
                    $('#paymentId').val(id);
                } else {
                    $('#consumer_key').removeAttr('required');
                    $('#account').val(data.id).trigger('change');
                    $('#bank').text(data.bank);
                    $('#branch').text(data.branch);
                    $('#city').text(data.city);
                    $('#code').text(data.code);
                    $('#address').text(data.address);
                    $('#paymentId').val(id);
                    $('#approval').val(data.approve).trigger('change');
                }
            }
        });
        $('#paymentSettings').validate({
            rules: {
                consumer_secret: {
                    required: false,
                }
            }
        });

    });

    $('#settings').on('hidden.bs.modal', function () {
        $('#paymentSettings').validate().resetForm();
        $( ":input" ).removeClass('error');
    });

    $('#edit-unit').on('hidden.bs.modal', function () {
        $('#editUnit').validate().resetForm();
    });
    $(document).ready(function () {
        $('.btn-group').hide();
        $('#confirmDelete').on('show.bs.modal', function (e) {
            var button = $(e.relatedTarget);
            var modal = $(this);
            $('#confirmDeleteSubmitBtn').attr('data-task', '').removeClass('delete-task-btn');

            if (button.data("label") == 'Delete') {
                modal.find('#confirmDeleteSubmitBtn').addClass('delete-task-btn').attr('data-task', button.data('id')).text(jsLang('Delete')).show();
                modal.find('#confirmDeleteLabel').text(button.data('title'));
                modal.find('.modal-body').text(button.data('message'));
            }

            $('#confirmDeleteSubmitBtn').on('click', function () {
                $('#delete-paymentMetthod-' + $(this).data('task')).trigger('submit');
            });
        });
    });

    $("#dataTableBuilder").addClass('taxes');
}

// email template js here
if ($('.main-body .page-wrapper').find('#emailTemplate-settings-container').length) {
    var firstEditorInstance = CodeMirror.fromTextArea(document.getElementById("firstEditor"), {
        lineNumbers: true,
        mode: "text/html",
        matchBrackets: true,
    });

    $(".previewButton").on('click', function (e) {
        var emailBodyContent = firstEditorInstance.getValue();
        $("#preview").html(emailBodyContent);
        $("a").on('click', function () {
            e.preventDefault();
            return false;
        });
    });

    $('#previewModal').on('hidden.bs.modal', function (e) {
        $("a").off('click');
    });

    var i;
    var length = $('#nthLoop').attr('data-rel');
    var editor = [];
    for (i = 1; i <= length - 1; i++) {
        editor[i] = CodeMirror.fromTextArea(document.getElementById("Editor" + i), {
            lineNumbers: true,
            mode: "text/html",
            matchBrackets: true,
        });
    }
}