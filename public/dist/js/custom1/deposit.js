    'use strict';
    $(".select2").select2();

    $('#deposit-add-container input,#deposit-edit-container input').on('keyup', function() {
        $(this).valid();
      });

    if (($('.main-body .page-wrapper').find('#deposit-add-container').length)) {
      $('#deposit-add-container #trans_date').daterangepicker(dateSingleConfig());

      $('#deposit-add-container #deposit').validate({
        rules: {
          account_no: {
            required: true
          },
          trans_date: {
            required: true
          },
          amount: {
            required: true,
          },
          category_id: {
            required: true
          },
          payment_method: {
            required: true
          },
          attachment: {
            fileType: "jpg|png|gif|doc|docx|pdf",
            remote: function(element){
              if (element.files.length != 0) {
                return { url : SITE_URL + "/is-valid-file-size", data: { filesize: element.files[0].size }}
              }
            },
          },
        }
      });

      function numberRound(num) {
        var n = parseFloat(num).toFixed(2);
        return n;
      }

        $('#validatedCustomFile').on('change', function (e) {
            var files = [];
            for (var i = 0; i < $(this)[0].files.length; i++) {
                files.push($(this)[0].files[i].name);
            }
            $(this).next('.custom-file-label').html(files.join(', '));
            //image validation
            var file = this.files[0];
            var fileType = file["type"];
            var validImageTypes = ["image/gif", "image/jpg", "image/jpeg", "image/png", "image/bmp", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
            if ($.inArray(fileType, validImageTypes) < 0) {
                $('#divNote').show();
                $('#note_txt_1').hide();
                $('#note_txt_2').html('<h6> <span class="text-danger font-weight-bolder"> ' + jsLang('Invalid file extension') + ' </span> </h6> <span class="badge badge-danger">' + jsLang('Note') +'!</span> ' + jsLang('Allowed File Extensions: jpg, png, gif, bmp'));
                $('#note_txt_2').show();
                $('#prvw').hide();
                $("#btnSubmit").attr('disabled',true);
            } else {
                $("#btnSubmit").removeAttr('disabled');
                $('#prvw').show();
                $('#divNote, #note_txt_2, #note_txt_1').hide();
            }
        });

      $('#deposit-add-container #account_no').on('change', function() {
        let account_no = $(this).val();
        let currency_code = $('option:selected', this).attr('currency-code');
        let currency_id = $('option:selected', this).attr('currency-id');
        let date = $('#trans_date').val();
        if (account_no == '' || currency_id == '') {
          $('label[for="account_no"]').css('display', 'block');
          $('.message').removeClass('text-success').html('');
        } else {
          var url = SITE_URL + "/get/balance";
          $.ajax({
            url: url,
            method: "POST",
            data: {
              'account_no': account_no,
              'date': date,
              '_token': token
            },
            dataType: "json",
            success: function(data) {
              if (data.status == 1) {
                $('label[for="account_no"]').css('display', 'none');
                $('.message').removeClass('text-danger').addClass('text-success').html('<strong>' + jsLang('Current Balance') + ':' + ' ' + getDecimalNumberFormat(data.balance) + ' ' + currency_code + '</strong>');
                $('#currency_id').val(currency_id);
              }
            }
          });
        }
      });

      $(document).ready(function() {
        function readURL(input) {
          if (input.files && input.files[0]) {
            var reader = new FileReader();
            $('#prvw').removeAttr('hidden');
            $('#imgAnchor').removeAttr('hidden');
            $('#divNote').hide();
            reader.onload = function(e) {
              $('#blah').attr('src', e.target.result);
              $('#imgAnchor').attr('href', e.target.result);
              $('#imgAnchor').attr('data-toggle', 'lightbox');
            }
            reader.readAsDataURL(input.files[0]);
          }
        }
      });

    }

// Deposit edit

if (($('.main-body .page-wrapper').find('#deposit-edit-container').length)) {
  $(document).ready(function() {
    $('#deposit-edit-container #deposit').validate({
      rules: {
        transaction_date: {
          required: true
        },
        amount: {
          required: true,
        },
        category_id: {
          required: true
        },
        payment_method: {
          required: true
        },
        attachment: {
          fileType: "jpg|png|gif|doc|docx|pdf",
          remote: function(element){
            if (element.files.length != 0) {
              return { url : SITE_URL + "/is-valid-file-size", data: { filesize: element.files[0].size }}
            }
          },
        },
      }
    });

  });

  $(document).ready(function() {
    function readURL(input) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        $('#prvw').removeAttr('hidden');
        $('#imgAnchor').removeAttr('hidden');
        $('#divNote').hide();
        reader.onload = function(e) {
          $('#blah').attr('src', e.target.result);
          $('#imgAnchor').attr('href', e.target.result);
          $('#imgAnchor').attr('data-toggle', 'lightbox');
        }
        reader.readAsDataURL(input.files[0]);
      }
    }
  });

  $(document).on('click', '#deposit-edit-container .attachment-delete', function() {
    swal({
        title: jsLang('Are you sure?'),
        text: jsLang('Once deleted, you will not be able to recover this file.'),
        icon: "warning",
        buttons: [jsLang('Cancel'), jsLang('Ok')],
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          var element = $(this);
          var parent = element.parent();
          var imageIcon = $('.attachment').parent();
          var removeIcon = $('.attachment-delete').parent();
          $.ajax({
            type: "POST",
            url: SITE_URL + "/deposit/file/delete",
            data: {
              id: element.attr('data-depositId'),
              filePath: "public/uploads/deposit",
              _token: token
            },
            dataType: 'json',
            success: function(response) {
              if (response.status == 1) {
                imageIcon.remove();
                removeIcon.remove();
                swal(jsLang('Success! Your file has been deleted.'), {
                  icon: "success",
                });
              } else {
                swal(jsLang('Something went wrong, please try again.'), {
                  icon: "error",
                  buttons: [false, jsLang('Ok')],
                });
              }
            }
          });
        }
      });
  });
}

// List
if (($('.main-body .page-wrapper').find('.list-container').length)) {
  $(function() {
    $(document).on("click", ".list-container #csv, .list-container #pdf", function(event) {
      event.preventDefault();
      window.location = SITE_URL + "/bank_account/deposit_" + this.id + "?to=" + $('#endto').val() + "&from=" + $('#startfrom').val() + "&account_no=" + $('.list-container #account_no').val();
    });
    $('body').tooltip({
      selector: '[data-toggle="tooltip"]'
    });
  });

  $('.list-container #dataTableBuilder').addClass('deposit-list');
}
