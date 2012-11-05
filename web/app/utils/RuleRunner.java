package utils;

import java.util.ArrayList;
import java.util.List;
import logs.AgendaLogger;
import org.drools.command.CommandFactory;
import org.drools.runtime.ExecutionResults;
import org.drools.runtime.StatelessKnowledgeSession;
import org.drools.runtime.rule.QueryResultsRow;
import org.drools.runtime.rule.impl.NativeQueryResults;
import ru.ifmo.ailab.e3soos.facts.Classification;
import ru.ifmo.ailab.e3soos.facts.Requirements;
import ru.ifmo.ailab.e3soos.facts.Schema;
import services.KnowledgeBase;

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
        session.addEventListener(alogger);

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
        Result result = new Result();
        result.setLogs(alogger.getFirings());
        result.setData("schemes", schemas);
        return result;
    }
}
