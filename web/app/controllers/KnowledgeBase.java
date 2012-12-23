package controllers;

import play.db.jpa.NoTransaction;
import play.mvc.Controller;
import play.mvc.With;

@NoTransaction
@With(Secure.class)
public class KnowledgeBase extends Controller {

    public static void update() {
        services.KnowledgeBase.getInstance().scan();
    }
}
