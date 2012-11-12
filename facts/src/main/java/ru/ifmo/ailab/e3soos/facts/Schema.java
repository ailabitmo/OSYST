package ru.ifmo.ailab.e3soos.facts;

import java.util.ArrayList;
import java.util.List;
import ru.ifmo.ailab.e3soos.facts.elements.BasicElement;
import ru.ifmo.ailab.e3soos.facts.elements.CorrectiveElement;
import ru.ifmo.ailab.e3soos.facts.elements.Element;
import ru.ifmo.ailab.e3soos.facts.elements.ElementType;
import ru.ifmo.ailab.e3soos.facts.elements.FastElement;
import ru.ifmo.ailab.e3soos.facts.elements.WideAngularElement;

public class Schema {

    /**
     * A wide angular element.
     */
    private WideAngularElement wideAngularElement;
    private List<CorrectiveElement> cyElements = new ArrayList<CorrectiveElement>();
    /**
     * A basic element.
     */
    private BasicElement basicElement;
    private List<CorrectiveElement> cbElements = new ArrayList<CorrectiveElement>();
    /**
     * A fast element.
     */
    private FastElement fastElement;
    private List<CorrectiveElement> ctElements = new ArrayList<CorrectiveElement>();

    public Schema() {
    }

    public Schema(final Element basic) {
        if(basic.getElementType() != ElementType.B) {
            throw new IllegalArgumentException();
        }
        this.basicElement = (BasicElement) basic;
    }

    public Schema(final BasicElement b) {
        this.basicElement = b;
    }

    public List<CorrectiveElement> getBasicCorrectiveElements() {
        return cbElements;
    }

    public void addBasicCorrectiveElement(Element element) {
        if(element.getElementType() != ElementType.C) {
            throw new IllegalArgumentException();
        }
        cbElements.add((CorrectiveElement)element);
    }

    public void setBasicCorrectiveElements(List<CorrectiveElement> elements) {
        this.cbElements = elements;
    }

    public List<CorrectiveElement> getFastCorrectiveElements() {
        return ctElements;
    }

    public void addFastCorrectiveElement(Element element) {
        if(element.getElementType() != ElementType.C) {
            throw new IllegalArgumentException();
        }
        ctElements.add((CorrectiveElement)element);
    }

    public void setFastCorrectiveElements(List<CorrectiveElement> elements) {
        this.ctElements = elements;
    }

    public List<CorrectiveElement> getWideAngularCorrectiveElements() {
        return cyElements;
    }

    public void addWideAngularCorrectiveElement(Element element) {
        if(element.getElementType() != ElementType.C) {
            throw new IllegalArgumentException();
        }
        cyElements.add((CorrectiveElement)element);
    }

    public void setWideAngularCorrectiveElements(List<CorrectiveElement> elements) {
        this.cyElements = elements;
    }

    public WideAngularElement getWideAngularElement() {
        return wideAngularElement;
    }

    public void setWideAngularElement(final WideAngularElement y) {
        this.wideAngularElement = y;
    }

    public void setWideAngularElement(final Element y) {
        if(y.getElementType() != ElementType.Y) {
            throw new IllegalArgumentException();
        }
        this.wideAngularElement = (WideAngularElement) y;
    }

    public BasicElement getBasicElement() {
        return basicElement;
    }

    public void setBasicElement(final BasicElement b) {
        this.basicElement = b;
    }

    public void setBasicElement(final Element b) {
        if(b.getElementType() != ElementType.B) {
            throw new IllegalArgumentException();
        }
        this.basicElement = (BasicElement) b;
    }

    public FastElement getFastElement() {
        return fastElement;
    }

    public void setFastElement(final Element b) {
        if(b.getElementType() != ElementType.T) {
            throw new IllegalArgumentException();
        }
        this.fastElement = (FastElement) b;
    }

    public void setFastElement(final FastElement t) {
        this.fastElement = t;
    }

    @Override
    public String toString() {
        StringBuilder codeBuilder = new StringBuilder();
        //Wide-angular element
        if (wideAngularElement != null) {
            codeBuilder.append(wideAngularElement.toString());
            codeBuilder.append(" + ");
        }
        if (cyElements != null) {
            for (CorrectiveElement c : cyElements) {
                codeBuilder.append(c.toString());
                codeBuilder.append(" + ");
            }
        }
        //Basic element
        codeBuilder.append(basicElement.toString());
        if (cbElements != null) {
            for (CorrectiveElement c : cbElements) {
                codeBuilder.append(" + ");
                codeBuilder.append(c.toString());
            }
        }
        //Fast element
        if (fastElement != null) {
            codeBuilder.append(" + ");
            codeBuilder.append(fastElement.toString());
        }
        if (ctElements != null) {
            for (CorrectiveElement c : ctElements) {
                codeBuilder.append(" + ");
                codeBuilder.append(c.toString());
            }
        }

        return codeBuilder.toString();
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (obj instanceof Schema) {
            Schema other = (Schema) obj;
            if (this.basicElement != null && !this.basicElement.equals(other.basicElement)) {
                return false;
            }
            if (this.cbElements != null && !this.cbElements.equals(other.cbElements)) {
                return false;
            }
            if (this.ctElements != null && !this.ctElements.equals(other.ctElements)) {
                return false;
            }
            if (this.cyElements != null && !this.cyElements.equals(other.cyElements)) {
                return false;
            }
            if (this.fastElement != null && !this.fastElement.equals(other.fastElement)) {
                return false;
            }
            if (this.wideAngularElement != null && !this.wideAngularElement.equals(other.wideAngularElement)) {
                return false;
            }
            return true;
        }
        return false;
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 89 * hash + (this.wideAngularElement != null ? this.wideAngularElement.hashCode() : 0);
        hash = 89 * hash + (this.cyElements != null ? this.cyElements.hashCode() : 0);
        hash = 89 * hash + (this.basicElement != null ? this.basicElement.hashCode() : 0);
        hash = 89 * hash + (this.cbElements != null ? this.cbElements.hashCode() : 0);
        hash = 89 * hash + (this.fastElement != null ? this.fastElement.hashCode() : 0);
        hash = 89 * hash + (this.ctElements != null ? this.ctElements.hashCode() : 0);
        return hash;
    }
}
