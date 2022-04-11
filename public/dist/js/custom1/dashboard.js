'use strict';
$(".select2").select2();

$('#daterange-btn').daterangepicker(daterangeConfig(startDate, endDate), cbRange);

function cbRange(start, end, label) {
var start        = formatMomentDate(start);
var end          = formatMomentDate(end);
if (start == formatMomentDate(new Date(0))) {
  $('#daterange-btn span').html('<i class="fa fa-calendar"> </i> ' + label);
  $('#startfrom,#endto').val('');
} else {
  $('#startfrom').val(start);
  $('#endto').val(end);
  $('#daterange-btn span').html('<i class="fa fa-calendar"> </i> ' + label);
}
$('#dashboardForm').trigger('submit');
}

$(document).ready(function(){
if (startDate == '') {
  $('#daterange-btn span').html('<i class="fa fa-calendar"> </i> ' + jsLang('Pick a date range'));
} else {
  $('#daterange-btn span').html('<i class="fa fa-calendar"> </i> ' + startDate + ' - ' +endDate );
}
});
  
$(window).on('load', function() {
  var windowSize = $(window).width();
  if ( windowSize > 767 ) {
    $('#smallDevice').removeClass("col-sm-12");
    $('#smallDevicePx').removeClass("px-0");
    $('#smallDevicePx').addClass("pr-0");

    $('#smallDevice').addClass("row");
    $("#quotationPie").addClass("mr-0 pr-1");
  }
  if ( windowSize == 768 ) {
    $('#currencySelector').removeClass("offset-md-6");
  }
  if ( windowSize < 767 ) {
    $("#quotationPie").addClass("mr-0 pr-1");
    $('#smallDevicePx').removeClass("pr-0");
    $('#smallDevice').removeClass("col-sm-12");
    $('#smallDevicePx').removeClass("px-0");
    $('#smallDevicePx').addClass("pr-0");

    $('#smallDevice').addClass("row");
    $("#quotationPie").addClass("mr-0 pr-1");
  }
  if ( windowSize < 576 ) {
    $('#removeBorder>div').removeClass("border border-top-0 border-bottom-0 border border-left-0");
    $('#smallDevice').removeClass("col-sm-12");
    $('#smallDevice').addClass("row");
    $('#smallDevicePx').removeClass("pr-0");
  }

  // Pie-Chart-1 Start of Chart JS
  var bar = document.getElementById("chart-pie-1").getContext('2d');
  var theme_g2 = bar.createLinearGradient(100, 0, 300, 0);
  theme_g2.addColorStop(0, 'rgba(137, 159, 212, 0.9)');
  theme_g2.addColorStop(1, 'rgba(163, 137, 212, 0.9)');
  var data1 = {
      labels: [
          "Paid",
          "Overdue",
          "Due"
      ],
      datasets: [{
          data: [paid, overdue, due],
          backgroundColor: [
              theme_g2,
              "#FFA07A",
              "#F0E68C"
          ],
          hoverBackgroundColor: [
              theme_g2,
              "#FFA09A",
              "#F0E69C"
          ]
      }]
  };
  var myPieChart1 = new Chart(bar, {
      type: 'pie',
      data: data1,
      responsive: true,
      options: {
          maintainAspectRatio: false,
          legend: {
            display: false
          }
      }
  });

  var canvas = document.getElementsByClassName('chartPieSecond')[0];
  var context = canvas.getContext('2d');
  var notInvoiced = total - invoiced;

  var theme_g22 = context.createLinearGradient(100, 0, 300, 0);
  theme_g22.addColorStop(0, 'rgba(137, 159, 212, 0.9)');
  theme_g22.addColorStop(1, 'rgba(163, 137, 212, 0.9)');
  var data2 = {
      labels: [
          "Successful" +" ("+ invoiced +")",
          "Not Successful" +" ("+ notInvoiced +")"
      ],
      datasets: [{
          data: [invoiced, notInvoiced],
          backgroundColor: [
              "#76b852",
              "#faae40"
          ],
          hoverBackgroundColor: [
              "#76b852",
              "#faae40"
          ]
      }]
  };
  var myPieChart2 = new Chart(context, {
      type: 'pie',
      data: data2,
      responsive: true,
      options: {
          maintainAspectRatio: false,
          legend: {
            display: false
          }
      }
  });
  var canvas = document.getElementsByClassName('chartPieThird')[0];
  var context = canvas.getContext('2d');
  var data3 = {
      labels: labels,
      datasets: [{
          data: counts,
          backgroundColor: colors,
          hoverBackgroundColor: colors
      }]
  };
  var myPieChart3 = new Chart(context, {
      type: 'pie',
      data: data3,
      responsive: true,
      options: {
          maintainAspectRatio: false,
          legend: {
            display: false
          }
      }
  });
});

  $('#currency').on('change', function(){
    $('#dashboardForm').trigger('submit');
  });