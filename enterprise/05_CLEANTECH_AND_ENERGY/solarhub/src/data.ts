export type OpsCategory = {
  id: string;
  title: string;
  fullName: string;
  focus: string;
  uses: string[];
  workflow: string[];
  goal: string;
  tools: string[];
  concepts?: string[];
  colorTheme: string;
  iconName: string;
};

export const categories: OpsCategory[] = [
  {
    id: "aiops",
    title: "AIOps",
    fullName: "Artificial Intelligence for IT Operations",
    focus: "Automating and improving IT operations using AI",
    uses: [
      "Cloud infrastructure",
      "DevOps",
      "Monitoring systems",
      "Cybersecurity",
      "Incident management"
    ],
    workflow: [
      "Collect logs & metrics",
      "Preprocess and normalize data",
      "Build anomaly detection models",
      "Root cause analysis",
      "Automated remediation",
      "Continuous optimization"
    ],
    goal: "Reduce downtime and automate infrastructure management.",
    tools: ["Datadog", "Splunk", "Dynatrace", "New Relic"],
    colorTheme: "blue",
    iconName: "server"
  },
  {
    id: "llmops",
    title: "LLMOps",
    fullName: "Large Language Model Operations",
    focus: "Managing, deploying, monitoring, and improving LLM applications",
    uses: [
      "Chatbots",
      "AI agents",
      "RAG systems",
      "AI copilots",
      "Multimodal assistants"
    ],
    workflow: [
      "Select LLM",
      "Prepare prompts & context",
      "Fine-tuning / RAG",
      "Tool integrations",
      "Bias & safety checks",
      "Deployment",
      "Drift & response quality monitoring",
      "Iteration & evaluation"
    ],
    goal: "Operate reliable GenAI systems at scale.",
    tools: ["OpenAI", "LangChain", "LlamaIndex", "Weights & Biases", "Humanloop"],
    concepts: [
      "Prompt Engineering",
      "RAG (Retrieval-Augmented Generation)",
      "AI Guardrails",
      "Hallucination detection",
      "Token optimization",
      "Evaluation pipelines"
    ],
    colorTheme: "fuchsia",
    iconName: "bot"
  },
  {
    id: "mlops",
    title: "MLOps",
    fullName: "Machine Learning Operations",
    focus: "Operationalizing traditional machine learning systems",
    uses: [
      "Recommendation engines",
      "Fraud detection",
      "Forecasting",
      "Computer vision",
      "Predictive analytics"
    ],
    workflow: [
      "Gather structured/unstructured data",
      "Data cleaning",
      "Feature engineering",
      "Model training",
      "Hyperparameter tuning",
      "Validation",
      "Deployment",
      "Monitoring & retraining"
    ],
    goal: "Create scalable and reproducible ML pipelines.",
    tools: ["MLflow", "Kubeflow", "Amazon SageMaker", "Vertex AI"],
    colorTheme: "emerald",
    iconName: "brain"
  }
];

export const summaryTable = [
  { area: "Main Domain", aiops: "IT Operations", mlops: "Machine Learning", llmops: "Generative AI" },
  { area: "Data Type", aiops: "Logs & Metrics", mlops: "Structured/Training Data", llmops: "Text, embeddings, prompts" },
  { area: "Core Goal", aiops: "Infrastructure automation", mlops: "ML lifecycle management", llmops: "LLM application reliability" },
  { area: "Monitoring", aiops: "System anomalies", mlops: "Model drift", llmops: "Hallucinations, latency, quality" },
  { area: "Typical Output", aiops: "Alerts & automation", mlops: "Predictions", llmops: "Natural language responses" },
  { area: "Users", aiops: "DevOps/SRE teams", mlops: "ML Engineers", llmops: "AI Engineers/Product Teams" }
];
