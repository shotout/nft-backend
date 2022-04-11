'use strict';
if ($('.main-body .page-wrapper').find('#sales-report-datewise,#purchase-report-datewise').length != 1) {
  $(".select2").select2();
}
// Expense report js here
if ($('.main-body .page-wrapper').find('#expense-report-container').length) {
   
    $('#startfrom').daterangepicker(reportDateConfig(startDate), function(start, end) {
        var startDate = moment(start, 'MMMM D, YYYY').format('MMMM-YYYY');
        $('#startfrom').val(startDate);
    });

    $('#endto').daterangepicker(reportDateConfig(endDate), function(start, end) {
      var endDate = moment(start, 'MMMM D, YYYY').format('MMMM-YYYY');
      $('#endto').val(endDate);
    });

    $('.btn-group').remove();
    $('.dataTables_length').remove();
    $('#expenseList_paginate, #expenseList_info').remove();
}

// Income vs expense report js here
if ($('.main-body .page-wrapper').find('#inc-vs-exp-report').length) {

    $('#startfrom').daterangepicker(reportDateConfig(startDate), function(start, end) {
        var startDate = moment(start, 'MMMM D, YYYY').format('MMMM-YYYY');
        $('#startfrom').val(startDate);
    });

    $('#endto').daterangepicker(reportDateConfig(endDate), function(start, end) {
        var endDate = moment(start, 'MMMM D, YYYY').format('MMMM-YYYY');
        $('#endto').val(endDate);
    });

    var revenue = $('#revenue').val();
    var income  = $('#income').val();
    var expense = $('#expense').val();
    $('#totalIncome').text(income);
    $('#totalExpense').text(expense);
    $('#totalRevenue').text(revenue);
    
    // [ line-chart ] start
    var sign = $('#sign').val();
    var bar = document.getElementById("chart-line-1").getContext('2d');
    var data1 = {
        labels: JSON.parse(dateGraph),
        datasets: [{
            label: "Income",
            data: JSON.parse(incomeGraph),
            fill: false,
            borderWidth: 4,
            borderColor: "#17a2b8",
            backgroundColor: "#17a2b8",
            hoverborderColor: "#17a2b8",
            hoverBackgroundColor: "#17a2b8",
        }, {
            label: "Expense",
            data: JSON.parse(expenseGraph),
            fill: false,
            borderWidth: 4,
            borderColor: "#899FD4",
            backgroundColor: "#899FD4",
            hoverborderColor: "#899FD4",
            hoverBackgroundColor: "#899FD4",
        }, {
            label: "Revenue",
            data: JSON.parse(revenueGraph),
            fill: false,
            borderWidth: 4,
            borderColor: "#28a745",
            backgroundColor: "#28a745",
            hoverborderColor: "#28a745",
            hoverBackgroundColor: "#28a745",
        }]
    };
    var myBarChart = new Chart(bar, {
        type: 'line',
        data: data1,
        responsive: true,
        options: {
            barValueSpacing: 20,
            maintainAspectRatio: false,
        }
    });
    // [ line-chart ] end
}

// Expense report js here
if ($('.main-body .page-wrapper').find('#expense-report-container').length) {

  $('#startfrom').daterangepicker(reportDateConfig(startDate), function(start, end) {
    var startDate = moment(start, 'MMMM D, YYYY').format('MMMM-YYYY');
    $('#startfrom').val(startDate);
  });

  $('#endto').daterangepicker(reportDateConfig(endDate), function(start, end) {
    var endDate = moment(start, 'MMMM D, YYYY').format('MMMM-YYYY');
    $('#endto').val(endDate);
  });

  $('.btn-group').remove();
  $('.dataTables_length').remove();
  $('#expenseList_paginate, #expenseList_info').remove();

  //Line chart JS Start
  var MONTHS = new Array();
  $.each(months, function(key, value) {
    MONTHS.push(value);
  });

  if (MONTHS != undefined || MONTHS.length != 0) {
    var config = {
      type: 'line',
      data: {
        labels: MONTHS,
        datasets: expenseData,
      },
      options: {
        responsive: true,
        title: {
          display: false,
          text: ''
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: ''
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Value'
            }
          }]
        }
      }
    };

    var ctx = document.getElementById('chartJsLineBasic').getContext('2d');
    window.myLine = new Chart(ctx, config);
  }
  //End Line Chart
}

// Income report js here
if ($('.main-body .page-wrapper').find('#income-report-container').length) {

  $('#startfrom').daterangepicker(reportDateConfig(startDate), function(start, end){
      var startDate = moment(start, 'MMMM D, YYYY').format('MMMM-YYYY');
      $('#startfrom').val(startDate);
  });

  $('#endto').daterangepicker(reportDateConfig(endDate), function(start, end){
      var endDate = moment(start, 'MMMM D, YYYY').format('MMMM-YYYY');
      $('#endto').val(endDate);
  });

  $('#startfrom').on('click', function(){
      var from = $("#startfrom").val().split("-");
      var month = getMonthNumber(from[0]);
      $(".ui-datepicker-month").val(month-1);
      $(".ui-datepicker-year").val(from[1]);
  });

  $('#endto').on('click', function(){
      var to = $("#endto").val().split("-");
      var month = getMonthNumber(to[0]);
      $(".ui-datepicker-month").val(month - 1);
      $(".ui-datepicker-year").val(to[1]);
  });
  
  $('.date-pick').on('click', function () {
      $('.ui-priority-secondary').remove();
  });


  $('.btn-group').remove();
  $('.dataTables_length').remove();
  $('#incomeList_paginate, #incomeList_info').remove();
  //Line chart JS Start
  var MONTHS = new Array();
  $.each(months, function(key, value) {
    MONTHS.push(value);
  });
  
  if (MONTHS != undefined || MONTHS.length != 0) {
    var config = {
      type: 'line',
      data: {
        labels: MONTHS,
        datasets: incomeData,
      },
      options: {
        responsive: true,
        title: {
          display: false,
          text: ''
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: ''
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Value'
            }
          }]
        }
      }
    };

    var ctx = document.getElementById('chartJsLineBasic').getContext('2d');
    window.myLine = new Chart(ctx, config);
  }
  //End Line Chart
}

// Sale report js here
if ($('.main-body .page-wrapper').find('#list-layout-container').length) {
  $("#searchType").on('change', function() {
    var type = $(this).val();
    if (type == 'custom') {
      $('.dateField').show();
      $('.yearField, .monthField').hide();
    } else if (type == 'yearly') {
      $('.dateField').hide();
      $('.yearField').show();
      $('#year option:selected').removeAttr('selected');
      $('#year').val('all').trigger('change');
    } else if (type != 'custom' && type != 'yearly') {
      $('.dateField, .yearField, .monthField').hide();
    }
  });

  // Month list showing
  $("#year").on('change', function() {
    var year = $(this).val();
    $('#month').val('all').trigger('change');
    if (year != 'all') {
      $(".monthField").show();
    } else {
      $(".monthField").hide();
    }
  });

  $(document).ready(function() {
    $('.barChart').removeAttr('style');
    $('.dateField, .yearField, .monthField').hide();
    var type = $('#searchType').val();
    var year = $('#year').val();
    var month = $('#month').val();
    if (type == 'custom') {

      $('.dateField').show();
      $('.yearField, .monthField').hide();

    } else if (type == 'yearly') {
      $('.yearField').show();
      $('.dateField').hide();
      if (year != 'all') {
        $('.monthField').show();
      }
    }

    $("#on_sale_msg").insertBefore($('#dataTableBuilder_info'));
  });

  //product type
  $(window).on('load', function() {
    changeProductInput();
  });

  $('#type').on('change', function() {
    changeProductInput();
  });

  function changeProductInput() {
    var type = $('#type').val();
    if (type == 'product') {
      $('#product_div').show();
      $('#service_div').hide();
    } else if (type == 'service') {
      $('#product_div').hide();
      $('#service_div').show();
    }
  }

  //get customer by currency
  $('#currency').on('change', function() {
    var currency = $(this).val();
    var url = SITE_URL + "/report/sales-report/get-customer";
    var token = token
    $.ajax({
      url: url,
      method: "POST",
      data: {
        'currency': currency,
        '_token': token
      },
      dataType: "json",
      success: function(data) {
        if (data.status == 1) {
          $('#customer').html(data.customers);
        }
      }
    });
  });

  function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
      vars[key] = value;
    });
    return vars;
  }

  function isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }


  $(document).on("click", "#pdf", function(event) {
    event.preventDefault();
    var params = {};
    params = getUrlVars();
    var from = isEmpty(params) ? $('#from').val() : params.from;
    var to = isEmpty(params) ? $('#to').val() : params.to;
    var searchType = isEmpty(params) ? $("#searchType").val() : params.searchType;
    var currency = isEmpty(params) ? 'null' : params.currency;
    var customer = isEmpty(params) ? 'null' : params.customer;
    var location = isEmpty(params) ? 'null' : params.location;
    var month = isEmpty(params) ? 'null' : params.month;
    var product = isEmpty(params) ? 'null' : params.product;
    var service = isEmpty(params) ? 'null' : params.service;
    var type = isEmpty(params) ? 'null' : params.type;
    var year = isEmpty(params) ? 'null' : params.year;

    window.location = SITE_URL + "/report/sales-report-pdf?from=" + from + "&to=" + to + "&searchType=" + searchType + "&year=" + year + "&month=" + month + "&type=" + type + "&product=" + product + "&service=" + service + "&location=" + location + "&currency=" + currency + "&customer=" + customer;
  });

  $(document).on("click", "#csv", function(event) {
    event.preventDefault();
    var params = {};
    params = getUrlVars();
    var from = isEmpty(params) ? $('#from').val() : params.from;
    var to = isEmpty(params) ? $('#to').val() : params.to;
    var searchType = isEmpty(params) ? $("#searchType").val() : params.searchType;
    var currency = isEmpty(params) ? 'null' : params.currency;
    var customer = isEmpty(params) ? 'null' : params.customer;
    var location = isEmpty(params) ? 'null' : params.location;
    var month = isEmpty(params) ? 'null' : params.month;
    var product = isEmpty(params) ? 'null' : params.product;
    var service = isEmpty(params) ? 'null' : params.service;
    var type = isEmpty(params) ? 'null' : params.type;
    var year = isEmpty(params) ? 'null' : params.year;

    window.location = SITE_URL + "/report/sales-report-csv?from=" + from + "&to=" + to + "&searchType=" + searchType + "&year=" + year + "&month=" + month + "&type=" + type + "&product=" + product + "&service=" + service + "&location=" + location + "&currency=" + currency + "&customer=" + customer;
  });

  $(document).ready(function() {
    // [ line-chart ] start
    var sign = $('#sign').val();
    var bar = document.getElementById("chart-line-1").getContext('2d');
    var data1 = {
      labels: JSON.parse(date),
      datasets: [{
        label: "Sales (" + sign + totalActualSale + ")",
        data: JSON.parse(sale),
        fill: false,
        borderWidth: 4,
        borderColor: "#17a2b8",
        backgroundColor: "#17a2b8",
        hoverborderColor: "#17a2b8",
        hoverBackgroundColor: "#17a2b8",
      }, {
        label: "Purchase (" + sign + totalPurchase + ")",
        data: JSON.parse(purchase),
        fill: false,
        borderWidth: 4,
        borderColor: "#899FD4",
        backgroundColor: "#899FD4",
        hoverborderColor: "#899FD4",
        hoverBackgroundColor: "#899FD4",
      }, {
        label: "Profit (" + sign + totalProfitAmount + ")",
        data: JSON.parse(profit),
        fill: false,
        borderWidth: 4,
        borderColor: "#28a745",
        backgroundColor: "#28a745",
        hoverborderColor: "#28a745",
        hoverBackgroundColor: "#28a745",
      }, {
        label: "Tax (" + sign + totalSaleTax + ")",
        data: JSON.parse(tax),
        fill: false,
        borderWidth: 4,
        borderColor: "#fd7e14",
        backgroundColor: "#fd7e14",
        hoverborderColor: "#fd7e14",
        hoverBackgroundColor: "#fd7e14",
      }]
    };
    var myBarChart = new Chart(bar, {
      type: 'line',
      data: data1,
      responsive: true,
      options: {
        barValueSpacing: 20,
        maintainAspectRatio: false,
      }
    });
    // [ line-chart ] end
  })
  $('#dataTableBuilder').addClass('sale-report');
}

// Sale report js here
if ($('.main-body .page-wrapper').find('#card-with-header-buttons').length) {
  $(function () {
   $(".select2").select2({});
   $(document).on("click", "#pdf", function(event){
      event.preventDefault();
      window.location = SITE_URL+"/report/inventory-stock-on-hand-pdf?type="+ $('#category').val() +"&location=" + $('#location').val();
    });

   $(document).on("click", "#csv", function(event){
      event.preventDefault();
      window.location = SITE_URL+"/report/inventory-stock-on-hand-csv?type=" + $('#category').val() + "&location=" + $('#location').val();
    });

   $(document).on("click", "#tablereload", function(event){
      event.preventDefault();
      $("#dataTableBuilder").DataTable().ajax.reload();
   });

   $(document).on('click', '.close', function(event) {
      $("#on_hand_msg").remove();
   });
  });
}

// Leads report js here
if ($('.main-body .page-wrapper').find('#leads-report-container').length) {
  $(".select2").select2();
  $(function() {
    $('#startfrom').daterangepicker(reportDateConfig(startDate), function(start, end){
       var startDate = moment(start, 'MMMM D, YYYY').format('MMMM-YYYY');
       $('#startfrom').val(startDate);
    });
    
    $('#endto').daterangepicker(reportDateConfig(endDate), function(start, end){
       var endDate = moment(start, 'MMMM D, YYYY').format('MMMM-YYYY');
       $('#endto').val(endDate);
    });
  });

  $('#startfrom').on('click', function() {
    var from = $("#startfrom").val().split("-");
    var month = getMonthNumber(from[0]);
    $(".ui-datepicker-month").val(month - 1);
    $(".ui-datepicker-year").val(from[1]);
  });

  $('#endto').on('click', function() {
    var to = $("#endto").val().split("-");
    var month = getMonthNumber(to[0]);
    $(".ui-datepicker-month").val(month - 1);
    $(".ui-datepicker-year").val(to[1]);
  });

  $('.date-pick').on('click', function() {
    $('.ui-priority-secondary').remove();
  });

  $(window).on('load', function() {
    var windowSize = $(window).width();
    if (windowSize > 767) {
      $('#smallDevice').removeClass("col-sm-12");
      $('#smallDevice-2').removeClass("col-sm-12");
      $('#smallDevicePx').removeClass("px-0");
      $('#smallDevicePx-2').removeClass("px-0");
      $('#smallDevicePx').addClass("pr-0");
      $('#smallDevicePx-2').addClass("pr-0");

      $('#smallDevice').addClass("row");
      $('#smallDevice-2').addClass("row");

      if (MONTHS != undefined || MONTHS.length != 0) {
        var config = {
          type: 'line',
          data: {
            labels: MONTHS,
            datasets: leadDataByStatus
          },
          options: {
            responsive: true,
            legend: {
              display: false
            },
            maintainAspectRatio: true,
            aspectRatio: 2,
            title: {
              display: false,
              text: ''
            },
            tooltips: {
              mode: 'index',
              intersect: false,
            },
            hover: {
              mode: 'nearest',
              intersect: true
            },
            scales: {
              xAxes: [{
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: ''
                }
              }],
              yAxes: [{
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Value'
                }
              }]
            }
          }
        };

        var ctx = document.getElementById('chartJsLineBasic').getContext('2d');
        window.myLine = new Chart(ctx, config);
      }
      //End Line Chart
    }
    if (windowSize < 767) {
      $('#smallDevicePx').removeClass("pr-0");
      $('#smallDevicePx-2').removeClass("pr-0");
      $('#smallDevice').removeClass("col-sm-12");
      $('#smallDevice-2').removeClass("col-sm-12");
      $('#smallDevicePx').removeClass("px-0");
      $('#smallDevicePx').addClass("pr-0");

      $('#smallDevice').addClass("row");
      $('#smallDevice-2').addClass("row");
    }
    if (windowSize < 576) {
      $('#removeBorder>div').removeClass("border border-top-0 border-bottom-0 border border-left-0");
      $('#smallDevice').removeClass("col-sm-12");
      $('#smallDevice-2').removeClass("col-sm-12");
      $('#smallDevice').addClass("row");
      $('#smallDevice-2').addClass("row");
      $('#smallDevicePx').removeClass("pr-0");
      $('#smallDevicePx-2').removeClass("pr-0");

      if (MONTHS != undefined || MONTHS.length != 0) {
        var config = {
          type: 'line',
          data: {
            labels: MONTHS,
            datasets: leadData
          },
          options: {
            responsive: true,
            legend: {
              display: false
            },
            maintainAspectRatio: true,
            aspectRatio: 1,
            title: {
              display: false,
              text: ''
            },
            tooltips: {
              mode: 'index',
              intersect: false,
            },
            hover: {
              mode: 'nearest',
              intersect: true
            },
            scales: {
              xAxes: [{
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: ''
                }
              }],
              yAxes: [{
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: 'Value'
                }
              }]
            }
          }
        };

        var ctx = document.getElementById('chart-pie-3').getContext('2d');
        window.myLine = new Chart(ctx, config);
      }
    }
  });

  $(document).ready(function() {
    var canvas = document.getElementsByClassName('chartPieStatus')[0];
    var context = canvas.getContext('2d');
    var data3 = {
      labels: labelsLeadByStatus,
      datasets: [{
        data: countsLeadByStatus,
        backgroundColor: colorsLeadByStatus,
        hoverBackgroundColor: colorsLeadByStatus
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
        },
      }
    });

    var canvas = document.getElementsByClassName('chartPieSource')[0];
    var context = canvas.getContext('2d');
    var data3 = {
      labels: labelsLeadBySource,
      datasets: [{
        data: countsLeadBySource,
        backgroundColor: colorsLeadBySource,
        hoverBackgroundColor: colorsLeadBySource
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
        },
      }
    });
  });
}

// Expense report js here
if ($('.main-body .page-wrapper').find('#orderListFilter').length) {
  $(function() {
    $(".barChart").show();

    $("#searchType").on('change', function() {
      var type = $(this).val();
      if (type == 'custom') {
        $('.dateField').show();
        $('.yearField, .monthField').hide();
      } else if (type != 'custom' && type == 'yearly') {
        $('.dateField').hide();
        $('.yearField').show();
        $('#year option:selected').removeAttr('selected');
        $('#year').val('all').trigger('change');
      } else if (type != 'custom' && type != 'yearly') {
        $('.dateField, .yearField, .monthField').hide();
      }
    });
    // Month list showing
    $("#year").on('change', function() {
      var year = $(this).val();
      $('#month').val('all').trigger('change');
      if (year != 'all') {
        $(".monthField").show();
      } else {
        $(".monthField").hide();
      }
    });
  });

  $(document).ready(function() {
    $('.dateField').hide();
    $('.yearField, .monthField').hide();
    var type = $('#searchType').val();
    var year = $('#year').val();
    var month = $('#month').val();
    if (type == 'custom') {

      $('.dateField').show();
      $('.yearField').hide();
      $('.monthField').hide();

    } else if (type == 'yearly') {
      $('.yearField').show();
      $('.dateField').hide();
      if (year != 'all') {
        $('.monthField').show();
      }
    }

  });


  function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
      vars[key] = value;
    });
    return vars;
  }

  function isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }


  $(document).on("click", "#pdf", function(event) {
    event.preventDefault();
    var params = {};
    params = getUrlVars();
    if (isEmpty(params)) {
      var from = $('#from').val();
      var to = $('#to').val();
      var searchType = $("#searchType").val();
      var currency = 'null';
      var supplier = 'null';
      var location = 'null';
      var month = 'null';
      var product = 'null';
      var service = 'null';
      var type = 'null';
      var year = 'null';

      window.location = SITE_URL + "/report/purchase-report-pdf?from=" + from + "&to=" + to + "&searchType=" + searchType + "&year=" + year + "&month=" + month + "&type=" + type + "&product=" + product + "&service=" + service + "&location=" + location + "&currency=" + currency + "&supplier=" + supplier;

    } else {
      var from = params.from;
      var to = params.to;
      var searchType = params.searchType;
      var currency = params.currency;
      var supplier = params.supplier;
      var location = params.location;
      var month = params.month;
      var product = params.product;
      var service = params.service;
      var type = params.type;
      var year = params.year;
      window.location = SITE_URL + "/report/purchase-report-pdf?from=" + from + "&to=" + to + "&searchType=" + searchType + "&year=" + year + "&month=" + month + "&type=" + type + "&product=" + product + "&service=" + service + "&location=" + location + "&currency=" + currency + "&supplier=" + supplier;
    }
  });

  $(document).on("click", "#csv", function(event) {
    event.preventDefault();
    var params = {};
    params = getUrlVars();
    if (isEmpty(params)) {
      var from = $('#from').val();
      var to = $('#to').val();
      var searchType = $("#searchType").val();
      var currency = 'null';
      var supplier = 'null';
      var location = 'null';
      var month = 'null';
      var product = 'null';
      var service = 'null';
      var type = 'null';
      var year = 'null';

      window.location = SITE_URL + "/report/purchase-report-csv?from=" + from + "&to=" + to + "&searchType=" + searchType + "&year=" + year + "&month=" + month + "&type=" + type + "&product=" + product + "&service=" + service + "&location=" + location + "&currency=" + currency + "&supplier=" + supplier;

    } else {
      var from = params.from;
      var to = params.to;
      var searchType = params.searchType;
      var currency = params.currency;
      var supplier = params.supplier;
      var location = params.location;
      var month = params.month;
      var product = params.product;
      var service = params.service;
      var type = params.type;
      var year = params.year;
      window.location = SITE_URL + "/report/purchase-report-csv?from=" + from + "&to=" + to + "&searchType=" + searchType + "&year=" + year + "&month=" + month + "&type=" + type + "&product=" + product + "&service=" + service + "&location=" + location + "&currency=" + currency + "&supplier=" + supplier;
    }
  });

  $(window).on('load', function() {
    if ($(window).width() < 768) {
      $('.monthField').removeClass('mb-2');
      $('.monthField').addClass('maginNegetive15');

      $('.yearField').removeClass('mb-2');
      $('.yearField').addClass('maginNegetive15');
    }
  });
  // [ bar-chart ] start
  if ($('.main-body .page-wrapper').find('#ChartJsExpense').length) {
    var bar = document.getElementById("chartJsBar").getContext('2d');
    var theme_g2 = bar.createLinearGradient(0, 300, 0, 0);
    theme_g2.addColorStop(0, '#899FD4');
    theme_g2.addColorStop(1, '#A389D4');
    var data1 = {
      labels: dates,
      datasets: [{
        label: jsLang('Purchases'),
        data: costs,
        borderColor: theme_g2,
        backgroundColor: theme_g2,
        hoverborderColor: theme_g2,
        hoverBackgroundColor: theme_g2,
      }]
    };
    var myBarChart = new Chart(bar, {
      type: 'bar',
      data: data1,
      options: {
        barValueSpacing: 20,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }],
          xAxes: [{
            ticks: {
              minRotation: 30,
              maxRotation: 45
            }
          }]
        }
      }
    });
  }
}

// Sale date wise report js here
if ($('.main-body .page-wrapper').find('#sales-report-datewise').length) {
  $(function () {
    $("#salesList").DataTable({
      responsive: true,
      "language": {
              "url": app_locale_url
            },
      "paging": false,
      "info": false,
      "ordering": false
    });
  });
}

// Purchase date wise report js here
if ($('.main-body .page-wrapper').find('#purchase-report-datewise').length) {
  $(function () {
    if (symbol_position == 'after') {
      grandTotalTax = grandTotalTax + currencySymbol;
    } else {
      grandTotalTax = currencySymbol + grandTotalTax;
    }
    $("#grand-total-tax").text(grandTotalTax)
    $("#grand-total-qty").text(grandTotalQuantity)
  })
  $(function () {
    $("#purchaseList").DataTable({
        responsive: true,
        "language": {
              "url": app_locale_url
            },
        "paging": false,
        "info": false,
        "ordering": false
    });
  });
}