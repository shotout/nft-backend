'use strict';
if (($('.main-body .page-wrapper').find('#barcode-container').length)) {
  $(document).ready(function() {
    $("#printBtn").on('click', function() {
      var mode = 'iframe';
      var close = mode == "popup";
      var options = {
        mode: mode,
        popClose: close
      };
      $("div.barcode").printArea(options);
    });
  });

  $('.select').select2();
  var stack = [];
  var token = $("#token").val();

  $("#search").autocomplete({
    source: function(request, response) {
      $.ajax({
        url: SITE_URL + "/barcode/search",
        dataType: "json",
        type: "POST",
        data: {
          _token: token,
          search: request.term
        },
        success: function(data) {
          if (data.status_no == 1) {
            $("#val_item").html();
            var data = data.items;
            $('#no_div').css('display', 'none');
            response($.map(data, function(item) {
              return {
                id: item.id,
                value: item.description,
                stock_id: item.stock_id
              }
            }).slice(0, 10));
          } else {
            $('.ui-menu-item').remove();
            $("#no_div").css('display', 'block');
          }
        }
      })
    },

    select: function(event, ui) {
      var e = ui.item;
      if (e.id) {
        if (!in_array(e.id, stack)) {
          stack.push(e.id);

          var new_row = '<tr id="rowid' + e.id + '">' +
            '<td class="text-center">' + e.value + ' <input type="hidden" name="id[]" value="' + e.id + '"><input type="hidden" name="name[]" value="' + e.value + '"><input type="hidden" name="stock_id[]" value="' + e.stock_id + '"></td>' +
            '<td><input class="form-control text-center no_units m-b-10 positive-int-number quantity" min="0" name="quantity[]" value="1" id="quantity_' + e.id + '"></td>' +
            '<td class="text-center"><span id="' + e.id + '" class="text-center btn btn-xs btn-danger delete_item"><i class="feather icon-trash-2"></i></span></td>'
          '</tr>';

          $(new_row).insertAfter($('table tr.dynamicRows'));
          $('.tableInfo').show();

        } else {
          $('#quantity_' + e.id).val(function(i, oldval) {
            return ++oldval;
          });

        }

        $(this).val('');
        $('#val_item').html('');
        return false;
      }
    },
    minLength: 1,
    autoFocus: true
  });

  $(document).on('click', ".delete_item", function(e) {
    var productId = $(this).attr('id');
    for (var i = 0; i < stack.length; i++) {
      if (stack[i] == productId) {
        stack.splice(i, 1);
      }
    }
  })

  function in_array(search, array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] == search) {
        return true;
      }
    }
    return false;
  }

  $("#btnSubmit").on('click', function(e) {
    if (stack && stack.length == 0) {
      $("#alert").fadeTo(10000, 500).slideUp(500, function() {
        $("#alert").slideUp(500);
      });
      e.preventDefault();

    }
    $('.quantity').each(function() {
      if ($(this).val() <= 0) {
        $("#quantity-alert").fadeTo(10000, 500).slideUp(500, function() {
          $("#quantity-alert").slideUp(500);
        });
        e.preventDefault();
      }
    });
  });
  $(document).on('click', ".delete_item", function(e) {
    $(this).parent().parent().remove();
  });
}