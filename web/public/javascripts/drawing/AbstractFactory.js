"use strict";

var Drawing = Drawing || {};

Drawing.AbstractFactory = (function() {

    var NUMBER_OF_ZONES = 4,
        SCHEME_HEIGHT = 120,
        ELEMENT_WIDTH = 30,
        ELEMENT_HEIGHT = 100,
        ELEMENT_INTERVAL = 5, //A half of distance between elements
        ZONE_WIDTH = ELEMENT_WIDTH + 2 * ELEMENT_INTERVAL,
        zoneW = [];

    /**
     * Computes the coordinates of the elements.
     * @param {Drawing.Element[]} elements
     */
    var _computeElementsLayout = function(elements) {

        //Initiate variables
        var elementsInZone = [],
            /**
             * Sum up the widths of the zones.
             * @param {Number} from
             * @param {NUmber} to
             */
            _computeWidth = function(from, to) {
                var result = 0;
                for (var j = from - 1; j < to - 1; j++) {
                    result += zoneW[j];
                }
                return result;
            };

        //Initialize the arrays
        for (var i = 0; i < NUMBER_OF_ZONES; i++) {
            elementsInZone[i] = 0;
            zoneW[i] = ZONE_WIDTH;
        }

        //Compute the number of elements in each zone
        for (var i = 0, len = elements.length; i < len; i++) {
            elementsInZone[elements[i].getFirstZone() - 1] += 0.5;
            elementsInZone[elements[i].getSecondZone() - 1] += 0.5;
        }

        //Compute the width of the zones
        for (var i = 0; i < NUMBER_OF_ZONES; i++) {
            if(elementsInZone[i] !== 0) {
                zoneW[i] = elementsInZone[i] * (ELEMENT_WIDTH + 2 * ELEMENT_INTERVAL);
            }
        }

        if(zoneW[1] !== zoneW[2]) {
            if(zoneW[1] > zoneW[2]) {
                zoneW[2] = zoneW[1];
            } else {
                zoneW[1] = zoneW[2];
            }
        }

        for (var i = 0, len = elements.length; i < len; i++) {

            var x = 0, w = ELEMENT_WIDTH;

            if (!elements[i - 1] || elements[i - 1].getSecondZone() !== elements[i].getFirstZone()) {
                x = _computeWidth(1, elements[i].getFirstZone()) + ELEMENT_INTERVAL;
            } else {
                x = elements[i - 1].getX() + elements[i - 1].getWidth()
                        + ELEMENT_INTERVAL * 2;
            }
            if (elements[i].getSecondZone() > elements[i].getFirstZone()) {
                w += _computeWidth(elements[i].getFirstZone() + 1,
                        elements[i].getSecondZone());
            }

            elements[i].setX(x);
            elements[i].setHeight(ELEMENT_HEIGHT);
            elements[i].setY((SCHEME_HEIGHT - elements[i].getHeight()) / 2);
            elements[i].setWidth(w);
        }
    },
    /**
     * Computes convexity for each of the surfaces in the scheme.
     * @param {Drawing.Element[]} elements
     */
    _computeSurfacesConvexities = function(elements) {
        var b = 0;

        for (var el = 0, len = elements.length; el < len; el++) {

            for (var i = 0; i < 2; i++) {

                var result, type, currentZone, previousZone;

                if (i === 0) {
                    //It's the left surface of the element.
                    type = elements[el].getFirstSurface();
                    currentZone = elements[el].getFirstZone();
                    if (el > 0) {
                        previousZone = elements[el - 1].getSecondZone();
                    }
                } else {
                    //It's the right surface of the element.
                    type = elements[el].getSecondSurface();
                    currentZone = elements[el].getSecondZone();
                    previousZone = elements[el].getFirstZone();
                }

                switch (type) {
                    case "P":
                        if (i === 1 && previousZone === 1 && currentZone < 3) {
                            result = 1;
                        } else if (i === 0 && currentZone < 2) {
                            result = 1;
                        } else {
                            result = -1;
                        }
                        if (i === 0) {
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
                        if (el === 0 && i === 0) {
                            //It's the first surface in the scheme.
                            result = 0;
                        } else {
                            if (b === 1) {
                                result = 1;
                            } else {
                                result = -1;
                            }
                        }
                        break;
                    case "F":
                        if (b === 1) {
                            result = 1;
                        } else {
                            result = -1;
                        }
                        break;
                    case "V":
                        if (currentZone === 2 && el === 0 && i === 0) {
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

                if (i === 0) {
                    //It's the left surface of the element.
                    elements[el].setFirstR(result);
                } else {
                    elements[el].setSecondR(result);
                }
            }
        }
    };

    return {
        /**
         * Creates a Kinetic.Group with a Drawing.SchemeFrame and
         * Drawing.Elements on it.
         *
         * @param {Object} config
         * @param {String} config.code i.e. 'B1P1A + C1V2P + T2V2P'
         * @param {Number} config.width
         * @param {Number} config.height
         * @returns {Kinetic.Group}
         */
        createScheme: function(config) {

            //TODO Verify the 'config' parameter

            var group = new Kinetic.Group(),
                groupElements = new Kinetic.Group(),
                elements = [],
                codes = config['code'].split(/[\s+]+/);

            for (var i = 0, len = codes.length; i < len; i++) {
                var element = new Drawing.Element({
                    code: codes[i]
                });

                elements.push(element);
            }

            _computeElementsLayout(elements);

            _computeSurfacesConvexities(elements);

            for(var i = 0, len = elements.length; i < len; i++) {
                groupElements.add(elements[i]);
            }

            var width = 0;
            for(var i = 0; i < NUMBER_OF_ZONES; i++) {
                width += zoneW[i];
            }

            group.add(new Drawing.SchemeFrame({
                width: width,
                height: SCHEME_HEIGHT,
                scdZoneLength: zoneW[1] + zoneW[2],
                frameCenter: zoneW[0] + zoneW[1]
            }));

            group.add(groupElements);

            group.setWidth(width);
            group.setHeight(SCHEME_HEIGHT);

            return group;
        },
        /**
         * @param {Object} config
         * @param {String} config.code i.e. 'B1P1A + C1V2P + T2V2P'
         * @param {Object} config.container
         * @param {Number} config.width
         * @param {Number} config.height
         * @returns {undefined}
         */
        createSchemeAndStage: function(config) {
            var layer = new Kinetic.Layer(),
                scheme = Drawing.AbstractFactory.createScheme({
                    code: config.code
                }),
                stage = new Kinetic.Stage({
                    container: config.container,
                    width: scheme.getWidth() + 1,
                    height: scheme.getHeight() + 1
                });

            layer.add(scheme);
            stage.add(layer);
        }
    };
})();

