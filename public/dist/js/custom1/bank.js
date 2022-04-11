'use strict';

if (!($('.main-body .page-wrapper').find('#bank-account-type-container').length)) {
  $(".select").select2();
}

if ($('.main-body .page-wrapper').find('#bank-add-container').length) {
  $(document).ready(function() {

    $('#bank-add-container #bank').validate({
      rules: {
        account_name: {
          required: true,
        },
        account_type_id: {
          required: true
        },
        account_no: {
          required: true,
          allowed: true,
        },
        bank_name: {
          required: true,
        },
        opening_balance: {
          required: true,
        },

        currency_id: {
          required: true
        }
      }
    });
  });
}

if ($('.main-body .page-wrapper').find('#bank-add-container,#bank-edit-container').length) {
  jQuery.validator.addMethod("allowed", function(value, element) {
    return this.optional(element) || /^[. ()0-9]+$/.test(value);
  }, jsLang('Allow only digits, white-spaces, first-brackets and dots'));
}

$('input').on('keyup', function() {
  $(this).valid();
});

$(document).on('change', '.account_type', function(e) {
  var select_val = $(e.currentTarget).val();
  if (select_val != '') {
    $("#error_account_type_id").hide();
  } else {
    $("#error_account_type_id").show();
  }
});

$(document).on('change', '.currency', function(e) {
  var select_val = $(e.currentTarget).val();
  if (select_val != '') {
    $("#error_currency_id").hide();
  } else {
    $("#error_currency_id").show();
  }
});

$(document).on('keyup change', '#account_no, #account_name', function() {
  var account_no = $('#account_no').val();
  var account_name = $('#account_name').val();
  var id = $('#account_id').val();
  $.ajax({
    url: SITE_URL + "/bank/account_validation",
    type: "get",
    data: {
      id: id,
      account_no: account_no,
      account_name: account_name,
    },
    success: function(data) {
      if (data.status == 1) {
        $("#error_account_no").addClass('error').text(jsLang('That Bank Account is already taken.')).show();
      } else {
        $("#error_account_no").hide();
        $("#error_account_no").removeClass('error');
      }
    }
  });
});

$("#bank-add-container #btnSubmit").on('click', function() {
  if ($("#bank").valid() == true) {
    $(".spinner").show();
    $(".spinner").css('line-height', '0');
    $("#spinnerText").text(jsLang('Please wait...'));
    $(this).attr("disabled", true);
    $("#bank").trigger('submit');
  }
});


// Bank edit
if ($('.main-body .page-wrapper').find('#bank-edit-container').length) {
  $(document).ready(function() {
    $('#date').removeClass('sorting_asc').addClass('sorting_disabled');

    $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
      $($.fn.dataTable.tables(true)).DataTable()
        .columns.adjust()
        .responsive.recalc();
    });
  });

  $('#daterange-btn').daterangepicker(daterangeConfig(startDate, endDate), cbRange);
  cbRange(startDate, endDate);

  $(function() {
    $("#bank-edit-container #dataTableBuilder").DataTable({
      "columnDefs": [{
        "orderable": false,
        "visible": false,
        "targets": 0
      }, {
        "orderable": false,
        "targets": 1
      }, {
        "orderable": false,
        "targets": 2
      }, {
        "orderable": false,
        "targets": 3
      }, {
        "orderable": false,
        "targets": 4
      }, {
        "orderable": false,
        "targets": 5
      }, {
         "orderable": false,
         "targets": 6
      }, ],
      "order": [
        [0, 'asc']
      ],
      "language": {
        "url": app_locale_url
      },
      "pageLength": row_per_page
    });
  });

  $('#bank-edit-container #bank').validate({
    rules: {
      account_name: {
        required: true,
      },
      account_type_id: {
        required: true
      },
      account_no: {
        required: true,
        allowed: true,
      },
      bank_name: {
        required: true
      },
      bank_gl_account: {
        required: true
      }
    },
  });

  $(document).on("click", "#bank-edit-container #csv, #bank-edit-container #pdf", function(event) {
    event.preventDefault();
    window.location = SITE_URL + "/bank_statement_" + this.id + "?to=" + $('#endto').val() + "&from=" + $('#startfrom').val() + "&account_no=" + account_no + "&mode=" + $('#mode').val() + "&type=" + $('#type').val();
  });

  $('#bank-edit-container input').on('keyup', function() {
    $(this).valid();
  });

  $("#bank-edit-container #currency_div").on("click", function() {
    $("#currency_error_message").html('<label for="currency_id" class="error">' + jsLang('Currency not changeable!') + '</label>');
  });

  $("#bank-edit-container #currency_div").mouseleave(function() {
    $("#currency_error_message label").fadeOut(1000);
  });
}

if ($('.main-body .page-wrapper').find('.list-container').length) {
  $(document).on("click", ".list-container #csv, .list-container #pdf", function(event) {
    event.preventDefault();
    window.location = SITE_URL + "/all_bank_report_" + this.id;
  });
  $('body').tooltip({
    selector: '[data-toggle="tooltip"]'
  });

  $('.list-container #dataTableBuilder').addClass('account-list');
}

// Account type list

if ($('.main-body .page-wrapper').find('#bank-account-type-container').length) {
  $('.edit-acc-type').on('click', function() {
    var id = $(this).attr("id");
    $('#type_id').val($(this).attr("id"));
    $.ajax({
      url: SITE_URL + "/edit-acc-type",
      data: {
        id: id,
        "_token": token
      },
      type: 'POST',
      dataType: 'JSON',
      success: function(data) {
        $('#type_id').val(data.id);
        $('#type_name').val(data.name);
        $('#type_name').attr("data-id", data.id);
        $('#edit-acc-type').modal();
      }
    });
  });

  $('#addAccType').validate({
    rules: {
      name: {
        required: true,
        remote: SITE_URL + "/acc-type-valid"
      }
    }
  });

  $('#add-acc-type').on('hidden.bs.modal', function() {
    $('input[name=name]').removeClass('error');
  });

  $('#editAccType').validate({
    rules: {
      name: {
        required: true,
        remote: {
          url: SITE_URL + "/acc-type-valid",
          type: "GET",
          data: {
            type_id: function() {
              return $('input[name=type_id]').val();
            }
          }
        }
      }
    }
  });

  $('#add-acc-type').on('hidden.bs.modal', function(e) {
    $(this).find('input[name=name]').val('');
    $('#addAccType').validate().resetForm();
  });
  $('#edit-acc-type').on('show.bs.modal', function(e) {
    $('#editAccType').validate().resetForm();
  });
  $('#edit-acc-type').on('hidden.bs.modal', function(e) {
    $('input[name=name]').removeClass('error');
  });
  $(document).ready(function() {
    $('.btn-group').hide();

    $('#confirmDelete').on('show.bs.modal', function(e) {
      var button = $(e.relatedTarget);
      var modal = $(this);
      $('#confirmDeleteSubmitBtn').attr('data-task', '').removeClass('delete-task-btn');
      if (button.data("label") == 'Delete') {
        modal.find('#confirmDeleteSubmitBtn').addClass('delete-task-btn').attr('data-task', button.data('id')).text(jsLang('Delete')).show();
        modal.find('#confirmDeleteLabel').text(button.data('title'));
        modal.find('.modal-body').text(button.data('message'));
      }
      $('#confirmDeleteSubmitBtn').on('click', function() {
        $('#delete-accType-' + $(this).data('task')).trigger('submit');
      })
    });
  });
}
// transfer list js here
if ($('.main-body .page-wrapper').find('#orderListFilter').length) {
  $(document).on("click", "#csv, #pdf", function(event){
    event.preventDefault();
    window.location = SITE_URL+"/bank_account/transfer_" + this.id + "?to=" + $('#endto').val() + "&from=" + $('#startfrom').val() + "&from_bank_id=" + $('#from_bank_id').val() + "&to_bank_id=" + $('#to_bank_id').val();
  });

  $(document).on("change", "#from_bank_id", function(event) {
    var source = $('#from_bank_id').val();
    var to = $('#to_bank_id').val();
    $.ajax({
        url: SITE_URL + "/bank_account/source-destination/accounts",
        type: "post",
        data: {
          _token : token,
          source : source,
        },
        success: function(data) {
          if (data.status == 1) {
            var toAcc = '<option value="">'+'To Bank A/c'+'</option>';
            var toHtml = '';
            $.each(data.toAccount , function( key, value ) {
              toHtml += `<option value="${value.id}" ${value.id == to ? "selected" : ""} > ${value.name} ${'('+value.currency.name+')'}</option>`;
            });
            $('#to_bank_id option').each(function() {
              $(this).remove();
            });
            $('#to_bank_id').append(toAcc, toHtml);
          }
        }
      });
  });

  $(document).on("change", "#to_bank_id", function(event) {
    var source = $('#from_bank_id').val();
    var to = $('#to_bank_id').val();
    $.ajax({
        url: SITE_URL + "/bank_account/source-destination/accounts",
        type: "post",
        data: {
          _token : token,
          to : to,
        },
        success: function(data) {
          if (data.status == 2) {
            var fromAcc = '<option value="">'+'From Bank A/c'+'</option>';
            var fromHtml = '';
            $.each(data.fromAccount , function( key, value ) {
              fromHtml += `<option value="${value.id}" ${value.id == source ? "selected" : ""}> ${value.name} ${'('+value.currency.name+')'}</option>`;
            });
            $('#from_bank_id option').each(function() {
              $(this).remove();
            });
            $('#from_bank_id').append(fromAcc, fromHtml);
          }
        }
      });
  });
  $('#dataTableBuilder').addClass('transfer-list');
}

// Bank account transfer js here
if ($('.main-body .page-wrapper').find('#bank-transfer-detail-container').length) {
    $("#dataTableBuilder").DataTable({
      "ordering": false
    });
}

// Bank Account transfer add js here
if ($('.main-body .page-wrapper').find('#bank-transfer-add-container').length) {
  $(".select2").select2().on('change', function () {
      $(this).valid();
      $('#destination-error').hide();
  });

  $('#trans_date').daterangepicker(dateSingleConfig());

  function numberRound(num) {
      var n = (num).toFixed(2);
      return n;
  }

  $('#transfer').validate({
      rules: {
          source: {
              required: true
          },
          destination: {
              required: true
          },
          trans_date: {
              required: true
          },
          amount: {
              required: true,
          },
          bank_charge: {
              required: true,
          },
          incoming_amount: {
              required: false,
          },
          exchange_rate: {
              required: true,
          }
      },
  });

  $('.incoming_amount_div').hide();
  $('.error').hide();

  $('#source').on('change', function () {
      var source = $(this).val();
      var url = SITE_URL + "/transfer-dependent";
      $.ajax({
          url: url,
          method: "POST",
          data: { 'source': source, '_token': token }
      }).done(function (data) {
          var data = JSON.parse(data);
          if (data.status_no == 1) {
              $("#destination").html(data.destination).trigger('change');
              $('.incoming_amount_div').hide();
              $('#exchange_rate_div').css('display', 'none');
          }
      });
  });

  $('#source').on('change', function () {
      $('#destination-error').hide();
      var transferAmount = validateNumbers($('input[name=amount]').val());
      let account_no = $(this).val();
      let currency_id = $('option:selected', this).attr('currency-id');
      let currency_code = $('option:selected', this).attr('currency-code');
      let date = $('#trans_date').val();
      if (account_no == '' || currency_id == '') {
          $('label[for="source"]').css('display', 'block');
          $('.message').removeClass('text-success').html('');
      } else {
          var url = SITE_URL + "/get/balance";
          $.ajax({
              url: url,
              method: "POST",
              data: { 'account_no': account_no, 'date': date, '_token': token },
              dataType: "json",
              success: function (data) {
                  if (data.status == 1) {
                      $('.message').removeClass('text-danger').addClass('text-success').html('<strong>' + jsLang('Current Balance') + ':' + ' ' + getDecimalNumberFormat(data.balance) + ' ' + currency_code + '</strong>');
                      $('#bank_charge_currency').html(currency_code);
                      $('#transfer_bank_currency').html(currency_code);
                      $('#from_acount_balance').val(data.balance);

                      if ($('input[name=amount]').val() != '') {
                          if (parseFloat(transferAmount) > parseFloat(data.balance)) {
                              $("#insufficient_amount").css('display', 'block').html(jsLang('Insufficient balance'));
                              $('#submit').attr('disabled', 'disabled');
                          } else {
                              $("#insufficient_amount").css('display', 'none');
                              $('#submit').removeAttr('disabled');
                          }
                      }
                  }
              }
          });
      }
  });

  $(document).on('input change', '#amount, #source, #bank_charge, #exchange_rate', function () {
      $('#destination-error').hide();
      $("#insufficient_amount").css('display', 'none')
      var accountBalance = ($('input[name=from_acount_balance]').val());
      var transferAmount = validateNumbers($('input[name=amount]').val());
      var bank_charge = validateNumbers($('input[name=bank_charge]').val());
      if ($('input[name=amount]').val() != '' && $('#source').val() != "") {
          calculateExchangeRate();
          if ((parseFloat(transferAmount) + parseFloat(bank_charge)) > parseFloat(accountBalance)) {
              $("#insufficient_amount").css('display', 'block').html(jsLang('Insufficient balance'));
              $('#submit').attr('disabled', 'disabled');
          } else {
              $("#insufficient_amount").css('display', 'none');
              $('#submit').removeAttr('disabled');
          }
      } else {
          $("#insufficient_amount").css('display', 'none');
      }
  });

  $('#destination').on('change', function () {
      //Source Info
      let source_currency_id = $('option:selected', ('#source')).attr('currency-id');
      let source_currency_code = $('option:selected', ('#source')).attr('currency-code');
      // Deatination Info
      let account_no = $(this).val();
      let currency_id = $('option:selected', this).attr('currency-id');
      let currency_code = $('option:selected', this).attr('currency-code');
      let date = $('#trans_date').val();

      if (source_currency_id != 'undefined' && currency_id != 'undefined' && (source_currency_id != currency_id) && source_currency_id != '' && currency_id != '') {
          $.ajax({
              method: "POST",
              url: SITE_URL + "/get-exchange-rate",
              data: { "fromCurrency": source_currency_id, "toCurrency": currency_id, "_token": token },
              dataType: "json",
              success: function (data) {
                  $('#exchange_rate').val(data);
                  calculateExchangeRate();
              }
          });
      }
      if (account_no == '' || currency_id == '') {
          $('label[for="destination"]').css('display', 'block');
          $('.messageDestination').removeClass('text-success').html('');
          $('#transfer_bank_currency, #bankFeeCode, #exchange_rate_div').css('display', 'none');
          $('.incoming_amount_div').hide();
      } else {
          var url = SITE_URL + "/get/balance";
          $.ajax({
              url: url,
              method: "POST",
              data: { 'account_no': account_no, 'date': date, '_token': token },
              dataType: "json",
              success: function (data) {
                  if (data.status == 1) {
                      $('.messageDestination').removeClass('text-danger').addClass('text-success').html('<strong>' + jsLang('Current Balance') + ':' + ' ' + getDecimalNumberFormat(data.balance) + ' ' + currency_code + '</strong>');

                      if (source_currency_id == currency_id) {
                          $('#exchange_rate').rules('remove', 'required');
                          $('#exchange_rate').removeAttr('required');
                          $("div .dynamicRow").empty();
                          $('.incoming_amount_div').hide();
                          $('#transfer_bank_currency, #bank_charge_currency').html(source_currency_code);
                          $('#transfer_bank_currency, #currencyCode, #bankFeeCode').css('display', 'flex');
                          $('#exchange_rate_div').css('display', 'none');
                          $("#outgoing_currency_id, #incoming_currency_id").val(source_currency_id);
                      } else if (source_currency_id != currency_id) {
                          $('#exchange_rate').rules('add', 'required');
                          $("div .dynamicRow").empty();
                          $("div .dynamicRow").append('<input type="text" placeholder="'+jsLang('Incoming Amount')+'" class="form-control positive-float-number" id="incoming_amount" name="incoming_amount" readonly>');
                          $("div .dynamicRow").append('<div class="input-group-prepend"><span class="input-group-text" id="incoming_bank_currency"></span></div>');
                          $('#incoming_bank_currency, #exchange_rate_currency_code').html(currency_code);
                          $('.incoming_amount_div').show();
                          $('#exchange_rate_div, #bankFeeCode, #transfer_bank_currency').css('display', 'flex');
                          $('#bank_charge_currency, #transfer_bank_currency').html(source_currency_code);
                          $("#outgoing_currency_id").val(source_currency_id);
                          $("#incoming_currency_id").val(currency_id);
                      }
                  }
              }
          });
      }
  });

  function calculateExchangeRate() {
      $('#destination-error').hide();
      var amount = $('#amount').val();
      var rate = $('#exchange_rate').val() != '' ? $('#exchange_rate').val() : 0;
      let source_currency_id = $('option:selected', ('#source')).attr('currency-id');
      let destination_currency_id = $('option:selected', ('#destination')).attr('currency-id');
      var accountBalance = ($('input[name=from_acount_balance]').val());
      if ($('#source').val() != "" && amount != '') {
          if (parseFloat(validateNumbers(amount)) > parseFloat(accountBalance)) {
              $("#insufficient_amount").css('display', 'block').html(jsLang('Insufficient balance'));
              $('#submit').attr('disabled', 'disabled');
          } else {
              $("#insufficient_amount").css('display', 'none');
              $('#submit').removeAttr('disabled');
          }
      }
      if ((amount != '' || amount != 'undefined') && (rate != '' || rate != 'undefined') && source_currency_id != 'undefined' && destination_currency_id != 'undefined' && (source_currency_id != destination_currency_id)) {
          $("#incoming_amount").val(getDecimalNumberFormat(parseFloat(validateNumbers(amount)) * parseFloat(rate)));
      }
  }
}
