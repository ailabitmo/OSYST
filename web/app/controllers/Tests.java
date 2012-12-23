package controllers;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import java.util.List;
import models.SchemaModel;
import models.TestCase;
import play.data.binding.Binder;
import play.db.jpa.Model;
import play.db.jpa.NoTransaction;
import play.db.jpa.Transactional;
import play.mvc.Controller;
import play.mvc.With;
import services.KnowledgeBase;
import services.testing.TestRunner;

@With(Secure.class)
public class Tests extends Controller {

    private static Gson gson;

    static {
        GsonBuilder builder = new GsonBuilder();
        gson = builder.create();
    }

    @Transactional(readOnly = true)
    public static void index() {
        List<TestCase> testcases = TestCase.all().fetch();
        render(testcases);
    }

    public static void schemes() {
        render();
    }

    public static void get(long id) {
        TestCase testcase = TestCase.findById(id);
        renderJSON(gson.toJson(testcase));
    }

    public static void add(TestCase testcase) {
        for (SchemaModel s : testcase.schemas) {
            s.save();
        }
        testcase.classes.save();
        testcase.save();
        renderJSON(gson.toJson(testcase));
        ok();
    }

    public static void edit(TestCase testcase) {
        testcase.save();
        testcase.classes.save();
        storeData(testcase.schemas, "testcase.schemas");
        ok();
    }

    public static void delete(long[] testcase_ids) {
        for (long id : testcase_ids) {
            TestCase tc = TestCase.findById(id);
            tc.delete();
        }
        ok();
    }

    @Transactional(readOnly = true)
    public static void run(long id) {
        TestCase tc = TestCase.findById(id);
        if (tc != null) {
            TestRunner.TestStatus result = TestRunner.run(tc);
            renderJSON("{\"status\": \"" + result.toString() + "\"}");
        } else {
            badRequest();
        }
    }

    /**
     * The solution from
     * {@link http://stackoverflow.com/questions/7986970/error-detached-entity-passed-to-persist-try-to-persist-complex-data-play-fra}
     */
    private static <T extends Model> void storeData(List<T> list, String parameterName) {
        for (int i = 0; i < list.size(); i++) {
            T relation = list.get(i);

            if (relation == null) {
                continue;
            }

            if (relation.id != null) {
                relation = (T) Model.Manager.factoryFor(relation.getClass()).findById(relation.id);
                StringBuffer buf = new StringBuffer(parameterName);
                buf.append('[').append(i).append(']');
                Binder.bind(relation, buf.toString(), request.params.all());
            }

            // try to set bidiritional relation (you need an interface or smth)
            //relation.shop = shop;
            relation.save();
        }
    }
}
