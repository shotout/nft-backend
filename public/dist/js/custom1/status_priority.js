"use strict";

/**
 * ticketStatusChange
 * change ticket status from the ticket list
 * @param  String url
 * @param  String statusId
 * @param  String ticketId
 * @return void
 */
function ticketStatusChange(url, statusId, ticketId) {
  $.ajax({
    url: url,
    method:"POST",
    data:{
      'status_id':statusId,
      'ticketId':ticketId,
      '_token':token
    },
    dataType:"json",
    success:function(data) {
      if (data.status == 1) {
        var previousTotal = parseInt($('#'+ data.preStatusName).html()) - parseInt(1);
        var newTotal = parseInt($('#'+ data.newStatusName).html()) + parseInt(1);
        $('#'+ data.preStatusName).html(previousTotal);
        $('#'+ data.newStatusName).html(newTotal);
        $("#dataTableBuilder").DataTable().ajax.reload();
      } else {
        var html = '<div class="alert alert-danger">' +
                      '<button type="button" class="close" data-dismiss="alert">×</button>' +
                      '<strong>Something went wrong, please try again.</strong>' +
                    '</div>';
        $('.noti-alert').append(html);
        $('#notifications').css('display', 'block');
      }
    }
  });
}

/**
 * ticketPriorityChange
 * change ticket priority status from the ticket list
 * @param  String url
 * @param  String priorityId
 * @param  String ticketId
 * @return void
 */
function ticketPriorityChange(url, priorityId, ticketId, ticketName) {
  $.ajax({
    url:url,
    method:"get",
    data:{
      'priorityId':priorityId,
      'ticketId':ticketId,
      '_token':token
    },
    dataType:"json",
    success:function(data) {
        if (data.status == 1) {
            $('#removeLiPriority ul').empty();
            $('#removeLiPriority ul').append(data.output);
            $('.priority-color').html(ticketName);
            if ($.trim(ticketName) == $.trim('High')) {
                $(".priority-color").css("background-color", "#f2d2d2");
            } else if ($.trim(ticketName) ==  $.trim('Low')) {
                $(".priority-color").css("background-color", "#e1e0e0");
            } else if ($.trim(ticketName) ==  $.trim('Medium')) {
                $(".priority-color").css("background-color", "#fae39f");
            }
      } else {
        var html = '<div class="alert alert-danger">' +
                      '<button type="button" class="close" data-dismiss="alert">×</button>' +
                      '<strong>Something went wrong, please try again.</strong>' +
                    '</div>';
        $('.noti-alert').append(html);
        $('#notifications').css('display', 'block');
      }
    }
  });
}
