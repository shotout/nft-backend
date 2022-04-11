"use strict";
$('.lang').on('click', function() {
    var lang = $(this).attr('id');
    var url = SITE_URL + '/change-lang';
    $.ajax({
      url:url,
      data:{
        _token:token,
        lang:lang,
        type:'customer'
      },
      type:"POST",
      success:function(data){
        if (data == 1) {
          location.reload();
        }
      },
      error: function(xhr, desc, err) {
        return 0;
      }
    });
});

$("#notifications").fadeTo(2000, 500).slideUp(500, function(){
    $("#notifications").slideUp(500);
}); 

$(function(){
  $('.error').hide();
});

$('#confirmDelete').on('show.bs.modal', function (e) {
  $message = $(e.relatedTarget).attr('data-message');
  $(this).find('.modal-body p').text($message);
  $title = $(e.relatedTarget).attr('data-title');
  $(this).find('.modal-title').text($title);
  var form = $(e.relatedTarget).closest('form');
  $(this).find('.modal-footer #confirm').data('form', form);
});


$('#confirmDelete').find('.modal-footer #confirm').on('click', function(){
  $(this).data('form').trigger('submit');
});

if (($('.main-body .page-wrapper').find('#customer-panel-list-layout-container').length)) {
  $(function() {
    $(".select2").select2();
    $('.selectpicker').selectpicker();
  });

  $('#daterange-btn').daterangepicker(daterangeConfig(startDate, endDate), cbRange);
  cbRange(startDate, endDate);

  $(document).on("click", "#tablereload", function(event){
    event.preventDefault();
    $("#dataTableBuilder").DataTable().ajax.reload();
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
      modal.find('.modal-body').load(button.data("remote"));
    }
  });

  $('#theModalSubmitBtn').on('click', function () {
    $('#delete-item-'+$(this).data('task')).trigger('submit');
  })
}