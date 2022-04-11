'use strict';
if ($('.main-body .page-wrapper').find('#timesheet-container').length) {
    $('body').tooltip({selector: '[data-toggle="tooltip"]'});
    var assignee    = $('#assignee').val();
    var project     = $('#project').val();
    var running     = $('#running').val();
    var to          = $('#endto').val();
    var from        = $('#startfrom').val();

    $(document).on("click", "#csv, #pdf", function(event){
        event.preventDefault();
        window.location = SITE_URL+"/timesheet-list-" + this.id + "?to=" + $('#endto').val() + "&from=" + $('#startfrom').val() + "&project=" + project + "&assignee=" + assignee + "&running=" + running;
    });
    $('#dataTableBuilder').addClass('timesheet_list_table');
}