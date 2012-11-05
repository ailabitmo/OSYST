package models;

import javax.persistence.Entity;
import play.db.jpa.Model;
import ru.ifmo.ailab.e3soos.facts.Schema;
import ru.ifmo.ailab.e3soos.facts.SchemaFactory;

@Entity
public class SchemaModel extends Model {

    public String code;

    public Schema toSchema() {
        return SchemaFactory.newSchema(code);
    }
}
