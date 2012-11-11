package ru.ifmo.ailab.e3soos.facts.elements;

public class FastElement extends Element {

    public FastElement() {
        super();
        setElementType(ElementType.T);
    }

    public FastElement(int firstZone, SurfaceType firstSurface,
            int secondZone, SurfaceType secondSurface) {
        super(ElementType.T, firstZone, firstSurface, secondZone, secondSurface);
    }
}
