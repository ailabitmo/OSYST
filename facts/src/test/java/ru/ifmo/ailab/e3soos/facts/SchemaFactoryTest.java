package ru.ifmo.ailab.e3soos.facts;

import static org.junit.Assert.*;
import org.junit.Test;

public class SchemaFactoryTest {

    @Test
    public void testNewSchema() {
        String code1 = "B1P3P";
        Schema schema1 = SchemaFactory.newSchema(code1);
        assertEquals(code1, schema1.toString());

        String code2 = "B1P1A + C1V2P + T2V2P";
        Schema schema2 = SchemaFactory.newSchema(code2);
        assertEquals(code2, schema2.toString());

        try {
            SchemaFactory.newSchema("C1V2P + T2V2P");
            assertTrue(false);
        } catch (IllegalArgumentException ex) {
        }
    }
}
