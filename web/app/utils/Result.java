package utils;

import java.util.HashMap;
import java.util.Map;

import logs.Action;
import logs.Firing;

/**
 * @author Maxim Kolchin
 */
public class Result {

    private Map<String, Object> data = new HashMap<String, Object>();
    private Map<String, Firing> logs;
    private Map<String, Action> actions;
    private String workflow;

    public Result() {
    }

    public void setLogs(final Map<String, Firing> logs) {
        this.logs = logs;
    }

    public void setData(final String key, Object data) {
        this.data.put(key, data);
    }

    public void setActions(final Map<String, Action> actions) {
        this.actions = actions;
    }

    public void setWorkflow(String workflow) {
        this.workflow = workflow;
    }
}
