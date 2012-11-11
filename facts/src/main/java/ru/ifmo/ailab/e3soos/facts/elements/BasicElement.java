package ru.ifmo.ailab.e3soos.facts.elements;

public class BasicElement extends Element {

    public BasicElement() {
        super();
        setElementType(ElementType.B);
    }

    public BasicElement(int firstZone, SurfaceType firstSurface,
            int secondZone, SurfaceType secondSurface) {
        super(ElementType.B, firstZone, firstSurface, secondZone, secondSurface);
    }
}
