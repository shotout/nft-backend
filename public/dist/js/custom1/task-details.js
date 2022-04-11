'use strict';
$('#dataTableBuilder, .task-v-preview').on('click', '.task_class, .add-attachments', function () {
    var  task_id = $(this).attr('data-id');
    $.ajax({
      url: SITE_URL + "/task/files",
      data:{
        "task_id":task_id
      },
      type: 'GET',
      dataType: 'JSON',
      success: function (data) {
        if (data.status == 1) {
          var files='';
          var image_ext = ['gif','png','jpg','jpeg'];
          $.each(data.files, function(key,value) {
            var name = value.file_name;
            var ext = name.split('.').pop();
            if (value.object_type =='Task' && jQuery.inArray(ext, image_ext)!='-1') {
              var pic = '/public/uploads/tasks/'+ value.file_name;
              var img_file = '<a class="cursor_pointer" href="'+SITE_URL+'/'+pic+'"  data-lightbox="image-1"> <img src="'+SITE_URL+'/'+pic+'" alt="'+value.original_file_name+'" class="img-thumbnail attachment-styles"></a>';
            } else {
              var img_file = '<p class="attachment_name">'+ ext +'</p>';            
            }
            var download_path = '/public/uploads/tasks/'+ value.file_name;
            var originalFileName = value.original_file_name;

            if (originalFileName != null) {
              if (originalFileName.length > 50) {
                originalFileName = originalFileName.trim();
                originalFileName = originalFileName.substring(0, 48) + "...";
              } else {
                originalFileName = value.original_file_name;
              }
            }
            files+='<table class="table_styles" id="table_id_'+value.id+'">'+
            '<tr >'+
            '<td class="td_styles">'+
             img_file+
            '</td>'+
            '<td class="td_styles1">&nbsp;&nbsp;</td>'+

            '<td class="td_styles1">'+ '<span title="'+value.original_file_name+'">'+ originalFileName +'</span>'+
              '<a href="'+SITE_URL+'/'+download_path+'" data-toggle="tooltip" data-placement="top" title="Download" class="cursor_pointer ml-15" download="'+value.file_name+'"><i class="fa fa-download"></i><a/>'+
                '<i class="feather icon-trash-2 attachment-item-delete color_red cursor_pointer ml-15" data-id="'+value.id+'"></i>'+'<br/>'+ jsLang('File Added') +' : '+value.created_at+
               '<br/>'+
            '</td>'+
            '</tr>'+
            '</table>'; 
          });
          $('#filesDiv').css('display', 'block');
          $('#files').html(files);
        } else {
          $('#filesDiv').css('display', 'none');
        }
      }
    });
});

var statusPicture = $("#uploader-text");
var msg = "";

$(".dropzone-attachments").dropzone({
  url: SITE_URL + "/task/file-upload?type=task",
  paramName: "attachment",
  headers: {
    'X-CSRF-TOKEN':  token
  },
  createImageThumbnails: false,
  sending: function(file, xhr, formData) {
    formData.append("task_id", $("#task_id").val());
    statusPicture.text(jsLang('Uploading...'));
  },
  maxFiles: 15,
  clickable: [$('.add-attachments').get(0)],
  error: function() {
    statusPicture.text(jsLang('Upload failed, unknown error!'));
  },
  complete: function(file) {
    if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0) {
      statusPicture.html(msg);
    }
  },
  success: function(file, response){
    var res = JSON.parse(response);
    if (res.result == true) {
      var url = SITE_URL+'/public/dist/js/html5lightbox/no_preview.png?v' + res.data.attachment_id;
      var extra = '';
      var div = '';
      var groupName = "task-"+res.data.task_id;
      if (jQuery.inArray(res.data.attachment_extension, ['gif','png','jpg','jpeg']) != -1) {
        var pic = '/public/uploads/tasks/'+ res.data.attachment_name;
        var img_file = '<a class="cursor_pointer" href="'+SITE_URL+'/'+pic+'"  data-lightbox="image-1"> <img src="'+SITE_URL+'/'+pic+'" alt="'+res.data.attachment_original_name+'" class="img-thumbnail attachment-styles"></a>';
      } else {
          var name = res.data.attachment_name;
          var ext = name.split('.').pop();
          var img_file = '<p class="attachment_name">'+ ext +'</p>';  
      }

      var download_path = '/public/uploads/tasks/'+ res.data.attachment_name;
      var originalFileName = res.data.attachment_original_name;
      if (originalFileName != null) {
        if (originalFileName.length > 50) {
          originalFileName = originalFileName.trim();
          originalFileName = originalFileName.substring(0, 48) + "...";
        } else {
          originalFileName = res.data.attachment_original_name;
        }
      }
      var files ='<table class="table-hover table_styles" id="table_id_'+res.data.attachment_id+'">'+
            '<tr >'+
            '<td class="td_styles">'+
             img_file+
            '</td>'+
            '<td class="td_styles1">&nbsp;&nbsp;</td>'+

            '<td class="td_styles1">'+
              '<span title="'+res.data.attachment_original_name+'">'+ originalFileName +'</span>' +
              '<a href="'+SITE_URL+'/'+download_path+'" data-toggle="tooltip" data-placement="top" title="Download" class="cursor_pointer ml-15" download="'+res.data.attachment_name+'"><i class="fa fa-download"></i><a/>'+
              '<i class="feather icon-trash-2 attachment-item-delete color_red cursor_pointer ml-15" data-id="'+res.data.attachment_id+'"></i>'+'<br/>'+
                jsLang('File Added') +' : '+res.data.created_at+
               '<br/>'+
            '</td>'+
            '</tr>'+
            '</table>'; 
      $('#files').prepend(files);
      msg = "";
    } else {
      msg = '<span class="text-danger">'+res.data.errorMessage+'</span>';
    }
  }
});
deleteAttachment(SITE_URL + '/task/file-remove?type=task');
$('#task-modal').on('hide.bs.modal', function (e) {
  $('.list-attachments').remove();
});