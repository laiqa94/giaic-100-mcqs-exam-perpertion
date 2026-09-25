import { Question } from './types';

export const module2Questions: Question[] = [
  {
    id: 11,
    moduleId: 'module-2',
    moduleNumber: 2,
    moduleTitle: 'What AI Actually Is',
    scenario: 'A junior developer complains to a senior ML engineer: "Our LLM has a major software bug—it hallucinated a non-existent API endpoint for our payment service in 2 out of 100 requests. We must patch this bug in the model code immediately."',
    question: 'From first principles of autoregressive transformer architecture, what is the most technically accurate explanation for why "hallucination" cannot simply be patched like a software bug?',
    options: {
      A: 'Hallucination is caused solely by bad server GPU cooling, which flips bits during memory bus transfers.',
      B: 'An LLM is not a relational database with ground-truth records; it is a probabilistic next-token generator calculating conditional probability distributions $P(w_t | w_{<t})$ over a finite vocabulary. Every output token is sampled from this distribution, meaning plausible-sounding but factually ungrounded tokens are an inherent mathematical artifact of generative sampling.',
      C: 'The bug is due to using Python instead of C++; compiling the LLM in Rust will mathematically eliminate all hallucinations.',
      D: 'Hallucinations only occur when the prompt contains fewer than 50 tokens.'
    },
    correctAnswer: 'B',
    rationale: 'LLMs possess no internal database of ground truth; they model statistical token distributions learned during pre-training. When an LLM outputs tokens, it evaluates logit probabilities. If an ungrounded token has high conditional semantic plausibility given preceding tokens, the model will generate it. Grounding requires external non-parametric retrieval (RAG) and schema validation, not a simple "code patch".',
    distractorBreakdown: {
      A: 'Hardware bit-flips are exceedingly rare ECC-managed occurrences and not the source of semantic hallucinations.',
      C: 'The inference programming language does not alter the mathematical probabilities produced by the model weights.',
      D: 'Hallucinations occur across short, medium, and long prompts, often worsening as context windows saturate.'
    },
    urduSummary: 'LLM koi sachai ka database nahi hai, balki aglay lafz ka probability distribution nikalnay wala statistical model hai. Isliye hallucination koi mamooli bug nahi balki iski fitrat hai.',
    corePrinciple: 'Probabilistic Next-Token Prediction & Nature of Hallucinations',
    difficulty: 'Hard'
  },
  {
    id: 12,
    moduleId: 'module-2',
    moduleNumber: 2,
    moduleTitle: 'What AI Actually Is',
    scenario: 'An engineer is building a mission-critical JSON extractor for medical lab reports. The model is occasionally emitting conversational filler words or slightly altered JSON keys, breaking downstream deserialization.',
    question: 'How do Temperature ($T$) and Top-p (nucleus sampling) affect the model\'s logit probability distribution, and what configuration is mathematically optimal for deterministic extraction?',
    options: {
      A: 'Set Temperature to 1.8 and Top-p to 0.99 to give the model maximum flexibility to explore different JSON schemas.',
      B: 'Setting Temperature near 0.0 collapses the softmax probability distribution toward a one-hot argmax selection (greedy decoding), forcing the model to pick the highest-probability token at each step, drastically reducing schema variance.',
      C: 'Temperature controls the clock speed of the GPU, while Top-p sets the thread pool size.',
      D: 'Set Top-p to 0.0 because Top-p of 0.0 forces the model to search the live internet before answering.'
    },
    correctAnswer: 'B',
    rationale: 'In the softmax formula $P(i) = \\frac{e^{z_i / T}}{\\sum e^{z_j / T}}$, lowering $T \\to 0$ sharpens the logit landscape, magnifying the delta between the top token and all others, culminating in greedy argmax decoding. For structured schema extraction, greedy decoding minimizes entropy and prevents exploratory branching into unexpected keys.',
    distractorBreakdown: {
      A: 'High temperature flattens logits, maximizing randomness and guaranteeing JSON parse failures.',
      C: 'Temperature is a mathematical scalar in softmax normalization, not a hardware clock setting.',
      D: 'Top-p truncates the cumulative probability distribution tail; setting it to 0 is invalid or defaults to greedy, having nothing to do with internet search.'
    },
    urduSummary: 'Temperature ko 0 karne se model har qadam par sirf sab se zyada probability wala token chunta hai (Greedy decoding), jis se structured JSON consistent banta hai.',
    corePrinciple: 'Softmax Temperature & Logit Distribution Dynamics',
    difficulty: 'Hard'
  },
  {
    id: 13,
    moduleId: 'module-2',
    moduleNumber: 2,
    moduleTitle: 'What AI Actually Is',
    scenario: 'A product manager asks: "Why don\'t we just dump our company\'s entire 500,000-page internal document library directly into the model\'s 1-million-token context window for every customer query instead of building a RAG vector database?"',
    question: 'What architectural and informational retrieval bottlenecks make this approach fatally flawed in production?',
    options: {
      A: 'The Attention Mechanism ($O(N^2)$ quadratic complexity or high KV cache memory overhead), severe Context Dilution ("Lost in the Middle" phenomenon), extreme per-query token latency, and exorbitant inference costs.',
      B: 'LLMs cannot read documents longer than 10 pages under any circumstance.',
      C: 'The internet shuts down if a single prompt exceeds 50,000 tokens.',
      D: 'Models automatically delete their pre-trained weights if context is loaded with PDF data.'
    },
    correctAnswer: 'A',
    rationale: 'Even with long-context architectures, full-context saturation causes massive KV cache consumption, high time-to-first-token (TTFT) latency, linear cost inflation per request, and significant attention degradation ("Lost in the Middle"), where the model fails to retrieve subtle needles buried inside hundreds of thousands of distracting tokens.',
    distractorBreakdown: {
      B: 'Modern long-context models routinely ingest large books, but doing so on every user query is economically and latency-prohibitive.',
      C: 'Network protocols handle megabyte-sized HTTP payloads without issue.',
      D: 'In-context processing affects ephemeral activation memory, never the static model weights.'
    },
    urduSummary: 'Context window me sab kuch thons dene se attention degrade hoti hai (Lost in the middle), latency aur token cost bohot barh jati hai; isliye RAG behtar rehta hai.',
    corePrinciple: 'Context Saturation, KV Cache & Lost-in-the-Middle',
    difficulty: 'Hard'
  },
  {
    id: 14,
    moduleId: 'module-2',
    moduleNumber: 2,
    moduleTitle: 'What AI Actually Is',
    scenario: 'A machine learning team discusses the difference between "Parametric Memory" and "Non-Parametric Memory" when updating an AI system with new tax legislation passed yesterday.',
    question: 'Which of the following correctly pairs the architectural component with the appropriate memory type and update methodology?',
    options: {
      A: 'Parametric memory consists of static weights ($W_Q, W_K, W_V$, MLP layers) updated only via pre-training or fine-tuning; Non-Parametric memory consists of external dynamic context (retrieval documents, vector stores, API responses) injected into the prompt at runtime.',
      B: 'Parametric memory is the computer\'s RAM; Non-Parametric memory is the SSD hard drive.',
      C: 'Parametric memory changes automatically whenever a user asks a question; Non-Parametric memory is frozen forever in 2021.',
      D: 'Parametric memory is used only for image models; text models only use Non-Parametric memory.'
    },
    correctAnswer: 'A',
    rationale: 'Parametric memory is encoded directly in the billions of floating-point neural weights frozen after training. Updating parametric memory requires expensive gradient descent (training/fine-tuning). Non-parametric memory lives outside the model (vector stores, databases, documents) and is supplied dynamically during inference without modifying model weights.',
    distractorBreakdown: {
      B: 'This conflates neural network representation theory with generic operating system hardware storage.',
      C: 'Weights do not self-update during inference; standard inference is strictly a forward-pass evaluation.',
      D: 'All transformer-based language models rely fundamentally on parametric weight matrices.'
    },
    urduSummary: 'Parametric memory model ke trained weights hote hain jo fine-tuning se badalte hain, jabke Non-Parametric memory bahar se aane wala context ya RAG data hota hai.',
    corePrinciple: 'Parametric vs Non-Parametric Memory Architecture',
    difficulty: 'Hard'
  },
  {
    id: 15,
    moduleId: 'module-2',
    moduleNumber: 2,
    moduleTitle: 'What AI Actually Is',
    scenario: 'Two data scientists analyze how an embedding model maps semantic text to vectors. Sentence A: "The bank of the river was overflowing." Sentence B: "The financial bank approved the commercial mortgage." Sentence C: "Water flooded the grassy riverbank."',
    question: 'In a modern high-dimensional dense vector space, how does cosine similarity behave between these sentences, and what does this reveal about contextual embeddings?',
    options: {
      A: 'Sentences A and B will have the highest cosine similarity because both contain the exact character string "bank".',
      B: 'Sentences A and C will exhibit higher cosine similarity than A and B because contextual transformer embeddings capture relational semantics and surrounding token attention rather than naive bag-of-words keyword matches.',
      C: 'All three sentences will have a cosine similarity of -1.0 because embeddings cannot distinguish nouns from verbs.',
      D: 'Cosine similarity is only applicable to 2D graphs and cannot be calculated in 1536-dimensional space.'
    },
    correctAnswer: 'B',
    rationale: 'Unlike legacy static word embeddings (Word2Vec) where "bank" had a single vector, contextual transformers compute token representations dynamically based on surrounding tokens via self-attention. Thus, the riverbank context of Sentence A clusters closely with the hydrological flooding context of Sentence C, while Sentence B clusters in the financial domain.',
    distractorBreakdown: {
      A: 'This describes naive lexical keyword matching (BM25/TF-IDF), not contextual dense vector embeddings.',
      C: 'Cosine similarities between semantically related natural language texts in typical embedding models are positive and distinct.',
      D: 'Cosine similarity is a standard linear algebra dot-product metric defined for any $N$-dimensional inner product space.'
    },
    urduSummary: 'Contextual embeddings lafzi milawat ki bajaye matlab (semantics) samajhte hain, isliye darya ke kinare wali baat doosray paani wale jumle se ziada qareeb hogi.',
    corePrinciple: 'Contextual Vector Embeddings & Latent Space Topography',
    difficulty: 'Hard'
  },
  {
    id: 16,
    moduleId: 'module-2',
    moduleNumber: 2,
    moduleTitle: 'What AI Actually Is',
    scenario: 'During a technical review, an executive asks: "Does the LLM actually reason step-by-step internally like a human mathematician when answering a complex question in a single zero-shot forward pass?"',
    question: 'What is the scientifically rigorous consensus regarding zero-shot reasoning vs. "Thinking / Test-Time Compute" models (like o1 or extended thinking)?',
    options: {
      A: 'Yes, a standard zero-shot forward pass executes an arbitrary number of hidden Turing-complete iterative cycles inside its static layers before generating token 1.',
      B: 'No, a standard single-pass autoregressive model computes token 1 using a fixed depth of transformer layers (fixed computation per token); true multi-step test-time reasoning requires generating explicit intermediate reasoning tokens (scratchpad / Chain-of-Thought) to spend additional compute exploring and verifying paths before emitting the final answer.',
      C: 'LLMs are sentient consciousness engines that feel intuitive epiphanies.',
      D: 'Reasoning models are identical to standard models with a simple prompt that says "Think hard".'
    },
    correctAnswer: 'B',
    rationale: 'In standard transformer inference, generating the next token uses a fixed amount of floating-point operations ($FLOPs$) proportional to network depth and parameter count. The model cannot "think longer" on harder tokens unless it generates explicit hidden or visible reasoning tokens (test-time compute), allowing sequential autoregressive conditioning over intermediate deductive steps.',
    distractorBreakdown: {
      A: 'Standard forward passes are feed-forward directed acyclic computations with no dynamic looping.',
      C: 'Attributing human sentience or subjective epiphanies to matrix multiplications is ungrounded anthropomorphism.',
      D: 'Reasoning models are trained via reinforcement learning (RL) with search and backtracking over extended chains of thought, not just a cosmetic prompt prefix.'
    },
    urduSummary: 'Standard model har token par fixed hisaab karta hai; mushkil masle hal karne ke liye test-time compute (Chain of Thought tokens) zaroori hota hai taake model soch kar raaste check kar sake.',
    corePrinciple: 'Test-Time Compute vs Fixed Single-Pass Computation',
    difficulty: 'Extreme'
  },
  {
    id: 17,
    moduleId: 'module-2',
    moduleNumber: 2,
    moduleTitle: 'What AI Actually Is',
    scenario: 'A cloud architect is sizing GPU infrastructure for a high-concurrency LLM inference cluster. The architect notices that GPU VRAM usage increases not just with model weights, but dramatically with the number of concurrent active user sessions and conversation turn lengths.',
    question: 'Which specific mechanism is consuming this dynamic VRAM during autoregressive generation?',
    options: {
      A: 'The Key-Value (KV) Cache, which stores precomputed Key and Value tensor representations for all historical tokens in each active context to avoid recomputing attention for previous tokens at every step.',
      B: 'The CPU motherboard BIOS leaking electricity into the PCIe lanes.',
      C: 'The user\'s browser cookies being duplicated inside the GPU L1 cache.',
      D: 'The model retraining its internal weights in real time for every connected user.'
    },
    correctAnswer: 'A',
    rationale: 'In autoregressive generation, without a KV Cache, generating each new token $N$ would require re-running attention across all prior $N-1$ tokens, leading to $O(N^2)$ redundant compute per sequence. Caching the Key and Value matrices in GPU VRAM enables $O(1)$ attention computation per step, but scales linearly with context length and batch size ($2 \\times \\text{layers} \\times \\text{heads} \\times d_k \\times \\text{seq\\_len} \\times \\text{batch}$).',
    distractorBreakdown: {
      B: 'Hardware electricity leakage is not related to software conversation state management.',
      C: 'Browser cookies remain in application memory on the web server, never in GPU VRAM.',
      D: 'Inference does not perform backpropagation or update model weights in real time.'
    },
    urduSummary: 'KV Cache purane tamam tokens ke Key aur Value tensors ko VRAM me mehfooz rakhta hai taake har naye token par dobara hisaab na karna paray, jis se lambi chat par memory barhti hai.',
    corePrinciple: 'KV Cache Mechanics & Memory Footprint in LLM Serving',
    difficulty: 'Hard'
  },
  {
    id: 18,
    moduleId: 'module-2',
    moduleNumber: 2,
    moduleTitle: 'What AI Actually Is',
    scenario: 'A developer inputs the prompt: "The capital of France is" and observes that the top candidate tokens from the model\'s output vocabulary are "Paris" (98.2%), "the" (0.9%), "a" (0.3%).',
    question: 'At which stage in the transformer architecture are these percentage probabilities generated from raw unbounded numbers?',
    options: {
      A: 'During the initial tokenization embedding lookup.',
      B: 'At the Softmax layer applied over the final linear projection layer (unnormalized logit vector) across the tokenizer vocabulary.',
      C: 'Inside the positional encoding sinusoidal function.',
      D: 'In the client-side JavaScript regex filter.'
    },
    correctAnswer: 'B',
    rationale: 'The final transformer layer outputs a vector of continuous, unbounded real numbers known as logits, corresponding to every token in the vocabulary ($V \\approx 32k\\text{--}128k$). Passing these logits through the Softmax function normalizes them into a valid probability distribution where all values lie between 0 and 1 and sum to 1.0.',
    distractorBreakdown: {
      A: 'The initial embedding layer converts discrete token IDs into dense vector representations, not output probabilities.',
      C: 'Positional encodings inject token sequence order information into initial embeddings.',
      D: 'Logits and softmax are core neural network operations calculated on the GPU inference server, not client-side JavaScript.'
    },
    urduSummary: 'Model ke aakhri layer ke raw numbers (logits) ko Softmax function ke zariye 0 se 1 ke darmiyan probabilities me tabdeel kiya jata hai.',
    corePrinciple: 'Logits to Probabilities via Softmax Normalization',
    difficulty: 'Hard'
  },
  {
    id: 19,
    moduleId: 'module-2',
    moduleNumber: 2,
    moduleTitle: 'What AI Actually Is',
    scenario: 'An insurance company tests an LLM on calculating complex compound interest. Even though the model wrote a beautifully phrased explanation, the final numeric calculation is off by $143.20.',
    question: 'Why are autoregressive LLMs notoriously unreliable at multi-digit arithmetic when forced to generate answers in a single token without code execution or tools?',
    options: {
      A: 'LLMs process text as subword tokens (e.g., "128" might be split into tokens "12" and "8") and predict the most statistically probable next token rather than executing binary ALU logic operations; multi-digit arithmetic requires exact carrying and state tracking that statistical token transitions cannot reliably guarantee.',
      B: 'Computers do not know how to multiply numbers.',
      C: 'The model ran out of RAM on that specific calculation.',
      D: 'Numbers are encrypted in the training data so the model cannot read them.'
    },
    correctAnswer: 'A',
    rationale: 'Subword tokenization breaks numbers arbitrarily, and next-token prediction estimates semantic plausibility rather than maintaining an arithmetic accumulator. Without an external tool (like a Python code execution environment or calculator) or scratchpad tokens to break down column-by-column carry operations, pure autoregression frequently produces plausible-looking but numerically incorrect digits.',
    distractorBreakdown: {
      B: 'CPUs and GPUs excel at arithmetic; the failure lies in the LLM simulating math via text prediction rather than routing to an ALU.',
      C: 'VRAM exhaustion causes out-of-memory crashes, not subtle arithmetic inaccuracies.',
      D: 'Numeric tokens are standard vocabulary tokens in training corpora, not encrypted values.'
    },
    urduSummary: 'LLM hisaab kitab calculator ki tarah nahi karta balki lafzon ki probability se andaaza lagata hai, isliye multi-digit math ke liye Code Interpreter ya tool lazmi hai.',
    corePrinciple: 'Subword Tokenization & Arithmetic Computation Limits',
    difficulty: 'Hard'
  },
  {
    id: 20,
    moduleId: 'module-2',
    moduleNumber: 2,
    moduleTitle: 'What AI Actually Is',
    scenario: 'A researcher demonstrates that changing a single irrelevant punctuation mark in a 5,000-token prompt changes the model\'s final classification from "Approved" to "Denied".',
    question: 'What fundamental mathematical characteristic of deep transformer networks explains this extreme sensitivity to slight input perturbations?',
    options: {
      A: 'Non-linear activation functions (e.g., GeLU/SwiGLU) and high-dimensional attention routing create a complex loss landscape where tiny shifts in token embeddings can redirect the trajectory across sensitive decision boundaries in latent space.',
      B: 'The transformer contains physical gears that jam when commas are inserted.',
      C: 'Punctuation marks carry a penalty score of 500 points in transformer tokens.',
      D: 'The model has developed an emotional bias against punctuation.'
    },
    correctAnswer: 'A',
    rationale: 'Deep neural networks with dozens of non-linear attention and MLP layers operate as highly complex, non-linear dynamical systems. Even subtle perturbations in earlier token embeddings propagate through multi-head self-attention matrices, occasionally shifting the logit margin when two competing classifications sit near an unstable decision boundary.',
    distractorBreakdown: {
      B: 'Transformers are mathematical software algorithms running on silicon semiconductors, not physical mechanical gears.',
      C: 'Punctuation tokens are standard vocabulary tokens with no arbitrary fixed numeric penalty.',
      D: 'Models possess no human emotions, desires, or personal pet peeves.'
    },
    urduSummary: 'Deep neural networks me non-linear layers ki wajah se ek choti si tabdeeli bhi attention trajectory ko doosri taraf morh sakti hai.',
    corePrinciple: 'Non-Linear Latent Trajectories & Perturbation Sensitivity',
    difficulty: 'Extreme'
  }
];
