package logs;

import org.drools.definition.rule.Rule;
import org.drools.event.rule.BeforeActivationFiredEvent;
import org.drools.event.rule.DefaultAgendaEventListener;
import org.drools.runtime.rule.Activation;

import java.util.ArrayList;

/**
 * Created by m.lapaev on 25.02.14.
 */

public class AgendaEventListenerImpl extends DefaultAgendaEventListener {
    private ArrayList<IWorkflowData> workflowData;

    public AgendaEventListenerImpl(ArrayList<IWorkflowData> workflowData) {
        this.workflowData = workflowData;
    }

    @Override
    public void beforeActivationFired(BeforeActivationFiredEvent event) {
        Activation activation = event.getActivation();
        Rule rule = activation.getRule();
        TriggeredRuleData ruleData = new TriggeredRuleData(rule.getName());
        workflowData.add(ruleData);
    }

}