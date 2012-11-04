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

    sendData = function() {
        $.ajax({
            url: '/tests/add',
            type: 'POST',
            dataType: 'json',
            data: fields,
            success: function() {
                console.log("saved");
            },
            error: function() {
                console.log("error");
            }
        });
    },

    save = function() {
        dialog.modal('hide');
        readFields();
        console.log(fields);
        sendData();
    };

    return {
        initialize: function() {
            $('#create-testcase').click(function() {
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
                save();
                event.preventDefault();
            })
        }
    };
})();