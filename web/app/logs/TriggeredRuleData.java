package logs;

/**
 * Describes triggered rule after some event. Another properties of raised rule would be added later, TODO
 */
public class TriggeredRuleData implements IWorkflowData {
    private String name;
    private final String type = "ruleTriggered";
    private String memoryAction = "add";
    private String calledRule = "";

    public TriggeredRuleData(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    @Override
    public String getType() {
        return type;
    }
}
