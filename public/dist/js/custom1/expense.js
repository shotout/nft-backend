'use strict';
$(".select").select2();

function numberRound(num) {
  var n = parseFloat(num).toFixed(2);
  return n;
}

if (($('.main-body .page-wrapper').find('#add-expense-container').length)) {
  var DefaultCurrency = defaultCurrencyID;

  $('#trans_date').daterangepicker(dateSingleConfig());

  $("#exchange_rate").on('keyup', function() {
    $('#valueText').html($('#exchange_rate').val());
  });

  $("#validatedCustomFile").on('change', function () {
    $(this).next('.custom-file-label').html($(this)[0].files[0].name);
  });

  $('#expense').validate({
    rules: {
      trans_date: {
        required: true
      },
      account_no: {
        required: true
      },
      category_id: {
        required: true
      },
      amount: {
        required: true,
      },
      currency: {
        required: true
      },
      attachment: {
        fileType: "jpg|png|gif|doc|docx|pdf",
        remote: function(element){
          if (element.files.length != 0) {
            return { url : SITE_URL + "/is-valid-file-size", data: { filesize: element.files[0].size }}
          }
        },
      },
    },
    messages: {
      amount: {
        number: jsLang('Enter a valid amount!'),
        min: jsLang('Enter a valid amount!')
      }
    },
    submitHandler: function() {
      var amount = $('#amount').val();
      var balance = $("#totalBalance").val();
      var method = $('#payment_method').val();
      if ((method == "Bank" && parseFloat(balance) >= parseFloat(amount)) || method != "Bank") {
        return true;
      }
    }
  });

  $(document).on('click', '#btnSubmit', function() {
    if ($("#expense").valid() == true) {
      /* load spinner */
        $(".spinner").show();
        $(".spinner").css('line-height', '0');
        $(".spinner").css('display', 'inline-block');
        $("#spinnerText").text(jsLang('Please wait...'));
        /* end of spinner */
        $(this).attr('disabled', 'disabled');
        $("#expense").trigger('submit');
    }
  });

  $('input').on('keyup', function() {
    $(this).valid();
  });

  $(document).on('keyup', '#amount', function(ev) {
    var amount = ($(this).val());
    var paymentMethod = $('#payment_method :selected').val();
    var token = $("#token").val();
    var account_no = $("#account_no").val();
    var totalAmount = $('#amount').val();
    var homeCurrency = $('#homeCurrency').val();
    var balance = $('#totalBalance').val();
    if (paymentMethod == "Bank") {
      if (parseFloat(amount) > parseFloat(balance) && totalAmount != "") {
        $("#errorMessage").html('<span class="f-11">' + jsLang('Insufficient Balance') + '<span>').show();
      }
      if (parseFloat(amount) <= parseFloat(balance) || totalAmount == "") {
        $("#errorMessage").html('');
      }
    } else {
      $('#currency-div').show();
      $('#currency').trigger("change");
    }
  });

  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      $('#prvw').removeAttr('hidden');
      $('#imgAnchor').removeAttr('hidden');
      $('#divNote').hide();
      reader.onload = function(e) {
        $('#blah').attr('src', e.target.result);
        $('#imgAnchor').attr('href', e.target.result);
        $('#imgAnchor').attr('data-toggle', 'lightbox');
      }
      reader.readAsDataURL(input.files[0]);
    }
  }

  $(document).on('change', '#payment_method', function() {
    $("#errorMessage").hide('');
    var paymentMethod = $(this).val();
    var homeCurrency = $('#homeCurrency').val();
    var paymentMethodId = $('option:selected', this).attr('data-methodId');
    $('#payment_method_id').val(paymentMethodId);
    var accountNo = $('#account_no').val();
    if (paymentMethod == "Bank") {
      $('#account').css('display', 'flex');
      $('#currency-div').hide();
    } else {
      $('#account_no').val('');
      $('#account_no').trigger("change");
      $('#account').css('display', 'none');
      $('#currency').attr("disabled", false);
      $('#currency-div').show();

    }
  });

  $('#account_no').on('change', function() {
    var amount = $('#amount').val();
    $('#account_no-error').hide();
    let account_no = $(this).val();
    let currency_id = $('option:selected', this).attr('currency-id');
    let currency_code = $('option:selected', this).attr('currency-code');
    var paymentMethod = $('#payment_method :selected').val();
    let date = $('#trans_date').val();
    var url = SITE_URL + "/get/balance";
    if (account_no != '') {
      $.ajax({
        url: url,
        method: "POST",
        data: {
          'account_no': account_no,
          'currency_id': currency_id,
          'date': date,
          '_token': token
        },
        dataType: "json",
        success: function(data) {
          $('.message').removeClass('text-danger').addClass('text-success').html('<strong>' + jsLang('Current Balance') + ':' + ' ' + getDecimalNumberFormat(numberRound(data.balance)) + ' ' + currency_code + '</strong>');
          if (paymentMethod == "Bank") {
            $('#currency-div').show();
            $('#currency').val(currency_id).trigger('change').attr("disabled", true);
            if (parseFloat(amount) > parseFloat(data.balance)) {
              $("#errorMessage").html('<span class="f-11">' + jsLang('Insufficient Balance') + '<span>').show();
            }
            if (parseFloat(amount) <= parseFloat(data.balance) || amount == "") {
              $("#errorMessage").html('');
            }
          } else {
            $("#errorMessage").html('');
          }
          $('#currency_id').val(currency_id);
          $('#totalBalance').val(data.balance);
        }
      });
    } else {
      $('.message').html('');
    }
  });

  $('input').on('keyup change', function() {
    $(this).valid();
  });

  $(document).on('change', '.category', function(e) {
    var select_val = $(e.currentTarget).val();
    if (select_val != '') {
      $("#category_id-error").hide();
    } else {
      $("#category_id-error").show();
    }
  });
}

if (($('.main-body .page-wrapper').find('#edit-expense-container').length)) {
  let flag = 1;

  var method = paymentMethod;
  if (method == 'Bank') {
    $('#previousAccount').css('display', 'flex');
    $('#currency').attr("disabled", true);
  } else {
    $('#previousAccount').css('display', 'none');
    $('#currency').attr("disabled", false);
  }

  $("#validatedCustomFile").on('change', function () {
    $(this).next('.custom-file-label').html($(this)[0].files[0].name);
  });

  $('#expense').validate({
    rules: {
      acc_no: {
        required: true
      },
      trans_date: {
        required: true
      },
      amount: {
        required: true,
      },
      category_id: {
        required: true
      },
      currency: {
        required: true
      },
      attachment: {
        fileType: "jpg|png|gif|doc|docx|pdf",
        remote: function(element){
          if (element.files.length != 0) {
            return { url : SITE_URL + "/is-valid-file-size", data: { filesize: element.files[0].size }}
          }
        },
      },
    },
    messages: {
      amount: {
        number: jsLang('Enter a valid amount!'),
        min: jsLang('Enter a valid amount!')
      }
    },
    submitHandler: function() {
      var amount = $('#amount').val();
      var method = $('#payment_method :selected').val();
      var balance = $("#totalBalance").val();
      balance = validateNumbers(balance);
      if ((method == "Bank" && parseFloat(balance) >= parseFloat(amount)) || method != "Bank") {
        return true;
      }
    }
  });

  $(document).on('click', '#btnSubmit', function() {
    if ($("#expense").valid() == true) {
      /* load spinner */
        $(".spinner").show();
        $(".spinner").css('line-height', '0');
        $(".spinner").css('display', 'inline-block');
        $("#spinnerText").text(jsLang('Please wait...'));
        /* end of spinner */
        $(this).attr('disabled', 'disabled');
        $("#expense").trigger('submit');
    }
  });
  
  $('#account_number').on('change', function() {
    var amount = $('#amount').val();
    $('#account_no-error').hide();
    let account_no = $(this).val();
    let currency_id = $('option:selected', this).attr('currency-id');
    let currency_code = $('option:selected', this).attr('currency-code');
    var paymentMethod = $('#payment_method :selected').val();
    let date = $('#trans_date').val();
    var url = SITE_URL + "/get/balance";
    if (account_no != '') {
      $.ajax({
        url: url,
        method: "POST",
        data: {
          'account_no': account_no,
          'currency_id': currency_id,
          'date': date,
          '_token': token
        },
        dataType: "json",
        success: function(data) {
          $('.message').removeClass('text-danger').addClass('text-success').html('<strong>Current Balance:' + ' ' + getDecimalNumberFormat(data.balance) + ' ' + currency_code + '</strong>');
          if (paymentMethod == "Bank") {
            $('#currency-div').show();
            $('#currency').val(currency_id).trigger('change').attr("disabled", true);
            if (parseFloat(amount) > parseFloat(data.balance)) {
              $("#errorMessage").html(jsLang('Insufficient Balance')).show();
            }
            if (parseFloat(amount) <= parseFloat(data.balance) || amount == "") {
              $("#errorMessage").html('');
            }
          } else {
            $("#errorMessage").html('');
          }
          $('#currency_id').val(currency_id);
          $('#totalBalance').val(data.balance);
        }
      });
    } else {
      $('.message').html('');
    }
  });

  $('#acc_no').on('change', function() {
    $('#currency-div').show();
    var amount = $('#amount').val();
    $('#acc_no-error').hide();
    let account_no = $(this).val();
    let currency_id = $('option:selected', this).attr('currency-id');
    let currency_code = $('option:selected', this).attr('currency-code');
    var currencyOption = `<option selected value="` + currency_id + `">` + currency_code + `</option>`;
    var paymentMethod = $('#payment_method :selected').val();
    let date = $('#trans_date').val();
    var url = SITE_URL + "/get/balance";
    if (account_no != '') {
      $.ajax({
        url: url,
        method: "POST",
        data: {
          'account_no': account_no,
          'currency_id': currency_id,
          'date': date,
          '_token': token
        },
        dataType: "json",
        success: function(data) {
          $('.message').removeClass('text-danger').addClass('text-success').html('<strong>Current Balance:' + ' ' + getDecimalNumberFormat(data.balance) + ' ' + currency_code + '</strong>');
          if (paymentMethod == "Bank") {
            $('#currency-div').show();
            $('#currency').append(currencyOption).attr("disabled", true);
            if (parseFloat(amount) > parseFloat(data.balance)) {
              $("#errorMessage").html('<span class="f-11">' + jsLang('Insufficient Balance') + '<span>').show();
            }
            if (parseFloat(amount) <= parseFloat(data.balance) || amount == "") {
              $("#errorMessage").html('');
            }
          } else {
            $("#errorMessage").html('');
          }
          $('#currency_id').val(currency_id);
          $('#totalBalance').val(data.balance);
        }
      });
    } else {
      $('.message').html('');
    }
  });

  $('#account_number').trigger("change");
  $('#acc_no').trigger("change");

  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      $('#prvw').removeAttr('hidden');
      $('#imgAnchor').removeAttr('hidden');
      $('#divNote').hide();
      reader.onload = function(e) {
        $('#blah').attr('src', e.target.result);
        $('#imgAnchor').attr('href', e.target.result);
        $('#imgAnchor').attr('data-toggle', 'lightbox');
      }
      reader.readAsDataURL(input.files[0]);
    }
  }

  $(document).on('change', '#payment_method', function() {
    $("#errorMessage").hide('');
    var paymentMethod = $(this).val();
    var homeCurrency = $('#homeCurrency').val();
    var paymentMethodId = $('option:selected', this).attr('data-methodId');
    $('#payment_method_id').val(paymentMethodId);
    if (paymentMethod == "Bank") {
      $('#account').css('display', 'flex');
      $('#currency-div').hide();
      $('#currency').attr("disabled", true);
      $('#account_no').trigger("change");
      $('#acc_no').trigger("change");
    } else {
      $('#account_no').val('');
      $('#account_no').trigger("change");
      $('#acc_no').val('');
      $('#acc_no').trigger("change");
      $('#account').css('display', 'none');
      $('#previousAccount').css('display', 'none');
      $('#currency').attr("disabled", false);
      $('#currency-div').show();
    }
  });

  $(document).on('keyup', '#amount', function(ev) {
    var amount = ($(this).val());
    var paymentMethod = $('#payment_method :selected').val();
    var token = $("#token").val();
    var homeCurrency = $('#homeCurrency').val();
    var balance = $('#totalBalance').val();
    if (paymentMethod == "Bank") {
      if (balance != '') {
        if (parseFloat(amount) > parseFloat(balance) && amount != "") {
          $("#errorMessage").html('<span class="f-11">' + jsLang('Insufficient Balance') + '<span>').show();
        }
        if (parseFloat(amount) <= parseFloat(balance) || amount == "") {
          $("#errorMessage").html('');
        }
      } else {
        if (parseFloat(amount) > parseFloat(balanceBank) && amount != "") {
          $("#errorMessage").html('<span class="f-11">' + jsLang('Insufficient Balance') + '<span>').show();
        }
        if (parseFloat(amount) <= parseFloat(balanceBank) || amount == "") {
          $("#errorMessage").html('');
        }
      }
    } else {
      $('#currency-div').show();
      $('#currency').trigger("change");
    }
  });

  $('.attachment-delete').on('click', function() {
    swal({
        title: jsLang('Are you sure?'),
        text: jsLang('Once deleted, you will not be able to recover this file.'),
        icon: "warning",
        buttons: [jsLang('Cancel'), jsLang('Ok')],
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          var element = $(this);
          var parent = element.parent();
          var imageIcon = $('.attachment').parent();
          var removeIcon = $('.attachment-delete').parent();
          $.ajax({
            type: "POST",
            url: SITE_URL + "/file/remove",
            data: {
              id: element.attr('data-attachment'),
              filePath: "public/uploads/expense",
              _token: token
            },
            dataType: 'json',
            success: function(response) {
              if (response.status == 1) {
                imageIcon.remove();
                removeIcon.remove();
                swal(jsLang('Success! Your file has been deleted.'), {
                  icon: "success",
                });
              } else {
                swal(jsLang('Something went wrong, please try again.'), {
                  icon: "error",
                  buttons: [false, jsLang('Ok')],
                });
              }
            }
          });
        }
      });
  });

  $('#theModal').on('show.bs.modal', function(e) {
    var button = $(e.relatedTarget);
    var modal = $(this);
    $('#theModalSubmitBtn').attr('data-task', '').removeClass('delete-task-btn');

    if (button.data("label") == 'Delete') {
      modal.find('#theModalSubmitBtn').addClass('delete-task-btn').attr('data-task', button.data('id')).text(jsLang('Delete')).show();
      modal.find('#theModalLabel').text(button.data('title'));
      modal.find('.modal-body').text(button.data('message'));
    } else {
      modal.find('.modal-body').load(button.data("remote"));
    }
  });
}

if (($('.main-body .page-wrapper').find('.list-container').length)) {
  $('body').tooltip({
    selector: '[data-toggle="tooltip"]'
  });
  $(document).on("click", "#csv, #pdf", function(event) {
    event.preventDefault();
    window.location = SITE_URL + "/expense_list_" + this.id + "?to=" + $('#endto').val() + "&from=" + $('#startfrom').val() + "&categoryName=" + $('#categoryName').val() + "&methodName=" + $('#methodName').val();
  });
  $('#dataTableBuilder').addClass('expense-list');
}