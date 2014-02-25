package logs;

import java.lang.String;

public class TriggeredEventData implements IWorkflowData {
    private String type;
    private String name;
    private String memoryAction;
    private String calledRule = "";

    public TriggeredEventData(String type, String name, String memoryAction) {
        this.type = type;
        this.name = name;
        this.memoryAction = memoryAction;
    }

    public String getName() {
        return name;
    }

    @Override
    public String getType() {
        return type;
    }

    public String getMemoryAction() {
        return memoryAction;
    }
}
