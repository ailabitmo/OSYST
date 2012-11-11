package ru.ifmo.ailab.e3soos.facts;

import java.util.ArrayList;
import java.util.List;
import ru.ifmo.ailab.e3soos.facts.elements.BasicElement;
import ru.ifmo.ailab.e3soos.facts.elements.CorrectiveElement;
import ru.ifmo.ailab.e3soos.facts.elements.FastElement;
import ru.ifmo.ailab.e3soos.facts.elements.WideAngularElement;

public class Schema {

    /**
     * A wide angular element.
     */
    private WideAngularElement yElement;
    private List<CorrectiveElement> cyElements = new ArrayList<CorrectiveElement>();
    /**
     * A basic element.
     */
    private BasicElement bElement;
    private List<CorrectiveElement> cbElements = new ArrayList<CorrectiveElement>();
    /**
     * A fast element.
     */
    private FastElement tElement;
    private List<CorrectiveElement> ctElements = new ArrayList<CorrectiveElement>();

    public Schema() {
    }

    public Schema(final BasicElement b) {
        this.bElement = b;
    }

    public List<CorrectiveElement> getBasicCorrectiveElements() {
        return cbElements;
    }

    public void addBasicCorrectiveElement(CorrectiveElement element) {
        cbElements.add(element);
    }

    public void setBasicCorrectiveElements(List<CorrectiveElement> elements) {
        this.cbElements = elements;
    }

    public List<CorrectiveElement> getFastCorrectiveElements() {
        return ctElements;
    }

    public void addFastCorrectiveElement(CorrectiveElement element) {
        ctElements.add(element);
    }

    public void setFastCorrectiveElements(List<CorrectiveElement> elements) {
        this.ctElements = elements;
    }

    public List<CorrectiveElement> getWideAngularCorrectiveElements() {
        return cyElements;
    }

    public void addWideAngularCorrectiveElement(CorrectiveElement element) {
        cyElements.add(element);
    }

    public void setWideAngularCorrectiveElements(List<CorrectiveElement> elements) {
        this.cyElements = elements;
    }

    public WideAngularElement getWideAngularElement() {
        return yElement;
    }

    public void setWideAngularElement(final WideAngularElement y) {
        this.yElement = y;
    }

    public BasicElement getBasicElement() {
        return bElement;
    }

    public void setBasicElement(final BasicElement b) {
        this.bElement = b;
    }

    public FastElement getFastElement() {
        return tElement;
    }

    public void setFastElement(final FastElement t) {
        this.tElement = t;
    }

    @Override
    public String toString() {
        StringBuilder codeBuilder = new StringBuilder();
        //Wide-angular element
        if (yElement != null) {
            codeBuilder.append(yElement.toString());
            codeBuilder.append(" + ");
        }
        if (cyElements != null) {
            for (CorrectiveElement c : cyElements) {
                codeBuilder.append(c.toString());
                codeBuilder.append(" + ");
            }
        }
        //Basic element
        codeBuilder.append(bElement.toString());
        if (cbElements != null) {
            for (CorrectiveElement c : cbElements) {
                codeBuilder.append(" + ");
                codeBuilder.append(c.toString());
            }
        }
        //Fast element
        if (tElement != null) {
            codeBuilder.append(" + ");
            codeBuilder.append(tElement.toString());
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
            if (this.bElement != null && !this.bElement.equals(other.bElement)) {
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
            if (this.tElement != null && !this.tElement.equals(other.tElement)) {
                return false;
            }
            if (this.yElement != null && !this.yElement.equals(other.yElement)) {
                return false;
            }
            return true;
        }
        return false;
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 89 * hash + (this.yElement != null ? this.yElement.hashCode() : 0);
        hash = 89 * hash + (this.cyElements != null ? this.cyElements.hashCode() : 0);
        hash = 89 * hash + (this.bElement != null ? this.bElement.hashCode() : 0);
        hash = 89 * hash + (this.cbElements != null ? this.cbElements.hashCode() : 0);
        hash = 89 * hash + (this.tElement != null ? this.tElement.hashCode() : 0);
        hash = 89 * hash + (this.ctElements != null ? this.ctElements.hashCode() : 0);
        return hash;
    }
}
