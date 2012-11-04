package controllers;

import java.util.List;
import models.SchemaModel;
import models.TestCase;
import play.mvc.Controller;
import play.mvc.With;

@With(Secure.class)
public class Tests extends Controller {

    public static void index() {
        List<TestCase> testcases = TestCase.all().fetch();
        render(testcases);
    }

    public static void add(TestCase testcase) {
        for(SchemaModel s : testcase.schemas) {
            s.save();
        }
        testcase.save();
        ok();
    }
}
