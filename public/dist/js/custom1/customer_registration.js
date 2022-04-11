'use strict';
$(".js-example-basic-single").select2();
$("#countrySelect > span").addClass('state-visible');
$('.select2-selection--single').css('border','1px solid #dddddd');
$(".select2-selection__rendered").css('color', '#aaaeba');
$('#stateVisible').hide();
$('#customerRegistration').validate({
    rules: {
        first_name: {
            required: true
        },
         last_name: {
            required: true
        },
        email: {
            required: true
        },
        password:{
            required: true
        },
        password_confirmation:{
           required: true
        },
        country:{
           required: true
        }
    }
});

$(document).on('change', '#country', function() {
    var country = $('#country :selected').val();
    if (country != '') {
        $('#country-error').hide();
        if(country == 1) {
            $('#stateVisible').show();
            $("#stateVisible > span").addClass('state-visible');
            $("#select2-country-container").addClass('color_black');
            $("#select2-state-container").addClass('color_black');
            var state = populateStates();
            $('#state').append(state);
            $('#state').select().val('').trigger('change');
        } else {
            $("#select2-country-container").addClass('color_black');
            $('#stateVisible').hide();
        }
    } else {
        $('#country-error').css('display', 'block');
    }

});