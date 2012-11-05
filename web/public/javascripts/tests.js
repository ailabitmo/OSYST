"use strict";

//Declare the namespace
var e3soos = e3soos || {};

/**
 * Initialize the code.
 */
$(document).ready(function() {
    e3soos.testcase.initialize();
});

e3soos.testcase = (function() {

    var fields = {},

    //DOM elements
    dialog = {},

    addSchema = function() {
        $('#schemas').append(
            '<div class="schema testcase-form-row">'
            + '<input type="checkbox"/><input type="text" class="span5"/>'
            +'</div>'
            );
    },

    removeSchema = function() {
        $('#schemas .schema input:checked').parent().detach();
    },

    removeTestcase = function (testcase) {
        var ids = {};
        testcase.each(function(index) {
            ids['testcase_ids[' +index +']'] = $(this).children('.testcase-id').text();
        });
        $.ajax({
            url: '/tests/delete',
            type: 'DELETE',
            dataType: 'json',
            data: ids,
            success: function() {
                testcase.detach();
            },
            error: function() {
                //FIXME
                console.log("error");
            }
        });
    },

    readFields = function() {
        fields['testcase.name'] = $('#tc-name').val();
        fields['testcase.classes.j'] = $('#gc-J').val();
        fields['testcase.classes.f'] = $('#gc-F').val();
        fields['testcase.classes.q'] = $('#gc-Q').val();
        fields['testcase.classes.d'] = $('#gc-D').val();
        fields['testcase.classes.w'] = $('#gc-W').val();
        fields['testcase.classes.l'] = $('#gc-L').val();
        fields['testcase.classes.s'] = $('#gc-S').val();
        $('#schemas .schema input:text').each(function(index) {
            fields['testcase.schemas[' + index + '].code'] = $(this).val();
        });
    },

    createTestcase = function() {
        changeStatus("saving");
        readFields();
        $.ajax({
            url: '/tests/add',
            type: 'POST',
            dataType: 'json',
            data: fields,
            success: function(data) {
                changeStatus("saved");
                setTimeout(function () {
                    dialog.modal('hide');
                }, 1000);
                fields['testcase.id'] = data['testcase_id'];
                $('.testcases').append(
                    '<tr class="testcase">'
                    + '<td><input type="checkbox"/></td>'
                    + '<td>' + fields['testcase.id'] + '</td>'
                    + '<td>' + fields['testcase.name'] + '</td>'
                    + '<td class="testcase-status">Not started</td>'
                    + '</tr>'
                    );
            },
            error: function() {
                changeStatus("error");
                setTimeout(function () {
                    //FIXME
                    }, 1000);
            }
        });
    },

    runAllTestcases = function() {
        var testcases = $('.testcase'),
        task = function(array) {
            if(array.length > 0) {
                var testcase = array.pop();
                $(testcase).children('.testcase-status').html(
                    '<span class="label label-info">Running...</span>');
                $.ajax({
                    url: '/tests/run/' + $(testcase).children('.testcase-id').text(),
                    dataType: 'json',
                    success: function(data) {
                        if(data['status'] == "PASSED"){
                            $(testcase).children('.testcase-status').html(
                                '<span class="label label-success">Passed</span>');
                        } else {
                            $(testcase).children('.testcase-status').html(
                                '<span class="label label-warning">Failed</span>');
                        }
                    },
                    error: function() {
                        $(testcase).children('.testcase-status').html(
                            '<span class="label label-important">Error</span>');
                    },
                    complete: function() {
                        task(array);
                    }
                });
            }
        };
        task($.makeArray(testcases));
    },

    changeStatus = function(status) {
        var help = $('#testcase-status');
        if(status == undefined) {
            help.html('All form fields are required.');
        } else if(status == "saving") {
            help.html('<span class="label label-info">Saving...</span>');
        } else if(status == "saved") {
            help.html('<span class="label label-success"><i class="icon-ok icon-white"></i> Saved</span>');
        } else if(status == "error") {
            help.html('<span class="label label-important"><i class="icon-warning-sign icon-white"></i> Error! Please, reload the page and try again.</span>');
        }
    };

    return {
        initialize: function() {
            $('#create-testcase').click(function() {
                changeStatus();
                dialog.modal('show');
            });

            dialog = $('#testcase-form');
            dialog.modal({
                show: false
            });

            $('#add-button').click(function(event) {
                addSchema();
                event.preventDefault();
            });
            $('#remove-button').click(function(event) {
                removeSchema();
                event.preventDefault();
            });

            $('#save-button').click(function(event) {
                createTestcase();
                event.preventDefault();
            });

            $('#remove-testcase').click(function(event) {
                removeTestcase($('.testcases .testcase input:checked').parent().parent());
                event.preventDefault();
            });

            $('#run-all-testcases').click(function(event) {
                runAllTestcases();
                event.preventDefault();
            });
        }
    };
})();