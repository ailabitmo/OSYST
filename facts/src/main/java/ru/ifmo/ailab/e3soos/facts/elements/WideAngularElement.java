package ru.ifmo.ailab.e3soos.facts.elements;

public class WideAngularElement extends Element {

    public WideAngularElement() {
        super();
        setElementType(ElementType.Y);
    }

    public WideAngularElement(int firstZone, SurfaceType firstSurface,
            int secondZone, SurfaceType secondSurface) {
        super(ElementType.Y, firstZone, firstSurface, secondZone, secondSurface);
    }
}
