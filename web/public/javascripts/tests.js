"use strict";

//Declare the namespace
var e3soos = e3soos || {};

/**
 * Initialize the code.
 */
$(document).ready(function() {
    e3soos.testcase_form.initialize();
    e3soos.testcase.initialize();
});

e3soos.testcase_form = (function() {

    var testcase_temp = {},

    //DOM elements
    dialog = {},

    addSchema = function(value) {
        $('#schemas').append(
            '<div class="schema testcase-form-row" '
            + (value === undefined? '' : 'schema_id="' + value.id + '"')
            + '>'
            + '<input type="checkbox"/><input type="text" value="'
            + (value === undefined? '':value.code) +'" class="span5"/>'
            +'</div>'
            );
    },

    removeSchema = function() {
        $('#schemas .schema input:checked').parent().detach();
    },

    readTestcase = function() {
        testcase_temp.name = $('#tc-name').val();
        if(testcase_temp.classes == undefined) {
            testcase_temp.classes = {};
        }
        testcase_temp.classes['j'] = $('#gc-J').val(),
        testcase_temp.classes['f'] = $('#gc-F').val(),
        testcase_temp.classes['q'] = $('#gc-Q').val(),
        testcase_temp.classes['d'] = $('#gc-D').val(),
        testcase_temp.classes['w'] = $('#gc-W').val(),
        testcase_temp.classes['l'] = $('#gc-L').val(),
        testcase_temp.classes['s'] = $('#gc-S').val()

        testcase_temp.schemas = [];
        $('#schemas .schema input:text').each(function() {
            var id = $(this).parent().attr('schema_id');
            testcase_temp.schemas.push({
                id: id,
                code: $(this).val()
            });
        });
        return testcase_temp;
    },

    writeTestcase = function(testcase) {
        testcase_temp = testcase;
        $('#tc-name').val(testcase.name);
        //Classes
        $('#gc-J').val(testcase.classes.j),
        $('#gc-F').val(testcase.classes.f),
        $('#gc-Q').val(testcase.classes.q),
        $('#gc-D').val(testcase.classes.d),
        $('#gc-W').val(testcase.classes.w),
        $('#gc-L').val(testcase.classes.l),
        $('#gc-S').val(testcase.classes.s)
        //Schemas
        $.each(testcase.schemas, function(index, value) {
            addSchema(value);
        });
    },

    cleanForm = function() {
        testcase_temp = {};
        $('#schemas .schema').detach();
    },

    updateKB = function() {
        $.ajax({
            url: '/kb/update',
            type: 'GET',
            error: function() {
                console.log("ERROR!");
            }
        });
    };

    return {
        initialize: function() {
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
                e3soos.testcase.callback(readTestcase());
                dialog.modal('hide');
                event.preventDefault();
            });
            $('#update-kb').click(function(event){
                updateKB();
                event.preventDefault();
            });
        },
        open: function(testcase) {
            cleanForm();
            if(testcase != undefined) {
                writeTestcase(testcase);
            }
            dialog.modal('show');
        }
    };
})();

e3soos.testcase = (function() {

    var testcases = [],

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
                delete testcases[testcase.id];
            },
            error: function() {
                console.log("ERROR!");
            }
        });
    },

    editTestcase = function(testcase) {
        var args = {};
        args['testcase.id'] = testcase.id;
        args['testcase.name'] = testcase.name;
        args['testcase.classes.id'] = testcase.classes.id;
        args['testcase.classes.j'] = testcase.classes.j;
        args['testcase.classes.f'] = testcase.classes.f;
        args['testcase.classes.q'] = testcase.classes.q;
        args['testcase.classes.d'] = testcase.classes.d;
        args['testcase.classes.w'] = testcase.classes.w;
        args['testcase.classes.l'] = testcase.classes.l;
        args['testcase.classes.s'] = testcase.classes.s;
        $.each(testcase.schemas, function(index, value) {
            args['testcase.schemas[' + index+ '].id'] = value.id;
            args['testcase.schemas[' + index+ '].code'] = value.code;
        });

        $.ajax({
            url: '/tests/edit',
            type: 'PUT',
            dataType: 'json',
            data: args,
            success: function(data) {
                var t = $('.testcase-id:contains(' + testcase.id+ ')').parent();
                $(t).children('.testcase-name').text(testcase.name);
            },
            error: function() {
                console.log("ERROR!");
            }
        });
    },

    createTestcase = function(testcase) {
        var args = {};
        args['testcase.name'] = testcase.name;
        args['testcase.classes.j'] = testcase.classes.j;
        args['testcase.classes.f'] = testcase.classes.f;
        args['testcase.classes.q'] = testcase.classes.q;
        args['testcase.classes.d'] = testcase.classes.d;
        args['testcase.classes.w'] = testcase.classes.w;
        args['testcase.classes.l'] = testcase.classes.l;
        args['testcase.classes.s'] = testcase.classes.s;
        $.each(testcase.schemas, function(index, value) {
            args['testcase.schemas[' + index+ '].code'] = value.code;
        });

        $.ajax({
            url: '/tests/add',
            type: 'POST',
            dataType: 'json',
            data: args,
            success: function(data) {
                testcase = data;
                testcases[testcase.id] = testcase;
                $('.testcases').append(
                    '<tr class="testcase">'
                    + '<td><input type="checkbox"/></td>'
                    + '<td class="testcase-id">' + testcase.id + '</td>'
                    + '<td>' + testcase.name + '</td>'
                    + '<td class="testcase-status">Not started</td>'
                    + '</tr>'
                    );
            },
            error: function() {
                console.log("ERROR!");
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
    };

    return {
        initialize: function() {
            $('#create-testcase').click(function(event) {
                e3soos.testcase_form.open();
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

            $('#edit-testcase').click(function(event){
                var dom = $('.testcases .testcase input:checked').parent().parent()[0];
                if(dom != undefined){
                    var id = $(dom).children('.testcase-id').text();
                    if(testcases[id] == undefined) {
                        $.ajax({
                            url: '/tests/' + id,
                            dataType: 'json',
                            success: function(data) {
                                //cache
                                testcases[data.id] = data;
                                e3soos.testcase_form.open(data);
                            },
                            error: function() {
                                console.log("ERROR!");
                            }
                        });
                    } else {
                        e3soos.testcase_form.open(testcases[id]);
                    }
                }
                event.preventDefault();
            });
        },
        callback: function(testcase) {
            console.log(testcase);
            if(testcase.id != undefined) {
                testcases[testcase.id] = testcase;
                editTestcase(testcase);
            } else {
                createTestcase(testcase);
            }
        }
    };
})();