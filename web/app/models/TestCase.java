package models;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.OneToMany;
import play.db.jpa.Model;

@Entity(name="TestCase")
public class TestCase extends Model {

    public String name;
    public ClassificationModel classes;
    @OneToMany
    @JoinTable(
            name="TestCase_Schema",
            joinColumns=@JoinColumn(name="testcase_id", referencedColumnName="id"),
            inverseJoinColumns=@JoinColumn(name="schema_id", referencedColumnName="id"))
    public List<SchemaModel> schemas = new ArrayList<SchemaModel>();

}
