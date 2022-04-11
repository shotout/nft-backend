"use strict";
$(function(){
    $('.error').hide();
});

// customer_header.blade.php
$('.lang').on('click', function() {
    var lang = $(this).attr('id');
    var url = SITE_URL + '/change-lang';
    $.ajax({
        url   :url,
        data:{
            _token:token,
            lang:lang,
            type:'user'
        },
        type:"POST",
        success:function(data){
            if(data == 1) {
                location.reload();
            }
        },
         error: function(xhr, desc, err) {
            return 0;
        }
    });
});

// header.blade.php
$(document).on('click', '#itemNotifications', function () {
  $('#notifications').html('<img id="itemNotificationsLoader" src="'+SITE_URL+'/public/dist/img/loader/spiner.gif" />');
  $.ajax({
    url: SITE_URL + '/item-notifications',
    method: "GET",
    success:function(data){
        var itemNotifications = JSON.parse(data);
        var liElements = '';
        var counter = 0;
        $.each(itemNotifications, function( index, value ) {
          liElements += '<li class="notification">' +
                              '<div class="media">' +
                                  '<i class="fas fa-exclamation-triangle triangle-exclamation"></i>' +
                                  '<div class="media-body">' +
                                      '<p class="mr-20">Item Name :<strong>' + value.name + '</strong><span class="n-time text-muted"></p>' +
                                      '<p>Quantity : <strong>' + value.qty + '</strong></p>' +
                                  '</div>' +
                              '</div>' +
                          '</li>';
            counter++;
        });
        $('#itemCount').text(counter);
        $('#notifications').html(liElements);
    }
  });
});