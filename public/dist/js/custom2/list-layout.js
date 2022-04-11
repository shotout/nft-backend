'use strict';

if ($('.main-body .page-wrapper').find('#list-layout-container').length) {
  $('.selectpicker').selectpicker();
  $(".select2").select2();
  $('#daterange-btn').daterangepicker(daterangeConfig(startDate, endDate), cbRange);
  cbRange(startDate, endDate);
  $(document).on("click", "#tablereload", function(event) {
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
      // load content from value of data-remote url
      modal.find('.modal-body').load(button.data("remote"));
    }
  });

  $('#theModalSubmitBtn').on('click', function () {
    $('#delete-item-'+$(this).data('task')).trigger('submit');
  });
}

