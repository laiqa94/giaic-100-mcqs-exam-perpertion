import { Question, ModuleInfo } from './types';
import { module1Questions } from './module1_delegation';
import { module2Questions } from './module2_what_is_ai';
import { module3Questions } from './module3_fluency';
import { module4Questions } from './module4_prompting';
import { module5Questions } from './module5_claude_gpt';
import { module6Questions } from './module6_skills_connectors';
import { module7Questions } from './module7_web_agents';
import { module8Questions } from './module8_workflows';
import { module9Questions } from './module9_governance';
import { module10Questions } from './module10_code_never_write';

export const allQuestions: Question[] = [
  ...module1Questions,
  ...module2Questions,
  ...module3Questions,
  ...module4Questions,
  ...module5Questions,
  ...module6Questions,
  ...module7Questions,
  ...module8Questions,
  ...module9Questions,
  ...module10Questions,
];

export const modulesList: ModuleInfo[] = [
  {
    id: 'module-1',
    number: 1,
    title: 'Just Delegate It',
    slug: 'just-delegate-it-crash-course',
    description: 'Autonomous delegation mental models, One-Way vs Two-Way doors, Human-in-the-Loop, and blast radius governance.',
    keyTopics: ['Delegation Levels 1-4', 'Two-Way vs One-Way Doors', 'Verification Asymmetry', 'Delegation Contracts', 'Blast Radius Containment']
  },
  {
    id: 'module-2',
    number: 2,
    title: 'What AI Actually Is',
    slug: 'what-ai-actually-is-crash-course',
    description: 'Autoregressive next-token prediction, logits and softmax, latent space, attention mechanisms, KV caches, and hallucination mathematics.',
    keyTopics: ['Next-Token Probability P(w|C)', 'Softmax Temperature & Top-p', 'KV Cache VRAM Footprint', 'Lost-in-the-Middle Attention', 'Parametric vs Non-Parametric']
  },
  {
    id: 'module-3',
    number: 3,
    title: 'AI Fluency',
    slug: 'ai-fluency-crash-course',
    description: 'Calibrated trust, automation bias vs algorithmic aversion, epistemic vigilance, cognitive scaffolding, and model drift.',
    keyTopics: ['AI Fluency Pyramid', 'Calibrated Trust', 'Context Rot & Resetting', 'Epistemic Vigilance', 'Deterministic vs Probabilistic Fit']
  },
  {
    id: 'module-4',
    number: 4,
    title: 'AI Prompting 2026',
    slug: 'ai-prompting-2026',
    description: 'Modern system prompts, XML delimiters, few-shot exemplar purity, constrained JSON decoding, prefix caching, and reasoning tokens.',
    keyTopics: ['XML Semantic Tagging', 'Exemplar In-Context Anchoring', 'Constrained JSON Decoding', 'Prefix Prompt Caching', 'Least-to-Most Decomposition']
  },
  {
    id: 'module-5',
    number: 5,
    title: 'Claude vs ChatGPT 101',
    slug: 'claude-chatgpt-101-crash-course',
    description: 'Artifacts vs Canvas, Claude Projects vs GPTs, configurable thinking budgets, safety alignments, and SWE-bench benchmarks.',
    keyTopics: ['Artifacts Sandbox Architecture', 'Claude Projects 200k Caching', 'Configurable Thinking Budgets', 'Contextual Safety Alignment', 'SWE-bench vs HumanEval']
  },
  {
    id: 'module-6',
    number: 6,
    title: 'Skills & Connectors',
    slug: 'skills-connectors-crash-course',
    description: 'Function calling lifecycles, Anthropic Model Context Protocol (MCP), tool description engineering, least privilege, and error recovery.',
    keyTopics: ['Tool Descriptions as Prompts', 'Model Context Protocol (MCP)', 'MCP Resources vs Tools', 'Informative Error Recovery', 'Parallel Tool Dispatch']
  },
  {
    id: 'module-7',
    number: 7,
    title: 'General Agents & Web',
    slug: 'general-agents-web-crash-course',
    description: 'ReAct feedback loops, Accessibility Tree parsing, SPA hydration synchronization, cycle detection, and indirect prompt injection defense.',
    keyTopics: ['ReAct (Reason + Act + Observe)', 'Accessibility Tree (AXTree)', 'SPA Hydration Wait Latency', 'Episodic Cycle Detection', 'Indirect Web Prompt Injection']
  },
  {
    id: 'module-8',
    number: 8,
    title: 'Workflow Design & Diagnosis',
    slug: 'workflow-design-diagnosis-crash-course',
    description: 'Routing, parallel fan-out/fan-in, orchestrator-workers, evaluator-optimizer loops, blackboard pattern, and compounding error decay.',
    keyTopics: ['Evaluator-Optimizer Loop', 'Router Pattern', 'Fan-Out Fan-In Parallelism', 'State Ping-Pong Livelocks', 'Blackboard State Pattern']
  },
  {
    id: 'module-9',
    number: 9,
    title: 'Governance, Risk & Responsible Use',
    slug: 'governance-risk-responsible-use-crash-course',
    description: 'Prompt injection, confused deputy defense, EU AI Act risk tiers, tamper-evident audit trails, shadow AI, and deceptive alignment.',
    keyTopics: ['Confused Deputy & Taint Tracking', 'EU AI Act High-Risk & GDPR', 'Probabilistic vs Deterministic Guardrails', 'Decision Provenance Logging', 'Deceptive Alignment']
  },
  {
    id: 'module-10',
    number: 10,
    title: 'Code You Never Write',
    slug: 'code-you-never-write-crash-course',
    description: 'Spec-driven development vs vibe coding, TDD as the verification oracle, package slopsquatting, runtime schemas, and the 2026 engineer role.',
    keyTopics: ['Vibe Coding vs Spec Integrity', 'TDD as the Primary Steering Harness', 'Package Slopsquatting Attacks', 'Runtime Zod Schema Boundaries', 'Characterization Testing']
  }
];

export function getQuestionsByModule(moduleId: string): Question[] {
  return allQuestions.filter(q => q.moduleId === moduleId);
}

export function getRandomDrill(count = 20): Question[] {
  const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
