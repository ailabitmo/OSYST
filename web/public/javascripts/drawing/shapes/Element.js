"use strict";

var Drawing = Drawing || {};

(function(){
    /**
     * Element constructor.
     * @constructor
     * @augments Kinetic.Shape
     * @param {Object} config
     */
    Drawing.Element = function(config) {
        this._initElement(config);
    };
    Drawing.Element.prototype = {
        _initElement: function(config) {
            this.setDefaultAttrs({
                code: 'B1A1A',
                width: 0,
                height: 0,
                ratio: 1,
                strokeWidth: 1,
                surfaceRadious: 15,
                firstR: 0, //1 - is convex, 0 - is flat, -1 - is concave
                secondR: 0 //1 -is concave , 0 - is flat or -1 - is convex
            });
            this.shapeType = "Element";

            this._computeAttrs(config);

            Kinetic.Shape.call(this, config);
            this._setDrawFuncs();
        },
        _computeAttrs: function(config) {
            this.attrs.code = config.code;
            this.attrs.type = this.attrs.code.charAt(0);
            this.attrs.firstZone = parseInt(this.attrs.code.charAt(1), 10);
            this.attrs.firstSurface = this.attrs.code.charAt(2);
            this.attrs.secondZone = parseInt(this.attrs.code.charAt(3), 10);
            this.attrs.secondSurface = this.attrs.code.charAt(4);
        },
        drawFunc: function(context) {

            this.attrs.centerX = this.attrs.width / 2;
            this.attrs.centerY = this.attrs.height / 2;

            context.beginPath();
            //Select the starting point
            if(this.attrs.firstR > 0) {
                context.moveTo(this.attrs.surfaceRadious, 0);
            } else {
                //the top-left corner
                context.moveTo(0,0);
            }
            //Draw the top line
            if(this.attrs.secondR < 0) {
                context.lineTo(this.attrs.width - this.attrs.surfaceRadious, 0);
            } else {
                context.lineTo(this.attrs.width, 0);
            }
            //Draw the second (a.k.a the right) surface
            if(this.attrs.secondR < 0) {
                context.bezierCurveTo(this.attrs.width, this.attrs.surfaceRadious,
                    this.attrs.width, this.attrs.height - this.attrs.surfaceRadious,
                    this.attrs.width - this.attrs.surfaceRadious, this.attrs.height);
            } else if(this.attrs.secondR > 0) {
                context.bezierCurveTo(this.attrs.width - this.attrs.surfaceRadious, this.attrs.surfaceRadious,
                    this.attrs.width - this.attrs.surfaceRadious, this.attrs.height - this.attrs.surfaceRadious,
                    this.attrs.width, this.attrs.height);
            } else {
                context.lineTo(this.attrs.width, this.attrs.height);
            }
            //Draw the bottom line
            if(this.attrs.firstR > 0) {
                context.lineTo(this.attrs.surfaceRadious, this.attrs.height);
            } else if(this.attrs.firstR < 0) {
                context.lineTo(0, this.attrs.height);
            } else {
                context.lineTo(0, this.attrs.height);
            }
            //Draw the first (a.k.a the left) surface
            if(this.attrs.firstR > 0) {
                context.bezierCurveTo(0, this.attrs.height - this.attrs.surfaceRadious,
                    0, this.attrs.surfaceRadious,
                    this.attrs.surfaceRadious, 0);
            } else if(this.attrs.firstR < 0) {
                context.bezierCurveTo(this.attrs.surfaceRadious, this.attrs.height - this.attrs.surfaceRadious,
                    this.attrs.surfaceRadious, this.attrs.surfaceRadious,
                    0, 0);
            } else {
                context.lineTo(0, 0);
            }
            //Stop drawing
            context.closePath();
            this.fillStroke(context);
        },
        getType : function () {
            return this.attrs.type;
        },
        getFirstZone: function () {
            return this.attrs.firstZone;
        },
        getFirstSurface: function () {
            return this.attrs.firstSurface;
        },
        setFirstR : function (r) {
            this.attrs.firstR = r;
        },
        setSecondR : function (r) {
            this.attrs.secondR = r;
        },
        getSecondZone: function () {
            return this.attrs.secondZone;
        },
        getSecondSurface: function () {
            return this.attrs.secondSurface;
        },
        /**
        * @param {Number} width
        */
        setWidth: function(width) {
            this.attrs.width = width;
        },
        /**
        * @param {Number} height
        */
        setHeight: function(height) {
            this.attrs.height = height * this.attrs.ratio;
        },
        setHeightRatio: function(ratio) {
            this.attrs.ratio = ratio;
        }
    };

    Kinetic.Global.extend(Drawing.Element, Kinetic.Shape);
})();