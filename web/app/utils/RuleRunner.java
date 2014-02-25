package utils;

import com.google.gson.Gson;
import logs.*;
import org.drools.command.CommandFactory;
import org.drools.definition.rule.Rule;
import org.drools.event.rule.*;
import org.drools.runtime.ExecutionResults;
import org.drools.runtime.StatelessKnowledgeSession;
import org.drools.runtime.rule.Activation;
import org.drools.runtime.rule.QueryResultsRow;
import org.drools.runtime.rule.impl.NativeQueryResults;
import ru.ifmo.ailab.e3soos.facts.Classification;
import ru.ifmo.ailab.e3soos.facts.Requirements;
import ru.ifmo.ailab.e3soos.facts.Schema;
import services.KnowledgeBase;

import java.util.ArrayList;
import java.util.List;

public abstract class RuleRunner {

    public static Classification classify(final Requirements reqs) {
        Classification c = new Classification();
        StatelessKnowledgeSession session = KnowledgeBase.getInstance().createStatelessKnowledgeSession();
        List<Object> facts = new ArrayList<Object>();
        facts.add(reqs);
        facts.add(c);
        session.execute(CommandFactory.newInsertElements(facts));
        return c;
    }

    public static List<Schema> synthesis(final Classification classification) {
        StatelessKnowledgeSession session = KnowledgeBase.getInstance().createStatelessKnowledgeSession();
        List cmds = new ArrayList();
        cmds.add(CommandFactory.newInsert(classification));
        cmds.add(CommandFactory.newFireAllRules());
        cmds.add(CommandFactory.newQuery("getSchemas", "get the all schemas"));

        ExecutionResults results = (ExecutionResults) session.execute(
                CommandFactory.newBatchExecution(cmds));

        NativeQueryResults schemasResults = (NativeQueryResults) results.getValue("getSchemas");
        List<Schema> schemas = new ArrayList<Schema>();
        for (QueryResultsRow row : schemasResults) {
            schemas.add((Schema) row.get("schema"));
        }
        return schemas;
    }

    public static Result synthesisWithLogs(final Classification classification) {
        StatelessKnowledgeSession session = KnowledgeBase.getInstance().createStatelessKnowledgeSession();
        AgendaLogger alogger = new AgendaLogger();
        WorkingMemoryLogger mlogger = new WorkingMemoryLogger();
        session.addEventListener(alogger);
        session.addEventListener(mlogger);
        ArrayList<IWorkflowData> workflowData = new ArrayList<IWorkflowData>();
//
        WorkingMemoryEventListenerImpl workingMemoryEventListener = new WorkingMemoryEventListenerImpl(workflowData);
        AgendaEventListenerImpl agendaEventListener = new AgendaEventListenerImpl(workflowData);
        session.addEventListener(workingMemoryEventListener);
        session.addEventListener(agendaEventListener);

        List cmds = new ArrayList();
        cmds.add(CommandFactory.newInsert(classification));
        cmds.add(CommandFactory.newFireAllRules());
        cmds.add(CommandFactory.newQuery("getSchemas", "get the all schemas"));

        ExecutionResults results = (ExecutionResults) session.execute(
                CommandFactory.newBatchExecution(cmds));

        NativeQueryResults schemasResults = (NativeQueryResults) results.getValue("getSchemas");
        ArrayList<String> schemas = new ArrayList<String>();
        for (QueryResultsRow row : schemasResults) {
            schemas.add(((Schema) row.get("schema")).toString());
        }

        Gson gson = new Gson();
        String rulesJson = gson.toJson(workflowData);
        Result result = new Result();
        result.setActions(mlogger.getActions());
        result.setLogs(alogger.getFirings());
        result.setData("schemes", schemas);
        result.setWorkflow(rulesJson);
        return result;
    }
}

