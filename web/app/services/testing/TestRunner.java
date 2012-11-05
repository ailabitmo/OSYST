package services.testing;

import java.util.List;
import models.SchemaModel;
import models.TestCase;
import ru.ifmo.ailab.e3soos.facts.Schema;
import utils.RuleRunner;

public abstract class TestRunner {

    public enum TestStatus {

        PASSED, FAILED
    };

    public static TestStatus run(final TestCase testcase) {
        List<Schema> results = RuleRunner.synthesis(testcase.classes.toClassification());
        System.out.println("Results:");
        for (Schema s : results) {
            System.out.println(s.toString());
        }
        System.out.println("Expected:");
        for (SchemaModel s : testcase.schemas) {
            System.out.println(s.toSchema().toString());
        }
        for (SchemaModel model : testcase.schemas) {
            if (!results.contains(model.toSchema())) {
                return TestStatus.FAILED;
            }
        }
        return TestStatus.PASSED;
    }
}
