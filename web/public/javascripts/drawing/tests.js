"use strict";

window.onload = function() {
    var container = $("#test-canvases");

    elementTest1(container);
    elementTest2(container);
    schemeFrameTest1(container);
    schemeTest1(container);
    schemeTest2(container);
};

function createTestCanvas(container, id) {
    $(container).append('<div id="' + id +'" class="test-canvas"></div>');
}

function addToStage(config, shape) {
    var layer = new Kinetic.Layer();
    layer.add(shape);

    var stage = new Kinetic.Stage(config);
    stage.add(layer);
}

function elementTest1(container) {
    var element = new Drawing.Element({
        code: 'B1A1A',
        width: 30,
        height: 100,
        firstR: 0,
        secondR: -1
    }),
    id = 'elementTests-1';

    createTestCanvas(container, id);

    addToStage({
        container: id,
        width: 50,
        height: 120
    }, element);
}

function elementTest2(container) {
    var element = new Drawing.Element({
        code: 'Y2P3A',
        x: 5,
        y: 5,
        width: 40,
        height: 115,
        firstR: -1,
        secondR: 1
    }),
    id = 'elementTests-2';

    createTestCanvas(container, id);

    addToStage({
        container: id,
        width: 50,
        height: 120
    }, element);
}

function schemeFrameTest1(container) {
    var element = new Drawing.SchemeFrame({
        width: 400,
        height: 120,
        scdZoneLength: 150,
        frameCenter: 200
    }),
    id = 'schemeFrameTest-1';

    createTestCanvas(container, id);

    addToStage({
        container: id,
        width: 402,
        height: 122
    }, element);
}

function schemeTest1(container) {
    var element = Drawing.AbstractFactory.createScheme({
        code: 'B1P1A + C1V2P + T3V3P'
    }),
    id = 'schemeTest-1';

    createTestCanvas(container, id);

    addToStage({
        container: id,
        width: 402,
        height: 122
    }, element);
}

function schemeTest2(container) {
    var element = Drawing.AbstractFactory.createScheme({
        code: 'Y1P1A + C1V2P + B2P2P + T3V3P + C3A3P + C3V4V + C4V4P'
    }),
    id = 'schemeTest-2';

    createTestCanvas(container, id);

    addToStage({
        container: id,
        width: 402,
        height: 122
    }, element);
}