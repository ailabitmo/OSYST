package ru.ifmo.ailab.e3soos.facts;

import ru.ifmo.ailab.e3soos.facts.elements.SurfaceType;
import static org.junit.Assert.assertEquals;
import org.junit.Test;
import ru.ifmo.ailab.e3soos.facts.elements.BasicElement;
import ru.ifmo.ailab.e3soos.facts.elements.CorrectiveElement;
import ru.ifmo.ailab.e3soos.facts.elements.ElementFactory;

/**
 *
 */
public class ElementFactoryTest {

    public ElementFactoryTest() {
    }

    @Test
    public void testNewElement() {
        assertEquals(new BasicElement(1, SurfaceType.P, 3, SurfaceType.P),
                ElementFactory.newElement("B1P3P"));
        assertEquals(new CorrectiveElement(2, SurfaceType.A, 3, SurfaceType.I),
                ElementFactory.newElement("C2A3I"));
    }
}
