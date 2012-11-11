package models;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import play.db.jpa.Model;

@Entity(name = "TestCase")
public class TestCase extends Model {

    public String name;

    @OneToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "classes_id")
    public ClassificationModel classes;

    @OneToMany(cascade= CascadeType.REMOVE)
    @JoinTable(
            name = "TestCase_Schema",
    joinColumns =
    @JoinColumn(name = "testcase_id", referencedColumnName = "id"),
    inverseJoinColumns =
    @JoinColumn(name = "schema_id", referencedColumnName = "id", unique=true))
    public List<SchemaModel> schemas = new ArrayList<SchemaModel>();
}
