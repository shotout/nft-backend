"use strict";
$(document).on( 'init.dt', function () {
  $(".dataTables_length").remove();
  $('#dataTableBuilder').removeAttr('style');
});
$('.error').hide();
function myFunction(x) {
  // If media query matches
  if (x.matches) {
    $('#cardRightButton').prev().css({ 'display': 'block' });
    $('#cardRightButton').addClass('row').css({ 'display': 'block', 'float': 'left', 'position': 'relative', 'right': '-20px' });
  } else {
    $('#cardRightButton').prev().css({ 'display': 'inline-block' });
    $('#cardRightButton').removeClass('row').css({ 'display': 'inline-block', 'float': 'right', 'position': 'absolute', 'right': '10px' });
  }
}

// URL shortner settings js here
if ($('.main-body .page-wrapper').find('#urlConfig-settings-container').length) {
  $('.select').select2();
  $( document ).on('ready', function() {
    $(".error").hide();
  });

  $('#myform1').validate({
    rules: {
      default: {
          required: true
      },
      status: {
          required: true
      },
      secret_key: {
          required: true
      }
    }
  });

  $('#url_shortner_form').validate({
    rules: {
      long_url: {
          required: true,
          url: true
      }
    }
  });

  $('#url_shortner_form').on('submit', function(e) {
    var checkForm = $('#url_shortner_form').valid();
     e.preventDefault();
      if (checkForm == true) {
        var long_url = $('input[name="long_url"]').val();
        $.ajax({
          type: "get",
          url: SITE_URL + "/short-url/create",
          data: {
            long_url: long_url,
          },
          success: function( result ) {
            if ( result != false) {
              $( "#generatedUrl" ).text(result);
              $( "#generatedUrlHref" ).attr('href', result);
              $( "#showShortUrl" ).show();
              $('input[name="long_url"]').val('');
            }
          }
        });
      }
  });

  var x = window.matchMedia("(max-width: 1024px)");
  // Call listener function at run time
  myFunction(x);
  // Attach listener function on state changes
  x.addEventListener('load',myFunction);
} else {
  var x = window.matchMedia("(max-width: 850px)");
  // Call listener function at run time
  myFunction(x);
  // Attach listener function on state changes
  x.addEventListener('load', myFunction);
}

if ($('.main-body .page-wrapper').find('#language-settings-container').length) {
  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $('#blah').attr('src', e.target.result);
      }
      reader.readAsDataURL(input.files[0]);
    }
  }
  function readAddURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $('#blah_add').attr('src', e.target.result);
      }
      $('#blah_add').show();
      reader.readAsDataURL(input.files[0]);
    }
  }
  $('.js-example-basic-single-1').select2({
    dropdownParent: $('#edit_language')
  });

  $('.js-example-basic-single-2').select2({
    dropdownParent: $('#add-language')
  });
  $("#dataTableBuilder").DataTable({
    "columnDefs": [{
      "targets": [2, 3, 4],
      "orderable": false
    }],
    buttons: [
      'csv', 'pdf'
    ],

    "language": {
      "url": app_locale_url
    },
    "pageLength": row_per_page,
  });

  $('#addLanguage').validate({
    rules: {
      language_name: {
        required: true
      },
      short_name: {
        required: true,
        remote: SITE_URL + "/languageShortName-valid"
      },
      status: {
        required: true
      },
      direction: {
        required: true
      }
    }
  });

  $('#editLanguage').validate({
    rules: {
      edit_language_name: {
        required: true
      },
      edit_short_name: {
        required: true,
        remote: {
          url: SITE_URL + "/languageShortName-valid",
          type: "GET",
          data: {
            language_id: function () { return $('input[name=language_id]').val(); }
          }
        }
      },
      edit_status: {
        required: true
      },
      edit_direction: {
        required: true
      },
      edit_flag: {
        required: true,
        filesize: true,
        extension: "jpg|png|bmp"
      },
    },
    messages: {
      edit_flag: {
        extension: jsLang('Please enter a supported file'),
      }
    }
  });

  jQuery.validator.addMethod("filesize", function (value, element) {
    return this.optional(element) || element.files[0].size < 102400;
  }, jsLang('File size must be less than 100KB'));

  var languageStatus;
  $(document).on('click', '.edit_language', function () {
    var id = $(this).attr("id");
    $.ajax({
      url: SITE_URL + "/edit-language",
      data: {
        id: id,
        "_token": token
      },
      type: 'POST',
      dataType: 'JSON',
      success: function (data) {
        $('#edit_language_name').val(data.language_name);
        $('#edit_short_name').val(data.short_name);
        $('#edit_status').val(data.status).trigger('change');
        $('#edit_direction').val(data.direction).trigger('change');
        $('#language_id').val(data.id);
        $('#editImg').attr('src', data.flag);

        if (data.is_default == 1) {
          $("#edit_default").prop("checked", true);
        } else {
          $("#edit_default").prop("checked", false);
        }
        $('#edit_language').modal();
      }
    });

  });
  $('#edit_default').on('change', function() {
    if ($(this)[0].checked) {
      $('#edit_status').val('Active').trigger('change');
    }
  });
  $('#default').on('change', function() {
    if ($(this)[0].checked) {
      $('#status').val('Active').trigger('change');
    }
  });
  $(document).on('change', '.commonClass', function (e) {
    var select_val = $(e.currentTarget).val();
    var inputName = $(this).attr('name');
    if (select_val != '') {
      $('#' + inputName + '_error').hide();
    }
  });

  $(document).on('change', '.editCommonclass', function (e) {
    var select_val = $(e.currentTarget).val();
    var inputName = $(this).attr('name');
    if (select_val != '') {
      $('#' + inputName + '_error').hide();
    }
  });

  $('#add-language').on('show.bs.modal', function (e) {
    $(this).find("#language_name_error").hide();
    $(this).find("#status_error").hide();
    $(this).find("#direction_error").hide();
  });

  $('#add-language').on('hidden.bs.modal', function (e) {
    $(this).find("select").val('').trigger('change');
    $('#default').prop('checked', false);
  });

  $("#flag").on("change", function () {
    readAddURL(this);
    var file = this.files[0];
    var fileType = file["type"];
    var validImageTypes = ["image/gif", "image/jpeg", "image/png"];
    if ($.inArray(fileType, validImageTypes) < 0 || this.files[0].size > 102400) {
      // invalid file type code goes here.
      $('#blah_add').hide();
      $("#imgNote").removeAttr("hidden");
    } else {
      $("#imgNote").removeAttr("hidden");
      $("#imgNote").attr("hidden", "true");
    }
  });

  $("#edit_flag").on("change", function () {
    readURL(this);

    var file = this.files[0];
    var fileType = file["type"];
    var validImageTypes = ["image/gif", "image/jpeg", "image/png"];
    if ($.inArray(fileType, validImageTypes) < 0 || this.files[0].size > 102400) {
      // invalid file type code goes here.
      $('#blah').hide();
      $("#imgNoteEdit").removeAttr("hidden");
    }
  });

  $('#blah_add').hide();
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
      $('#delete-language-' + $(this).data('task')).trigger('submit');
    });
  });

  $(document).on("click", "#tablereload", function (event) {
    event.preventDefault();
    $("#dataTableBuilder").DataTable().ajax.reload();
  });
}

$('input').on('keyup', function () {
  $(this).valid();
});

// translation js
if ($('.main-body .page-wrapper').find('#translation-settings-container').length) {
  $("#translation-settings-container #dataTableBuilder").DataTable({
    "columnDefs": [{
      "targets": 1,
      "orderable": false
    }],

    "language": {
      "url": app_locale_url
    },
    "pageLength": row_per_page,
  });
}
// item category js
if ($('.main-body .page-wrapper').find('#itemCategory-settings-container').length) {
  $('#myform1').validate({
    rules: {
      description: {
        required: true,
        remote: SITE_URL + "/category-valid"
      },
      dflt_units: {
        required: true
      }
    }
  });

  $('#editCat').validate({
    rules: {
      description: {
        required: true,
        remote: {
          url: SITE_URL + "/edit-category-valid",
          type: "GET",
          data: {
            id: function () { return $("#catId").val(); },
            catName: function () { return $('.edit_name_error').val(); }
          }
        }
      },
      dflt_units: {
        required: true
      }
    }
  });
  if ($('.main-body .page-wrapper').find('#itemCategory-settings-container').length) {
    $('.js-example-basic-single').select2({
      dropdownParent: $('#add-category')
    });
    $('.js-example-basic-single-2').select2({
      dropdownParent: $('#edit-category')
    });
  }
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

  $(document).on('click', '.edit_category', function () {
    var id = $(this).attr("id");
    $.ajax({
      url: SITE_URL + "/edit-category",
      data: {
        id: id,
        "_token": token
      },
      type: 'POST',
      dataType: 'JSON',
      success: function (data) {
        $('#name').val(data.name);
        $('#dflt_units').val(data.dflt_units).trigger('change');
        $('#cat_id').val(data.id);
        $("#edit_status").val(data.status).trigger('change');
        $('#edit-category').modal();
      }
    });
  });

  $(document).on('change', '.add_unit', function (e) {
    var select_val = $(e.currentTarget).val();
    if (select_val != '') {
      $("#dflt_units-error").hide();
    }
  });

  $(document).on('change', '.edit_unit', function (e) {
    var select_val = $(e.currentTarget).val();
    if (select_val != '') {
      $("#edit_dflt_units-error").hide();
    }
  });

  $(document).on('change', '.edit_name_error', function (e) {
    var select_val = $(e.currentTarget).val();
    if (select_val != '') {
      $("#edit_description-error").hide();
    }
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
      $('#delete-category-' + $(this).data('task')).trigger('submit');
    });
  });


  $('#add-category').on('hidden.bs.modal', function (e) {
    $(this).find("select").val('').trigger('change');
    $(this).find('input[name=description]').val('');
    $(this).find('input[name=description]').removeClass('error');
  });

  $('#edit-category').on('hidden.bs.modal', function (e) {
    $(this).find("input[name=description]").val('');
    $(".edit_name_error").removeClass('error');
  });

  $('#add-category').on('show.bs.modal', function (e) {
    $(this).find("#dflt_units-error").hide();
    $(this).find("#description-error").hide();
    $('#status').val(1).trigger('change');
  });

  $('#edit-category').on('show.bs.modal', function (e) {
    var id = $(e.relatedTarget).attr('id');
    $('#catId').val(id);
    $(this).find("#edit_description-error").hide();
    $(this).find("#edit_dflt_units-error").hide();
    $('.editnameError').hide();
    $('#editCat').validate().resetForm();
  });
}

// Income expense category js here

if ($('.main-body .page-wrapper').find('#incExpCategory-settings-container').length) {
  $('.js-example-basic-single-1').select2({
    dropdownParent: $('#add-category')
  });

  $('.js-example-basic-single-2').select2({
    dropdownParent: $('#edit-category')
  });

  $("#dataTableBuilder").DataTable({
    "columnDefs": [{
      "targets": 2,
      "orderable": false
    }],
    "language": {
      "url": app_locale_url
    },
    "pageLength": row_per_page
  });
  $(document).on('click', '.edit_category', function () {
    var id = $(this).attr("id");
    $.ajax({
      url: SITE_URL + "/income-expense-category/edit",
      // data that will be sent
      data: {
        id: id,
        "_token": token
      },
      type: 'POST',
      dataType: 'JSON',
      success: function (data) {
        $('#name').val(data.name);
        $('#type').val(data.type).trigger('change');
        $('#id').val(data.id);
        $('#edit-category').modal();
      }
    });
  });

  $(document).on('keyup change', '.CatName, .catType', function () {
    var catName = $('.CatName').val();
    var catType = $('.catType :selected').val();
    $.ajax({
      url: SITE_URL + "/income-expense-category-valid",
      type: "get",
      data: {
        catName: catName,
        catType: catType,
      },
      success: function (response) {
        if (response == "true") {
          $('.nameError').show();
          $('.nameError').html(jsLang('That Category Name is already taken.'));
          $("button[type=submit]").attr('disabled', 'disabled');
        } else {
          $('.nameError').hide();
          $("button[type=submit]").attr('disabled', false);
        }
      }
    });
  });

  $(document).on('keyup change', '.edit_catName, .edit_catType', function () {
    var id = $("#cat_Id").val();
    var edit_catName = $('.edit_catName').val();
    var edit_catType = $('.edit_catType :selected').val();
    $.ajax({
      url: SITE_URL + "/edit-income-expense-category-valid",
      type: "get",
      data: {
        id: id,
        edit_catName: edit_catName,
        edit_catType: edit_catType,
      },
      success: function (response) {
        if (response == "true") {
          $('.editnameError').show();
          $('.editnameError').html(jsLang('That Category Name is already taken.'));
        } else {
          $('.editnameError').hide();
        }
      }
    });
  });

  $(document).on('change', '.catType', function (e) {
    var select_val = $(e.currentTarget).val();
    if (select_val != '') {
      $("#catType_error").hide();
    }
  });

  $(document).on('change', '.name_error', function (e) {
    var select_val = $(e.currentTarget).val();
    if (select_val != '') {
      $("#edit_catName_error").hide();
    }
  });

  $('#add-category').on('hidden.bs.modal', function (e) {
    var validator = $("#myform1").validate();
    validator.resetForm();
    $(this).find("input[name=name]").val('');
    $(this).find("select").val('').trigger('change');
    $('input[name=name]').removeClass('error');
  });

  $('#add-category').on('show.bs.modal', function (e) {
    $(this).find("#catName_error").hide();
    $(this).find("#catType_error").hide();
  });

  $('#edit-category').on('hidden.bs.modal', function (e) {
    $(this).find("input[name=name]").val('');
    $(".name_error").removeClass('error');
  });

  $('#edit-category').on('show.bs.modal', function (e) {
    var id = $(e.relatedTarget).attr('id');
    $('#cat_Id').val(id);
    $(this).find("#edit_catName_error").hide();
    $('.editnameError').hide();

  });
  if ($('.main-body .page-wrapper').find('#incExpCategory-settings-container').length) {
    $('#myform1').validate({
      rules: {
        name: {
          required: true,
        },
        type: {
          required: true
        }
      }
    });

    $('#editCat').validate({
      rules: {
        name: {
          required: true
        },
        type: {
          required: true
        }
      }
    });
  }

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
      $('#delete-iec-' + $(this).data('task')).trigger('submit');
    });
  });

  $(window).on('load', function () {
    if ($(window).width() < 834) {
      $('#headerTitle').addClass('font-14');
    }
  });
}

// category import js here
if ($('.main-body .page-wrapper').find('#categoryImport-settings-container').length) {
  $('#myform1').validate({
    rules: {
      item_image: {
        required: true
      }
    }
  });

  $('#myform1').on('submit', function (e) {
    var flag = 0;
    $('.valdation_check').each(function () {
      var id = $(this).attr('id');
      if ($('#' + id).val() == '') {
        $('#val_' + id).html(jsLang('This field is required.'));
        flag = 1;
      }
    });

    $('.valdation_select').each(function () {
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

  $(".valdation_check").on('keypress keyup', function () {
    var nm = $(this).attr("id");
    $('#val_' + nm).html("");
  });

  $(".valdation_select").on('click', function () {
    var nm = $(this).attr("id");
    $('#val_' + nm).html("");
  });

  $("#fileRequest").on('click', function () {
    window.location = SITE_URL + "/public/dist/downloads/item_categories.csv";
  });

  $('#note_txt_2').hide();
  $("#validatedCustomFile").on("change", function () {
    //get uploaded filename
    var files = [];
    for (var i = 0; i < $(this)[0].files.length; i++) {
      files.push($(this)[0].files[i].name);
    }
    $(this).next('.custom-file-label').html(files.join(', '));

    //image validation
    var fileName = files.toString();
    var ext = fileName.split('.').pop();
    if ($.inArray(ext, ['csv']) == -1) {
      $('#note_txt_1, #validatedCustomFile-error').hide();
      $('#note_txt_2').show();
      $('#note_txt_2').html('<h6> <span class="text-danger font-weight-bolder">' + jsLang('Invalid file extension') + '</span> </h6> <span class="badge badge-info note-style">' + jsLang('Note') + '</span><small class="text-info"> ' + jsLang('Allowed File Extensions: csv')) + '</small>';
      $("button[type=submit]").attr('disabled', 'disabled');
    } else {
      $("button[type=submit]").removeAttr('disabled');
      $('#note_txt_1, #note_txt_2').hide();
    }
  });
}

// lead source js here
if ($('.main-body .page-wrapper').find('#leadSource-settings-container').length) {

  $('.js-example-basic-single-1').select2({
    dropdownParent: $('#add-lead-source')
  });

  $('.js-example-basic-single-2').select2({
    dropdownParent: $('#edit-lead-source')
  });

  $("#dataTableBuilder").DataTable({
    "columnDefs": [{
      "targets": 2,
      "orderable": false
    }],
    "language": {
      "url": app_locale_url
    },
    "pageLength": row_per_page
  });


  $(document).on('click', '.edit_lead_source', function () {
    var id = $(this).attr("id");
    $.ajax({
      url: SITE_URL + "/edit-lead-source",
      data: {
        id: id,
        "_token": token
      },
      type: 'POST',
      dataType: 'JSON',
      success: function (data) {
        var my_status = data.active_status;
        $('#name').val(data.name);
        $('#my_status').val(my_status).trigger('change');
        $('#source_id').val(data.id);
        $('#edit-lead-source').modal();
      }
    });

  });

  $('#myform1').validate({
    rules: {
      name: {
        required: true,
        remote: SITE_URL + "/leadSource-valid"
      }
    }
  });

  $('#editSource').validate({
    rules: {
      name: {
        required: true,
        remote: {
          url: SITE_URL + "/leadSource-valid",
          type: "GET",
          data: {
            leadSource_id: function () { return $('input[name=source_id]').val(); }
          }
        }
      }
    }
  });

  $('#add-lead-source').on('hidden.bs.modal', function (e) {
    $(this).find('input[name=name]').val('');
    $('#myform1').validate().resetForm();
    $(this).find('input[name=name]').removeClass('error');
  });
  $('#edit-lead-source').on('show.bs.modal', function (e) {
    $('#editSource').validate().resetForm();
  });
  $('#edit-lead-source').on('hidden.bs.modal', function (e) {
    $('input[name=name]').removeClass('error');
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
      $('#delete-leadSource-' + $(this).data('task')).trigger('submit');
    });
  });
  $('#dataTableBuilder').addClass('lead-source-settings');
}

// group js here
if ($('.main-body .page-wrapper').find('#group-settings-container').length) {

    $('.js-example-basic-single-1').select2({
        dropdownParent: $('#add-group')
    });

    $('.js-example-basic-single-2').select2({
        dropdownParent: $('#edit-group')
    });

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


    $(document).on('click', '.edit_group', function () {
        var id = $(this).attr("id");
        $.ajax({
            url: SITE_URL + "/groups/edit",
            data: {
                id: id,
                "_token": token
            },
            type: 'POST',
            dataType: 'JSON',
            success: function (data) {
                var my_status = data.active_status;
                $('#name').val(data.name);
                $('#description').text(data.description);
                $('#my_status').val(my_status).trigger('change');
                $('#group_id').val(data.id);
                $('#edit-group').modal();
            }
        });

    });

    $('#myform1').validate({
        rules: {
            name: {
                required: true,
                maxlength: 50,
                remote: SITE_URL + "/groups/valid"
            }
        }
    });

    $('#editGroup').validate({
        rules: {
            name: {
                required: true,
                maxlength: 50,
                remote: {
                    url: SITE_URL + "/groups/valid",
                    type: "GET",
                    data: {
                        group_id: function () { return $('input[name=group_id]').val(); }
                    }
                }
            }
        }
    });

    $('#add-group').on('hidden.bs.modal', function (e) {
        $(this).find('input[name=name]').val('');
        $('#myform1').validate().resetForm();
        $(this).find('input[name=name]').removeClass('error');
    });
    $('#edit-group').on('show.bs.modal', function (e) {
        $('#editGroup').validate().resetForm();
    });
    $('#edit-group').on('hidden.bs.modal', function (e) {
        $('input[name=name]').removeClass('error');
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
            $('#delete-group-' + $(this).data('task')).trigger('submit');
        });
    });
    $('#dataTableBuilder').addClass('lead-source-settings');
}

// lead status js here
if ($('.main-body .page-wrapper').find('#leadStatus-settings-container').length) {

  $('.js-example-basic-single-1').select2({
    dropdownParent: $('#add-lead-status')
  });

  $('.js-example-basic-single-2').select2({
    dropdownParent: $('#edit-lead-status')
  });
  $(function () {
    $("#dataTableBuilder").DataTable({
      "columnDefs": [{
        "targets": [2, 3],
        "orderable": false
      }],
      "language": {
        "url": app_locale_url
      },
      "pageLength": row_per_page
    });
  });

  $(document).on('click', '.edit_lead_status', function () {
    var id = $(this).attr("id");
    $('#status_id').val($(this).attr("id"));
    $.ajax({
      url: SITE_URL + "/edit-lead-status",
      // data that will be sent
      data: {
        id: id,
        "_token": token
      },
      type: 'POST',
      dataType: 'JSON',
      success: function (data) {
        var my_status = data.active_status;
        $('#name').val(data.name);
        $('#color').val(data.color);
        $('#my_status').val(my_status).trigger('change');
        $('#status_id').val(data.id);
        $('#edit-lead-status').modal();
      }
    });

  });

  $('#myform1').validate({
    rules: {
      name: {
        required: true,
        remote: SITE_URL + "/leadStatus-valid"
      }
    }
  });

  $('#editStatus').validate({
    rules: {
      name: {
        required: true,
        remote: {
          url: SITE_URL + "/leadStatus-valid",
          type: "GET",
          data: {
            leadStatus_id: function () {
              return $('input[name=status_id]').val();
            }
          }
        }
      }
    }
  });

  $('#add-lead-status').on('hidden.bs.modal', function (e) {
    $(this).find('input[name=name]').val('');
    $(this).find('input[name=color]').val('');
    $('#myform1').validate().resetForm();
    $(this).find('input[name=name]').removeClass('error');
  });
  $('#edit-lead-status').on('show.bs.modal', function (e) {
    $('#editStatus').validate().resetForm();
  });
  $('#edit-lead-status').on('hidden.bs.modal', function (e) {
    $('input[name=name]').removeClass('error');
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
      $('#delete-leadStatus-' + $(this).data('task')).trigger('submit');
    });
  });
  $('#dataTableBuilder').addClass('lead-status-setting');
}

// unit settings js here
if ($('.main-body .page-wrapper').find('#unit-settings-container').length) {
  $('#addUnit').validate({
    rules: {
      name: {
        required: true
      },
      abbr: {
        required: true,
        remote: SITE_URL + "/unitAbbr-valid"
      }
    }
  });

  $(document).on('click', '.edit_unit', function () {
    var id = $(this).attr("id");

    $.ajax({
      url: SITE_URL + "/edit-unit",
      data: {
        id: id,
        "_token": token
      },
      type: 'POST',
      dataType: 'JSON',
      success: function (data) {

        $('#unit_name').val(data.name);
        $('#unit_abbr').val(data.abbr);
        $('#unit_id').val(data.id);
        $('#edit-unit').modal();
      }
    });

  });

  $('#editUnit').validate({
    rules: {
      name: {
        required: true
      },
      abbr: {
        required: true,
        remote: {
          url: SITE_URL + "/unitAbbr-valid",
          type: "GET",
          data: {
            unit_id: function () { return $('input[name=unitId]').val(); }
          }
        }
      }
    }
  });

  $('#add-unit').on('hidden.bs.modal', function (e) {
    $('#name').removeClass('error');
    $('#abbr').removeClass('error');
  });

  $('#add-unit').on('show.bs.modal', function (e) {
    $(this).find("input[name=name]").val('');
    $(this).find("input[name=abbr]").val('');
    $('#addUnit').validate().resetForm();
  });

  $('#edit-unit').on('show.bs.modal', function (e) {
    var id = $(e.relatedTarget).attr('id');
    $('#unitId').val(id);
    $('#editUnit').validate().resetForm();
    $('input[name=name]').removeClass('error');
    $('input[name=abbr]').removeClass('error');
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
      $('#delete-unit-' + $(this).data('task')).trigger('submit');
    })
  });
}

// database backup settings js
if ($('.main-body .page-wrapper').find('#dbBackup-settings-container').length) {
  $("#dataTableBuilder").DataTable({
    "order": [],
    "columnDefs": [{
      "targets": 3,
      "orderable": false
    }],

    "language": {
      "url": app_locale_url
    },
    "pageLength": row_per_page
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
      $('#delete-backup-' + $(this).data('task')).trigger('submit');
    })
  });
  $('#dataTableBuilder').addClass('backup-list');
}

// Email setup settings js here
if ($('.main-body .page-wrapper').find('#emailConfig-settings-container').length) {
  jQuery.validator.addMethod("regxEmailValidation", function(value, element) {
    return this.optional(element) || validateEmail(value);
  }, jsLang('Enter a valid email'));
  $('.select').select2();
  $('#myform1').validate({
    rules: {
      protocol: {
        required: true,
        normalizer: function(value) {
            return value.trim();
        }
      },
      encryption: {
        required: true,
        normalizer: function(value) {
            return value.trim();
        }
      },
      smtp_host: {
        required: true,
        normalizer: function(value) {
            return value.trim();
        }
      },
      smtp_port: {
        required: true,
        normalizer: function(value) {
            return value.trim();
        }
      },
      smtp_email: {
        required: true,
        regxEmailValidation: true,
        normalizer: function(value) {
            return value.trim();
        }
      },
      from_address: {
        required: true,
        regxEmailValidation: true,
        normalizer: function(value) {
            return value.trim();
        }
      },
      from_name: {
        required: true,
        regxEmailValidation: true,
        normalizer: function(value) {
            return value.trim();
        }
      },
      smtp_username: {
        required: true,
        regxEmailValidation: true,
        normalizer: function(value) {
            return value.trim();
        }
      },
      smtp_password: {
        required: true,
        normalizer: function(value) {
            return value.trim();
        }
      }
    }
  });

  $("#type").on('change', function () {
    var type = $(this).val();
    if (type == 'smtp') {
      $("#sendmail_form, #sendmail_head").hide();
      $("#smtp_form, #smtp_head").show();
      $("#type_val").attr('value', 'smtp');
    } else {
      $("#sendmail_form, #sendmail_head").show();
      $("#smtp_form, #smtp_head").hide();
      $("#type_val").attr('value', 'sendmail');
    }
  });

  $(window).on('load', function () {
    var type = $("#type").val();
    if (type == 'smtp') {
      $("#sendmail_form, #sendmail_head").hide();
      $("#smtp_form, #smtp_head").show();
      $("#type_val").attr('value', 'smtp');
    } else {
      $("#sendmail_form, #sendmail_head").show();
      $("#smtp_form, #smtp_head").hide();
      $("#type_val").attr('value', 'sendmail');
    }
  });
}

// SMS setup settings js here
if ($('.main-body .page-wrapper').find('#smsConfig-settings-container').length) {
  $('.select').select2();

  $('#myform1').validate({
    rules: {
      default: {
        required: true,
        normalizer: function(value) {
            return value.trim();
        }
      },
      status: {
        required: true,
        normalizer: function(value) {
            return value.trim();
        }
      },
      key: {
        required: true,
        normalizer: function(value) {
            return value.trim();
        }
      },
      secret_key: {
        required: true,
        normalizer: function(value) {
            return value.trim();
        }
      },
      number: {
        required: true,
        regxPhone: true,
        normalizer: function(value) {
            return value.trim();
        }
      }
    }
  });
  jQuery.validator.addMethod("regxPhone", function (value, element) {
    var regExp = new RegExp(/^[\+\d]?(?:[\d-.\s()]*)$/);
    return this.optional(element) || regExp.test(value);
  }, jsLang('Enter a valid phone number'));
}

// Captcha Set up
if ($('.main-body .page-wrapper').find('#captcha-settings-container').length) {
  $('#myform1').validate({
    rules: {
      site_key: {
        required: true,
      },
      
      secret_key: {
        required: true,
      },

      site_verify_url: {
        required: true,
      },

      plugin_url: {
        required: true,
      },
    }
  });
}

// Currency Converter Setup
if ($('.main-body .page-wrapper').find('#currency-converter-settings-container').length) {
  $("input:radio[name=customRadio]").click(function() {
    if ($(this).attr("id") == "customRadio2") {
      $('#exchange_rate_api').val('active');
      $('#currency_converter_api').val('inactive');
    } else if ($(this).attr("id") == "customRadio1") {
      $('#exchange_rate_api').val('inactive');
      $('#currency_converter_api').val('active');
    }
  })
}
