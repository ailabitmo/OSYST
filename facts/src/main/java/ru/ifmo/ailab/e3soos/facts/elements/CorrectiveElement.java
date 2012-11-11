package ru.ifmo.ailab.e3soos.facts.elements;

public class CorrectiveElement extends Element {

    public CorrectiveElement() {
        super();
        setElementType(ElementType.C);
    }

    public CorrectiveElement(int firstZone, SurfaceType firstSurface,
            int secondZone, SurfaceType secondSurface) {
        super(ElementType.C, firstZone, firstSurface, secondZone, secondSurface);
    }
}
