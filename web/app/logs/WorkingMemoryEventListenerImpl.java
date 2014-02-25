package logs;

import org.drools.event.rule.ObjectInsertedEvent;
import org.drools.event.rule.ObjectRetractedEvent;
import org.drools.event.rule.ObjectUpdatedEvent;
import org.drools.event.rule.WorkingMemoryEventListener;

import java.util.ArrayList;

/**
 * Created by m.lapaev on 25.02.14.
 */
public class WorkingMemoryEventListenerImpl
        implements WorkingMemoryEventListener {
    private ArrayList<IWorkflowData> workflowData;

    public WorkingMemoryEventListenerImpl(ArrayList<IWorkflowData> workflowData) {
        this.workflowData = workflowData;
    }

    @Override
    public void objectInserted(ObjectInsertedEvent event) {
        TriggeredEventData eventData = new TriggeredEventData("objectInserted", event.getObject().toString(), "add");
        workflowData.add(eventData);
    }

    @Override
    public void objectUpdated(ObjectUpdatedEvent event) {

        TriggeredEventData eventData = new TriggeredEventData("objectInserted", event.getObject().toString(), "change");
        workflowData.add(eventData);
    }

    @Override
    public void objectRetracted(ObjectRetractedEvent event) {
        TriggeredEventData eventData = new TriggeredEventData("objectInserted", event.getOldObject().toString(), "remove");
        workflowData.add(eventData);
    }
}