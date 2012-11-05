package controllers;

import java.util.List;
import models.SchemaModel;
import models.TestCase;
import play.db.jpa.NoTransaction;
import play.db.jpa.Transactional;
import play.mvc.Controller;
import play.mvc.With;
import services.testing.TestRunner;

@With(Secure.class)
public class Tests extends Controller {

    @Transactional(readOnly=true)
    public static void index() {
        List<TestCase> testcases = TestCase.all().fetch();
        render(testcases);
    }

    public static void add(TestCase testcase) {
        for(SchemaModel s : testcase.schemas) {
            s.save();
        }
        testcase.save();
        renderJSON("{\"testcase_id\": " + testcase.id + "}");
        ok();
    }

    public static void delete(long[] testcase_ids) {
        for (long id : testcase_ids) {
            TestCase tc = TestCase.findById(id);
            tc.delete();
        }
        ok();
    }

    public static void run(long id) {
        TestCase tc = TestCase.findById(id);
        if(tc != null) {
            TestRunner.TestStatus result = TestRunner.run(tc);
            renderJSON("{\"status\": \"" + result.toString() + "\"}");
        } else {
            badRequest();
        }
    }
}
