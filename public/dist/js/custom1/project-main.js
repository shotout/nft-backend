'use strict';
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