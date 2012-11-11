package ru.ifmo.ailab.e3soos.facts;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import ru.ifmo.ailab.e3soos.facts.elements.BasicElement;
import ru.ifmo.ailab.e3soos.facts.elements.CorrectiveElement;
import ru.ifmo.ailab.e3soos.facts.elements.Element;
import ru.ifmo.ailab.e3soos.facts.elements.ElementFactory;
import ru.ifmo.ailab.e3soos.facts.elements.ElementType;
import ru.ifmo.ailab.e3soos.facts.elements.FastElement;
import ru.ifmo.ailab.e3soos.facts.elements.WideAngularElement;

public abstract class SchemaFactory {

    private static final Pattern FORMAT = Pattern.compile(
            "^([YyBb]{1}\\d\\w\\d){1}[(\\w\\d\\w\\d)\\s\\+]*$");

    public static Schema newSchema(final String pattern) {
        Matcher matcher = FORMAT.matcher(pattern);
        if (matcher.matches()) {
            Schema schema = new Schema();

            String[] codes = pattern.split("[\\s+]+");
            Element previous = null;
            for (String code : codes) {
                Element element = ElementFactory.newElement(code);
                switch (element.getElementType()) {
                    case B:
                        schema.setBasicElement((BasicElement) element);
                        break;
                    case Y:
                        schema.setWideAngularElement((WideAngularElement) element);
                        break;
                    case T:
                        schema.setFastElement((FastElement) element);
                        break;
                    case C:
                        CorrectiveElement ce = (CorrectiveElement) element;
                        switch (previous.getElementType()) {
                            case B:
                                schema.addBasicCorrectiveElement(ce);
                                break;
                            case Y:
                                schema.addWideAngularCorrectiveElement(ce);
                                break;
                            case T:
                                schema.addFastCorrectiveElement(ce);
                                break;
                        }
                }
                if (element.getElementType() != ElementType.C) {
                    previous = element;
                }
            }
            return schema;
        } else {
            throw new IllegalArgumentException();
        }
    }
}
