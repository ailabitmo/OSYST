package jobs;

import models.User;
import play.jobs.Job;
import play.jobs.OnApplicationStart;
import play.test.Fixtures;
import utils.RuleRunner;

@OnApplicationStart
public class OnStartApplication extends Job {

    @Override
    public void doJob() {
        //Check if a database is empty
        if(User.count() == 0) {
            Fixtures.loadModels("initial-data.yml");
        }
    }
}
