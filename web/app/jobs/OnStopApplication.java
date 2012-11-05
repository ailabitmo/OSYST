package jobs;

import play.jobs.Job;
import play.jobs.OnApplicationStop;
import services.KnowledgeBase;
import utils.RuleRunner;

@OnApplicationStop
public class OnStopApplication extends Job {

    @Override
    public void doJob() throws Exception {
        KnowledgeBase.dispose();
    }

}
