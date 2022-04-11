'use strict';
// knowledge list js here
if ($('.main-body .page-wrapper').find('#knowledge-container-index').length) {
    $('body').tooltip({selector: '[data-toggle="tooltip"]'});
    $(document).on("click", "#csv, #pdf", function (event) {
        event.preventDefault();
        window.location = SITE_URL + "/knowledge-base/" + this.id + "?group_id=" + $('#group_id').val()+"&status="+$('#status').val()+"&from="+$('#startfrom').val()+"&to="+$('#endto').val();
    });
    $('#dataTableBuilder').addClass('knowledge-list');
}

// knowledge js here
if ($('.main-body .page-wrapper').find('#knowledge-container').length) {
    var editorDescription;
    ClassicEditor.create(document.querySelector('#description'))
        .then(editor => {
            editorDescription = editor;
            theEditor = intialData = editor.getData(); // Save for later use.
            editor.model.document.on('change', () => {
                let editorData = intialData = editor.getData();
                editorData = editorData.replace(/&nbsp;/g, '').replace('<p>', '').replace('</p>', '').replace(/^\s+|\s+$/g, "");
                theEditor = editorData;
                if (editorData.length == 0) {
                    $('#description-error').show().html(jsLang('This field is required.'));
                    return false;
                } else {
                    $('#description-error').hide().html('');
                }
            });
        }).catch(error => {
    });
    $(".select2").select2();
    // form validation
    $('#knowledgeAdd').validate({
        rules: {
            subject: {
                required: true,
                maxlength: 290,
            },
            group_id: {
                required: true
            },
        }
    });

    $('#knowledgeEdit').validate({
        rules: {
            subject: {
                required: true,
                maxlength: 290,
            },
            slug: {
                required: true,
                maxlength: 290,
            },
            group_id: {
                required: true
            },
        }
    });

    $('#btnSubmit').on('click', function () {
        btnSubmit('#knowledgeAdd')
    });
    $('#btnUpdate').on('click', function () {
        btnSubmit('#knowledgeEdit')
    });

    function btnSubmit(formId) {
        if ($(formId).valid() == true) {
            $(".spinner").show().css('line-height', '0');
            $("#spinnerText").text(jsLang('Please wait...'));
            $(this).attr("disabled", true);
            $(formId).trigger('submit');
        }
    }
    $(document).on('keyup', '#subject', function() {
        var str = this.value.replace(/[&\/\\#@,+()$~%.'":*?<>{}]/g, "");
        $('#slug').val(str.trim().toLowerCase().replace(/\s/g, "-"));
    });

    $(document).on('keyup', '#slug', function() {
        var str = this.value.replace(/[&\/\\#@,+()$~%.'":*?<>{}]/g, "");
        $('#slug').val(str.trim().toLowerCase().replace(/\s/g, "-"));
    });
}
