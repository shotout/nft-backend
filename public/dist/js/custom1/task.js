'use strict';

function refreshAutoComplete() {
    $('#assignee').html('');
    var html = `<input class="form-control auto col-sm-12 ui-autocomplete-input" placeholder="Search" id="search" autocomplete="off">`;
    $('#autoCompleteInput').remove();
    var searchElement = $('#search');
    searchElement.remove();
    $('#relatedToDiv').append(html);
    var stack = [];
    searchElement.autocomplete({
        delay: 500,
        position: {
            my: "left top",
            at: "left bottom",
            collision: "flip"
        },
        source: function(request, response) {
            $.ajax({
                url: SITE_URL + "/task/related-search",
                dataType: "json",
                type: "POST",
                data: {
                    _token: token,
                    search: request.term,
                    relatedTo: $('#related_to').val(),
                },
                success: function(data) {
                    if (data.status_no == 1) {
                        var data = data.result;
                        $('#no_div').css('display', 'none');
                        response($.map(data, function(result) {
                            return {
                                id: result.id,
                                subject: result.subject,
                                value: result.name,
                                chargeType: result.chargeType,
                            }
                        }));
                    } else {
                        $('.ui-menu-item').remove();
                        $("#no_div").css({
                            "top": searchElement.position().top + 35,
                            "left": searchElement.position().left,
                            "width": searchElement.width(),
                            "display": "block",
                        });
                    }
                }
            })
        },

        select: function(event, ui) {
            var e = ui.item;
            if (e.chargeType != '') {
                if (e.chargeType == 3) {
                    $('#hourly_rate_div').css("display", "flex");
                } else {
                    $('#hourly_rate_div').css("display", "none")
                }
            }

            if (e.id) {
                var input = `<p id="autoCompleteInput"><span class="badge badge-secondary f-16 mt-1">${e.value}<i class="fa fa-times ml-2 cursor_pointer" title=${jsLang('Remove')} onclick="javascript: autoCompleteRefresh()"></i></span><input type="hidden" name="relatedTo" value="${$('#related_to').val()}"><input type="hidden" name="relatedId" id="relatedId" value="${e.id}"></p>`;
                searchElement.hide();
                $('#relatedToDiv').html(input);
                if ($('#related_to').val() == 1) {
                    $("#assignee").select2("val", "");
                    var project_id = $('#relatedId').val();
                    getMilestone(project_id);
                    var task_id = null;
                    $.ajax({
                        url: SITE_URL + "/project/task/get_rest_assignee",
                        method: "POST",
                        data: {
                            'project_id': project_id,
                            'task_id': task_id,
                            '_token': token
                        },
                        dataType: "json",
                        success: function(data) {
                            if (data.project_member_status == 1) {
                                var project_member = '<option value=""> ' + jsLang('Select Assignee') + '</option>';
                                // Hide assign me button if not in project
                                for (let index = 0; index < data.project_member.length; ++index) {
                                    if (data.project_member[index]['user_id'] == loggedUserId) {
                                        var check = true;
                                    }
                                }!check ? $('#assign_me').hide() : $('#assign_me').show();
                                $.each(data.project_member, function(key, value) {
                                    project_member += '<option value="' + value.user_id + '">' + value.user_name + '</option>';
                                })
                                $('#assignee').html(project_member);
                            } else {
                                $('#assignee').html('<option value="">' + jsLang('No member found') + '</option>');
                            }
                        }
                    });
                } else {
                    $('#assignee').val('').trigger('change');
                    $.ajax({
                        url: SITE_URL + "/project/task/get_all_user",
                        method: "GET",
                        data: {
                            'task_id': null,
                            '_token': token
                        },
                        dataType: "json",
                        success: function(data) {
                            if (data.status == 1) {
                                var project_member = '<option value=""> ' + jsLang('Select Assignee') + '</option>';
                                $.each(data.users, function(key, value) {
                                    project_member += '<option value="' + value.id + '">' + value.full_name + '</option>';
                                })
                                $('#assignee').html(project_member);
                            } else {
                                $('#assignee').html('<option value="">' + jsLang('No memeber found') + '</option>');
                            }
                        }
                    });
                }
            }
        },
        minLength: 1
    })
}
function autoCompleteRefresh() {
        $('#assignee').html('');
        if ($('#autoCompleteInput').length == 1) {
            var html = `<input class="form-control auto col-sm-12 ui-autocomplete-input" placeholder="Search Here" id="search" autocomplete="off">`;
            $('#autoCompleteInput').remove();
            $('#search').remove();
            $('#relatedToDiv').append(html);
        } else {
            $('#showPrevious').remove();
            $('#addRelatedTo').css('display', 'flex');
        }
        if ($('#related_to').val() == 1) {
            $('.searchSpan').text(jsLang('Project'));
        } else if ($('#related_to').val() == 2) {
            $('.searchSpan').text(jsLang('Customer'));
        } else {
            $('.searchSpan').text(jsLang('Ticket'));
        }
        var stack = [];
        $("#search").autocomplete({
            delay: 500,
            position: {
                my: "left top",
                at: "left bottom",
                collision: "flip"
            },
            source: function(request, response) {
                $.ajax({
                    url: SITE_URL + "/task/related-search",
                    dataType: "json",
                    type: "POST",
                    data: {
                        _token: token,
                        search: request.term,
                        relatedTo: $('#related_to').val(),
                    },
                    success: function(data) {
                        if (data.status_no == 1) {
                            var data = data.result;
                            $('#no_div').css('display', 'none');
                            response($.map(data, function(result) {
                                return {
                                    id: result.id,
                                    subject: result.subject,
                                    value: result.name,
                                    chargeType: result.chargeType,
                                }
                            }));
                        } else {
                            $('.ui-menu-item').remove();
                            $("#no_div").css('top', $("#search").position().top + 35);
                            $("#no_div").css('left', $("#search").position().left);
                            $("#no_div").css('width', $("#search").width());
                            $("#no_div").css('display', 'block');
                        }
                    }
                })
            },

            select: function(event, ui) {
                var e = ui.item;
                if (e.chargeType != '') {
                    if (e.chargeType == 3) {
                        $('#hourly_rate_div').css("display", "flex");
                    } else {
                        $('#hourly_rate_div').css("display", "none");
                    }
                }

                if (e.id) {
                    var input = `<p id="autoCompleteInput"><span class="badge badge-secondary f-16 mt-1">${e.value}<i class="fa fa-times ml-2 cursor_pointer" title=${jsLang('Remove')} onclick="javascript: autoCompleteRefresh()"></i></span><input type="hidden" name="relatedTo" value="${$('#related_to').val()}"><input type="hidden" name="relatedId" id="relatedId" value="${e.id}"></p>`;
                    $("#search").hide();
                    $('#relatedToDiv').html(input);
                    if ($('#related_to').val() == 1) {
                        $("#assignee").select2("val", "");
                        var project_id = $('#relatedId').val();
                        getMilestone(project_id);
                        var task_id = null;
                        var url = SITE_URL + "/project/task/get_rest_assignee";
                        $.ajax({
                            url: url,
                            method: "POST",
                            data: {
                                'project_id': project_id,
                                'task_id': task_id,
                                '_token': token
                            },
                            dataType: "json",
                            success: function(data) {
                                if (data.project_member_status == 1) {
                                    var project_member = '<option value=""> ' + jsLang('Select Assignee') + '</option>';
                                    // Hide assign me button if not in project
                                    for (let index = 0; index < data.project_member.length; ++index) {
                                        if (data.project_member[index]['user_id'] == loggedUserId) {
                                            var check = true;
                                        }
                                    }
                                    if (!check) {
                                        $('#assign_me').hide();
                                    } else {
                                        $('#assign_me').show();
                                    }
                                    // Hide assign me button if not in project end

                                    $.each(data.project_member, function(key, value) {
                                        project_member += '<option value="' + value.user_id + '">' + value.user_name + '</option>';
                                    })
                                    $('#assignee').html(project_member);
                                } else {
                                    $('#assignee').html('<option value="">' + jsLang('No member found') + '</option>');
                                }
                            }
                        });
                    } else {
                        var url = SITE_URL + "/project/task/get_all_user";
                        $('#assignee').val('').trigger('change');
                        $.ajax({
                            url: url,
                            method: "GET",
                            data: {
                                'task_id': null,
                                '_token': token
                            },
                            dataType: "json",
                            success: function(data) {
                                if (data.status == 1) {
                                    var project_member = '<option value=""> ' + jsLang('Select Assignee') + '</option>';
                                    $.each(data.users, function(key, value) {
                                        project_member += '<option value="' + value.id + '">' + value.full_name + '</option>';
                                    })
                                    $('#assignee').html(project_member);
                                } else {
                                    $('#assignee').html('<option value="">' + jsLang('No member found') + '</option>');
                                }
                            }
                        });
                    }
                }
            },
            minLength: 1
        })
}
function changeRelatedField() {
    var related_id = $('#related_to').val();
    if (related_id == '1') {
        $('#milestone_div, #hourly_rate_div').css("display", "flex");
    } else if (related_id == '2' || related_id == '3' || related_id == '') {
        $('#milestone_div').css("display", "none");
        $('#hourly_rate_div').css("display", "flex");
    }
}
function getMilestone(project_id) {
    $.ajax({
        url: SITE_URL + "/project/task/get-milestone",
        method: "POST",
        data: {
            'project_id': project_id,
            '_token': token
        },
        dataType: "json",
        success: function(data) {
            if (data.status == 1) {
                $('#milestone').html(data.output);
            }
        }
    });
}
function addTodoItem() {
    var todoItem = $("#myInput").val();
    if (todoItem === '') {
        swal(jsLang('Empty checklist'), {
            icon: "error",
            buttons: [false, jsLang('Ok')],
        });
        return false;
    } else if (todoItem.length < 5) {
        swal(jsLang('Too Short checklist'), {
            icon: "error",
            buttons: [false, jsLang('Ok')],
        });
        return false;
    } else {
        $.ajax({
            url: SITE_URL + '/task/checklist',
            data:{
              todoItem : todoItem,
              _token: _token
            },
            type: 'POST',
            dataType: 'JSON',
            success: function (data) {
                if (data.status == 1) {
                    var todoItem = data.value;
                    // Creating a Hidden div containing all checklist to pass in Post request
                    var hiddenDiv = document.createElement("input");
                    hiddenDiv.setAttribute("type", "hidden");
                    hiddenDiv.setAttribute("id", todoItem);
                    hiddenDiv.setAttribute("value", todoItem);
                    hiddenDiv.setAttribute("name", "allCheckListHiidenInput[]");
                    document.getElementById("checklistCollector").appendChild(hiddenDiv);
                    $("#myUL").append("<li id='" + todoItem + "'>" + todoItem +
                        " <span class='todo-item-delete text-c-red f-18' id='" + todoItem + "'>" +
                        "<i class='feather icon-trash-2'></i></span></li>");
                    $("#myInput").val("");
                }
            }
        });

    }
}
function deleteTodoItem(e, item) {
    e.preventDefault();
    var r = document.getElementById('checklistCollector').getElementsByTagName('input');
    for (var m = 0; m < r.length; m++) {
        if (r[m].value == item.id) {
            r[m].remove();
        }
    }

    $(item).parent().fadeOut('fast', function() {
        $(item).parent().remove();
    });
}
if ($('.main-body .page-wrapper').find('#add-task-container').length) {
    $('.error').hide();
    $("#taskForm").validate({
        rules: {
            task_name: {
                required: true,
            },
            related_to: {
                required: true,
            },
            task_details: {
                required: true,
            },
            hourly_rate: {
                required: true,
            },
        }
    });
    $(".js-example-responsive").select2({
        tags: true
    })

    $('#startDate').daterangepicker(dateSingleConfig());
    $('#dueDate').daterangepicker(dateSingleConfig());
    $('#dueDate').val('');
    $(document).on('change', '#startDate, #dueDate', function() {
        var startDate = $('#startDate').val();
        var dueDate = $('#dueDate').val();
        if (startDate != '' && dueDate != '') {
            if (Date.parse(startDate) > Date.parse(dueDate)) {
                $('#due_date-error').html(jsLang('The due date cannot be before the start date.')).css('display', 'block');
            } else {
                $('#due_date-error').html("").css('display', 'none');
            }
        }
    });

    $('#priority,#custom_repet').select2();

    $('#assignee').select2({
        placeholder: jsLang('Select Assignee'),
    });

    $('#related_to').select2({
        placeholder: jsLang('Nothing Selected')
    });

    $('#milestone').select2({
        placeholder: jsLang('Nothing Selected')
    });

    //Related to
    $(window).on('load', function() {
        changeRelatedField();
    });

    $('#related_to').on('change', function() {
        changeRelatedField();
        refreshAutoComplete();
    });

    //Set myself as assignee to the creating task
    $('#assign_me').on('click', function() {
        var assigned = $('#assignee').val();
        assigned.push(loggedUserId);
        $('#assignee').val(assigned).trigger('change');
    });
    $(document).on('change', '#assignee', function() {
        var assigned = $('#assignee').val();
        if (jQuery.inArray(loggedUserId, assigned) == 0) {
            $('#assign_me').hide();
        } else if (jQuery.inArray(loggedUserId, assigned) == -1) {
            $('#assign_me').show();
        }
    });

    //Get all assignee on change of related to
    $('#related_to').on('change', function() {
        if ($(this).val() != '') {
            $('#related_to_error').css('display', 'none');

            var searchText = ($(this).val() == 1) ? 'Project' : ($(this).val() == 2) ? 'Customer' : 'Ticket';
            $('.searchSpan').text(jsLang(searchText));

            $('#addRelatedTo').css('display', 'flex');
            var stack = [];
            $("#search").autocomplete({
                delay: 500,
                position: {
                    my: "left top",
                    at: "left bottom",
                    collision: "flip"
                },
                source: function(request, response) {
                    $.ajax({
                        url: SITE_URL + "/task/related-search",
                        dataType: "json",
                        type: "POST",
                        data: {
                            _token: token,
                            search: request.term,
                            relatedTo: $('#related_to').val(),
                        },
                        success: function(data) {
                            if (data.status_no == 1) {
                                var data = data.result;
                                $('#no_div').css('display', 'none');
                                response($.map(data, function(result) {
                                    return {
                                        id: result.id,
                                        subject: result.subject,
                                        value: result.name,
                                        chargeType: result.chargeType,
                                    }
                                }));
                            } else {
                                $('.ui-menu-item').remove();
                                $("#no_div").css({
                                    "top": $("#search").position().top + 35,
                                    "left": $("#search").position().left,
                                    "width": $("#search").width(),
                                    "display": "block",
                                });
                            }
                        }
                    })
                },

                select: function(event, ui) {
                    var e = ui.item;
                    if (e.chargeType != '') {
                        var hourly_rate_display = (e.chargeType == 3) ? 'flex' : 'none';
                        $('#hourly_rate_div').css("display", hourly_rate_display);
                    }

                    if (e.id) {
                        var input = `<p id="autoCompleteInput"><span class="badge badge-secondary f-16 mt-1">${e.value}<i class="fa fa-times ml-2 cursor_pointer" title=${jsLang('Remove')} onclick="javascript: autoCompleteRefresh()"></i></span><input type="hidden" name="relatedTo" value="${$('#related_to').val()}"><input type="hidden" name="relatedId" id="relatedId" value="${e.id}"></p>`;

                        $("#search").hide();
                        $('#relatedToDiv').html(input);

                        if ($('#related_to').val() == 1) {
                            $("#assignee").select2("val", "");
                            var project_id = $('#relatedId').val();
                            getMilestone(project_id);
                            var task_id = null;
                            $.ajax({
                                url: SITE_URL + "/project/task/get_rest_assignee",
                                method: "POST",
                                data: {
                                    'project_id': project_id,
                                    'task_id': task_id,
                                    '_token': token
                                },
                                dataType: "json",
                                success: function(data) {
                                    if (data.project_member_status == 1) {
                                        var project_member = '<option value=""> ' + jsLang('Select Assignee') + '</option>';
                                        // Hide assign me button if not in project
                                        for (let index = 0; index < data.project_member.length; ++index) {
                                            if (data.project_member[index]['user_id'] == loggedUserId) {
                                                var check = true;
                                            }
                                        }!check ? $('#assign_me').hide() : $('#assign_me').show();
                                        $.each(data.project_member, function(key, value) {
                                            project_member += '<option value="' + value.user_id + '">' + value.user_name + '</option>';
                                        })
                                        $('#assignee').html(project_member);
                                    } else {
                                        $('#assignee').html('<option value="">' + jsLang('No memeber found') + '</option>');
                                    }
                                }
                            });
                        } else {
                            $('#assignee').val('').trigger('change');
                            $.ajax({
                                url: SITE_URL + "/project/task/get_all_user",
                                method: "GET",
                                data: {
                                    'task_id': null,
                                    '_token': token
                                },
                                dataType: "json",
                                success: function(data) {
                                    if (data.status == 1) {
                                        var project_member = '<option value=""> ' + jsLang('Select Assignee') + '</option>';
                                        $.each(data.users, function(key, value) {
                                            project_member += '<option value="' + value.id + '">' + value.full_name + '</option>';
                                        })
                                        $('#assignee').html(project_member);
                                    } else {
                                        $('#assignee').html('<option value="">' + jsLang('No memeber found') + '</option>');
                                    }
                                }
                            });
                        }
                    }
                },
                minLength: 1
            })

        } else {
            $('#related_to_error').css('display', 'block');
            $('#addRelatedTo').css('display', 'none');
        }
    });

    $("body").on("click", ".delete_file_field", function() {
        $(this).parents(".control-group").remove();
    });

    // EVENT DELEGATION
    $(function() {
        $("#checklistAddBtn").on('click', function(e) {
            e.preventDefault();
            addTodoItem()
        });

        $("#myUL").on('click', '.todo-item-delete', function(e) {
            deleteTodoItem(e, this)
        })
    });

    deleteAttachment(SITE_URL + "/file/remove?type=task");
    uploadAttachment(SITE_URL + "/file/upload?type=task", $("#uploader-text"));

    $(window).on('load', function() {
        if ($(window).width() <= 1000) {
            $('.col-sm-10').addClass('col-sm-12').removeClass('col-sm-10');
            $('.col-sm-8').addClass('col-sm-10').removeClass('col-sm-8');
            $('.col-sm-3').addClass('col-sm-4').removeClass('col-sm-3');
        }
    });

    $(document).on('click', '#btnSubmit', function() {
        var startDate = $('#startDate').val();
        var dueDate = $('#dueDate').val();
        if (startDate != '' && dueDate != '') {
            if (Date.parse(startDate) > Date.parse(dueDate)) {
                $('#due_date-error').html(jsLang('The due date cannot be before the start date.')).css('display', 'block');
                $('#dueDate').focus();
                return false;
            } else {
                $('#due_date-error').html("").css('display', 'none');
            }
        }

        if ($("form#taskForm").valid() == true && $('#search').length == 0) {
            /* load spinner */
            $(".spinner").show();
            $(".spinner").css('line-height', '0');
            $("#spinnerText").text(jsLang('Please wait...'));
            /* end of spinner */
            $(this).attr('disabled', 'disabled');
            $("form#taskForm").trigger('submit');
        }


        if ($('#search').length) {
            var text = '';
            if ($('#related_to').val() != '') {
                if ($('#related_to').val() == 1) {
                    text = jsLang('Please select the project to create task');
                } else if ($('#related_to').val() == 2) {
                    text = jsLang('Please select the customer to create task');
                } else {
                    text = jsLang('Please select the ticket to create task');
                }
                swal(text, {
                    icon: "error",
                    buttons: [false, jsLang('Ok')],
                });
                return false;
            }
        }
    });
}
if ($('.main-body .page-wrapper').find('#edit-task-container').length) {
    $(".js-example-responsive").select2({
        tags: true,
    });


    if ($('#checkAssignMe').val() === '1') {
        $('#assign_me').hide();
    }
    var related_id = $('#related_to').val();
    if (related_id == '1') {
        if ($('#chargeType').val() == 3) {
            $('#milestone_div, #hourly_rate_div').css("display", "flex");
        } else {
            $('#milestone_div').css("display", "flex");
            $('#hourly_rate_div').css("display", "none");
        }
    } else if (related_id == '2' || related_id == '3') {
        $('#milestone_div').css("display", "none");
        $('#hourly_rate_div').css("display", "flex");
    } else {
        $('#hourly_rate_div').css("display", "none");
    }

    $('#task_form').on('submit', function(e) {
        // reomve previous error messages
        $('#taskForm .text-danger').remove();
        if (!$('#task_name').val()) {
            $('#task_name').focus();
            return false;
        }
        var startDate = $('#startDate').val();
        var dueDate = $('#dueDate').val();
        if (startDate != '' && dueDate != '') {
            if (Date.parse(startDate) > Date.parse(dueDate)) {
                $('#due_date-error').html(jsLang('The due date cannot be before the start date.')).css('display', 'block');
                $('#dueDate').focus();
                return false;
            } else {
                $('#due_date-error').html("").css('display', 'none');
            }
        }

        if ($('#search').length == 1 && $('#showPrevious').length == 0) {
            var text = '';
            if ($('#related_to').val() != '') {
                if ($('#related_to').val() == 1) {
                    text = jsLang('Please select the project to create task');
                } else if ($('#related_to').val() == 2) {
                    text = jsLang('Please select the customer to create task');
                } else {
                    text = jsLang('Please select the ticket to create task');
                }
                swal(text, {
                    icon: "error",
                    buttons: [false, jsLang('Ok')],
                });
                return false;
            }
        }
    });
    $('#startDate').daterangepicker(dateSingleConfig($('#startDate').val()));
    if ($('#dueDate').val() != '') {
        $('#dueDate').daterangepicker(dateSingleConfig($('#dueDate').val()));
    } else {
        $('#dueDate').daterangepicker(dateSingleConfig());
        $('#dueDate').val('');
    }

    $('.js-example-basic-single').select2();

    $('#assignee').select2({
        placeholder: jsLang('Select assignee'),
    });

    $('#milestone').select2({
        placeholder: jsLang('Nothing selected'),
    });

    $('#related_to').select2({

    });

    $('#status').select2({
        placeholder: jsLang('Nothing selected')
    });

    $('#related_to').on('change', function() {
        changeRelatedField();
    });

    $(document).on('change', '#startDate, #dueDate', function() {
        var startDate = $('#startDate').val();
        var dueDate = $('#dueDate').val();
        if (startDate != '' && dueDate != '') {
            if (Date.parse(startDate) > Date.parse(dueDate)) {
                $('#due_date-error').html(jsLang('The due date cannot be before the start date.')).css('display', 'block');
            } else {
                $('#due_date-error').html("").css('display', 'none');
            }
        }
    });

    // Set myself as assignee to the creating task
    $('#assign_me').on('click', function() {
        var allAssignee = [loggedUserId];
        var assigned = $('#assignee').val();
        $.each(assigned, function(key, value) {
            allAssignee.push(value)
        });
        $('#assignee').val(allAssignee).trigger('change');
    });

    $('#assignee').on('click change', function() {
        var assigned = $('#assignee').val();
        if (jQuery.inArray(loggedUserId, assigned) == 0) {
            $('#assign_me').hide();
        } else if (jQuery.inArray(loggedUserId, assigned) != 0) {
            $('#assign_me').show();
        }
    });

    function changeRelatedField() {
        var related_id = $('#related_to').val();
        if (related_id == '1') {
            $('#milestone_div, #hourly_rate_div').css("display", "flex");
        } else if (related_id == '2' || related_id == '3' || related_id == '') {
            $('#milestone_div').css("display", "none");
            $('#hourly_rate_div').css("display", "flex");
        }
    }

    function getMilestone(project_id) {
        var url = SITE_URL + "/project/task/get-milestone";
        $.ajax({
            url: url,
            method: "POST",
            data: {
                'project_id': project_id,
                '_token': token
            },
            dataType: "json",
            success: function(data) {
                $('#milestone').html(data.output);
            }
        });
    }

    // Get all assignee on change of related to
    $('#related_to').on('change', function() {
        refreshAutoComplete()
    });




    $(document).on("click", ".checklist_label", function() {
        var id = $(this).attr('data-id');
        var title = $(this).text();
        if ($(".checklist_input").length > 0) {
            $(".checklist_input_text").focus();
        } else {
            var row = "<span class='checklist_input'><input class='checklist_input_text' value='" + title + "' type='text' id='" + id + "'></span>";
            $(this).after(row);
            $(this).hide();
            $(".checklist_input_text").focus();
        }
    })

    $(document).on('blur', '.checklist_input_text', function() {
        var id = $(this).attr("id");
        var task_id = $("#task_id").val();
        var title = $(this).val();
        $.ajax({
            url: SITE_URL + "/checklist/edit",
            method: "POST",
            data: {
                'id': id,
                'task_id': task_id,
                'title': title,
                '_token': token
            },
            success: function(data) {
                if (data < 0) {
                    swal(jsLang('Checklist already exist'), {
                        icon: "error",
                        buttons: [false, jsLang('Ok')],
                    });
                } else {
                    $("span[data-id=" + id + "]").html(data.title);
                }
                $("span[data-id=" + id + "]").show();
                $(".checklist_input_text").hide();
            }
        })
    });

    function addTodoItem() {
        var title = $("#myInput").val();
        if (title === '') {
            swal(jsLang('Empty checklist'), {
                icon: "error",
                buttons: [false, jsLang('Ok')],
            });
            return false;
        } else if (title.length < 5) {
            swal(jsLang('Too Short checklist'), {
                icon: "error",
                buttons: [false, jsLang('Ok')],
            });
            return false;
        }

        $.ajax({
            type: "POST",
            url: SITE_URL + "/checklist_edit/add",
            token: token,
            data: {
                'task_id': $("#task_id").val(),
                'title': title,
                '_token': token
            },
            dataType: 'json',
            success: function(data) {
                if (data.message == 'success') {
                    var row = "<li class='checkbox checkbox-primary'>" +
                        "<input type='checkbox' name='todo-item-done' class='todo-item-done' id='checklist_status_" + data.item.id + "' value='" + data.item.title + "'  />" +
                        "<label for='checklist_status_" + data.item.id + "' class='cr f-12'>" +
                        "<span class='checklist_label cursor_text' data-id='" + data.item.id + "' title='Click to edit'>" + data.item.title + "</span>" +
                        "<span class='todo-item-delete text-c-red f-18' id='" + data.item.title + "'><i class='feather icon-trash-2'></i></span></label>" +
                        "</li>";
                    $("#myUL").append(row);
                    $("#myInput").val("");
                } else {
                    swal(data.message, {
                        icon: "error",
                        buttons: [false, jsLang('Ok')],
                    });
                }
            }
        });
    }

    $('#related_to').on('change', function() {
        if ($(this).val() != '') {
            $('#assignee').html('');
            $('#showPrevious').css('display', 'none');
            $('#releted_to').css('display', 'none');
            $('#related_to_error').css('display', 'none');

            var searchText = ($(this).val() == 1) ? 'Project' : ($(this).val() == 2) ? 'Customer' : 'Ticket';
            $('.searchSpan').text(jsLang(searchText));

            $('#addRelatedTo').css('display', 'flex');
            var stack = [];
            $("#search").autocomplete({
                delay: 500,
                position: {
                    my: "left top",
                    at: "left bottom",
                    collision: "flip"
                },
                source: function(request, response) {
                    $.ajax({
                        url: SITE_URL + "/task/related-search",
                        dataType: "json",
                        type: "POST",
                        data: {
                            _token: token,
                            search: request.term,
                            relatedTo: $('#related_to').val(),
                        },
                        success: function(data) {
                            if (data.status_no == 1) {
                                var data = data.result;
                                $('#no_div').css('display', 'none');
                                response($.map(data, function(result) {
                                    return {
                                        id: result.id,
                                        subject: result.subject,
                                        value: result.name,
                                        chargeType: result.chargeType,
                                    }
                                }));
                            } else {
                                $('.ui-menu-item').remove();
                                $("#no_div").css({
                                    "top": $("#search").position().top + 35,
                                    "left": $("#search").position().left,
                                    "width": $("#search").width(),
                                    "display": "block",
                                });
                            }
                        }
                    })
                },

                select: function(event, ui) {
                    var e = ui.item;
                    if (e.chargeType != '') {
                        var hourly_rate_display = (e.chargeType == 3) ? 'flex' : 'none';
                        $('#hourly_rate_div').css("display", hourly_rate_display);
                    }

                    if (e.id) {
                        var input = `<p id="autoCompleteInput"><span class="badge badge-secondary f-16 mt-1">${e.value}<i class="fa fa-times ml-2 cursor_pointer" title=${jsLang('Remove')} onclick="javascript: autoCompleteRefresh()"></i></span><input type="hidden" name="relatedTo" value="${$('#related_to').val()}"><input type="hidden" name="relatedId" id="relatedId" value="${e.id}"></p>`;

                        $("#search").hide();
                        $('#relatedToDiv').html(input);

                        if ($('#related_to').val() == 1) {
                            $("#assignee").select2("val", "");
                            var project_id = $('#relatedId').val();
                            getMilestone(project_id);
                            var task_id = null;
                            $.ajax({
                                url: SITE_URL + "/project/task/get_rest_assignee",
                                method: "POST",
                                data: {
                                    'project_id': project_id,
                                    'task_id': task_id,
                                    '_token': token
                                },
                                dataType: "json",
                                success: function(data) {
                                    if (data.project_member_status == 1) {
                                        var project_member = '<option value=""> ' + jsLang('Select Assignee') + '</option>';
                                        // Hide assign me button if not in project
                                        for (let index = 0; index < data.project_member.length; ++index) {
                                            if (data.project_member[index]['user_id'] == loggedUserId) {
                                                var check = true;
                                            }
                                        }!check ? $('#assign_me').hide() : $('#assign_me').show();
                                        $.each(data.project_member, function(key, value) {
                                            project_member += '<option value="' + value.user_id + '">' + value.user_name + '</option>';
                                        })
                                        $('#assignee').html(project_member);
                                    } else {
                                        $('#assignee').html('<option value="">' + jsLang('No memeber found') + '</option>');
                                    }
                                }
                            });
                        } else {
                            $('#assignee').val('').trigger('change');
                            $.ajax({
                                url: SITE_URL + "/project/task/get_all_user",
                                method: "GET",
                                data: {
                                    'task_id': null,
                                    '_token': token
                                },
                                dataType: "json",
                                success: function(data) {
                                    if (data.status == 1) {
                                        var project_member = '<option value=""> ' + jsLang('Select Assignee') + '</option>';
                                        $.each(data.users, function(key, value) {
                                            project_member += '<option value="' + value.id + '">' + value.full_name + '</option>';
                                        })
                                        $('#assignee').html(project_member);
                                    } else {
                                        $('#assignee').html('<option value="">' + jsLang('No member found') + '</option>');
                                    }
                                }
                            });
                        }
                    }
                },
                minLength: 1
            })

        } else {
            $('#related_to_error').css('display', 'block');
            $('#addRelatedTo').css('display', 'none');
        }
    });



    function deleteTodoItem(e, item) {
        swal({
                title: jsLang('Are you sure?'),
                text: jsLang('Once deleted, you will not be able to recover this checklist.'),
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
                    var item_name = item.id;

                    // deleting from DB through AJAX
                    $.ajax({
                        type: "POST",
                        url: SITE_URL + "/checklist/delete",
                        token: token,
                        data: $(task_form).serialize() + "&id=" + item_name,
                        dataType: 'json',
                        success: function(data) {
                            if (data.message == 'success') {
                                // Deleting items from hidden div which contains the checklist that will be used in Post request
                                var r = document.getElementById('checklistCollector').getElementsByTagName('input');
                                for (var m = 0; m < r.length; m++) {
                                    if (r[m].value == item.id) {
                                        r[m].remove();
                                    }
                                }

                                $(item).parent().fadeOut('fast', function() {
                                    $(item).parent().remove();
                                });

                                swal(jsLang('Success! Checklist has been deleted.'), {
                                    icon: "success",
                                    buttons: [false, jsLang('Ok')],
                                });
                            }
                        }
                    });
                }
            });
    }

    // Changing check or uncheck through AJAX
    function completeTodoItem() {
        var id = $(this).attr('id');
        id = id.split("_")[2];
        var status = $(this).is(":checked");
        $.ajax({
            type: "POST",
            url: SITE_URL + "/checklist/change_status",
            token: token,
            data: {
                'id': id,
                'status': status,
                '_token': token
            },
            success: function(data) {
                if (data.message == 'success') {
                    if (data.item.is_checked == 1) {
                        $("span[data-id=" + id + "]").addClass("strike");
                    } else {
                        $("span[data-id=" + id + "]").removeClass("strike");
                    }
                }
            }
        });
    }

    // EVENT DELEGATION
    $(function() {
        $("#checklistAddBtn").on('click', function(e) {
            e.preventDefault();
            addTodoItem()
        });

        $("#myUL").on('click', '.todo-item-delete', function(e) {
            var item = this;
            deleteTodoItem(e, item)
        });

        $(document).on('click', ".todo-item-done", completeTodoItem);
    });

    $("#task_form").validate({
        ignore: ".ignore",
        rules: {
            task_name: {
                required: true,
            },
            task_details: {
                required: true,
            },
            hourly_rate: {
                required: true,
            },
        }
    });

    $(window).on('load', function() {
        if ($(window).width() <= 1000) {
            $('.col-sm-10').addClass('col-sm-12').removeClass('col-sm-10');
            $('.col-sm-8').addClass('col-sm-10').removeClass('col-sm-8');
            $('.col-sm-3').addClass('col-sm-4').removeClass('col-sm-3');
        }
    });
}
if ($('.main-body .page-wrapper').find('#list-task-container').length) {
    $('[data-toggle="tooltip"]').tooltip();
    $('body').tooltip({
        selector: '[data-toggle="tooltip"]'
    });
    $(".select2").select2();

    $('#daterange-btn').daterangepicker(daterangeConfig(startDate, endDate), cbRange);
    cbRange(startDate, endDate);

    $(document).on("click", "#tablereload", function(event) {
        event.preventDefault();
        $("#dataTableBuilder").DataTable().ajax.reload();
    });

    $(document).on("click", "#csv", function(event) {
        event.preventDefault();
        window.location = SITE_URL + "/project/tasks_csv?from=" + $('#startfrom').val() + "&to=" + $('#endto').val() + "&project=" + $('#project').val() + "&assignee=" + $('#assignee').val() + "&status=" + $('#status').val();
    });

    $(document).on("click", "#pdf", function(event) {
        event.preventDefault();
        window.location = SITE_URL + "/project/tasks_pdf?from=" + $('#startfrom').val() + "&to=" + $('#endto').val() + "&project=" + $('#project').val() + "&assignee=" + $('#assignee').val() + "&status=" + $('#status').val();
    });

    $('#theModal').on('show.bs.modal', function(e) {
        var button = $(e.relatedTarget);
        var modal = $(this);
        $('#theModalSubmitBtn').attr('data-task', '').removeClass('delete-task-btn');

        if (button.data("label") == 'Delete') {
            modal.find('#theModalSubmitBtn').addClass('delete-task-btn').attr('data-task', button.data('id')).text(jsLang('Delete')).show();
            modal.find('#theModalLabel').text(button.data('title'));
            modal.find('.modal-body').text(button.data('message'));
        } else {
            modal.find('.modal-body').html('<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
            modal.find('.modal-body').load(button.data("remote"));
        }
    });

    $('#theModalSubmitBtn').on('click', function() {
        $('#delete-item-' + $(this).data('task')).trigger('submit');
    })
}
