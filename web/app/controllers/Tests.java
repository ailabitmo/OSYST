package controllers;

import java.util.List;
import models.TestCase;
import play.mvc.Controller;
import play.mvc.With;

@With(Secure.class)
public class Tests extends Controller {

    public static void index() {
        List<TestCase> testcases = TestCase.all().fetch();
        render(testcases);
    }
}
