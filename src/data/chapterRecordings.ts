export interface ChapterVideo {
  label: string;
  youtubeId: string;
  url: string;
  badge?: string;
}

export interface ChapterRecording {
  chapterNumber: number;
  title: string;
  moduleId: string;
  description: string;
  videos: ChapterVideo[];
  keyTopics: string[];
  docSlug: string;
}

export const chapterRecordings: ChapterRecording[] = [
  {
    chapterNumber: 1,
    title: 'Just Delegate It',
    moduleId: 'module-1',
    description: 'Autonomous delegation mental models, One-Way vs Two-Way doors, Human-in-the-Loop, verification asymmetry, and blast radius governance.',
    keyTopics: ['Delegation Levels 1-4', 'Two-Way vs One-Way Doors', 'Verification Asymmetry', 'Delegation Contracts', 'Blast Radius Containment'],
    docSlug: 'just-delegate-it-crash-course',
    videos: [
      {
        label: 'Live Session: Just Delegate It',
        youtubeId: '0uu_mHTDIfE',
        url: 'https://youtu.be/0uu_mHTDIfE',
        badge: 'Chapter 01 Recording',
      },
    ],
  },
  {
    chapterNumber: 2,
    title: 'What AI Actually Is',
    moduleId: 'module-2',
    description: 'Autoregressive next-token prediction, logits and softmax, latent space, attention mechanisms, KV caches, and hallucination mathematics.',
    keyTopics: ['Next-Token Probability P(w|C)', 'Softmax Temperature & Top-p', 'KV Cache VRAM Footprint', 'Lost-in-the-Middle Attention', 'Parametric vs Non-Parametric'],
    docSlug: 'what-ai-actually-is-crash-course',
    videos: [
      {
        label: 'Live Session: What AI Actually Is',
        youtubeId: 'g__37WLnk98',
        url: 'https://youtu.be/g__37WLnk98',
        badge: 'Chapter 02 Recording',
      },
    ],
  },
  {
    chapterNumber: 3,
    title: 'AI Fluency',
    moduleId: 'module-3',
    description: 'Calibrated trust, automation bias vs algorithmic aversion, epistemic vigilance, cognitive scaffolding, and model drift.',
    keyTopics: ['AI Fluency Pyramid', 'Calibrated Trust', 'Context Rot & Resetting', 'Epistemic Vigilance', 'Deterministic vs Probabilistic Fit'],
    docSlug: 'ai-fluency-crash-course',
    videos: [
      {
        label: 'Live Session: AI Fluency',
        youtubeId: 'VQ2I8nD_Pr4',
        url: 'https://youtu.be/VQ2I8nD_Pr4',
        badge: 'Chapter 03 Recording',
      },
    ],
  },
  {
    chapterNumber: 4,
    title: 'AI Prompting in 2026',
    moduleId: 'module-4',
    description: 'Modern system prompts, XML delimiters, few-shot exemplar purity, constrained JSON decoding, prefix caching, and reasoning tokens.',
    keyTopics: ['XML Semantic Tagging', 'Exemplar In-Context Anchoring', 'Constrained JSON Decoding', 'Prefix Prompt Caching', 'Least-to-Most Decomposition'],
    docSlug: 'ai-prompting-2026',
    videos: [
      {
        label: 'Live Session: AI Prompting in 2026',
        youtubeId: 'Qz4J0omFt_8',
        url: 'https://youtu.be/Qz4J0omFt_8',
        badge: 'Chapter 04 Recording',
      },
    ],
  },
  {
    chapterNumber: 5,
    title: 'Claude and ChatGPT 101',
    moduleId: 'module-5',
    description: 'Artifacts vs Canvas, Claude Projects vs GPTs, configurable thinking budgets, safety alignments, and SWE-bench benchmarks.',
    keyTopics: ['Artifacts Sandbox Architecture', 'Claude Projects 200k Caching', 'Configurable Thinking Budgets', 'Contextual Safety Alignment', 'SWE-bench vs HumanEval'],
    docSlug: 'claude-chatgpt-101-crash-course',
    videos: [
      {
        label: 'Live Session: Claude and ChatGPT 101',
        youtubeId: 'G0JCuWmywKM',
        url: 'https://youtu.be/G0JCuWmywKM',
        badge: 'Chapter 05 Recording',
      },
    ],
  },
  {
    chapterNumber: 6,
    title: 'Skills & Connectors + Projects',
    moduleId: 'module-6',
    description: 'Function calling lifecycles, Anthropic Model Context Protocol (MCP), tool description engineering, least privilege, error recovery, and hands-on projects.',
    keyTopics: ['Tool Descriptions as Prompts', 'Model Context Protocol (MCP)', 'MCP Resources vs Tools', 'Informative Error Recovery', 'Parallel Tool Dispatch'],
    docSlug: 'skills-connectors-crash-course',
    videos: [
      {
        label: 'Part 1: Skills & Connectors Core Concepts',
        youtubeId: 'STDUKRH6dwo',
        url: 'https://youtu.be/STDUKRH6dwo',
        badge: 'Part 1',
      },
      {
        label: 'Part 2: Connectors & Practical Projects Walkthrough',
        youtubeId: 'HctbMU6aFCA',
        url: 'https://youtu.be/HctbMU6aFCA',
        badge: 'Part 2 (Projects)',
      },
    ],
  },
  {
    chapterNumber: 7,
    title: 'General Agents on the Web',
    moduleId: 'module-7',
    description: 'ReAct feedback loops, Accessibility Tree parsing, SPA hydration synchronization, cycle detection, and indirect prompt injection defense.',
    keyTopics: ['ReAct (Reason + Act + Observe)', 'Accessibility Tree (AXTree)', 'SPA Hydration Wait Latency', 'Episodic Cycle Detection', 'Indirect Web Prompt Injection'],
    docSlug: 'general-agents-web-crash-course',
    videos: [
      {
        label: 'Live Session: General Agents on the Web',
        youtubeId: 'vOrV2ZcnTpk',
        url: 'https://youtu.be/vOrV2ZcnTpk',
        badge: 'Chapter 07 Recording',
      },
    ],
  },
  {
    chapterNumber: 8,
    title: 'Workflow Design and Diagnosis',
    moduleId: 'module-8',
    description: 'Routing, parallel fan-out/fan-in, orchestrator-workers, evaluator-optimizer loops, blackboard pattern, and compounding error decay.',
    keyTopics: ['Evaluator-Optimizer Loop', 'Router Pattern', 'Fan-Out Fan-In Parallelism', 'State Ping-Pong Livelocks', 'Blackboard State Pattern'],
    docSlug: 'workflow-design-diagnosis-crash-course',
    videos: [
      {
        label: 'Live Session: Workflow Design and Diagnosis',
        youtubeId: 'r2Mzsk1Niv4',
        url: 'https://youtu.be/r2Mzsk1Niv4',
        badge: 'Chapter 08 Recording',
      },
    ],
  },
  {
    chapterNumber: 9,
    title: 'Governance, Risk and Responsible Use',
    moduleId: 'module-9',
    description: 'Prompt injection, confused deputy defense, EU AI Act risk tiers, tamper-evident audit trails, shadow AI, and deceptive alignment.',
    keyTopics: ['Confused Deputy & Taint Tracking', 'EU AI Act High-Risk & GDPR', 'Probabilistic vs Deterministic Guardrails', 'Decision Provenance Logging', 'Deceptive Alignment'],
    docSlug: 'governance-risk-responsible-use-crash-course',
    videos: [
      {
        label: 'Live Session: Governance, Risk and Responsible Use',
        youtubeId: 'AF8AQjP39tQ',
        url: 'https://youtu.be/AF8AQjP39tQ',
        badge: 'Chapter 09 Recording',
      },
    ],
  },
  {
    chapterNumber: 10,
    title: 'Code You Never Write',
    moduleId: 'module-10',
    description: 'Spec-driven development vs vibe coding, TDD as the verification oracle, package slopsquatting, runtime schemas, and the 2026 engineer role.',
    keyTopics: ['Vibe Coding vs Spec Integrity', 'TDD as the Primary Steering Harness', 'Package Slopsquatting Attacks', 'Runtime Zod Schema Boundaries', 'Characterization Testing'],
    docSlug: 'code-you-never-write-crash-course',
    videos: [
      {
        label: 'Live Session: Code You Never Write',
        youtubeId: 'ntMHbPrQIW0',
        url: 'https://youtu.be/ntMHbPrQIW0',
        badge: 'Chapter 10 Recording',
      },
    ],
  },
];

export const SHARE_STUDENTS_MESSAGE = `🎓 GIAIC Exam Preparation – All 10 Chapters Recordings 🎥

Watch the Live Sessions in sequence:

1. Just Delegate It
   https://youtu.be/0uu_mHTDIfE

2. What AI Actually Is
   https://youtu.be/g__37WLnk98

3. AI Fluency
   https://youtu.be/VQ2I8nD_Pr4

4. AI Prompting in 2026
   https://youtu.be/Qz4J0omFt_8

5. Claude and ChatGPT 101
   https://youtu.be/G0JCuWmywKM

6. Skills & Connectors + Projects
   https://youtu.be/STDUKRH6dwo
   https://youtu.be/HctbMU6aFCA

7. General Agents on the Web
   https://youtu.be/vOrV2ZcnTpk

8. Workflow Design and Diagnosis
   https://youtu.be/r2Mzsk1Niv4

9. Governance, Risk and Responsible Use
   https://youtu.be/AF8AQjP39tQ

10. Code You Never Write
    https://youtu.be/ntMHbPrQIW0

Watch these sessions and then practice scenario-based MCQs for exam preparation!
Best of luck to all students! ❤️`;
