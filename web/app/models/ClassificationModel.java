package models;

import javax.persistence.Entity;
import play.db.jpa.Model;
import ru.ifmo.ailab.e3soos.facts.Classification;

@Entity
public class ClassificationModel extends Model {

    public int j;
    public int w;
    public int f;
    public int l;
    public int q;
    public int s;
    public int d;

    public Classification toClassification() {
        Classification c = new Classification();
        c.setJ(j);
        c.setW(w);
        c.setF(f);
        c.setL(l);
        c.setQ(q);
        c.setS(s);
        c.setD(d);
        return c;
    }

}
