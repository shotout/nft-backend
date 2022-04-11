'use strict';
$(document).on('click', '#btnSubmit', function() {
    /* load spinner */
    $(".spinner").css('display', 'inline-block');
    $(".spinner").css('line-height', '0');
    $("#spinnerText").text(jsLang('Sign In'));
    /* end of spinner */
    $(this).attr('disabled','disabled');
    $("#customerSignInform").trigger('submit');
})
