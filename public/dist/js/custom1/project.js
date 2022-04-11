'use strict';
// Common JS
if ($('.main-body .page-wrapper').find('#project-list-container').length || $('.main-body .page-wrapper').find('#project-task-container').length) {
  var oldMembers = "";
}

if ($('.main-body .page-wrapper').find('#milestone-add-container').length || $('.main-body .page-wrapper').find('#milestone-edit-container').length) {
  var oldMembers = "";
  var from = "";
  var to = "";
}
// End Common JS

// Project List
if ($('.main-body .page-wrapper').find('#project-list-container').length) {
  $(document).on("click", "#csv, #pdf", function(event) {
    event.preventDefault();
    window.location = SITE_URL +"/project_"+ this.id +"?from="+ $('#startfrom').val() +"&to="+ $('#endto').val() +"&status="+ $('#status').val() +"&project_type="+ $('#project_type').val();
  });
  $('#dataTableBuilder').addClass('project-list-styles');
}
// End Project List

// Project Add Edit
if ($('.main-body .page-wrapper').find('#project-add-container').length || $('.main-body .page-wrapper').find('#project-edit-container').length) {
  $('.select2').select2();
  $('#project_tag').select2({
    tags: true
  });
  // Classic editor
  ClassicEditor.create(document.querySelector('.text-editor')).catch(error => {
  });

  $(window).on('load', function() {
    $('.custom_error_show').hide();
    if ($('.main-body .page-wrapper').find('#project-add-container').length) {
      var windowSize = $(window).width();
      if ( windowSize < 576 ) {
        $(".row").addClass("mb-0");
        $('.custom_error_show').removeClass('pl-3');
      }
    }

    if ( windowSize > 429 ) {
      $(".rowAddForText").addClass("row");
    }
  });


  $('#project_from').validate({
    rules: {
      project_name: {
          required: true
      },
      project_type: {
          required: true
      },
      customer_id: {
          required: false
      },
      status:{
         required: true
      },
      'members[]':{
         required: true
      },
      start_date:{
         required:true
      },
    },
    invalidHandler: function(event, validator) {
      $('.custom_error_show').show();
    },

  });

  $('#members').select2({
    placeholder: jsLang('Nothing selected'),
    allowClear: true
  });

  if ($('.main-body .page-wrapper').find('#project-edit-container').length) {
    $(function () {
      var assignObj = $('#customer_id option:selected');
      var name      = assignObj.attr('data-name');
      var email     = assignObj.attr('data-email');
      $('#assign_name').val(name);
      $('#assign_email').val(email);
    });

    if (taskExist == 1) {
      $('#charge_type').prop("disabled", true);
    }
  }

  $(document).on('change', '#customer_id, #project_type', function () {
    var validEmailFormat = true;
    var assignObj = $('option:selected', this);
    var name      = assignObj.attr('data-name');
    var email     = assignObj.attr('data-email');
    $('#assign_name').val(name);
    $('#assign_email').val(email);
    if ($('.main-body .page-wrapper').find('#project-add-container').length) {
      var re = /^[a-zA-Z0-9]+[a-zA-Z0-9_.-]+[a-zA-Z0-9_-]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]+.[a-z]{2,}$/;
      var is_email=re.test(email);
      if (!is_email) {
        validEmailFormat = false;
      }
      if (email != '' && validEmailFormat == true) {
        $('#emailCheckboxDiv').css('display', 'flex');
      } else {
        $('#emailCheckboxDiv').css('display', 'none');
      }
    }
  });
  if ($('.main-body .page-wrapper').find('#project-add-container').length ) {
    $('#startDate, #endDate').daterangepicker(dateSingleConfig());
    $('#endDate').val('');
  }
  if ($('.main-body .page-wrapper').find('#project-edit-container').length) {
    $('#startDate').daterangepicker(dateSingleConfig($('#startDate').val()));
    if ($('#endDate').val() != '') {
      $('#endDate').daterangepicker(dateSingleConfig($('#endDate').val()));
    } else {
      $('#endDate').daterangepicker(dateSingleConfig());
      $('#endDate').val('');
    }
  }
  var type =$('#project_type').val();
  if (type == 'customer') {
    $('.cusDiv').show();
  } else if (type == 'product') {
    $('.cusDiv').hide();
  } else if (type == 'in_house') {
    $('.cusDiv').hide();
  }
  $(document).on('change', '#project_type', function () {
    var projetcType = $(this).val();
    if (projetcType == '') {
      $('#project_type_error').css('display', 'block');
    } else {
      $('#project_type_error').css('display', 'none');
    }
    if (projetcType == 'customer') {
      $('.cusDiv').show();
      $('.permission').show();
    } else if (projetcType == 'product') {
      $('.customerCheck').prop('checked', false);
      $('.cusDiv').hide();
      $('.permission').hide();
    } else if (projetcType == 'in_house') {
      $('.customerCheck').prop('checked', false);
      $('.cusDiv').hide();
      $('.permission').hide();
    }
  });

  $('#total_cost_div').css('display','flex');
  $('#rate_per_hour_div').css('display','none');
  if ($('#charge_type').val() == '1') {
    $('#total_cost').rules('add', 'required');
  } else if ($('#charge_type').val() == '2') {
      $('#total_cost_div').css('display','none');
      $('#rate_per_hour_div').css('display','flex');
      $('#total_cost').rules('remove', 'required');
      $('#rate_per_hour').rules('add', 'required');
  } else if ($('#charge_type').val() == '3') {
      $('#total_cost_div, #rate_per_hour_div').css('display','none');
      $('#total_cost').rules('remove', 'required');
      $('#rate_per_hour').rules('remove', 'required');
  }
  $(document).on('change', '#charge_type', function () {
    $('#total_cost').rules('remove', 'required');
    var chargeType = $(this).val();
    if (chargeType == '1') {
      $('#total_cost_div').css('display','flex');
      $('#rate_per_hour_div').css('display','none');
      $('#total_cost').rules('add', 'required');
      $('#rate_per_hour').rules('remove', 'required');
    } else if (chargeType == '2') {
      $('#total_cost_div').css('display','none');
      $('#rate_per_hour_div').css('display','flex');
      $('#total_cost').rules('remove', 'required');
      $('#rate_per_hour').rules('add', 'required');
    } else if (chargeType == '3') {
      $('#total_cost_div, #rate_per_hour_div').css('display','none');
      $('#total_cost').rules('remove', 'required');
      $('#rate_per_hour').rules('remove', 'required');
    }
  });

  $(window).on('load',function(){
    changePermission();
  });

  $('#project_type').on('change',function(){
    changePermission();
  });

  function changePermission() {
    var type = $('#project_type').val();
    if (type == 'customer') {
      $('#permission_div').show();
    } else {
      $('#permission_div').hide();
    }
  }

  $(document).on('change', '#startDate, #endDate', function() {
    if ($('#startDate').val() != '' && $('#endDate').val() != '') {
      if (Date.parse($('#startDate').val()) > Date.parse($('#endDate').val())) {
        $('#endDate-error').html(jsLang('The end date cannot be before the start date.')).css('display', 'block');
      } else {
        $('#endDate-error').html("").css('display', 'none');
      }
    }
  });

  $(document).on('click', '#btnSubmit', function() {
    if ($('#startDate').val() != '' && $('#endDate').val() != '') {
      if (Date.parse($('#startDate').val()) > Date.parse($('#endDate').val())) {
        $('#endDate-error').html(jsLang('The end date cannot be before the start date.')).css('display', 'block');
        $('#endDate').focus();
        return false;
      } else {
        $('#endDate-error').html("").css('display', 'none');
      }
    }
    if ($("#project_from").valid() == true ) {
      /* load spinner */
      $(".spinner").show();
      $(".spinner").css('line-height', '0');
      $("#spinnerText").text(jsLang('Please wait...'));
      /* end of spinner */
      $(this).attr('disabled','disabled');
      $("#project_from").trigger('submit');
    }
  });

  $(document).on('change', '#status', function () {
    if ($('#status').val() != '') {
      $('#status_error').css('display', 'none');
    } else {
      $('#status_error').css('display', 'block');
    }
  });

  $(document).on('change', '#members', function () {
    if ($('#members').val() != '') {
      $('#members_error').css('display', 'none');
    } else {
      $('#members_error').css('display', 'block');
    }
  });
}
// End Project Add Edit

// Project Overview
if ($('.main-body .page-wrapper').find('#project-overview-container').length) {
    $(window).on('load', function() {
      var windowSize = $(window).width();
      if ( windowSize < 576 ) {
        $('#border-right-1').removeClass("border-right");
        $('div.card-block.m-t-10').addClass("ml-2");
      }
    });

  $('.progressbar').each(function () {
    var elementPos = $(this).offset().top;
    var topOfWindow = $(window).scrollTop();
    var percent = $(this).find('.circle').attr('data-percent');
    var percentage = parseInt(percent, 10) / parseInt(100, 10);
    var animate = $(this).data('animate');
    $(this).data('animate', true);
    $(this).find('.circle').circleProgress({
      startAngle: -Math.PI / 2,
      value: percent / 100,
      thickness: 14,
      fill: {
        color: '#1dc4e8'
      }
    }).on('circle-animation-progress', function (event, progress, stepValue) {
      $(this).find('div').text((stepValue * 100).toFixed(1) + "%");
    }).stop();
  });

  $('#members').select2({
    dropdownParent: $('#parent')
  });

  $(document).on('click', '#memberSetting', function () {
    $('#memberSettingModal').modal();
  });
  $('#memberSettingModal').on('show.bs.modal', function () {
    $(".member_class").val(oldMembers).trigger("change");
  });

  $(document).on('click', '#show-more', function() {
    if ($(this).attr('data-title') == 'show-more') {
      $(this).text(jsLang('SHOW LESS'));
      $('#projectDetailsLess').show();
      $('#initial').hide();
      $('#show-more').attr('data-title', 'show-less');
    } else {
      $(this).text(jsLang('SHOW MORE'));
      $('#projectDetailsLess').hide();
      $('#initial').show();
      $('#show-more').attr('data-title', 'show-more');
    }
  });

  $('#editMember').validate({
    rules: {
      'members[]':{
        required: true
      }
    }
  });

  $(document).on('change', '#members', function () {
    if ($('#members').val() != '') {
      $('#members_error').css('display', 'none');
    } else {
      $('#members_error').css('display', 'block');
    }
  });
}
// End Project Overview

// Project Task
if ($('.main-body .page-wrapper').find('#project-task-container').length) {
  $(".js-example-basic-single").select2();
  // * Set the time range for daterangepicker
  $('#daterange-btn').daterangepicker(daterangeConfig(startDate, endDate), cbRange);
  cbRange(startDate, endDate);

  $('#theModal').on('show.bs.modal', function (e) {
    var button = $(e.relatedTarget);
    var modal = $(this);
    $('#theModalSubmitBtn').attr('data-task', '').removeClass('delete-task-btn');

    if (button.data("label") == 'Delete') {
      modal.find('#theModalSubmitBtn').addClass('delete-task-btn').attr('data-task', button.data('id')).text(jsLang('Delete')).show();
      modal.find('#theModalLabel').text(button.data('title'));
      modal.find('.modal-body').text(button.data('message'));
    } else {
      /* load spinner */
      var spinner = '<div class="spinner">'+
                '<div class="bounce1"></div>'+
                '<div class="bounce2"></div>'+
                '<div class="bounce3"></div>'+
              '</div>';
      modal.find('.modal-body').html(spinner);
      /* end of spinner */

      // load content from value of data-remote url
      modal.find('.modal-body').load(button.data("remote"));
    }
  });

  $('#theModalSubmitBtn').on('click', function () {
    $('#delete-item-'+$(this).data('task')).trigger("submit");
  })

  $(document).on("click", "#csv, #pdf", function(event) {
    event.preventDefault();
    window.location = SITE_URL+"/projectTask" + this.id.charAt(0).toUpperCase()+this.id.slice(1) + "?from=" + $('#startfrom').val() + "&to=" + $('#endto').val() + "&assignee=" + $('#assignee').val() + "&status=" + $('#status').val() + "&priority=" + $('#priority').val() + "&project="+ projectId;
  });
}
// End Project Task

// Project Task Add Edit
if ($('.main-body .page-wrapper').find('#project-task-add-container').length || $('.main-body .page-wrapper').find('#project-task-edit-container').length) {
  $(".js-example-responsive").select2({
    tags: true,
  });

  if ($('.main-body .page-wrapper').find('#project-task-add-container').length) {
    deleteAttachment(SITE_URL + '/file/remove?type=task');
    uploadAttachment(SITE_URL + '/file/upload?type=task', "#user_id");
    $(window).on('load', function() {
      if ($(window).width() <= 1000) {
        $('.col-sm-8').addClass('col-sm-12');
        $('.col-sm-8').removeClass('col-sm-8');
        $('.col-sm-8').addClass('col-sm-8');
        $('.col-sm-8').removeClass('col-sm-8');
        $('.col-sm-3').addClass('col-sm-4');
        $('.col-sm-3').removeClass('col-sm-3');
      }
    });
  }

  $('#project_task_form').validate({
    rules: {
      task_name: {
        required: true
      },
      start_date:{
        required:true
      },
      task_details:{
        required: true
      }
    },
  });


  $('#startDate').daterangepicker(dateSingleConfig());
  if ($('#dueDate').val() != '') {
    $('#dueDate').daterangepicker(dateSingleConfig($('#dueDate').val()));
  } else {
    $('#dueDate').daterangepicker(dateSingleConfig());
    $('#dueDate').val('');
  }
  $('#dueDate').daterangepicker(dateSingleConfig());
  $('#dueDate').val('');

  //Set myself as assignee to the creating task
  $('#assign_me').on('click', function() {
    var assigned = $('#assignee').val();
    assigned.push(loggedUserId);
    $('#assignee').val(assigned).trigger('change');
  });

  $(document).on('change', '#assignee', function() {
    var assigned = $('#assignee').val();
    if (jQuery.inArray( loggedUserId, assigned ) == 0) {
      $('#assign_me').hide();
    } else if (jQuery.inArray( loggedUserId, assigned ) != 0) {
      $('#assign_me').show();
    }
  });

  $('#priority, #assignee, #status').select2();

  $('#customer').select2({
    placeholder: jsLang('Select a customer'),
    allowClear: true
  });

  $('#milestone').select2();

  $('#assignee').select2({
    placeholder: jsLang('Nothing selected'),
    allowClear: true
  });

  // checklist Item Starts
  // EVENT DELEGATION
  $("#checklistAddBtn").on('click', function(e) {
    e.preventDefault();
    var todoItem = $("#myInput").val();
    //checking for empty & short input
    if (todoItem === '') {
      swal(jsLang('Empty checklist'), {
        icon: "error",
        buttons: [false, jsLang('Ok')],
      });
      return false;
    }
    else if(todoItem.length < 5) {
      swal(jsLang('Too Short checklist'), {
        icon: "error",
        buttons: [false, jsLang('Ok')],
      });
      return false;
    }
    if ($('.main-body .page-wrapper').find('#project-task-edit-container').length) {
      $.ajax({
        type: "POST",
        url : SITE_URL + '/checklist_edit/add',
        token: token,
        data: {'task_id': $("#task_id").val(), 'title': todoItem, '_token': token },
         dataType:'json',
         success: function (data) {
            if (data.message == 'success') {
              var row = "<li class='checkbox checkbox-primary'>"+
                      "<input type='checkbox' name='todo-item-done' class='todo-item-done' id='checklist_status_"+data.item.id+"' value='"+data.item.title+"'  />"+
                      "<label for='checklist_status_"+data.item.id+"' class='cr f-12'>"+
                      "<span class='checklist_label cursor_text' data-id='"+data.item.id+"' title='Click to edit'>"+data.item.title+"</span>"+
                      "<span class='todo-item-delete text-c-red f-18' id='"+data.item.title+"'><i class='feather icon-trash-2'></i></span></label>"+
                    "</li>";
              $("#myUL").append(row);
              $("#myInput").val("");
            } else {
              swal(data.message, {
                icon: "error",
                buttons: [false, jsLang('Ok')],
              });
            }
         }
      });
    } else if ($('.main-body .page-wrapper').find('#project-task-add-container').length) {
      // Creating a Hidden div containing all checklist to pass in Post request
      var hiddenDiv = document.createElement("input");
      hiddenDiv.setAttribute("type", "hidden");
      hiddenDiv.setAttribute("id",todoItem );
      hiddenDiv.setAttribute("value",todoItem );
      hiddenDiv.setAttribute("name","allCheckListHiidenInput[]" );
      document.getElementById("checklistCollector").appendChild(hiddenDiv);
      $("#myUL").append("<li id='"+ todoItem +"'>"+ todoItem +
                           " <span class='todo-item-delete text-c-red f-18' id='"+ todoItem +"'>"+
                           "<i class='feather icon-trash-2'></i></span></li>");
      $("#myInput").val("");
    }
  });

  if ($('.main-body .page-wrapper').find('#project-task-edit-container').length) {
    $(document).on('click', ".todo-item-done", function() {
      var id = $(this).attr('id');
      id = id.split("_")[2];
      var status = $(this).is(":checked");
      $.ajax({
        type: "POST",
        url: SITE_URL+'/checklist/change_status',
        token: token,
        data: {'id':id, 'status': status, '_token': token},
        success: function (data) {
          if(data.message == 'success'){
            if (data.item.is_checked == 1) {
              $("span[data-id=" + id + "]").addClass("strike");
            } else {
              $("span[data-id=" + id + "]").removeClass("strike");
            }
          }
        }
      });
    });
  }

  $("#myUL").on('click', '.todo-item-delete', function(e) {
    var item = this;
    if ($('.main-body .page-wrapper').find('#project-task-edit-container').length) {
      swal({
        title: jsLang('Are you sure?'),
        text: jsLang('Once deleted, you will not be able to recover this checklist.'),
        icon: "warning",
        buttons: [jsLang('Cancel'), jsLang('Ok')],
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          var element = $(this);
          var parent = element.parent();
          var  imageIcon = $('.attachment').parent();
          var removeIcon = $('.attachment-delete').parent();
          var item_name = item.id;

          // deleting from DB through AJAX
          $.ajax({
            type: "POST",
            url : SITE_URL + '/checklist/delete',
            token: token,
            data: $(project_task_form).serialize()+ "&id=" + item_name,
            dataType:'json',
            success: function (data) {
              if (data.message == 'success') {
                // Deleting items from hidden div which contains the checklist that will be used in Post request
                var r = document.getElementById('checklistCollector').getElementsByTagName('input');
                for (var m = 0; m < r.length;m++) {
                  if (r[m].value == item.id) {
                    r[m].remove();
                  }
                }

                $(item).parent().fadeOut('fast', function() {
                  $(item).parent().remove();
                });

                swal(jsLang('Success! Checklist has been deleted.'), {
                  icon: "success",
                  buttons: [false, jsLang('Ok')],
                });
              }
            }
          });
        }
      });
    } else if ($('.main-body .page-wrapper').find('#project-task-add-container').length) {
      var r = document.getElementById('checklistCollector').getElementsByTagName('input');
      for(var m = 0; m < r.length; m++) {
        if(r[m].value==item.id) {
          r[m].remove();
        }
      }
      $(item).parent().fadeOut('fast', function() {
        $(item).parent().remove();
      })
    }
  });

  $(document).on('change', '#startDate, #dueDate', function() {
    var startDate = $('#startDate').val();
    var dueDate = $('#dueDate').val();
    if (startDate != '' && dueDate != '') {
      if (Date.parse(startDate) > Date.parse(dueDate)) {
        $('#due_date-error').html(jsLang('The due date cannot be before the start date.')).css('display', 'block');
      } else {
        $('#due_date-error').html("").css('display', 'none');
      }
    }
  });

  $(document).on('click', '#btnSubmit', function(){
    var startDate = $('#startDate').val();
    var dueDate = $('#dueDate').val();
    if (startDate != '' && dueDate != '') {
      if (Date.parse(startDate) > Date.parse(dueDate)) {
        $('#due_date-error').html(jsLang('The due date cannot be before the start date.')).css('display', 'block');
        $('#dueDate').focus();
        return false ;
      } else {
        $('#due_date-error').html("").css('display', 'none');
      }
    }

    if ($("#project_task_form").valid() == true) {
      $(this).attr('disabled','disabled');
      $("#project_task_form").trigger('submit');
    }
  });

  if (projectChargeType != '' && projectChargeType == 3) {
    $('#hourly_rate_div').css('display', 'flex');
    $('#hourly_rate').rules('add', 'required');
  } else {
    $('#hourly_rate_div').css('display', 'none');
    $('#hourly_rate').rules('remove', 'required');
  }
  // checklist Ends
}
// End Project Task Add Edit

// Project Timesheet
if ($('.main-body .page-wrapper').find('#project-timesheet-container').length) {
  $(document).on("click", "#csv, #pdf", function(event) {
    event.preventDefault();
    window.location = SITE_URL+"/project/timersheet/" + this.id + "?project="+ projectId;
  });
}
// End Project Timesheet

// Project Milestones List
if ($('.main-body .page-wrapper').find('#project-milestone-container').length) {
  $(document).on("click", "#csv, #pdf", function(event) {
    event.preventDefault();
    window.location = SITE_URL+"/project/milestones/" + this.id + "?project="+ projectId;
  });
  $('#dataTableBuilder').addClass('milestone-list');
}
// End Project Milestones List

// Project Milestone Add Edit
if ($('.main-body .page-wrapper').find('#milestone-add-container').length || $('.main-body .page-wrapper').find('#milestone-edit-container').length) {
  ClassicEditor.create(document.querySelector('#description'));
  $('#milestone_form').validate({
    rules: {
      name: "required",
      due_date: "required",
    },
  });
  $('#dueDate').daterangepicker(dateSingleConfig());
}
// End Project Milestone Add Edit

// Project Files List
if ($('.main-body .page-wrapper').find('#project-files-container').length) {
  $('#dataTableBuilder_length').remove();
  uploadAttachment(SITE_URL + '/project/files/store', "#project_id", ".dropzone-attachments", true);
}
// End Project Files List

// Project Tickets List
if ($('.main-body .page-wrapper').find('#project-ticket-list-container').length) {
  $(".select2").select2();
  $('#daterange-btn').daterangepicker(daterangeConfig(startDate, endDate), cbRange);
  cbRange(startDate, endDate);
  $(document).on("click", "#csv, #pdf", function(event){
   event.preventDefault();
    window.location = SITE_URL+"/ticket_" + this.id + "?from="+ $('#startfrom').val() +"&to="+ $('#endto').val() +"&project="+ projectId +"&department_id="+ $('#department_id').val() +"&status="+ $('#status').val();
  });
  $('#dataTableBuilder').addClass('project-ticket-list-styles');
  $(document).on('click',".ticket_status_change", function () {
    var statusId = $(this).attr('data-id');
    var ticketId = $(this).attr('ticket_id');
    ticketStatusChange(SITE_URL + '/ticket/change-status', statusId, ticketId);
  });
  $(document).on('click',".ticket_priority_change", function () {
    var priorityId = $(this).attr('data-id');
    var ticketId = $(this).attr('ticket_id');
    ticketPriorityChange(SITE_URL + '/ticket/priority-status', priorityId, ticketId);
  });
}
// End Project Tickets List

// Project Invoices List
if ($('.main-body .page-wrapper').find('#project-invoice-list-container').length) {
  $('#daterange-btn').daterangepicker(daterangeConfig(startDate, endDate), cbRange);
  cbRange(startDate, endDate);

  $(document).on("click", "#csv, #pdf", function(event){
    event.preventDefault();
    window.location = SITE_URL+"/project_invoice_" + this.id + "?from=" + $('#startfrom').val() + "&to=" + $('#endto').val() + "&project=" + projectId;
  });
}
// End Project Invoices List

// Project Note
if ($('.main-body .page-wrapper').find('#project-note-container').length) {
  var editEditor;
  var theEditor;
  $('#update-note').validate({
      ignore: [],
      rules: {
        content: {
          CKEditorRequired: true
        },
        subject: {
          required: true
        }
      }
  });
  $('#addNote').validate({
      ignore: [],
      rules: {
        content: {
          CKEditorRequired: true
        },
        subject: {
          required: true
        }
      }
  });
  validateCKEditor('#note_add_messages', '#note_add_messages-error');
  var editorValue;
  ClassicEditor.create(document.querySelector('#note_content_edit'))
    .then(editor => {
      editorValue = editor;
      theEditor = editor.getData(); // Save for later use.
      editor.model.document.on('change', () => {
        let editorData = editor.getData();
        editorData = editorData.replace(/&nbsp;/g, '').replace('<p>', '').replace('</p>', '').replace(/^\s+|\s+$/g, "");
        theEditor = editorData;
        if (editorData.length == 0) {
          $('#note_content_edit-error').show().html(jsLang('This field is required.'));
          return false;
        } else {
          $('#note_content_edit-error').hide().html('');
        }
      });
    }).catch(error => {});
  $('.edit-btn').on('click', function () {
    var id = $(this).attr('data-id');
    $("#id").val(id);
    $("#note-id").html(id);
    $.ajax({
      url: SITE_URL + '/project/notes/edit/' + id,
      type: 'GET',
      success: function (data) {
        var note = JSON.parse(data);
        $("#note_subject_edit").val(note.subject);
        $("#note_content_edit").html(note.content);
        editorValue.setData(note.content)
      },
    });
  });

  $('#modal-default').on('show.bs.modal', function() {
    $('#update-note').validate(). resetForm();
  });
  $('#theModal').on('show.bs.modal', function (e) {
    var button = $(e.relatedTarget);
    var modal = $(this);
    $('#theModalSubmitBtn').attr('data-task', '').removeClass('delete-task-btn');

    if (button.data("label") == 'Delete') {
      modal.find('#theModalSubmitBtn').addClass('delete-task-btn').attr('data-task', button.data('id')).text(jsLang('Delete')).show();
      modal.find('#theModalLabel').text(button.data('title'));
      modal.find('.modal-body').text(button.data('message'));
    } else {
      /* load spinner */
      var spinner = '<div class="spinner">'+
                '<div class="bounce1"></div>'+
                '<div class="bounce2"></div>'+
                '<div class="bounce3"></div>'+
              '</div>';
      modal.find('.modal-body').html(spinner);
      /* end of spinner */

      // load content from value of data-remote url
      modal.find('.modal-body').load(button.data("remote"));
    }
  });

  $('#theModalSubmitBtn').on('click', function () {
    $('#delete-item-'+$(this).data('task')).trigger('submit');
  })
}
// End Project Note
