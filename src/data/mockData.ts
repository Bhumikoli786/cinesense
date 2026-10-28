import { AnalysisResult, MovieCardData, PipelineStep } from '../types';

export const SAMPLE_REVIEWS_FOR_ANALYZER = [
  {
    label: '✨ Raving Praise (Masterpiece)',
    title: 'Interstellar Odyssey',
    genre: 'Sci-Fi',
    review: 'An absolute cinematic masterpiece! The emotional depth paired with breathtaking visuals and Hans Zimmer\'s mesmerizing score left me speechless in the theater. The exploration of love transcending time and space is deeply poignant and unforgettable.'
  },
  {
    label: '💥 Harsh Critique (Disappointment)',
    title: 'Shadows of the Night',
    genre: 'Thriller',
    review: 'A profoundly disappointing mess. What could have been an intriguing premise was ruined by amateurish pacing, cardboard characters, and jarring plot holes. The dialogue felt wooden and the climax was utterly predictable and tedious.'
  },
  {
    label: '⚖️ Nuanced & Balanced (Mixed)',
    title: 'The Clockmaker\'s Secret',
    genre: 'Drama',
    review: 'Visually gorgeous with impeccable costume design and stellar performances from the lead cast. However, the second act drags significantly and the screenplay struggles to resolve its ambitious subplots. An admirable effort that falls slightly short of greatness.'
  },
  {
    label: '😂 Sarcastic / Subdued Humor',
    title: 'Galactic Bounty',
    genre: 'Comedy',
    review: 'If you enjoy two straight hours of explosions masking the complete absence of a script, this is your dream film. The jokes land about as softly as an anvil, though the popcorn was surprisingly fresh.'
  },
  {
    label: '👻 Psychological Horror',
    title: 'Whispers in the Cellar',
    genre: 'Horror',
    review: 'Genuinely chilling atmospheric dread! Rather than relying on cheap jump scares, the director builds suffocating tension through sound design and eerie cinematography. Haunting and deeply unsettling.'
  }
];

export const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: 'step-1',
    title: '1. Raw Review Ingestion',
    shortDesc: 'Captures raw audience feedback, multi-line critique, and user input strings.',
    technicalDetails: 'The system ingests raw multi-modal textual strings from critic portals, social feeds, or direct user input. Input validation guards against injection, checks string bounds (10 to 10,000 chars), and detects language character sets.',
    exampleRaw: '"I LOVED the visuals & cinematography!! But the plot was kinda weak... <br> 10/10 sound though!"',
    exampleProcessed: 'Normalized raw input stream preserved with structural metadata.',
    codeSnippet: `const rawReview = input.trim();\nif (rawReview.length < 10) throw new Error("Input too short");`,
    iconName: 'FileText'
  },
  {
    id: 'step-2',
    title: '2. Text Cleaning & Normalization',
    shortDesc: 'Strips HTML noise, handles contractions, removes special symbols, and standardizes casing.',
    technicalDetails: 'Standard preprocessing sanitizes noisy data: HTML tags (<br>, <p>) are stripped, Unicode artifacts resolved, contractions expanded (can\'t -> cannot), and text lowercased to reduce vocabulary sparsity.',
    exampleRaw: '"I LOVED the visuals & cinematography!! But the plot was kinda weak... <br> 10/10 sound though!"',
    exampleProcessed: '"i loved the visuals cinematography but the plot was kinda weak 10 10 sound though"',
    codeSnippet: `const cleaned = raw\n  .replace(/<[^>]*>/g, '')\n  .replace(/[^\\w\\s'.!?]/g, ' ')\n  .toLowerCase();`,
    iconName: 'Sparkles'
  },
  {
    id: 'step-3',
    title: '3. Tokenization & Stopwords Filtering',
    shortDesc: 'Segments stream into atomic tokens, computes subwords, and isolates sentiment-bearing words.',
    technicalDetails: 'Byte-Pair Encoding (BPE) or whitespace-regex segmenters break sentences into discrete tokens. High-frequency syntactical words ("the", "is", "at") are identified, isolating core cinematic descriptive predicates.',
    exampleRaw: '["i", "loved", "the", "visuals", "cinematography", "but", "the", "plot", "was", "weak"]',
    exampleProcessed: 'Keywords retained: ["loved", "visuals", "cinematography", "plot", "weak"] (5 sentiment carriers)',
    codeSnippet: `const tokens = text.match(/[a-z0-9'-]+/g);\nconst contentTokens = tokens.filter(t => !STOPWORDS.has(t));`,
    iconName: 'Cpu'
  },
  {
    id: 'step-4',
    title: '4. Embeddings & Semantic Representation',
    shortDesc: 'Projects tokens into high-dimensional semantic vector spaces capturing context and nuance.',
    technicalDetails: 'Tokens are mapped through transformer attention layers into dense 768-to-1536 dimensional embedding vectors. Multi-head self-attention enables the model to understand that "not bad" is positive, whereas "bad" alone is negative.',
    exampleRaw: 'Tokens: ["masterpiece", "visuals", "uninspired", "pacing"]',
    exampleProcessed: 'Vector representation: e(x) ∈ ℝ^d with contextual positional encodings & attention weights.',
    codeSnippet: `// Multi-head self-attention representation\nAttention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V`,
    iconName: 'Network'
  },
  {
    id: 'step-5',
    title: '5. Sentiment Classification & Aspect Analysis',
    shortDesc: 'Deep classification heads output polarity, confidence, subjectivity, and aspect sentiment.',
    technicalDetails: 'Softmax classification layers evaluate probability distributions across sentiment categories (Positive, Neutral, Negative). Aspect-level attention branches evaluate specific cinematic dimensions: Acting, Plot, Sound, and Direction.',
    exampleRaw: 'Embedding Vector → Linear Layer → Softmax Head',
    exampleProcessed: 'P(Positive)=0.92, P(Negative)=0.03, P(Neutral)=0.05 → Class: Positive (92% Confidence)',
    codeSnippet: `const sentiment = argmax([p_pos, p_neg, p_neu]);\nconst polarity = (p_pos - p_neg);`,
    iconName: 'Layers'
  },
  {
    id: 'step-6',
    title: '6. Explainable Visualization & Insights',
    shortDesc: 'Renders intuitive gauge meters, highlighted key phrases, summaries, and SDG metrics.',
    technicalDetails: 'Outputs are translated into interactive visual metrics: polarity gauges (-1.0 to +1.0), highlighted keyword contributions with attention weights, emotion radars, and downloadable reports for entertainment infrastructure.',
    exampleRaw: 'Model inference outputs + attention gradient map',
    exampleProcessed: 'Rendered in CineSense UI with glassmorphism gauges, keyword badges, and analytics records.',
    codeSnippet: `// Render Gauge (-100 to +100)\nconst angle = (polarity + 1) * 90; // 0deg to 180deg`,
    iconName: 'BarChart3'
  }
];

export const DEMO_MOVIES_CATALOG: MovieCardData[] = [
  {
    id: 'mv-1',
    title: 'Solaris Horizon',
    year: 2024,
    genre: 'Sci-Fi',
    director: 'Elena Vance',
    rating: 8.9,
    posterBg: 'from-blue-950 via-indigo-900 to-slate-900',
    posterIcon: 'Atom',
    sampleReview: 'A triumph of modern speculative fiction. The deep space sequences are breathtaking, backed by a hypnotic synthesizer score that kept me glued to the screen.',
    actualSentiment: 'Positive',
    confidence: 96
  },
  {
    id: 'mv-2',
    title: 'The Silent Whisper',
    year: 2023,
    genre: 'Horror',
    director: 'Marcus Sterling',
    rating: 4.2,
    posterBg: 'from-red-950 via-zinc-900 to-stone-950',
    posterIcon: 'Skull',
    sampleReview: 'Relies entirely on clichéd loud jump scares and an incomprehensible script. What could have been creepy ended up feeling completely uninspired and boring.',
    actualSentiment: 'Negative',
    confidence: 93
  },
  {
    id: 'mv-3',
    title: 'Parisian Rhapsody',
    year: 2024,
    genre: 'Romance',
    director: 'Camille Laurent',
    rating: 7.5,
    posterBg: 'from-rose-950 via-purple-900 to-slate-950',
    posterIcon: 'Heart',
    sampleReview: 'A charming, bittersweet love story with delightful chemistry between the leads. While the third act feels slightly rushed, the cinematography is wonderfully warm.',
    actualSentiment: 'Positive',
    confidence: 88
  },
  {
    id: 'mv-4',
    title: 'Neon Velocity',
    year: 2025,
    genre: 'Action',
    director: 'Kenji Sato',
    rating: 6.0,
    posterBg: 'from-amber-950 via-slate-900 to-cyan-950',
    posterIcon: 'Zap',
    sampleReview: 'Fast-paced car chases and punchy stunt choreography, but paper-thin character development and repetitive dialogue make it just an average popcorn flick.',
    actualSentiment: 'Neutral',
    confidence: 79
  },
  {
    id: 'mv-5',
    title: 'The Courtroom Verdict',
    year: 2023,
    genre: 'Drama',
    director: 'Arthur Miller Jr.',
    rating: 9.2,
    posterBg: 'from-emerald-950 via-slate-900 to-neutral-950',
    posterIcon: 'Scale',
    sampleReview: 'A gripping, intellectually rigorous legal drama with powerhouse performances. The climactic cross-examination sequence is sheer cinematic perfection.',
    actualSentiment: 'Positive',
    confidence: 98
  },
  {
    id: 'mv-6',
    title: 'Laughter Therapy',
    year: 2024,
    genre: 'Comedy',
    director: 'Maya Brooks',
    rating: 5.1,
    posterBg: 'from-yellow-950 via-slate-900 to-stone-900',
    posterIcon: 'Laugh',
    sampleReview: 'A few laugh-out-loud moments early on, but the humor quickly devolves into juvenile slapstick and tired gags. An uneven comedy that runs out of steam.',
    actualSentiment: 'Negative',
    confidence: 85
  }
];

export const INITIAL_ANALYTICS_HISTORY: AnalysisResult[] = [
  {
    id: 'demo-1',
    movieTitle: 'Interstellar Odyssey',
    genre: 'Sci-Fi',
    reviewText: 'An absolute cinematic masterpiece! The emotional depth paired with breathtaking visuals and Hans Zimmer\'s mesmerizing score left me speechless in the theater.',
    sentiment: 'Positive',
    confidence: 96,
    polarityScore: 0.88,
    subjectivityScore: 0.82,
    summary: 'The reviewer praises the film as an emotional and visual masterpiece with an extraordinary musical score.',
    keyPhrases: [
      { text: 'cinematic masterpiece', sentiment: 'positive', weight: 0.95 },
      { text: 'breathtaking visuals', sentiment: 'positive', weight: 0.9 },
      { text: 'mesmerizing score', sentiment: 'positive', weight: 0.88 },
      { text: 'speechless', sentiment: 'positive', weight: 0.75 }
    ],
    aspects: [
      { aspect: 'Acting & Cast', sentiment: 'Positive', score: 0.85 },
      { aspect: 'Direction & Pacing', sentiment: 'Positive', score: 0.9 },
      { aspect: 'Plot & Screenplay', sentiment: 'Positive', score: 0.8 },
      { aspect: 'Cinematography & Visuals', sentiment: 'Positive', score: 0.98 },
      { aspect: 'Soundtrack & Audio', sentiment: 'Positive', score: 0.95 }
    ],
    emotions: { joy: 92, excitement: 88, sadness: 25, disappointment: 5, suspense: 60 },
    tokenMetrics: { totalTokens: 38, wordCount: 30, characterCount: 198, cleanWordCount: 18, readingTimeSeconds: 9, lexicalDiversity: 0.86 },
    modelUsed: 'gemini-3.8-flash (Demo Record)',
    timestamp: '2026-10-12T10:15:00.000Z',
    source: 'demo'
  },
  {
    id: 'demo-2',
    movieTitle: 'Shadows of the Night',
    genre: 'Thriller',
    reviewText: 'A profoundly disappointing mess. What could have been an intriguing premise was ruined by amateurish pacing, cardboard characters, and jarring plot holes. The dialogue felt wooden and the climax was utterly predictable.',
    sentiment: 'Negative',
    confidence: 94,
    polarityScore: -0.84,
    subjectivityScore: 0.78,
    summary: 'A scathing review criticizing terrible pacing, cardboard characterization, and predictable plot execution.',
    keyPhrases: [
      { text: 'profoundly disappointing', sentiment: 'negative', weight: 0.92 },
      { text: 'amateurish pacing', sentiment: 'negative', weight: 0.85 },
      { text: 'wooden dialogue', sentiment: 'negative', weight: 0.8 },
      { text: 'utterly predictable', sentiment: 'negative', weight: 0.88 }
    ],
    aspects: [
      { aspect: 'Acting & Cast', sentiment: 'Negative', score: -0.75 },
      { aspect: 'Direction & Pacing', sentiment: 'Negative', score: -0.85 },
      { aspect: 'Plot & Screenplay', sentiment: 'Negative', score: -0.9 },
      { aspect: 'Cinematography & Visuals', sentiment: 'Neutral', score: 0.1 },
      { aspect: 'Soundtrack & Audio', sentiment: 'Not Mentioned', score: 0.0 }
    ],
    emotions: { joy: 5, excitement: 10, sadness: 45, disappointment: 90, suspense: 30 },
    tokenMetrics: { totalTokens: 42, wordCount: 34, characterCount: 226, cleanWordCount: 20, readingTimeSeconds: 10, lexicalDiversity: 0.88 },
    modelUsed: 'gemini-3.8-flash (Demo Record)',
    timestamp: '2026-10-12T09:40:00.000Z',
    source: 'demo'
  },
  {
    id: 'demo-3',
    movieTitle: 'The Clockmaker\'s Secret',
    genre: 'Drama',
    reviewText: 'Visually gorgeous with impeccable costume design and stellar performances from the lead cast. However, the second act drags significantly and the screenplay struggles to resolve its ambitious subplots.',
    sentiment: 'Neutral',
    confidence: 82,
    polarityScore: 0.08,
    subjectivityScore: 0.65,
    summary: 'The reviewer offers a balanced review, praising technical craftsmanship and acting while noting narrative drag.',
    keyPhrases: [
      { text: 'visually gorgeous', sentiment: 'positive', weight: 0.85 },
      { text: 'stellar performances', sentiment: 'positive', weight: 0.82 },
      { text: 'drags significantly', sentiment: 'negative', weight: 0.75 },
      { text: 'struggles to resolve', sentiment: 'negative', weight: 0.7 }
    ],
    aspects: [
      { aspect: 'Acting & Cast', sentiment: 'Positive', score: 0.8 },
      { aspect: 'Direction & Pacing', sentiment: 'Negative', score: -0.5 },
      { aspect: 'Plot & Screenplay', sentiment: 'Negative', score: -0.4 },
      { aspect: 'Cinematography & Visuals', sentiment: 'Positive', score: 0.9 },
      { aspect: 'Soundtrack & Audio', sentiment: 'Not Mentioned', score: 0.0 }
    ],
    emotions: { joy: 40, excitement: 35, sadness: 20, disappointment: 35, suspense: 40 },
    tokenMetrics: { totalTokens: 35, wordCount: 28, characterCount: 195, cleanWordCount: 16, readingTimeSeconds: 8, lexicalDiversity: 0.89 },
    modelUsed: 'gemini-3.8-flash (Demo Record)',
    timestamp: '2026-10-12T08:15:00.000Z',
    source: 'demo'
  },
  {
    id: 'demo-4',
    movieTitle: 'Cybernetic Echoes',
    genre: 'Action',
    reviewText: 'Explosive, high-octane fun! The choreography is razor-sharp and the sound design punches through your chest. Not a profound story, but pure adrenaline from start to finish.',
    sentiment: 'Positive',
    confidence: 91,
    polarityScore: 0.76,
    subjectivityScore: 0.70,
    summary: 'The reviewer loves the visceral action and sound design, appreciating it as an effective high-energy blockbuster.',
    keyPhrases: [
      { text: 'high-octane fun', sentiment: 'positive', weight: 0.88 },
      { text: 'razor-sharp choreography', sentiment: 'positive', weight: 0.85 },
      { text: 'punches through', sentiment: 'positive', weight: 0.75 }
    ],
    aspects: [
      { aspect: 'Acting & Cast', sentiment: 'Neutral', score: 0.2 },
      { aspect: 'Direction & Pacing', sentiment: 'Positive', score: 0.85 },
      { aspect: 'Plot & Screenplay', sentiment: 'Neutral', score: 0.0 },
      { aspect: 'Cinematography & Visuals', sentiment: 'Positive', score: 0.88 },
      { aspect: 'Soundtrack & Audio', sentiment: 'Positive', score: 0.92 }
    ],
    emotions: { joy: 75, excitement: 95, sadness: 5, disappointment: 10, suspense: 70 },
    tokenMetrics: { totalTokens: 36, wordCount: 29, characterCount: 182, cleanWordCount: 17, readingTimeSeconds: 9, lexicalDiversity: 0.89 },
    modelUsed: 'gemini-3.8-flash (Demo Record)',
    timestamp: '2026-10-12T07:50:00.000Z',
    source: 'demo'
  },
  {
    id: 'demo-5',
    movieTitle: 'The Haunting of Hollow Peak',
    genre: 'Horror',
    reviewText: 'Utterly lifeless and boring. It fails on every fundamental horror metric: zero tension, absurd character decisions, and an ending so lazy it feels like an insult to paying audiences.',
    sentiment: 'Negative',
    confidence: 97,
    polarityScore: -0.92,
    subjectivityScore: 0.85,
    summary: 'The reviewer strongly condemns the horror film for lack of tension, poor writing, and an offensive ending.',
    keyPhrases: [
      { text: 'utterly lifeless', sentiment: 'negative', weight: 0.95 },
      { text: 'zero tension', sentiment: 'negative', weight: 0.9 },
      { text: 'absurd decisions', sentiment: 'negative', weight: 0.8 },
      { text: 'lazy ending', sentiment: 'negative', weight: 0.92 }
    ],
    aspects: [
      { aspect: 'Acting & Cast', sentiment: 'Negative', score: -0.7 },
      { aspect: 'Direction & Pacing', sentiment: 'Negative', score: -0.9 },
      { aspect: 'Plot & Screenplay', sentiment: 'Negative', score: -0.95 },
      { aspect: 'Cinematography & Visuals', sentiment: 'Negative', score: -0.5 },
      { aspect: 'Soundtrack & Audio', sentiment: 'Negative', score: -0.4 }
    ],
    emotions: { joy: 2, excitement: 5, sadness: 30, disappointment: 96, suspense: 10 },
    tokenMetrics: { totalTokens: 37, wordCount: 29, characterCount: 191, cleanWordCount: 18, readingTimeSeconds: 9, lexicalDiversity: 0.86 },
    modelUsed: 'gemini-3.8-flash (Demo Record)',
    timestamp: '2026-10-12T06:30:00.000Z',
    source: 'demo'
  }
];

export const SAMPLE_CSV_DATA = `movie_title,genre,review_text
The Quantum Paradox,Sci-Fi,"A mind-bending spectacle with groundbreaking theoretical concepts and stunning cinematography. Highly recommended!"
Midnight Carnival,Horror,"A dreadful catastrophe. Incoherent storyline, awful acting, and zero scares whatsoever."
Love in Tuscany,Romance,"A sweet, comforting romantic comedy with charming performances and picturesque vineyard scenery."
The Heist of 1989,Thriller,"Taut and suspenseful with clever twists, though the middle section slows down noticeably."
Giggle Factory,Comedy,"Failed to produce a single laugh. Unbearably annoying characters and tired old jokes."
Chrono Warriors,Action,"Mindless action with spectacular visual effects. Great popcorn entertainment if you turn your brain off."
The Lost Pianist,Drama,"A deeply moving portrait of artistic sacrifice with an Oscar-worthy performance from the lead."
Alien Abyss,Sci-Fi,"Plagiarizes better movies without contributing anything new. Predictable and thoroughly dull."`;
