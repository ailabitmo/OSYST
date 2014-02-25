"use strict";

//Declare the namespace
var e3soos = e3soos || {};

/**
 * Initializes the code
 */
$(document).ready(function () {
    e3soos.dashboard.initialize();
});

function parseRules(workflow, logs) {
    var debug = "";
    var hm = {};
    $.each(logs, function (index, value) {
        for (var j = 0; j < value.facts.length; j++) {
            hm[value.facts[j]] = value.ruleName;
            debug += (value.facts[j] + ":" + value.ruleName + "<br/>");
        }
    });
    workflow = replaceAll(workflow, "[{", "");
    workflow = replaceAll(workflow, "}]", "");
    var temp = workflow.split("},{");
    var blocks = new Array(temp.length);
    for (var i = 0; i < temp.length; i++) {
        blocks[i] = {
            name: getValue(temp[i], "name"),
            type: getValue(temp[i], "type"),
            memoryAction: getValue(temp[i], "memoryAction"),
            calledRule: hm[getValue(temp[i], "name")]
        };
        debug += ("Block " + i + "<br/>");
        debug += ("name:" + getValue(temp[i], "name") + "<br/>");
        debug += ("type:" + getValue(temp[i], "type") + "<br/>");
        debug += ("memoryAction:" + getValue(temp[i], "memoryAction") + "<br/>");
        debug += ("calledRule:" + hm[getValue(temp[i], "name")] + "<br/><br/>");
    }
    return {blocks: changeOrder(blocks), logs: debug};
}

function changeOrder(blocks) {
    var output = new Array(blocks.length);
    var indexer = 0;
    for (var i = 0; i < blocks.length; i++) {
        if (blocks[i].type == "ruleTriggered") {
            output[indexer] = blocks[i];
            indexer++
        }
    }
    for (i = 0; i < blocks.length; i++) {
        if (blocks[i].type == "objectInserted") {
            output[indexer] = blocks[i];
            indexer++
        }
    }
    return output;
}

function replaceAll(string, search, replace) {
    return string.split(search).join(replace);
}

function getValue(data, type) {
    var temp = data.split("\",\"");
    for (var i = 0; i < temp.length; i++) {
        var str = replaceAll(temp[i], "\"", "");
        if (str.indexOf(type) == 0) {
            return replaceAll(str, type + ":", "");
        }
    }
}

e3soos.dashboard = (function () {

    var classification = {},
        technicalReqs = {},
        schemes = [],

        /**
         * Reads technical requirements from the DOM tree and saves them.
         */
            readTechnicalReqs = function () {
            technicalReqs.apertureSpeed = $('#aperture-speed').val();
            technicalReqs.angularField = $('#angular-field').val();
            technicalReqs.focalLength = $('#focal-length').val();
            technicalReqs.imageQuality = $('#image-quality').val();
            technicalReqs.backFocalDistance = $('#backfocal-distance').val();
            technicalReqs.entrancePupilPosition = $('#entrance-pupil-position').val();
            technicalReqs['waveLengths[0]'] = $('#spectral-range-min').val();
            technicalReqs['waveLengths[1]'] = $('#spectral-range-max').val();
        },

        /**
         * Gets if the debug mode is enabled or not.
         * @return true or false
         */
            isDebugMode = function () {
            var debug = $('#debug');
            // return debug.size() !== 0 && debug.is('.active');
            return true;
        },

        /**
         * Writes the classification object in DOM tree.
         */
            writeClassification = function () {
            $('#class-J').text(classification.j);
            $('#class-W').text(classification.w);
            $('#class-F').text(classification.f);
            $('#class-L').text(classification.l);
            $('#class-Q').text(classification.q);
            $('#class-S').text(classification.s);
            $('#class-D').text(classification.d);
            $('#class-R').text(classification.r);
        },

        afterSynthesisFinished = function (data) {
            schemes = data.schemes;
            classification = data.classification;
            writeClassification();
            lib.schemes.show({
                schemes: schemes
            });
            $('#scheme-area').height($(window).height() - $('#general-chs').height() - 130);
        },

        onError = function () {
            e3soos.notifier.showError();
        };

    /**
     * Public methods and variables.
     */
    return {
        synthesis: function () {
            readTechnicalReqs();
            if (!jQuery.isEmptyObject(technicalReqs)) {
                e3soos.notifier.open();
                if (isDebugMode()) {
                    $.getJSON(
                        'debug/synthesis?' + e3soos.utils.toParam(technicalReqs, 'requirements.'),
                        function (data) {
                            e3soos.debugwindow.open(data.logs);
                            e3soos.visualizationwindow.open(data.workflow, data.logs);
                            afterSynthesisFinished(data.data);
                            e3soos.notifier.close();
                        }
                    ).error(function () {
                            onError();
                        });
                } else {
                    $.getJSON(
                        'run/synthesis?' + e3soos.utils.toParam(technicalReqs, 'requirements.'),
                        function (data) {
                            afterSynthesisFinished(data);
                            e3soos.notifier.close();
                        }
                    ).error(function () {
                            onError();
                        });
                }
            }
        },

        /**
         * Initilize the module.
         */
        initialize: function () {
            $('#btn-synthesis').click(function (event) {
                if (e3soos.validator.validate($('#tech-reqs-form'))) {
                    e3soos.dashboard.synthesis();
                }
                event.preventDefault();
            });
            $('#debug').click(function (event) {
                event.preventDefault();
            });
            $('#debug').button();

            //Setup ajax request configuration
            $.ajaxSetup({
                timeout: 60000
            });
            $('#print').click(function (event) {
                if (e3soos.validator.validate($('#tech-reqs-form'))) {
                    e3soos.dashboard.print();
                }
                event.preventDefault();
            });
        },
        print: function () {
            readTechnicalReqs();
            if (!jQuery.isEmptyObject(technicalReqs)) {
                window.open(
                    'synthesis/print?' + e3soos.utils.toParam(technicalReqs, 'requirements.'));
            }
        }
    };
})();

/**
 * Progress bar.
 */
e3soos.notifier = (function () {

    var modal_id = "notifier-modal",

        /**
         * Creates the DOM representation of the progress bar.
         */
            createDOM = function () {
            $('body').append('<div id="' + modal_id + '" class="modal fade">'
                + '<div class="modal-header"><h3>Please, waiting...</h3></div>'
                + '</div>');
        };

    /**
     * Public methods and variables.
     */
    return {
        open: function () {
//            if ($('#' + modal_id).length <= 0) {
//                createDOM();
//            }
//            $('#' + modal_id).modal({
//                backdrop:'static',
//                keyboard:false
//            });
        },

        close: function () {
            setTimeout(function () {
                $('#' + modal_id).modal('hide');
            }, 600);
        },

        showError: function () {
            $('#' + modal_id).empty();
            $('#' + modal_id).append('<div class="alert alert-error" style="margin-bottom:0;">'
                + '<h4 class="alert-heading">Oops, error!</h4>'
                + 'Please, reload the page or contact us if it doesn\'t help.'
                + '</div>');
        }
    };
})();

e3soos.debugwindow = (function () {

    var window = $('<div></div>').dialog({
        autoOpen: false,
        title: 'Debug window',
        width: 'auto'
    });

    return {
        open: function (logs) {
            window.empty();
            var html = '<table class="table table-striped">'
                + '<thead><tr><th>Package</th><th>Rule</th><th>Facts fired a rule</th></tr></thead>';
            $.each(logs, function (index, value) {
                html += '<tr><td>' + value.packageName + '</td><td>' + value.ruleName
                    + '</td><td>' + value.facts + '</td></tr>';
            });
            html += '</table>';
            window.html(html);
            window.dialog('open');
        },
        close: function () {
            window.dialog('close');
        }
    };
})();

e3soos.visualizationwindow = (function () {
    var _visualization = visualization;

    var init = function () {
        getBlocks(function (blocks) {
            _visualization.drawBlocks(blocks);
        });
    };

    var getBlocks = function (callback) {
        $.get("./rest/", function (blocks) {
            //test data
            blocks[0].memoryAction = "remove";
            blocks[1].memoryAction = "add";
            blocks[3] = {
                name: "fact3",
                type: "objectInserted",
                memoryAction: "change",
                calledRule: "Rule #1"
            };
            blocks[4] = {
                name: "fact4",
                type: "objectInserted",
                memoryAction: "add",
                calledRule: "Rule #1"
            };
            blocks[5] = {
                name: "fact5",
                type: "objectInserted",
                memoryAction: "change",
                calledRule: "Rule #1"
            };
            //test data

            callback(blocks);
        });
    };
    var window = $('<div></div>').dialog({
        autoOpen: false,
        title: 'Debug window',
        width: 'auto'
    });

    return {
        open: function (workflow, logs) {
            window.empty();
            var html = '<div id="droolsVisualizationCanvas"></div>';
            window.html(html);
            window.dialog('open');
            visualization.drawBlocks(parseRules(workflow, logs).blocks);
        },
        close: function () {
            window.dialog('close');
        }
    };
})();

e3soos.validator = (function () {

    var isEmptyString = function (value) {
            var tmp = $.trim(value);
            if (tmp === "" || tmp === undefined || tmp === null) {
                return true;
            } else {
                return false;
            }
        },

        isValid = function (element) {
            if (element.attr('requred') === "true" && isEmptyString(element.val())) {
                return false;
            }
            if (element.attr('type') === "number" && !$.isNumeric(element.val())) {
                return false;
            }
            if (element.attr('min') && element.val() < parseFloat(element.attr('min'))) {
                return false;
            }
            if (element.attr('max') && element.val() > parseFloat(element.attr('max'))) {
                return false;
            }
            return true;
        };

    return {
        /**
         * Validate a form.
         */
        validate: function (form) {
            var flag = true;
            form.find('*:input').each(function () {
                var control_group = $(this).parents('.control-group');
                if (!isValid($(this))) {
                    $(control_group).addClass('error');
                    flag = false;
                } else {
                    $(control_group).removeClass('error');
                }
            });
            return flag;
        }
    };
})();
var visualization = new function () {
    var self = this;
    var stage;
    var layers = {};
    var _blocks;

    var blockTypes = {
        fact: "objectInserted",
        rule: "ruleTriggered"
    };

    var memoryActions = {
        add: "add",
        remove: "remove",
        change: "change"
    };

    var settings = {
        canvasWidth: 800,
        canvasHeight: 200,
        blockWidth: 300,
        blockHeight: 50,
        blockLeftMargin: 50,
        blockTopMargin: 50,
        timeLineLeftMargin: 10,
        fontSize: 14,
        fontWidth: 6,
        lineHeight: 15,
        rulePolygonIncline: 10, //different in pixels between topLeftCorner and lowerLeftCorner
        arrowWidth: 10,
        arrowHeight: 5
    };

    var lastBlockMarginTop = 0;
    var lastBlockHeight = settings.blockHeight;

    $(document).ready(function () {
        initKinetic();
    });

    var initKinetic = function () {
        stage = new Kinetic.Stage({
            width: settings.canvasWidth,
            height: settings.canvasHeight,
            container: 'droolsVisualizationCanvas'
        });
        layers.main = new Kinetic.Layer();
        layers.texts = new Kinetic.Layer();
        layers.timeLine = new Kinetic.Layer();
        layers.memoryActionLines = new Kinetic.Layer();
        layers.calledRulesLines = new Kinetic.Layer();
        stage.add(layers.main);
        stage.add(layers.texts);
        stage.add(layers.timeLine);
        stage.add(layers.memoryActionLines);
        stage.add(layers.calledRulesLines);
    };

    this.drawBlocks = function (blocks) {
        initKinetic();
        _blocks = blocks;
        drawBlock(0);
    };

    var drawBlock = function (indexBlock) {

        var block = _blocks[indexBlock];
        if (!block)
            return;
        switch (block.type) {
            case blockTypes.fact:
                self.addFact(block);
                break;
            case blockTypes.rule:
                self.addRule(block);
                break;
        }

        setTimeout(function () {
            drawBlock(indexBlock + 1);
        }, 0);
    };

    this.addFact = function (block) {
        var textLines = getTextLines("Name: " + block.name);
        var blockHeight = getBlockHeight(textLines);

        var newBlockMarginTop = getNewBlockMarginTop(blockHeight);

        lastBlockMarginTop = newBlockMarginTop;
        block.blockMarginTop = newBlockMarginTop;

        resizeCanvas(newBlockMarginTop);
        drawTimeLine();
        drawFactRectangle(blockHeight, newBlockMarginTop);

        lastBlockHeight = blockHeight;
        block.blockHeight = blockHeight;

        drawMemoryAction(block);

        if (block.calledRule)
            addArrow(block);

        addText(textLines, newBlockMarginTop);
    };

    var drawFactRectangle = function (blockHeight, blockMarginTop) {
        var rect = new Kinetic.Rect({
            width: settings.blockWidth,
            height: blockHeight,
            x: settings.blockLeftMargin,
            y: blockMarginTop,
            fill: 'lightgreen',
            stroke: 'black',
            strokeWidth: 1
        });

        layers.main.add(rect);
//        layers.main.draw();
        layers.main.batchDraw();
    };

    this.addRule = function (block) {
        var textLines = getTextLines("Name: " + block.name);
        var blockHeight = getBlockHeight(textLines);

        var newBlockMarginTop = getNewBlockMarginTop(blockHeight);

        lastBlockMarginTop = newBlockMarginTop;
        block.blockMarginTop = newBlockMarginTop;

        resizeCanvas(newBlockMarginTop);
        drawTimeLine();
        drawRulePolygon(blockHeight, newBlockMarginTop);

        lastBlockHeight = blockHeight;
        block.blockHeight = blockHeight;

        addText(textLines, newBlockMarginTop);
    };

    var drawRulePolygon = function (blockHeight, blockMarginTop) {
        var polygon = new Kinetic.Polygon({
            points: [settings.blockLeftMargin + settings.rulePolygonIncline, blockMarginTop,
                settings.blockLeftMargin + settings.blockWidth, blockMarginTop,
                settings.blockLeftMargin + settings.blockWidth - settings.rulePolygonIncline, blockMarginTop + blockHeight,
                settings.blockLeftMargin, blockMarginTop + blockHeight],
            fill: 'lightgreen',
            stroke: 'black',
            strokeWidth: 1
        });

        layers.main.add(polygon);
//        layers.main.draw();
        layers.main.batchDraw();
    };

    var drawMemoryAction = function (block) {
        var topMargin = block.blockMarginTop + block.blockHeight / 2;

        drawHorizontLine([settings.timeLineLeftMargin, topMargin, settings.blockLeftMargin, topMargin ]);

        switch (block.memoryAction) {
            case memoryActions.add:
                drawLeftArrow(settings.timeLineLeftMargin, topMargin);
                break;
            case memoryActions.remove:
                drawRightArrow(settings.blockLeftMargin, topMargin);
                break;
            case memoryActions.change:
                drawLeftArrow(settings.timeLineLeftMargin, topMargin);
                drawRightArrow(settings.blockLeftMargin, topMargin);
                break;
        }
    };

    var drawHorizontLine = function (pointsArray) {
        var line = new Kinetic.Line({
            points: pointsArray,
            stroke: 'black'
        });

        layers.memoryActionLines.add(line);
//        layers.memoryActionLines.draw();
        layers.memoryActionLines.batchDraw();
    };

    var drawLeftArrow = function (leftPointX, leftPointY) {
        var polygon = new Kinetic.Polygon({
            points: [leftPointX, leftPointY,
                leftPointX + settings.arrowWidth, leftPointY + settings.arrowHeight,
                leftPointX + settings.arrowWidth, leftPointY - settings.arrowHeight],
            fill: 'black',
            stroke: 'black',
            strokeWidth: 1
        });

        layers.memoryActionLines.add(polygon);
        //layers.memoryActionLines.draw();
        layers.memoryActionLines.batchDraw();
    };

    var drawRightArrow = function (rightPointX, rightPointY) {
        var polygon = new Kinetic.Polygon({
            points: [rightPointX, rightPointY,
                rightPointX - settings.arrowWidth, rightPointY + settings.arrowHeight,
                rightPointX - settings.arrowWidth, rightPointY - settings.arrowHeight],
            fill: 'black',
            stroke: 'black',
            strokeWidth: 1
        });

        layers.memoryActionLines.add(polygon);
//        layers.memoryActionLines.draw();
        layers.memoryActionLines.batchDraw();
    };

    var getTextLines = function (text) {
        var words = text.split(' ');
        var line = '';
        var lines = [];
        var context = layers.texts.getContext()._context;

        for (var i = 0; i < words.length; i++) {
            var testLine = line + words[i] + ' ';
            var metrics = context.measureText(testLine);
            var testWidth = testLine.length * settings.fontWidth;
            if (testWidth > settings.blockWidth - 20) {
                lines.push(line);
                line = words[i] + ' ';
            } else
                line = testLine;

            if (i === words.length - 1)
                lines.push(line);
        }

        return lines;
    };

    var getBlockHeight = function (textLines) {
        var blockHeight = settings.blockHeight;
        var textHeight = 20;

        textLines.forEach(function (line) {
            var lineHeight = getLineHeight(line);
            textHeight += lineHeight;
        });

        if (textHeight > settings.blockHeight)
            blockHeight = textHeight;

        return blockHeight;
    };

    var getLineHeight = function (line) {
        var lineHeight = settings.lineHeight;
        var wrapCount = line.match(/[\n]/g);
        if (wrapCount && wrapCount.length)
            lineHeight = (++wrapCount.length) * settings.lineHeight;

        return lineHeight;
    };

    var getNewBlockMarginTop = function (blockHeight) {
        var newBlockMarginTop;
        if (layers.main.getChildren().length > 0)
            newBlockMarginTop = lastBlockMarginTop + settings.blockTopMargin + lastBlockHeight;
        else
            newBlockMarginTop = lastBlockMarginTop + settings.blockTopMargin;

        return newBlockMarginTop;
    };

    var resizeCanvas = function (marginTop) {
        if (marginTop + settings.blockHeight > settings.canvasHeight) {
            settings.canvasHeight = marginTop + settings.blockHeight + settings.blockTopMargin;
            stage.setSize(settings.canvasWidth, settings.canvasHeight);
        }
    };

    var drawTimeLine = function () {
        var line = layers.timeLine.getChildren()[0];
        if (!line) {
            line = new Kinetic.Line({
                points: [settings.timeLineLeftMargin, 0, settings.timeLineLeftMargin, settings.canvasHeight],
                stroke: 'black'
            });

            layers.timeLine.add(line);
        } else {
            line.setPoints([settings.timeLineLeftMargin, 0, settings.timeLineLeftMargin, settings.canvasHeight]);
        }
//        layers.timeLine.draw();
        layers.timeLine.batchDraw();
    };

    var addArrow = function (block) {
        var calledRule = getCalledRule(block.calledRule);
        var distance = block.blockMarginTop - calledRule.blockMarginTop;
        var topBlockCenterY = calledRule.blockMarginTop + calledRule.blockHeight / 2;
        var lowerBlockCenterY = block.blockMarginTop + block.blockHeight / 2;

        var spline = new Kinetic.Spline({
            points: [
                {
                    x: settings.blockLeftMargin + settings.blockWidth - settings.rulePolygonIncline / 2,
                    y: topBlockCenterY
                },
                {
                    x: settings.blockLeftMargin + settings.blockWidth + distance * 0.3,
                    y: topBlockCenterY + distance / 2
                },
                {
                    x: settings.blockLeftMargin + settings.blockWidth,
                    y: lowerBlockCenterY
                }
            ],
            stroke: 'black',
            strokeWidth: 2,
            tension: 1
        });

        layers.calledRulesLines.add(spline);
        layers.calledRulesLines.batchDraw();
        drawLeftArrow(settings.blockLeftMargin + settings.blockWidth, lowerBlockCenterY);
    };

    var addText = function (textLines, newBlockMarginTop) {
        var leftMargin = settings.blockLeftMargin + 10;
        var topMargin = 10;

        textLines.forEach(function (line) {
            var text = new Kinetic.Text({
                x: leftMargin,
                y: newBlockMarginTop + topMargin,
                text: line,
                fontSize: settings.fontSize,
                fontFamily: 'Calibri',
                fill: 'green'
            });

            layers.texts.add(text);

            topMargin += getLineHeight(line);
        });
//        layers.texts.draw();
        layers.texts.batchDraw();
    };

    var getCalledRule = function (calledRuleName) {
        alert(calledRuleName);
        return _blocks.filter(function (block) {
            return block.name === calledRuleName;
        })[0];
    };
}()