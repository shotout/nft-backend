'use strict';

if (($('.main-body .page-wrapper').find('#cus-panel-ticket-add-container').length)) {
	$(".select2").select2();
	$("body").on("click", ".delete_file_field", function() {
		$(this).parents(".control-group").remove();
	});
	validateCKEditor('#ticket_messages', '#ticket_messages-error');
	$('#ticket_form').validate({
		ignore: [],
		rules: {
			subject: {
				required: true
			},
			message: {
				CKEditorRequired: true
			},
		}
	});

	$(document).ready(function() {
		$('select').on("change", function() {
			if ($(this).val() != "") {
				$(this).valid();
			}
		});
	});
	deleteAttachment(SITE_URL + "/promotion/upload");
	uploadAttachment(SITE_URL + "/promotion/upload", '#customer_id');

	
	$('#btnSubmit').on('click', function() {
		if ($("#ticket_form").valid() == true) {
			/* load spinner */
			$(".spinner").show();
			$(".spinner").css('line-height', '0');
			$("#spinnerText").text('Please wait...');
			/* end of spinner */
			$(this).attr("disabled", true);
			$("#promotion_form").trigger('submit');
		}
	});
}