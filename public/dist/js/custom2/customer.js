'use strict';
// customer_add.blade.php
if (($('.main-body .page-wrapper').find('#add-customer-container').length)) {
  $(document).ready(function() {
    $(".js-example-basic-single").select2();
    $('.error').hide();
    $('#submitBtn').on('click', function(e) {
      var firstName = $('#first_name').val();
      var lastName = $('#last_name').val();
      var currency_id = $('#currency_id').val();
      if ( firstName == '' || lastName == '' || currency_id == '') {
        $('#home').addClass('active show');
        $('[href="#home"]').tab('show').addClass('active');
        $('#profile').removeClass('active show');
        $('#home').attr('aria-labelledby').val('home-tab');
        e.preventDefault();
      }
    if ($("#customerAdd").valid() == true && currency_id != '') {
			$(".spinner").show().css('line-height', '0');
			$("#spinnerText").text(jsLang('Please wait...'));
			$(this).attr("disabled", true);
			$("#customerAdd").trigger('submit');
		}
    });
    $('#copy').on('click', function() {
      $('#ship_street').val($('#bill_street').val());
      $('#ship_city').val($('#bill_city').val());
      $('#ship_state').val($('#bill_state').val());
      $('#ship_zipCode').val($('#bill_zipCode').val());
      var bill_country = $('#bill_country_id').val();
      $("#ship_country_id").val(bill_country).trigger('change');
    });
  });

  $('#currency_id').on('change', function() {
    var currency = $(this).val();
    if (currency == '') {
      $("#error-currency").show();
    } else {
      $('#error-currency').hide();
    }
  });
  // Item form validation
  $('#customerAdd').validate({
    rules: {
      first_name: {
        required: true,
        maxlength: 30
      },
      last_name: {
        required: true,
        maxlength: 30
      },
      email: {
        regxEmailValidation: true
      },
      phone: {
        required: false,
        regxPhone: true
      },
      currency_id: {
        required: true
      },
    }
  });
  $(document).ready(function() {
    $("#email").on('blur', function() {
      $('#val_email').html("");
      if ($(this).val() != '') {
        emailValidation();
      } else {
        $('#submitBtn').off('click');
      }
    });
  });


  $("#email").on('keyup', function() {
    if ($('#email-error').val() == null) {
      $("#val_email").html("");
    }
  });

  function emailValidation() {
    var result;
    var url = SITE_URL + "/email-valid-customer";
    var email = $("#email").val();
    var token = $("#token").val();

    if (validateEmail(email)) {
      $('#val_email').html("");
      $.ajax({
        url: url,
        data: {
          _token: token,
          email: email
        },
        type: "POST",
        success: function(data) {
          if (data != "true") {
            $("#val_email").css('display', 'block').text(jsLang('This email is already existed.'));
            $('#submitBtn').on("click", function(e) {
              e.preventDefault();
            });
            result = 0;

          } else {
            $("#val_email").html('');
            $('#submitBtn').off('click');
            result = 1;
          }
        },
        error: function(xhr, desc, err) {

          return 0;
        }
      });
    }
    return result;
  }
}

// customer_edit.blade.php
if (($('.main-body .page-wrapper').find('#edit-customer-container').length)) {
  $(document).ready(function() {
    $(".js-example-basic-single").select2();
    $('#curr_err, #ship_country_err').hide();
  });

  $('#copy').on('click', function() {
    $('#ship_street').val($('#bill_street').val());
    $('#ship_city').val($('#bill_city').val());
    $('#ship_state').val($('#bill_state').val());
    $('#ship_zipCode').val($('#bill_zipCode').val());

    var billing_country_id = $('#billing_country_id').val();
    $("#shipping_country_id").val(billing_country_id).trigger('change');
  });

  $('#editCustomer').validate({
    rules: {
      first_name: {
        required: true,
        maxlength: 30
      },
      last_name: {
        required: true,
        maxlength: 30
      },
      email: {
        regxEmailValidation: true
      },
      currency_id: {
        required: true
      },
    }
  });

  $(document).ready(function() {
    $("#email").on('blur', function() {
      $('#val_email').html("");
      if ($(this).val() != '') {
        emailValidation();
      } else {
        $('#submitBtn').off('click');
      }
    });
  });

  $("#email").on('keyup', function() {
    if ($('#email-error').val() == null) {
      $("#val_email").html("");
    }
  });

  function emailValidation() {
    var result;
    var customerId = $('input[name=customer_id]').val();
    var url = SITE_URL + "/email-valid-customer";
    var email = $("#email").val();
    var token = $("#token").val();

    if (validateEmail(email)) {
      $('#val_email').html("");
      $.ajax({
        url: url,
        data: {
          _token: token,
          email: email,
          customerId: customerId
        },
        type: "POST",
        success: function(data) {
          if (data != "true") {
            $("#val_email").css('display', 'block').text(jsLang('This email is already existed.'));
            $('#submitBtn').on("click", function(e) {
              e.preventDefault();
            });
            result = 0;

          } else {
            $("#val_email").html('');
            $('#submitBtn').off('click');
            result = 1;
          }
        },
        error: function(xhr, desc, err) {

          return 0;
        }
      });
    } else {
      return 0;
    }
    return result;
  }

  $('#password-form').validate({
    rules: {
      password: {
        required: true,
        minlength: 5
      },
      password_confirmation: {
        required: true,
        minlength: 5,
        equalTo: "#password"
      }
    }
  });

  $('#currency').on('change', function() {
    var currency = $(this).val();
    if (currency == '') {
      $("#error-currency").show();
    } else {
      $('#error-currency').hide();
    }
  });

  $('#submitBtn').on('click', function() {
      if ($("form#editCustomer").valid() == true) {
        $('#submitBtn').attr('disabled', 'disabled');
        $("form#editCustomer").trigger('submit');
      }
  });
}

// custom validation rules for customer add and edit
if (($('.main-body .page-wrapper').find('#add-customer-container,#edit-customer-container').length)) {
    jQuery.validator.addMethod("regxPhone", function(value, element) {
    var regExp = new RegExp(/^((\+\d{1,4}(-| )?\(?\d\)?(-| )?\d{1,9})|(\(?\d{2,9}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/);
    var regExp2 = new RegExp(/^[+0-9 () \-]{8,20}$/);
    return this.optional(element) || regExp.test(value) || regExp2.test(value);
  }, jsLang('Enter a valid phone number'));

  jQuery.validator.addMethod("regxEmailValidation", function(value, element) {
    return this.optional(element) || validateEmail(value);
  }, jsLang('Enter a valid email'));
}

// customer_import.blade.php
if (($('.main-body .page-wrapper').find('#import-customer-container').length)) {
  $('#myform1').validate({
    rules: {
      csv_file: {
        required: true
      }
    }
  });
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
    window.location = SITE_URL + "/dist/downloads/dosen_sheet.csv";
  });


  $(document).ready(function() {
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
        $('#note_txt_1, #validatedCustomFile-error').hide();
        $('#note_txt_2').show();
        $('#note_txt_2').html('<h6> <span class="text-danger font-weight-bolder"> '+ jsLang('Invalid file Extension.') +' </span> </h6> <span class="badge badge-info note-style">'+ jsLang('Note') +'</span><small class="text-info">'+ jsLang(' Allowed File Extensions: csv')) + '</small>';
        $("#submit").attr('disabled', 'disabled');
      } else {
        $("#submit").removeAttr('disabled');
        $('#note_txt_1').hide();
        $('#note_txt_2').hide();
      }
    });
  });
}

$('#validatedCustomFile').on("change", function(e) {
		var files = [];
		for (var i = 0; i < $(this)[0].files.length; i++) {
			files.push($(this)[0].files[i].name);
		}
		$(this).next('.custom-file-label').html(files.join(', '));
	});

  $("#validatedCustomFile").on('change', function () {
    $(this).next('.custom-file-label').html($(this)[0].files[0].name);
 });

  $('#validatedCustomFile1').on("change", function(e) {
		var files = [];
		for (var i = 0; i < $(this)[0].files.length; i++) {
			files.push($(this)[0].files[i].name);
		}
		$(this).next('.custom-file-label').html(files.join(', '));
	});

  $('#validatedCustomFile2').on("change", function(e) {
		var files = [];
		for (var i = 0; i < $(this)[0].files.length; i++) {
			files.push($(this)[0].files[i].name);
		}
		$(this).next('.custom-file-label').html(files.join(', '));
	});

  $('#validatedCustomFile3').on("change", function(e) {
		var files = [];
		for (var i = 0; i < $(this)[0].files.length; i++) {
			files.push($(this)[0].files[i].name);
		}
		$(this).next('.custom-file-label').html(files.join(', '));
	});

  $('#validatedCustomFile4').on("change", function(e) {
		var files = [];
		for (var i = 0; i < $(this)[0].files.length; i++) {
			files.push($(this)[0].files[i].name);
		}
		$(this).next('.custom-file-label').html(files.join(', '));
	});

  $('#validatedCustomFile5').on("change", function(e) {
		var files = [];
		for (var i = 0; i < $(this)[0].files.length; i++) {
			files.push($(this)[0].files[i].name);
		}
		$(this).next('.custom-file-label').html(files.join(', '));
	});

  $('#validatedCustomFile6').on("change", function(e) {
		var files = [];
		for (var i = 0; i < $(this)[0].files.length; i++) {
			files.push($(this)[0].files[i].name);
		}
		$(this).next('.custom-file-label').html(files.join(', '));
	});


// customer_invoice.blade.php
if (($('.main-body .page-wrapper').find('#customer-invoice-container').length)) {
  $(document).ready(function() {
    $(".select2").select2();
  });
  $(function() {
    $('#daterange-btn').daterangepicker(daterangeConfig(startDate, endDate), cbRange);
    cbRange(startDate, endDate);

    $(document).on("click", "#csv, #pdf", function(event) {
      event.preventDefault();
      window.location = SITE_URL + "/customer/sales-report-" + this.id + "?to=" + $('#endto').val() + "&from=" + $('#startfrom').val() + "&customer=" + $('#customer').val() + "&pay_status_type=" + $('#pay_status_type').val();
    });

    $(document).ready(function() {
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
          $('#delete-invoice-' + $(this).data('task')).trigger('submit');
        })
      });
    });

    $(document).on("click", "#tablereload", function(event) {
      event.preventDefault();
      $("#dataTableBuilder").DataTable().ajax.reload();
    });

  });
}

// customer_ledger.blade.php
if (($('.main-body .page-wrapper').find('#customer-ledger-container').length)) {
  $(document).ready(function() {
    $('#dataTableBuilder_length').after('<div class="col-md-4 col-sm-4 col-xs-6"><div class="row" id="mt-2"><div class="btn-group btn-styles"><button type="button" class="form-control dropdown-toggle export-btn" data-toggle="dropdown" aria-haspopup="true">Export</button><ul class="dropdown-menu csv-btn"><li><a href="" title="CSV" id="csv">'+ jsLang('CSV') +'</a></li><li><a href="" title="PDF" id="pdf">'+ jsLang('PDF') +'</a></li></ul></div><div class="btn btn-group refresh-btn"><a href="" id="tablereload" class="form-control"><span><i class="fa fa-refresh"></i></span></a></div></div></div>');
  });

  $(document).ready(function() {
    var p = $('#total_purchase_amount').val();
    var q = $('#paid_amount').val();
    var r = $('#balance_amount').val();
    $('#total_purchase_amount1').html(p);
    $('#paid_amount1').html(q);
    $('#balance_amount1').html(r);
  });

  $(function() {
    $("#ledger").DataTable({
      "order": [],
      "language": {
        "url": app_locale_url
      },
      "pageLength": row_per_page
    });
    $("#summery").DataTable({
      "order": [],
      "columnDefs": [{
        "targets": 0,
        "orderable": false
      }, {
        "targets": 1,
        "orderable": false
      }],
      "language": {
        "url": app_locale_url
      },
      "pageLength": row_per_page
    });
    $('#summery_paginate').hide();
    $('#summery_info').hide();
    $('#summery_length').hide();
    $('#summery_filter').hide();
  });

  // * Set the time range for daterangepicker

  $('#daterange-btn').daterangepicker(daterangeConfig(startDate, endDate), cbRange);
  cbRange(startDate, endDate);

  $(document).on("click", "#csv, #pdf", function(event) {
    event.preventDefault();
    window.location = SITE_URL + "/customer-ledger-filtering-" + this.id + "?to=" + $('#endto').val() + "&from=" + $('#startfrom').val() + "&id=" + ledger_customer_id;
  });
}



// customer_note.blade.php
if (($('.main-body .page-wrapper').find('#customer-note-container').length)) {
  $('#daterange-btn').daterangepicker(daterangeConfig(startDate, endDate), cbRange);
    cbRange(startDate, endDate);

  // Edit note
  $('#dataTableBuilder').on('click', '.notecontent', function() {
    var subject = $(this).attr('data-subject');
    var note = $(this).attr('data-note');
    var note_id = $(this).attr('data-note_id');

    $('#edit_subject').val(subject);
    $('#edit_note').val(note);
    $('#note_id').val(note_id);
  });

  // Add note validation
  $('#add_note, #edit_note_form').validate({
    rules: {
      subject: {
        required: true
      },
      note: {
        required: true
      }
    }
  });

  $('#edit_note_form').validate({
    rules: {
      subject: {
        required: true
      },
      note: {
        required: true
      }
    }
  });
  $('#submitBtn').on('click', function() {
    if ($("#add_note").valid() == true) {
			$(".spinner").show().css('line-height', '0');
			$("#spinnerText").text(jsLang('Please wait...'));
			$(this).attr("disabled", true);
			$("#add_note").trigger('submit');
		}
  });

  $('#newNote').on('hidden.bs.modal', function() {
    $('#subject-error').hide('error');
    $('input[name=subject]').removeClass('error');
    $('#note-error').hide('error');
    $('input[name=note]').removeClass('error');
  });

  $('#editNote').on('hidden.bs.modal', function() {
    $('#edit_subject-error').hide('error');
    $('input[name=subject]').removeClass('error');
    $('#edit_note-error').hide('error');
    $('input[name=note]').removeClass('error');
  });

  $(document).on("click", "#csv, #pdf", function(event) {
    event.preventDefault();
    window.location = SITE_URL + "/customer/notes-" + this.id + "?to=" + $('#endto').val() + "&from=" + $('#startfrom').val() + "&customerId=" + $('#customer').val();
  });

  $(document).ready(function() {
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
        $('#delete-notes-' + $(this).data('task')).trigger('submit');
      })
    });
  });
  $(document).on('click', '#edit-customer-note', function() {
    var noteId = $('#edit-customer-note').attr('data-note_id');
      $.ajax({
        url: SITE_URL + '/customer/getnote',
        method: "GET",
        data: {
          'noteId': noteId,
          '_token': token
        },
        dataType: "json",
        success: function(data) {
          $('#edit_subject').val(data.subject);
          $('#edit_note').val(data.content);
        }
      });
  });
}

// customer_panel.blade.php
if (($('.main-body .page-wrapper').find('#cus-panel-container').length)) {
  $(document).ready(function() {
    if ($(window).width() == 320 || $(window).width() == 768) {
      $("h2").removeClass('f-22').addClass('f-18');
      $(".dashBoardIcon").removeClass('f-60').addClass('f-40');
    }
  });
}

// customer_payments.blade.php
if (($('.main-body .page-wrapper').find('#customer-payments-container').length)) {
  $(function() {
    $("#example1").DataTable({
      "order": [],
      "columnDefs": [{
        "targets": 5,
        "orderable": false
      }],
      "language": {
        "url": app_locale_url
      },
      "pageLength": row_per_page
    });

    $('.select2').select2();
    $('#daterange-btn').daterangepicker(daterangeConfig(startDate, endDate), cbRange);
    cbRange(startDate, endDate);

    $(document).on("click", "#csv, #pdf", function(event) {
      event.preventDefault();
      window.location = SITE_URL + "/customer/payment-report-" + this.id + "?to=" + $('#endto').val() + "&from=" + $('#startfrom').val() + "&customerId=" + $('#customer').val() + "&method=" + $('#method').val() + "&currency=" + $('#currency').val();
    });

    $(document).on("click", "#tablereload", function(event) {
      event.preventDefault();
      $("#dataTableBuilder").DataTable().ajax.reload();
    });

    $(document).ready(function() {
      $('#confirmDelete').on('show.bs.modal', function(e) {
        var button = $(e.relatedTarget);
        var modal = $(this);
        $('#confirmDeleteSubmitBtn').attr('data-task', '').removeClass('delete-task-btn');
        if (button.data("label") == 'Delete') {
          modal.find('#confirmDeleteLabel').text(button.data('title'));
          modal.find('.modal-body').text(button.data('message'));
        }
        $('#confirmDeleteSubmitBtn').on('click', function() {
          $('#delete-payment-' + button.data('id')).trigger('submit');
        })
      });
    });
  });
  $('#dataTableBuilder').addClass('customer-payments-list')
}

// customer_project.blade.php
if (($('.main-body .page-wrapper').find('#customer-project-container').length)) {
  $(function() {
    $('.select2').select2();

    $('#daterange-btn').daterangepicker(daterangeConfig(startDate, endDate), cbRange);
    cbRange(startDate, endDate);

    $(document).on("click", "#csv, #pdf", function(event) {
      event.preventDefault();
      window.location = SITE_URL + "/customer/projects-" + this.id + "?to=" + $('#endto').val() + "&from=" + $('#startfrom').val() + "&customer=" + $('#customer').val() + "&status=" + $('#status').val();
    });

    $(document).on("click", "#tablereload", function(event) {
      event.preventDefault();
      $("#dataTableBuilder").DataTable().ajax.reload();
    });
  });

  $(document).ready(function() {
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
        $('#delete-project-' + $(this).data('task')).trigger('submit');
      })
    });
  });
  $('#dataTableBuilder').addClass('customer-project-list');
}

// customer_sales_order.blade.php
if (($('.main-body .page-wrapper').find('#customer-sale-order-container').length)) {
  $('#daterange-btn').daterangepicker(daterangeConfig(startDate, endDate), cbRange);
  cbRange(startDate, endDate);

  $(document).ready(function() {
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
        $('#delete-quotation-' + button.data('id')).trigger('submit');
      })
    });
  });

  $(document).on("click", "#csv, #pdf", function(event) {
    event.preventDefault();
    window.location = SITE_URL + "/customer-quotation-filtering-" + this.id + "?to=" + $('#endto').val() + "&from=" + $('#startfrom').val() + "&customer=" + sale_order_cus_name + "&debtor_no=" + sale_order_cus_id;
  });

  $(document).on("click", "#tablereload", function(event) {
    event.preventDefault();
    $("#dataTableBuilder").DataTable().ajax.reload();
  });
}

// customer_task.blade.php
if (($('.main-body .page-wrapper').find('#customer-task-container').length)) {
   $('.select2').select2();

  $('#daterange-btn').daterangepicker(daterangeConfig(startDate, endDate), cbRange);
  cbRange(startDate, endDate);

  $(document).on("click", "#csv, #pdf", function(event) {
    event.preventDefault();
    window.location = SITE_URL + "/customer/tasks-" + this.id + "?to=" + $('#endto').val() + "&from=" + $('#startfrom').val() + "&customer=" + $('#customer').val() + "&assignee=" + $('#assignee').val() + "&status=" + $('#status').val() + "&priority=" + $('#priority').val();
  });

  $(document).on("click", "#tablereload", function(event) {
    event.preventDefault();
    $("#dataTableBuilder").DataTable().ajax.reload();
  });

  $(document).ready(function() {
    $('#confirmDelete').on('show.bs.modal', function(e) {
      var button = $(e.relatedTarget);
      var modal = $(this);
      $('#confirmDeleteSubmitBtn').attr('data-task', '').removeClass('delete-task-btn');
      if (button.data("label") == 'Delete') {
        modal.find('#confirmDeleteSubmitBtn').addClass('btn btn-danger custom-btn-small delete-task-btn').attr('data-task', button.data('id')).text(jsLang('Delete')).show();
        modal.find('#confirmDeleteLabel').text(button.data('title'));
        modal.find('.modal-body').text(button.data('message'));
      }
      $('#confirmDeleteSubmitBtn').on('click', function() {
        $('#delete-task-' + $(this).data('task')).trigger('submit');
      })
    });
  });

  $('body').tooltip({
    selector: '[data-toggle="tooltip"]'
  });
  $('#dataTableBuilder').addClass('customer-task-list');
}

// customer_tickets.blade.php
if (($('.main-body .page-wrapper').find('#customer-ticket-container').length)) {
  $(function() {
    $('.select2').select2();
    $("#example1").DataTable({
      "order": [],
      "columnDefs": [{
        "targets": 5,
        "orderable": false
      }],
      "language": {
        "url": app_locale_url
      },
      "pageLength": row_per_page
    });

    $('#daterange-btn').daterangepicker(daterangeConfig(startDate, endDate), cbRange);
    cbRange(startDate, endDate);

    $(document).on("click", "#csv, #pdf", function(event) {
      event.preventDefault();
      window.location = SITE_URL + "/customer/tickets-" + this.id + "?to=" + $('#endto').val() + "&from=" + $('#startfrom').val() + "&customer=" + $('#customer').val() + "&project=" + $('#project').val() + "&department_id=" + $('#department_id').val() + "&status=" + $('#status').val();
    });

    $(document).on("click", "#tablereload", function(event) {
      event.preventDefault();
      $("#dataTableBuilder").DataTable().ajax.reload();
    });


  });

  $(document).ready(function() {
    $('#confirmDelete').on('show.bs.modal', function(e) {
      var button = $(e.relatedTarget);
      var modal = $(this);
      $('#confirmDeleteSubmitBtn').attr('data-task', '').removeClass('delete-task-btn');
      if (button.data("label") == 'Delete') {
        modal.find('#confirmDeleteSubmitBtn').addClass('btn-danger custom-btn-small delete-task-btn').attr('data-task', button.data('id')).text(jsLang('Delete')).show();
        modal.find('#confirmDeleteLabel').text(button.data('title'));
        modal.find('.modal-body').text(button.data('message'));
      }
      $('#confirmDeleteSubmitBtn').on('click', function() {
        $('#delete-ticket-' + $(this).data('task')).trigger('submit');
      })
    });
  });
  $('#dataTableBuilder').addClass('customer-ticket-list');
  $(document).on('click', ".ticket_status_change", function () {
    var statusId = $(this).attr('data-id');
    var ticketId = $(this).attr('ticket_id');
    ticketStatusChange(SITE_URL + '/ticket/change-status', statusId, ticketId);
  });
  $(document).on('click',".ticket_priority_change", function () {
    var priorityId = $(this).attr('data-id');
    var ticketId = $(this).attr('ticket_id');
    ticketPriorityChange(SITE_URL + '/ticket/priority-status', priorityId, ticketId);
  });


  // admin_list.blade.php
if (($('.main-body .page-wrapper').find('.list-container').length)) {
  $(document).ready(function() {
    $('#dataTableBuilder').on('change', '.status', function() {
      var id = $(this).attr('data-admin_id');
      var status = $(this).is(":checked") ? 1 : 0;
      var url = SITE_URL + "/admin/change-status";
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
            $('#total_admin').html(data.total_admin);
            $('#admin_active').html(data.admin_active);
            $('#admin_inactive').html(data.admin_inactive);
          } else {
              $("#alert").fadeTo(2000, 500).slideUp(500, function() {
                $("#alert").slideUp(500);
              });
          }
        }
      });
    });

    $(document).on("click", "#csv, #pdf", function(event) {
      event.preventDefault();
      window.location = SITE_URL + "/customer_list_"+this.id;
    });
  });
  $('body').tooltip({selector: '[data-toggle="tooltip"]'});
  $('#dataTableBuilder').addClass('customer-list-styles');

}
}
