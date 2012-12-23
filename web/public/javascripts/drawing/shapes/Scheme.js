"use strict";

var Drawing = Drawing || {};

(function(){
    /**
     * Scheme constructor.
     * @constructor
     * @augments Kinetic.Shape
     * @param {Object} config
     */
    Drawing.Scheme = function(config) {
        this._initScheme(config);
    };
    Drawing.Scheme.prototype = {
        _initScheme: function(config) {
            this.setDefaultAttrs({
                elements: [],
                interval: 20,
                elementWidth: 30, //FIXME Do we really need it?
                elementHeight: 100 //FIXME Do we really need it?
            });
            this.shapeType = "Scheme";

            this._computeAttrs(config);

            Kinetic.Shape.call(this, config);
            this._setDrawFuncs();
        },
        drawFunc: function(context) {

        },
        /**
         * Computes various attributes.
         */
        _computeAttrs: function(config) {
            //Extract optical element codes from the scheme code
            for(var code in config['scheme'].split(/[\s+]+/)) {
                this.attrs.elements.push(new Drawing.Element({
                    code: code
                }));
            }

            _computeSurfacesConvexities();
        },
        /**
         * Computes convexity for each of the surfaces in the scheme.
         */
        _computeSurfacesConvexities: function() {
            var b = 0;

            for(var el = 0, len = this.attrs.elements; el < len; el++) {

                for(var i = 0; i < 2; i++) {

                    var result, type, currentZone, previousZone;

                    if(i == 0) {
                        //It's the left surface of the element.
                        type = this.attrs.elements[el].getFirstSurface();
                        currentZone = this.attrs.elements[el].getFirstZone();
                        if(el > 0) {
                            previousZone = this.attrs.elements[el - 1].getSecondZone();
                        }
                    } else {
                        //It's the right surface of the element.
                        type = this.attrs.elements[el].getSecondSurface();
                        currentZone = this.attrs.elements[el].getSecondZone();
                        previousZone = this.attrs.elements[el].getFirstZone();
                    }

                    switch(type) {
                        case "P":
                            if(i == 1 && previousZone == 1 && currentZone < 3) {
                                result = 1;
                            } else if(i == 0 && currentZone < 2){
                                result = 1;
                            } else {
                                result = -1;
                            }
                            if(i == 0){
                                //It's the left surface of the element.
                                b = result;
                            } else {
                                //It's the right surface of the element.
                                b = -1 * result;
                            }
                            break;
                        case "O":
                            result = 0;
                            break;
                        case "A":
                            if(el == 0 && i == 0) {
                                //It's the first surface in the scheme.
                                result = 0;
                            } else {
                                if (b == 1) {
                                    result = 1;
                                } else {
                                    result = -1;
                                }
                            }
                            break;
                        case "F":
                            if(b == 1) {
                                result = 1;
                            } else {
                                result = -1;
                            }
                            break;
                        case "V":
                            if(currentZone == 2 && el == 0 && i == 0) {
                                //It's the first surface in the scheme and located in the second zone.
                                result = -1;
                            } else {
                                result = 0;
                            }
                            break;
                        default:
                            //It's unknown type of surface.
                            result = 0;
                    }
                }

                if(i == 0) {
                    //It's the left surface of the element.
                    this.attrs.elements[el].setFirstR(result);
                } else {
                    this.attrs.elements[el].setSecondR(result);
                }
            }
        }
    };

    Kinetic.Global.extend(Drawing.Scheme, Kinetic.Shape);
})();

/**
 * A structural scheme.
 */
Drawing.Scheme = function(options) {

    this.layer = new Kinetic.Layer();
    this.elements = [];
    this.surfaces = [];
    this.types = [];
    this.zones = [];
    this.inFirstZone = 0;
    this.inSecondZone = 0;
    this.inThirdZone = 0;

    for(var i = 0; i < this.options.codes.length; i++) {
        this.types.push(this.options.codes[i].charAt(2));
        this.zones.push(parseInt(this.options.codes[i].charAt(1)));
        this.types.push(this.options.codes[i].charAt(4));
        this.zones.push(parseInt(this.options.codes[i].charAt(3)));
        if(this.zones[i*2] == 1 && this.zones[i*2 + 1] == 1) {
            this.inFirstZone++;
        }
        if(this.zones[i*2] == 2 && this.zones[i*2 + 1] == 2) {
            this.inSecondZone++;
        }
        if(this.zones[i*2] == 3 && this.zones[i*2 + 1] == 3) {
            this.inThirdZone++;
        }
    }

    this.options.firstZoneW = this.options.elementWidth * (1 + this.inFirstZone)
    + this.options.interval * (1 + this.inFirstZone);
    this.options.firstZSX = this.options.interval;
    this.options.secondZoneW = this.options.elementWidth * (3 + this.inSecondZone)
    + this.options.interval * (3 + this.inSecondZone);
    this.options.secondZSX = this.options.firstZoneW + this.options.interval;
    this.options.secondZEX = this.options.secondZSX + this.options.secondZoneW;
    this.options.thirdZoneW = this.options.elementWidth * (1 + this.inThirdZone)
    + this.options.interval * (1 + this.inThirdZone);
    this.options.thirdZSX = this.options.secondZEX + this.options.interval,

    this.options.width = this.options.firstZoneW + this.options.interval * 2 + this.options.secondZoneW
    + this.options.thirdZoneW;
    this.options.centerX = this.options.secondZSX + this.options.secondZoneW / 2;
    this.options.centerY = this.options.height / 2;
    this.options.endX = this.options.width - this.options.xylinesStrokeWidth;
    this.options.zoneBottomY = (this.options.height - this.options.xylinesStrokeWidth * 2) * 0.95;
};

Drawing.Scheme.prototype._addElement = function (element) {
    var y = (this.options.height - element.getHeight()) / 2,
    x = this.options.firstZSX,
    w = this.options.elementWidth;

    var previous = undefined;
    if(this.elements.length > 0) {
        previous = this.elements[this.elements.length - 1];
    }

    if(element.getFirstZone() == "1") {
        if(previous != undefined) {
            x = previous.getX() + previous.getWidth() + this.options.interval;
        }
        if(element.getSecondZone() == "2") {
            x = this.options.secondZSX - this.options.elementWidth / 2;
        } else if(element.getSecondZone() == "3") {
            x = this.options.secondZSX - this.options.elementWidth / 2;
            w = this.options.secondZEX + (this.options.elementWidth / 2) - x;
        }
    } else if(element.getFirstZone() == "2") {
        x = this.options.centerX + this.options.interval;
        if(element.getSecondZone() == "2" && previous != undefined) {
            if(previous.getFirstZone() == "2" && previous.getSecondZone() == "2") {
                x = previous.getX() + previous.getWidth() + this.options.interval;
            }
        } else if(element.getSecondZone() == "3") {
            x = this.options.secondZEX - this.options.elementWidth / 2;
        }
    } else if(element.getFirstZone() == "3") {
        x = this.options.thirdZSX + this.options.interval;
        if(previous != undefined) {
            if((previous.getX() + previous.getWidth()) > this.options.thirdZSX) {
                x = previous.getX() + previous.getWidth() + this.options.interval;
            }
        }
    }

    //Set the element's props
    element.setX(x);
    element.setWidth(w);
    element.setY(y);

    this.elements.push(element);
    this.layer.add(element);
};

Drawing.Scheme.prototype.draw = function() {

    this.surfaces = this._getSaliences(this.options.codes);

    for(var i = 0; i < this.options.codes.length; i++) {
        this._addElement(new Drawing.Element({
            width: this.options.elementWidth,
            height: this.options.elementHeight,
            code: this.options.codes[i],
            firstR: this.surfaces[i * 2],
            secondR: this.surfaces[i * 2 + 1]
        }));
    }

    this._createXYLines();

    //Create a stage
    var stage = new Kinetic.Stage({
        container: this.options.container,
        width: this.options.width,
        height: this.options.height
    });

    stage.add(this.layer);
};