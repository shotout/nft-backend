'use strict';
  $('.iCheck-helper, .view-check').on('click',function(){
    $('#form').trigger('submit');
  });
  var pk = new Piklor(".color-picker", 
    [
      "#1abc9c",
      "#2ecc71",
      "#3498db",
      "#9b59b6",
      "#34495e",
      "#16a085",
      "#27ae60",
      "#2980b9",
      "#8e44ad",
      "#2c3e50",
      "#f1c40f",
      "#e67e22",
      "#e74c3c",
      "#95a5a6",
      "#f39c12",
      "#d35400",
      "#c0392b",
      "#7f8c8d"
    ], 
    {
      open: ".picker-wrapper .btn"
    }), 
    colorInput = pk.getElm("#eventColor"),
    showColor = pk.getElm('#showColor');
    pk.colorChosen(function (col) {
      colorInput.value = col;
      showColor.style.backgroundColor = col;
  });
  $('#eventForm').validate({
    rules: {
      title: {
        required: true
      },
      description: {
        required: false
      },
      start_date: {
        required: true
      },
      end_date: {
        endDateGreaterThanStartDate: true
      },
    }
  });
  $.validator.addMethod("endDateGreaterThanStartDate", function(value, element) {
      var startDate = $('#startDate').val();
      var endDate = $('#endDate').val();
      if (Date.parse(startDate) > Date.parse(endDate)) {
        return false;
      }
      return true;
  }, jsLang('The end date cannot be before the start date.'));

  $('#addEventModal').on('show.bs.modal', function (e) {
    $('#eventForm').validate().resetForm();
    $('input').removeClass('error');
    $(this).find('textarea[name=description]').val('');
  });
  $(document).on('change', '#startDate, #endDate', function() {
    var startDate = $('#startDate').val();
    var endDate = $('#endDate').val();
    if (Date.parse(startDate) > Date.parse(endDate)) {
      $('#end_date-error').html(jsLang('The end date cannot be before the start date.')).css('display', 'block');
    }
  });

  document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      selectable: true,
      initialDate: initialDate,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      },
      events: JSON.parse(calendarEvents),
      dayMaxEventRows: true, // for all non-TimeGrid views
      dateClick: function(info) {
        $("#addEventModal").modal("show");
        $('#startDate').daterangepicker(dateSingleConfig(info.dateStr));
        $('#endDate').daterangepicker(dateSingleConfig(info.dateStr))
        $("#evtTitle").val("");
        $("#evtDes").val("");
        $('#end_date-error').html("");
        $("#endDate").val("");
        $("#eventColor").val("");
        $("#showColor").css("background-color", "");
        $("#gridSystemModalLabel").html(jsLang('Add Event'));
        $('#delete').css('display', 'none');
      },
      eventClick: function(info) {
        var eventObj = info.event;
        if (eventObj.groupId == 6) {
          $("#addEventModal").modal("show");
          $("#gridSystemModalLabel").html(jsLang('Edit Event'));
          $("#evtTitle").val(eventObj.title);
          $("#evtDes").val(eventObj.extendedProps.description.replace('\\r\\n', '\r\n'));
          $('#startDate').daterangepicker(dateSingleConfig(eventObj.start));
          if (eventObj.end == null) {
            $('#endDate').daterangepicker({
                autoUpdateInput: false,
                singleDatePicker: true,
            });
             $('#endDate').on('apply.daterangepicker', function(ev, picker) {
                $(this).val(picker.endDate.format(dateFormatForMoment));
            });
           } else {
              $('#endDate').daterangepicker(dateSingleConfig(eventObj.end));
           }
          $("#eventColor").val(eventObj.backgroundColor);
          $("#showColor").css("background-color", eventObj.backgroundColor);
          $("#eventId").val(eventObj.id);
          $('#delete').css('display', 'block');
        }
      },
    });
    calendar.render();
  });

  $(document).on('click', '#delete', function() {
    swal({
      title: jsLang('Are you sure?'),
      text: jsLang('Once deleted, you will not be able to recover this event.'),
      icon: "warning",
      buttons: [jsLang('Cancel'), jsLang('Ok')],
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        var id = $('#eventId').val();
        var element = $(this);
        var parent = element.parent();
        var  imageIcon = $('.attachment').parent();
        var removeIcon = $('.attachment-delete').parent();
        $.ajax({
          type: "POST",
          url: SITE_URL + '/calendar/event-delete',
          data: {
            id: id, 
            _token: token
          },
          dataType: 'json',
          success: function(response) {
            if (response.status == 1) {
              swal(jsLang('Success! Event has been deleted.'), {
              icon: "success",
              buttons: [false, jsLang('Ok')],
              });
              location.reload();
            } else {
              swal(jsLang('Oops! Something went wrong, please try again.'), {
                icon: "error",
                buttons: [false, jsLang('Ok')],
              });
            }
          }
        });  
      } 
    });
  })
