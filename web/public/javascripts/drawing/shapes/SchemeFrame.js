"use strict";

var Drawing = Drawing || {};

(function() {
    /**
     * SchemeFrame constructor.
     * @constructor
     * @augments Kinetic.Shape
     * @param {Object} config
     */
    Drawing.SchemeFrame = function(config) {
        this._initFrame(config);
    };
    Drawing.SchemeFrame.prototype = {
        _initFrame: function(config) {
            this.setDefaultAttrs({
                scdZoneLength: config.width ? config.width / 2.5 : 0,
                frameCenter: config.width ? config.width / 2 : 0,
                stroke: 'black',
                strokeWidth: 1
            });
            this.shapeType = "SchemeFrame";

            Kinetic.Shape.call(this, config);
            this._setDrawFuncs();
        },
        drawFunc: function(context) {

            var centerY = this.attrs.y + this.attrs.height / 2,
            centerX = this.attrs.x + this.attrs.frameCenter,
            endX = this.attrs.x + this.attrs.width,
            endY = this.attrs.y + this.attrs.height;

            context.beginPath();

            //Draw the main line
            context.moveTo(this.attrs.x, centerY);
            context.lineTo(endX, centerY);

            //Draw the right line
            context.moveTo(endX, this.attrs.y + this.attrs.height * 0.1);
            context.lineTo(endX, this.attrs.y + this.attrs.height * 0.9);

            //Draw the center line
            context.moveTo(centerX, this.attrs.y + this.attrs.height * 0.15);
            context.lineTo(centerX, this.attrs.y + this.attrs.height * 0.35);
            context.moveTo(centerX, this.attrs.y + this.attrs.height * 0.65);
            context.lineTo(centerX, this.attrs.y + this.attrs.height * 0.85);

            //Draw the second zone area
            context.moveTo(centerX - this.attrs.scdZoneLength / 2, this.attrs.y + this.attrs.height * 0.95);
            context.lineTo(centerX - this.attrs.scdZoneLength / 2, endY);
            context.lineTo(centerX + this.attrs.scdZoneLength / 2, endY);

            context.moveTo(centerX + this.attrs.scdZoneLength / 2, endY);
            context.lineTo(centerX + this.attrs.scdZoneLength / 2, this.attrs.y + this.attrs.height * 0.95);

            context.closePath();
            this.fillStroke(context);
        }
    };

    Kinetic.Global.extend(Drawing.SchemeFrame, Kinetic.Shape);
})();


