
import React from 'react';
import { Resource, ResourceCategory } from './types';

export const RESOURCES: Resource[] = [
  {
    id: 'deepseek-v3',
    name: 'DeepSeek-V3',
    description: 'Strongest open-source model for coding and logic from China. Beats many closed models.',
    category: ResourceCategory.LLM,
    url: 'https://github.com/deepseek-ai/DeepSeek-V3',
    license: 'DeepSeek License (Free Use)',
    region: 'China',
    useCase: 'Best for Python/JS coding, mathematical reasoning, and low-latency inference.',
    howToConnect: '### OpenAI Compatible API\n```python\nfrom openai import OpenAI\nclient = OpenAI(api_key="YOUR_KEY", base_url="https://api.deepseek.com")\nresponse = client.chat.completions.create(\n    model="deepseek-chat",\n    messages=[{"role": "user", "content": "Write a fast sort in JS"}]\n)```',
    comparison: 'Superior to Llama 3 in coding tasks; similar reasoning to GPT-4o but open-weights.',
    tags: ['Coding', 'SOTA', 'MoE']
  },
  {
    id: 'llama-3-1',
    name: 'Llama 3.1',
    description: 'Meta\'s premier open model series. The global standard for general-purpose LLMs.',
    category: ResourceCategory.LLM,
    url: 'https://llama.meta.com/',
    license: 'Llama 3.1 Community',
    region: 'USA',
    useCase: 'General assistant, RAG pipelines, and fine-tuning for custom enterprise tasks.',
    howToConnect: '### Local: Ollama\n`ollama run llama3.1` \n\n### Python: Groq (Fastest)\n```python\nfrom groq import Groq\nclient = Groq(api_key="GR_...")\nchat = client.chat.completions.create(\n    model="llama-3.1-70b-versatile",\n    messages=[...]\n)```',
    comparison: 'The most supported ecosystem globally. More robust than Mistral for large-scale reasoning.',
    tags: ['Meta', 'Generalist', 'Versatile']
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large 2',
    description: 'Europe\'s leading model. Optimized for multilingual tasks and high efficiency.',
    category: ResourceCategory.LLM,
    url: 'https://mistral.ai/',
    license: 'Mistral Research License',
    region: 'Europe',
    useCase: 'Multilingual applications (French, German, etc.) and complex reasoning.',
    howToConnect: '### Via Mistral SDK\n```python\nfrom mistralai.client import MistralClient\nclient = MistralClient(api_key="...")\nres = client.chat(model="mistral-large-latest", messages=[...])\n```\n### Local: vLLM\n`python -m vllm.entrypoints.openai.api_server --model mistralai/Mistral-Large-Instruct-2407`',
    comparison: 'More efficient "tokens per dollar" than Llama. Better at European languages.',
    tags: ['Multilingual', 'Efficient', 'French']
  },
  {
    id: 'sarvam-indic',
    name: 'Sarvam-2B',
    description: 'Leading open model from India, optimized specifically for Indic languages.',
    category: ResourceCategory.LLM,
    url: 'https://www.sarvam.ai/',
    license: 'Apache 2.0',
    region: 'India',
    useCase: 'Translation, chat, and summarization in Hindi, Bengali, Tamil, and 7 other Indian languages.',
    howToConnect: '### Transformers SDK\n```python\nfrom transformers import AutoModelForCausalLM, AutoTokenizer\nmodel = AutoModelForCausalLM.from_pretrained("sarvamai/sarvam-2b-v0.5")\ntok = AutoTokenizer.from_pretrained("sarvamai/sarvam-2b-v0.5")\n# Supports 10+ Indic languages natively\n```',
    comparison: 'Significantly better Hindi comprehension than Llama or GPT-3.5 due to custom tokenization.',
    tags: ['Indic', 'Multilingual', 'Small Model']
  },
  {
    id: 'qwen-2-5',
    name: 'Qwen 2.5',
    description: 'Alibaba\'s high-performance model. Excellent at math and following complex instructions.',
    category: ResourceCategory.LLM,
    url: 'https://github.com/QwenLM/Qwen2.5',
    license: 'Apache 2.0',
    region: 'China',
    useCase: 'Mathematical problem solving, tool use, and long-context (128k) understanding.',
    howToConnect: '### Via ModelScope\n`pip install modelscope` \n`modelscope download --model qwen/Qwen2.5-7B-Instruct` \n\n### WebUI\nRun `python -m vllm.entrypoints.openai.api_server --model Qwen/Qwen2.5-7B-Instruct` for local API.',
    comparison: 'Often outperforms Llama 3.1 in STEM subjects and structured data extraction.',
    tags: ['Math', 'Tool Use', 'Long Context']
  },
  {
    id: 'bhashini',
    name: 'Bhashini API',
    description: 'Indian Government initiative for real-time translation and voice across Indian languages.',
    category: ResourceCategory.API,
    url: 'https://bhashini.gov.in/',
    license: 'Free / Gov Open Data',
    region: 'India',
    useCase: 'Building apps for the "Next Billion Users" in India. Voice-to-voice translation.',
    howToConnect: '### REST API (Postman/Curl)\n`POST /ulca/apis/v1/model/compute` \nHeaders: `{"Authorization": "YOUR_ULCA_KEY"}` \nPayload: `{"modelId": "...", "input": [{"source": "Hello"}]}`\n*Requires registration on Bhashini Portal*',
    comparison: 'Unique access to niche Indian dialects that global players like Google miss.',
    tags: ['Translation', 'Voice', 'Public Service']
  },
  {
    id: 'openrouter',
    name: 'OpenRouter (Free Tier)',
    description: 'A unified API to access almost every open model (Llama, DeepSeek, Phi) with many 100% free options.',
    category: ResourceCategory.API,
    url: 'https://openrouter.ai/',
    license: 'Free Tier Available',
    region: 'Global',
    useCase: 'Unified development. Switch between models with one line of code.',
    howToConnect: '### Standard Header\n```javascript\nfetch("https://openrouter.ai/api/v1/chat/completions", {\n  method: "POST",\n  headers: {\n    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,\n    "HTTP-Referer": "YOUR_SITE_URL",\n    "Content-Type": "application/json"\n  },\n  body: JSON.stringify({ model: "openrouter/free" })\n});```',
    comparison: 'Easier than hosting your own. Aggregates the best prices globally.',
    tags: ['Unified', 'Aggregator', 'Free Models']
  },
  {
    id: 'falcon-180b',
    name: 'Falcon 180B',
    description: 'TII\'s massive open model from UAE. One of the largest open-weights models ever.',
    category: ResourceCategory.LLM,
    url: 'https://falconllm.tii.ae/',
    license: 'Falcon Custom License',
    region: 'Global',
    useCase: 'Research and massive-scale knowledge retrieval without API restrictions.',
    howToConnect: '### HF Inference Endpoints\n1. Select Falcon 180B in HF Dashboard\n2. Deploy to AWS/GCP\n3. Connect via `InferenceClient`:\n```python\nfrom huggingface_hub import InferenceClient\nclient = InferenceClient(model="tiiuae/falcon-180B")\n```',
    comparison: 'Comparable to GPT-4 in raw knowledge capacity but hard to host locally.',
    tags: ['Huge', 'TII', 'Research']
  }
];

export const CATEGORY_ICONS: Record<ResourceCategory, React.ReactNode> = {
  [ResourceCategory.LLM]: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  ),
  [ResourceCategory.API]: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  [ResourceCategory.MCP]: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
    </svg>
  ),
  [ResourceCategory.DATASET]: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  ),
  [ResourceCategory.TOOL]: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  [ResourceCategory.FRAMEWORK]: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
};
