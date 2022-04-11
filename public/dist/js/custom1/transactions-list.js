// Purchase list
'use strict';
$(document).ready(function() {
  $('.select2').select2();
});
$(document).on("click", "#csv", function(event){
  event.preventDefault();
  var method = $('#method').val();
  var to = $('#endto').val();
  var from = $('#startfrom').val();
  var mode = $('#mode').val();
  var type = $('#type').val();
  
  window.location = SITE_URL+"/transaction/csv?to="+to+"&from="+from+"&method="+method+"&mode="+mode+"&type="+type;
});

$(document).on("click", "#pdf", function(event){
  event.preventDefault();
  var method = $('#method').val();  
  var to = $('#endto').val();
  var from = $('#startfrom').val();
  var mode = $('#mode').val();
  var type = $('#type').val();

  window.location = SITE_URL+"/transaction/pdf?to="+to+"&from="+from+"&method="+method+"&mode="+mode+"&type="+type; 
});
$('#dataTableBuilder').addClass('transaction-list');