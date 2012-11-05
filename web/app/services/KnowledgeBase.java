package services;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import org.drools.KnowledgeBaseFactory;
import org.drools.agent.KnowledgeAgent;
import org.drools.agent.KnowledgeAgentConfiguration;
import org.drools.agent.KnowledgeAgentFactory;
import org.drools.builder.KnowledgeBuilderConfiguration;
import org.drools.builder.KnowledgeBuilderFactory;
import org.drools.event.knowledgeagent.AfterResourceProcessedEvent;
import org.drools.event.rule.DefaultKnowledgeAgentEventListener;
import org.drools.io.ResourceChangeScannerConfiguration;
import org.drools.io.ResourceFactory;
import org.drools.io.impl.UrlResource;
import org.drools.runtime.StatelessKnowledgeSession;
import play.Logger;

public class KnowledgeBase {

    private static KnowledgeBase instance;
    private KnowledgeAgent knowledgeAgent;
    private Map<String, Date> packagesVersions = new HashMap();

    private KnowledgeBase() {
    }

    public static synchronized KnowledgeBase getInstance() {
        if (instance == null) {
            instance = new KnowledgeBase();
            instance.init();
        }
        return instance;
    }

    private void init() {
        //Create a knowledge agent configuration
        KnowledgeAgentConfiguration kaConf = KnowledgeAgentFactory.newKnowledgeAgentConfiguration();
        kaConf.setProperty("drools.agent.scanDirectories", "false");

        //Create the resource change scanner configuration
        ResourceChangeScannerConfiguration rsConf =
                ResourceFactory.getResourceChangeScannerService().newResourceChangeScannerConfiguration();
        rsConf.setProperty("drools.resource.scanner.interval", "300");

        KnowledgeBuilderConfiguration kbConf = KnowledgeBuilderFactory.newKnowledgeBuilderConfiguration();
        kbConf.setProperty("drools.dialect.mvel.strict", "false");

        //Create a knowledge agent
        knowledgeAgent = KnowledgeAgentFactory.newKnowledgeAgent("all", KnowledgeBaseFactory.newKnowledgeBase(),
                kaConf, kbConf);
        knowledgeAgent.addEventListener(new KAEventListener());
        knowledgeAgent.applyChangeSet(
                ResourceFactory.newClassPathResource("e3soos.classification.xml", KnowledgeBase.class));
        knowledgeAgent.applyChangeSet(
                ResourceFactory.newClassPathResource("e3soos.basic.xml", KnowledgeBase.class));
        knowledgeAgent.applyChangeSet(
                ResourceFactory.newClassPathResource("e3soos.fast.xml", KnowledgeBase.class));
        knowledgeAgent.applyChangeSet(
                ResourceFactory.newClassPathResource("e3soos.generation.xml", KnowledgeBase.class));
        knowledgeAgent.applyChangeSet(
                ResourceFactory.newClassPathResource("e3soos.wideangular.xml", KnowledgeBase.class));
        knowledgeAgent.applyChangeSet(
                ResourceFactory.newClassPathResource("e3soos.corrective.xml", KnowledgeBase.class));

        //Set the resource change scanner configuration
        ResourceFactory.getResourceChangeScannerService().configure(rsConf);
        //Start the resource change scanner
        ResourceFactory.getResourceChangeNotifierService().start();
        ResourceFactory.getResourceChangeScannerService().start();
    }

    /**
     * Creates a {@link StatelessKnowledgeSession} from the latest version of
     * the knowledge base.
     * <p/>
     * @return
     */
    public StatelessKnowledgeSession createStatelessKnowledgeSession() {
        return knowledgeAgent.newStatelessKnowledgeSession();
    }

    public Map<String, Date> getPackagesVersions() {
        return packagesVersions;
    }

    public static synchronized void dispose() {
        if (instance.knowledgeAgent != null) {
            instance.knowledgeAgent.dispose();
        }
        ResourceFactory.getResourceChangeNotifierService().stop();
        ResourceFactory.getResourceChangeScannerService().stop();
        instance = null;
    }

    private class KAEventListener extends DefaultKnowledgeAgentEventListener {

        @Override
        public void afterResourceProcessed(AfterResourceProcessedEvent event) {
            UrlResource pkg = (UrlResource) event.getResource();
            try {
                packagesVersions.put(pkg.getURL().getPath().split("/")[4],
                        new Date(pkg.getLastModified()));
            } catch (IOException ex) {
                Logger.fatal(ex, ex.getLocalizedMessage());
            }
        }
    }
}
