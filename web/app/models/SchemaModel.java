package models;

import javax.persistence.Entity;
import net.sf.oval.constraint.NotBlank;
import net.sf.oval.constraint.NotNull;
import play.db.jpa.Model;

@Entity
public class SchemaModel extends Model {

    public String code;
}
