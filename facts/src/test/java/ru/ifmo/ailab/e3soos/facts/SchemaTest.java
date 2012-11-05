package ru.ifmo.ailab.e3soos.facts;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;

public class SchemaTest {

    @Test
    public void testEquals() {
        String code1 = "B1P3P";
        Schema schema1 = SchemaFactory.newSchema(code1);
        assertEquals(SchemaFactory.newSchema(code1), schema1);

        String code2 = "B1P3P + C3A3A";
        Schema schema2 = SchemaFactory.newSchema(code2);
        assertEquals(SchemaFactory.newSchema(code2), schema2);
    }
}
