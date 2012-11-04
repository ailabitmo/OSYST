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
        }
    };
})();