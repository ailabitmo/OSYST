package ru.ifmo.ailab.e3soos.facts;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public abstract class SchemaFactory {

    private static final Pattern FORMAT = Pattern.compile(
            "^([YyBb]{1}\\d\\w\\d){1}[(\\w\\d\\w\\d)\\s\\+]*$");

    public static Schema newSchema(final String pattern) {
        Matcher matcher = FORMAT.matcher(pattern);
        if (matcher.matches()) {
            Schema schema = new Schema();

            String[] codes = pattern.split("[\\s+]+");
            Element previous = null;
            for(String code:codes) {
                Element element = ElementFactory.newElement(code);
                switch(element.getElementType()) {
                    case B:
                        schema.setBElement(element);
                        break;
                    case Y:
                        schema.setYElement(element);
                        break;
                    case T:
                        schema.setTElement(element);
                        break;
                    case C:
                        switch(previous.getElementType()) {
                            case B:
                                schema.setCbElement(element);
                                break;
                            case Y:
                                schema.setCyElement(element);
                                break;
                            case T:
                                schema.setCtElement(element);
                                break;
                        }
                }
                previous = element;
            }
            return schema;
        } else {
            throw new IllegalArgumentException();
        }
    }
}
