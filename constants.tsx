
import { Assessment, Unit, MCQ, WebResource, LabActivity, LabScenario, CaseStudy } from './types';

export const SYLLABUS_DATA = {
  [Unit.UNIT_1]: "Emergence of Robotic Process Automation (RPA), Evolution of RPA, Differentiating RPA from Automation – Benefits of RPA – Application areas of RPA, Components of RPA, RPA Platforms. Robotic Process Automation Tools – Templates, User Interface, Domains in Activities, Workflow Files.",
  [Unit.UNIT_2]: "Sequence, Flowchart & Control Flow: Sequencing the Workflow, Activities, Flowchart, Control Flow for Decision making. Data Manipulation: Variables, Collection, Arguments, Data Table, Clipboard management, File operations Controls: Finding the control, waiting for a control, Act on a control, UiExplorer, Handling Events",
  [Unit.UNIT_3]: "App Integration, Recording, Scraping, Selector, Workflow Activities. Recording mouse and keyboard actions to perform operation, Scraping data from website and writing to CSV. Process Mining.",
  [Unit.UNIT_4]: "Exception handling, Common exceptions, Logging- Debugging techniques, Collecting crash dumps, Error reporting. Code management and maintenance: Project organization, Nesting workflows, Reusability, Templates, Commenting techniques, State Machine.",
  [Unit.UNIT_5]: "Publishing using publish utility, Orchestration Server, Control bots, Orchestration Server to deploy bots, License management, Publishing and managing updates. RPA Vendors – Open Source RPA, Future of RPA"
};

export const CASE_STUDIES_DATA: CaseStudy[] = [
  // UNIT 1: Introduction to RPA
  { id: "cs-1-1", unit: Unit.UNIT_1, title: "Banking KYC Automation", industry: "Banking", challenge: "Manual KYC checks took 20 days per client across 5 legacy systems.", solution: "RPA bots aggregate data from bureaus and internal mainframes automatically.", impact: "Processing time reduced by 85% with 100% audit compliance." },
  { id: "cs-1-2", unit: Unit.UNIT_1, title: "Healthcare Patient Intake", industry: "Healthcare", challenge: "Manual data entry from paper forms caused 30% error rate in records.", solution: "OCR integrated RPA bots read digital forms and populate EHR systems.", impact: "Error rate dropped to <1% and patient wait times fell by 50%." },
  { id: "cs-1-3", unit: Unit.UNIT_1, title: "Retail Inventory Sync", industry: "Retail", challenge: "POS and Warehouse systems were synced manually every 24 hours, leading to stock-outs.", solution: "Attended bots sync systems every 30 minutes based on transaction triggers.", impact: "15% increase in online sales availability." },
  { id: "cs-1-4", unit: Unit.UNIT_1, title: "HR Employee Onboarding", industry: "Human Resources", challenge: "Onboarding a single employee required 15 different manual system updates.", solution: "A single workflow triggers all 15 updates automatically upon contract sign-off.", impact: "Onboarding completed in 1 hour vs 3 days." },
  { id: "cs-1-5", unit: Unit.UNIT_1, title: "Insurance Claims Routing", industry: "Insurance", challenge: "Claims were manually sorted by 10 employees before being assigned.", solution: "Bot reads claim keywords and routes to the correct department based on logic rules.", impact: "Reduced overhead by 60% and sped up initial response by 24 hours." },

  // UNIT 2: Process Activities
  { id: "cs-2-1", unit: Unit.UNIT_2, title: "Currency Reconciliation", industry: "Finance", challenge: "Complex rounding and conversion logic led to frequent ledger imbalances.", solution: "Used Data Table manipulation activities to perform precise 4-decimal conversions.", impact: "Imbalances eliminated entirely; daily close time reduced by 4 hours." },
  { id: "cs-2-2", unit: Unit.UNIT_2, title: "IT Ticket Triage", industry: "IT Services", challenge: "L1 Support overwhelmed by 1000+ uncategorized emails daily.", solution: "Used String Manipulation and If-Decisions to auto-tag tickets.", impact: "90% of tickets auto-assigned correctly to L2/L3 teams." },
  { id: "cs-2-3", unit: Unit.UNIT_2, title: "Dynamic Supply Ordering", industry: "Logistics", challenge: "Varying portal load times caused bot failures in basic sequences.", solution: "Implemented Flowcharts with 'Wait for Element' controls via UiExplorer.", impact: "Bot reliability increased from 70% to 99.8%." },
  { id: "cs-2-4", unit: Unit.UNIT_2, title: "Legal Doc Metadata", industry: "Legal", challenge: "Thousands of scanned files lacked consistent naming for archiving.", solution: "Applied File Operations to rename and move documents based on content analysis.", impact: "Digital archive built in 1/10th the time of manual labor." },
  { id: "cs-2-5", unit: Unit.UNIT_2, title: "Payroll Audit Logic", industry: "Finance", challenge: "Manual auditing of 10,000 employees for payroll anomalies took 2 weeks.", solution: "Used Data Table Filtering and Joins to identify outliers instantly.", impact: "Identified $120k in overpayments in the first audit run." },

  // UNIT 3: Integration & Scraping
  { id: "cs-3-1", unit: Unit.UNIT_3, title: "Price Comparison Engine", industry: "E-commerce", challenge: "Couldn't track competitor prices in real-time.", solution: "Web scraping bots monitor 50 sites hourly and update pricing DB.", impact: "Sales increased by 12% due to competitive pricing agility." },
  { id: "cs-3-2", unit: Unit.UNIT_3, title: "Real Estate Listing Scraper", industry: "Real Estate", challenge: "Consolidating listings from 10 sites with different UI layouts.", solution: "Used Anchor-based Selectors to extract data despite layout variations.", impact: "Market data is now 100% accurate and updated daily." },
  { id: "cs-3-3", unit: Unit.UNIT_3, title: "Sentiment Analysis Bot", industry: "Marketing", challenge: "Brand team couldn't quantify customer mood on social media.", solution: "Scraped social feeds and passed data to Sentiment Analysis via Web Integration.", impact: "Real-time dashboard for brand health monitoring." },
  { id: "cs-3-4", unit: Unit.UNIT_3, title: "Invoice Pattern Recognition", industry: "Accounting", challenge: "Invoices came in 100+ different formats.", solution: "Used Pattern-based scraping to extract amounts and dates generically.", impact: "95% of invoices now processed without human intervention." },
  { id: "cs-3-5", unit: Unit.UNIT_3, title: "Weather Data for Logistics", industry: "Transportation", challenge: "Routes weren't adjusted for micro-climate weather changes.", solution: "Bot scrapes hourly local weather data to suggest route pivots.", impact: "Fuel costs reduced by 8% through avoided storm delays." },

  // UNIT 4: Exception & Management
  { id: "cs-4-1", unit: Unit.UNIT_4, title: "Self-Healing Order Bot", industry: "Retail", challenge: "Flaky CRM connections caused bot to fail 20% of orders.", solution: "Implemented Try-Catch with a Retry Scope for 'Network Busy' errors.", impact: "Order completion success reached 99.99%." },
  { id: "cs-4-2", unit: Unit.UNIT_4, title: "State Machine Payroll", industry: "Finance", challenge: "Complex 5-step payroll was too linear; failures required full restart.", solution: "Refactored into a State Machine to allow resume from point of failure.", impact: "Reduced manual intervention by 90% during system outages." },
  { id: "cs-4-3", unit: Unit.UNIT_4, title: "Compliance Log Reporting", industry: "Compliance", challenge: "Regulators needed proof of every bot decision.", solution: "Used Log Message activities to create detailed transaction-level audit trails.", impact: "Passed 100% of external audits without single non-conformity." },
  { id: "cs-4-4", unit: Unit.UNIT_4, title: "Modular CRM Connector", industry: "Sales", challenge: "CRM updates broke the 500-activity long monolithic bot.", solution: "Broke bot into reusable workflow templates (Init, Login, Sync, Close).", impact: "Maintenance time cut from 4 days to 2 hours per update." },
  { id: "cs-4-5", unit: Unit.UNIT_4, title: "Global Error Dashboard", industry: "Tech", challenge: "IT didn't know when bots failed until users complained.", solution: "Created a Global Exception Handler that logs screenshots to a central repo.", impact: "Average time-to-fix (MTTR) dropped by 75%." },

  // UNIT 5: Deployment
  { id: "cs-5-1", unit: Unit.UNIT_5, title: "Scaling to 2000 Robots", industry: "BPO", challenge: "Managing thousands of robot licenses was impossible via Excel.", solution: "Used Orchestrator to centrally manage licenses and deployment groups.", impact: "Global scaling achieved with 3 admins vs expected 20." },
  { id: "cs-5-2", unit: Unit.UNIT_5, title: "Cloud-First RPA Migration", industry: "Technology", challenge: "On-premise hardware costs for RPA were spiraling.", solution: "Migrated to Cloud Orchestrator for elastic scaling of bots.", impact: "Infrastructure costs dropped by 45%." },
  { id: "cs-5-3", unit: Unit.UNIT_5, title: "Secure Asset Management", industry: "Cybersecurity", challenge: "Storing bot passwords in config files was a security risk.", solution: "Used Orchestrator Assets with AES-256 encryption.", impact: "Passed Level 3 Security Audit with zero vulnerabilities." },
  { id: "cs-5-4", unit: Unit.UNIT_5, title: "Open Source RPA Trial", industry: "Non-Profit", challenge: "High licensing fees were a barrier for a small NGO.", solution: "Implemented Open Source RPA for back-office data entry.", impact: "Automated 5 processes at $0 license cost." },
  { id: "cs-5-5", unit: Unit.UNIT_5, title: "Zero-Downtime Updates", industry: "Logistics", challenge: "Updating bots required 4 hours of production downtime.", solution: "Used Orchestrator's blue-green deployment utility.", impact: "100% uptime maintained during software upgrades." }
];

export const LAB_ACTIVITIES: LabActivity[] = [
  { id: 'input_dialog', name: 'Input Dialog', icon: 'Keyboard', description: 'Prompts user for text input.', parameters: ['Label', 'Variable'] },
  { id: 'msg_box', name: 'Message Box', icon: 'Box', description: 'Displays a message to user.', parameters: ['Text', 'Buttons'] },
  { id: 'open_browser', name: 'Open Browser', icon: 'Globe', description: 'Opens a specific URL.', parameters: ['URL', 'Type'] },
  { id: 'read_range', name: 'Read Range', icon: 'FileSpreadsheet', description: 'Reads Excel into Data Table.', parameters: ['File', 'Sheet'] },
  { id: 'write_csv', name: 'Write CSV', icon: 'FileText', description: 'Saves DT to CSV.', parameters: ['DataTable', 'Path'] },
  { id: 'if_cond', name: 'Flow Decision', icon: 'GitBranch', description: 'Branches flowchart.', parameters: ['Condition'] },
  { id: 'state', name: 'State', icon: 'Layers', description: 'A state in a State Machine.', parameters: ['Transitions'] },
  { id: 'type_into', name: 'Type Into', icon: 'Keyboard', description: 'Types into UI element.', parameters: ['Selector', 'Text'] },
  { id: 'click', name: 'Click', icon: 'MousePointer2', description: 'Clicks a UI element.', parameters: ['Selector'] },
  { id: 'try_catch', name: 'Try Catch', icon: 'ShieldAlert', description: 'Handles errors.', parameters: ['Blocks'] },
  { id: 'sys_trigger', name: 'System Trigger', icon: 'Zap', description: 'Monitors file events.', parameters: ['Event', 'Path'] },
  { id: 'get_mail', name: 'Get Mail', icon: 'Mail', description: 'Retrieves inbox messages.', parameters: ['Account'] },
  { id: 'log_msg', name: 'Log Message', icon: 'Terminal', description: 'Outputs text.', parameters: ['Message'] },
  { id: 'get_asset', name: 'Get Asset', icon: 'Lock', description: 'Retrieves secure data.', parameters: ['AssetName'] }
];

export const LAB_SCENARIOS: LabScenario[] = [
  { id: 'lab_1', unit: Unit.UNIT_2, title: '1. User Input Sequence', objective: 'Input Dialog & Message Box.', task: 'Get name/age and greet user.', requiredActivities: ['input_dialog', 'msg_box'], successLogs: ['Input requested...', 'User entered "Alex"', 'Displaying message.'] },
  { id: 'lab_2', unit: Unit.UNIT_2, title: '2. Conditional Flowchart', objective: 'Browser Navigation.', task: 'Navigate based on membership.', requiredActivities: ['if_cond', 'open_browser'], successLogs: ['Decision: Premium', 'Navigating to portal.'] },
  { id: 'lab_3', unit: Unit.UNIT_4, title: '3. State Machine Game', objective: 'Logic Comparison.', task: 'Compare input with random #.', requiredActivities: ['state', 'input_dialog', 'if_cond'], successLogs: ['State: Init', 'State: Guess', 'Match found!'] },
  { id: 'lab_4', unit: Unit.UNIT_3, title: '4. UI Automation', objective: 'Desktop Interaction.', task: 'Automate Calculator.', requiredActivities: ['type_into', 'click'], successLogs: ['Calc open', 'Typing "5"', 'Clicking "+"', 'Result: 10'] },
  { id: 'lab_5', unit: Unit.UNIT_2, title: '5. Var & Args', objective: 'Modular Design.', task: 'Pass price into sub-workflow.', requiredActivities: ['log_msg'], successLogs: ['Arg In: 50', 'Calculated Tax', 'Arg Out: 59'] },
  { id: 'lab_6', unit: Unit.UNIT_5, title: '6. System Trigger', objective: 'File Monitoring.', task: 'Archive files on creation.', requiredActivities: ['sys_trigger', 'log_msg'], successLogs: ['Trigger: ON', 'File detected', 'Moved to archive.'] },
  { id: 'lab_7', unit: Unit.UNIT_3, title: '7. Email Login', objective: 'Secure Login.', task: 'Login to portal with Assets.', requiredActivities: ['open_browser', 'get_asset', 'type_into', 'click'], successLogs: ['Browser open', 'Credential read', 'Login successful.'] },
  { id: 'lab_8', unit: Unit.UNIT_3, title: '8. Recording Actions', objective: 'Mouse/KB Simulation.', task: 'Record notepad typing.', requiredActivities: ['click', 'type_into'], successLogs: ['Playback start', 'Typing letter', 'Saved to desktop.'] },
  { id: 'lab_9', unit: Unit.UNIT_3, title: '9. Scrape to CSV', objective: 'Structured Extraction.', task: 'Scrape web table to CSV.', requiredActivities: ['open_browser', 'write_csv'], successLogs: ['Extracting table', '10 rows found', 'CSV created.'] },
  { id: 'lab_10', unit: Unit.UNIT_4, title: '10. Error Handling', objective: 'Try-Catch Logic.', task: 'Screenshot on failure.', requiredActivities: ['try_catch', 'log_msg'], successLogs: ['Try: Fail', 'Catch: Start', 'Screenshot saved.'] },
  { id: 'lab_11', unit: Unit.UNIT_3, title: '11. Web Scraping', objective: 'Data Extraction.', task: 'Scrape multiple search pages.', requiredActivities: ['open_browser', 'click', 'write_csv'], successLogs: ['Page 1 ok', 'Page 2 ok', 'Master CSV saved.'] },
  { id: 'lab_12', unit: Unit.UNIT_5, title: '12. Email Processing', objective: 'Inbox Automation.', task: 'Extract query info from mail.', requiredActivities: ['get_mail', 'log_msg'], successLogs: ['Reading inbox', '3 queries found', 'Tickets logged.'] }
];

export const MCQ_DATA: Record<string, MCQ[]> = {
  [Unit.UNIT_1]: [
    { question: "Which is a core benefit of RPA?", options: ["Changing app source code", "Non-invasive integration", "Manual data entry", "Hardware assembly"], correctAnswer: 1, explanation: "RPA works on the UI layer without changing the underlying application code." },
    { question: "What does the Orchestrator do?", options: ["Writes code", "Manages and monitors bots", "Only stores files", "Sends emails only"], correctAnswer: 1, explanation: "Orchestrator is the central management platform for a robot workforce." },
    { question: "Differentiating RPA from automation, RPA...", options: ["Is invasive", "Interacts with UI layer", "Requires APIs always", "Is physical"], correctAnswer: 1, explanation: "RPA mimics human UI interactions." },
    { question: "Common RPA tool includes:", options: ["UiPath", "MS Paint", "Google Chrome", "Adobe Reader"], correctAnswer: 0, explanation: "UiPath is an industry-leading RPA platform." },
    { question: "What is 'Attended Automation'?", options: ["Bots on servers", "Bots on user desktop", "Physical robots", "Web scrapers only"], correctAnswer: 1, explanation: "Attended bots work alongside humans." }
  ],
  [Unit.UNIT_2]: [
    { question: "Which workflow is best for linear tasks?", options: ["Sequence", "Flowchart", "State Machine", "Trigger"], correctAnswer: 0, explanation: "Sequences are for simple, top-down linear steps." },
    { question: "Selectors use which format?", options: ["JSON", "XML", "HTML", "YAML"], correctAnswer: 1, explanation: "UiPath selectors are XML fragments." },
    { question: "Which activity allows decisions in Flowcharts?", options: ["If", "Flow Decision", "Assign", "Delay"], correctAnswer: 1, explanation: "Flow Decision is the flowchart version of 'If'." }
  ],
  [Unit.UNIT_3]: [
    { question: "Scraping structured data produces...", options: ["String", "DataTable", "Image", "Boolean"], correctAnswer: 1, explanation: "Pattern-based scraping outputs to a DataTable variable." },
    { question: "Which recorder is best for Web?", options: ["Basic", "Desktop", "Web", "Citrix"], correctAnswer: 2, explanation: "Web recorder is optimized for browser interactions." }
  ],
  [Unit.UNIT_4]: [
    { question: "Where is the cleanup code placed in Try-Catch?", options: ["Try", "Catch", "Finally", "Log"], correctAnswer: 2, explanation: "The 'Finally' block always executes, making it ideal for cleanup." },
    { question: "State Machines are best for...", options: ["Linear tasks", "Event-driven tasks", "Web scraping", "Simple math"], correctAnswer: 1, explanation: "State machines manage complex, non-linear logical states." }
  ],
  [Unit.UNIT_5]: [
    { question: "What is a 'Queue' used for?", options: ["Writing code", "Distributing work items", "Storage", "Licensing"], correctAnswer: 1, explanation: "Queues allow multiple bots to share a list of work items." },
    { question: "RPA bots are published as...", options: [" .exe", ".nupkg", ".zip", ".xaml"], correctAnswer: 1, explanation: "RPA projects are published as NuGet packages." }
  ]
};

export const ASSESSMENTS: Assessment[] = [
  { id: "rpa-architecture", unit: Unit.UNIT_1, title: "RPA Architecture Architect", description: "Design a legacy system sync strategy.", scenario: "Bank needs to sync 5 legacy COBOL screens with a modern CRM without APIs.", task: "Propose a bot architecture (Studio, Robot, Orchestrator) and explain why RPA is better than API integration here.", learningObjectives: ["RPA Components", "Benefits vs Traditional Automation"] },
  { id: "logic-wizard", unit: Unit.UNIT_2, title: "Logic Flow Wizard", description: "Complex decision tree implementation.", scenario: "Insurance process with 10 variables determining 'Risk Level'.", task: "Design the Flowchart vs Sequence logic and describe Data Table filtering steps.", learningObjectives: ["Control Flow", "Data Manipulation"] },
  { id: "scraping-pro", unit: Unit.UNIT_3, title: "Integration & Scraping Pro", description: "Dynamic web extraction strategy.", scenario: "Website with changing IDs for a 'Submit' button every refresh.", task: "Explain how to use Anchors and Wildcards in Selectors for robust scraping.", learningObjectives: ["Selectors", "Data Scraping"] },
  { id: "resilient-dev", unit: Unit.UNIT_4, title: "Resilient Developer", description: "Exception handling for scale.", scenario: "Payroll bot crashing on 5% of records due to formatting errors.", task: "Implement a Try-Catch strategy with Business Rule Exceptions vs System Exceptions.", learningObjectives: ["Error Handling", "Logging"] },
  { id: "deployment-lead", unit: Unit.UNIT_5, title: "Deployment Commander", description: "Large scale Orchestrator planning.", scenario: "Deploying 100 bots across 3 time zones with secure credentials.", task: "Plan the Asset and Queue hierarchy in Orchestrator for this deployment.", learningObjectives: ["Orchestrator", "Asset Management"] }
];

export const WEB_RESOURCES: WebResource[] = [
  { title: "UiPath Starter Guide", description: "Official learning path for Unit I basics.", url: "https://academy.uipath.com", unit: Unit.UNIT_1, category: "Documentation" },
  { title: "Control Flow Logic", description: "Deep dive into Sequences and Flowcharts.", url: "https://docs.uipath.com", unit: Unit.UNIT_2, category: "Documentation" },
  { title: "Selector Mastery", description: "Best practices for dynamic UI selectors.", url: "https://docs.uipath.com", unit: Unit.UNIT_3, category: "Article" },
  { title: "REFramework Documentation", description: "The standard for Unit IV State Machines.", url: "https://docs.uipath.com", unit: Unit.UNIT_4, category: "Documentation" },
  { title: "Orchestrator Guide", description: "Comprehensive Unit V management manual.", url: "https://docs.uipath.com", unit: Unit.UNIT_5, category: "Documentation" }
];
