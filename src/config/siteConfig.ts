import type { ProofDrawerConfig, SiteConfig } from '../types/siteConfig';
import { getTypographySystemForTheme } from '../utils/textEffects';

function getProofDrawerDefaults(): ProofDrawerConfig {
  return {
    enabled: true,
    label: 'Proof file',
    title: 'Evidence slots',
    description: 'A slot stays marked as missing until a real artifact or reference is attached.',
    items: [
      { id: 'architecture', label: 'Architecture notes', description: 'Boundaries, services, and state flow.', status: 'placeholder', href: '', icon: 'flow', order: 0 },
      { id: 'diagram', label: 'System diagram', description: 'A map of the machinery when it is ready to inspect.', status: 'placeholder', href: '', icon: 'system', order: 1 },
      { id: 'commits', label: 'Commit references', description: 'Implementation history without manufactured receipts.', status: 'placeholder', href: '', icon: 'trace', order: 2 },
      { id: 'tests', label: 'Behavior checks', description: 'Tests, edge cases, and failure-path coverage.', status: 'placeholder', href: '', icon: 'proof', order: 3 },
      { id: 'failure-modes', label: 'Failure modes', description: 'The cases the system is expected to survive.', status: 'placeholder', href: '', icon: 'warning', order: 4 },
      { id: 'constraints', label: 'Production constraints', description: 'Scale, latency, and operational boundaries.', status: 'placeholder', href: '', icon: 'status', order: 5 },
    ],
  };
}

export function getDefaultConfig(): SiteConfig {
  return {
    _version: 1,
    _lastModified: null,

    identity: {
      name: 'Aryan Sharma',
      handle: '@aryanteddys',
      roleLines: [
        'AI-native media systems',
        'Full-stack cloud + automation',
        'Proof-first production systems',
      ],
      location: 'India',
      email: 'aryanteddys@gmail.com',
      shortBio: 'I build AI-native media systems that are cinematic on the surface and traceable underneath.',
      heroStatement: 'AI-native media systems, built like production infrastructure and directed with taste.',
      heroStatementDirect: 'Full-stack engineering for media automation, AI workflows, cloud infra, observability, rendering, and review surfaces.',
      heroKicker: 'PROOF-FIRST MEDIA SYSTEMS',
      brandSubtitle: 'systems / media / AI',
      brandGlyph: 'AS',
      ctaPrimary: { text: 'Inspect Case Files', href: '#systems-built' },
      ctaSecondary: { text: 'Email Aryan', href: '#open-channel' },
      metadata: {
        trace_id: 'aryan.sharma',
        mode: 'nocturnal_builder',
        origin: 'India',
        handle: '@aryanteddys',
        stack: 'full-stack / cloud / ai / media',
        signal: 'proof_over_vibes',
      },
      portraitCaption: { label: 'visual_id', value: 'cold_light / field_signal' },
      portraitAlt: 'Aryan Sharma in cold outdoor light wearing winter layers and sunglasses.',
    },

    sections: [
      { id: 'trace-begins', sectionId: 'trace_begins', signal: 'cold_boot', proofLevel: 'identity', systemStatus: 'awake', type: 'hero', title: 'Hero', kicker: 'PROOF-FIRST MEDIA SYSTEMS', visible: true, order: 0, animationStyle: 'reveal', backgroundIntensity: 1.0 },
      { id: 'identity', sectionId: 'not_template_developer', signal: 'anti_template', proofLevel: 'positioning', systemStatus: 'clear', type: 'statement', title: 'Identity Statement', kicker: 'IDENTITY', railLabel: 'not_a_template_developer', visible: true, order: 1, animationStyle: 'reveal', backgroundIntensity: 1.0, bodyAtmospheric: 'I build AI-native media systems that can be inspected, operated, and trusted. The mood is cinematic; the work is traceable.', bodyDirect: 'Full-stack engineering for media automation, AI workflows, cloud infrastructure, observability, and production-grade interfaces.' },
      { id: 'signal-profile', sectionId: 'signal_profile', signal: 'identity_diagnostic', proofLevel: 'personal', systemStatus: 'calibrated', type: 'signal-profile', title: 'Signal Profile', kicker: 'WORKING STYLE', icon: 'signal', railLabel: 'diagnostic', heading: 'How I work when the problem is still unclear.', visible: true, order: 2, animationStyle: 'reveal', backgroundIntensity: 1.0 },
      { id: 'systems-built', sectionId: 'systems_built', signal: 'case_files', proofLevel: 'high', systemStatus: 'inspectable', type: 'projects', title: 'Systems Built', kicker: 'SYSTEMS BUILT', railLabel: 'case_files', heading: 'Inspectable systems, not project tiles.', descriptionAtmospheric: 'Each case file shows the problem, system shape, stack, proof themes, and what the build proves.', descriptionDirect: 'Case files for AI media automation and controlled AI creative production.', visible: true, order: 3, animationStyle: 'reveal', backgroundIntensity: 1.0 },
      { id: 'proof-layer', sectionId: 'proof_layer', signal: 'receipts_not_vibes', proofLevel: 'black_box', systemStatus: 'recording', type: 'proof', title: 'Proof Layer', kicker: 'PROOF LAYER', railLabel: 'receipts_not_vibes', heading: 'Reliability rules I build around.', descriptionAtmospheric: 'The principles that keep media and AI systems useful when jobs fail, retry, render, or drift.', descriptionDirect: 'Idempotency, observability, render parity, state machines, golden-thread tracing, and tests.', visible: true, order: 4, animationStyle: 'reveal', backgroundIntensity: 1.0 },
      { id: 'anti-patterns', sectionId: 'anti_patterns', signal: 'refusal_list', proofLevel: 'taste', systemStatus: 'enforced', type: 'anti-patterns', title: 'Anti-Patterns', kicker: 'ANTI-PATTERNS', icon: 'warning', railLabel: 'things_i_avoid', heading: 'Things I do not ship on purpose.', visible: false, order: 5, animationStyle: 'reveal', backgroundIntensity: 1.0 },
      { id: 'stack', sectionId: 'stack_clusters', signal: 'tools_with_context', proofLevel: 'practical', systemStatus: 'available', type: 'stack', title: 'Stack', kicker: 'STACK', railLabel: 'tools_i_think_with', heading: 'Tools grouped by the pressure they solve.', descriptionAtmospheric: 'A stack map organized by system responsibility, not logo collecting.', descriptionDirect: 'Interface, backend, cloud, media, AI, and reliability clusters.', visible: true, order: 6, animationStyle: 'reveal', backgroundIntensity: 1.0 },
      { id: 'field-notes', sectionId: 'field_notes', signal: 'build_floor_fragments', proofLevel: 'working_notes', systemStatus: 'collecting', type: 'field-notes', title: 'Field Notes', kicker: 'FIELD NOTES', icon: 'log', railLabel: 'fragments_from_the_floor', heading: 'Small notes from systems that refused to stay simple.', visible: false, order: 7, animationStyle: 'reveal', backgroundIntensity: 1.0 },
      { id: 'philosophy', sectionId: 'operating_principles', signal: 'manifesto', proofLevel: 'values', systemStatus: 'stable', type: 'philosophy', title: 'Philosophy', kicker: 'PHILOSOPHY', railLabel: 'operating_principles', visible: true, order: 8, animationStyle: 'reveal', backgroundIntensity: 1.0 },
      { id: 'operating-manual', sectionId: 'operating_manual', signal: 'collaboration_protocol', proofLevel: 'practical', systemStatus: 'readable', type: 'operating-manual', title: 'Operating Manual', kicker: 'OPERATING MANUAL', icon: 'person', railLabel: 'how_to_work_with_me', heading: 'Useful defaults for working together.', visible: false, order: 9, animationStyle: 'reveal', backgroundIntensity: 1.0 },
      { id: 'human-layer', sectionId: 'weather_inside_machine', signal: 'human_layer', proofLevel: 'subtle', systemStatus: 'breathing', type: 'human', title: 'Human Layer', kicker: 'HUMAN LAYER', railLabel: 'weather_inside_machine', heading: 'A colder signal, still human.', descriptionAtmospheric: 'Night, rain, blue light, sport, fiction, and dry humor. Texture, not a personality maze.', descriptionDirect: 'Personal motifs that shape the interface without replacing the proof.', visible: true, order: 10, animationStyle: 'reveal', backgroundIntensity: 1.0 },
      { id: 'build-log', sectionId: 'build_log', signal: 'timeline', proofLevel: 'receipts', systemStatus: 'indexed', type: 'timeline', title: 'Build Log', kicker: 'BUILD LOG', railLabel: 'timeline', heading: 'Recent build trace.', visible: true, order: 11, animationStyle: 'reveal', backgroundIntensity: 1.0 },
      { id: 'open-channel', sectionId: 'open_channel', signal: 'contact', proofLevel: 'direct', systemStatus: 'listening', type: 'contact', title: 'Contact', kicker: 'CONTACT', heading: 'Need an AI media system that has to work in production?', visible: true, order: 12, animationStyle: 'reveal', backgroundIntensity: 1.0 },
    ],

    signalProfile: {
      enabled: true,
      sectionLabel: 'Working style',
      title: 'How I work when the problem is still unclear.',
      description: 'How I move from ambiguous stakes to a system someone can inspect.',
      items: [
        { id: 'ambiguity', label: 'Ambiguity', description: 'Vague pressure becomes structure, owners, and next actions.', visible: true, order: 0, icon: 'trace' },
        { id: 'confidence', label: 'Confidence', description: 'Earn it with proofs, not volume.', visible: true, order: 1, icon: 'proof' },
        { id: 'taste', label: 'Taste', description: 'Make the interface feel calm, then prove the behavior.', visible: true, order: 2, icon: 'spark' },
        { id: 'evidence', label: 'Traceability', description: 'Leave logs, states, and receipts behind.', visible: true, order: 3, icon: 'status' },
        { id: 'humor', label: 'Human signal', description: 'Dry humor, carefully rate-limited.', visible: true, order: 4, icon: 'terminal' },
      ],
    },

    antiPatterns: {
      enabled: true,
      sectionLabel: 'Refusals',
      title: 'What I avoid shipping.',
      description: 'The refusal list keeps taste measurable.',
      items: [
        { id: 'fragile-demos', label: 'Fragile demos', description: 'Demos that collapse under real users.', visible: true, order: 0, icon: 'warning' },
        { id: 'empty-polish', label: 'Empty polish', description: 'Pretty screens with no system underneath.', visible: true, order: 1, icon: 'layout' },
        { id: 'ai-wrappers', label: 'AI wrappers', description: 'Prompt windows pretending to be products.', visible: true, order: 2, icon: 'ai' },
        { id: 'hidden-failures', label: 'Hidden failures', description: 'Failure states that disappear instead of explaining themselves.', visible: true, order: 3, icon: 'error' },
        { id: 'untraceable-jobs', label: 'Untraceable jobs', description: 'Async work with no trail, owner, or answer.', visible: true, order: 4, icon: 'trace' },
        { id: 'corporate-fog', label: 'Corporate fog', description: 'Language that consumes space and says nothing.', visible: true, order: 5, icon: 'terminal' },
      ],
    },

    fieldNotes: {
      enabled: true,
      sectionLabel: 'Field notes',
      title: 'Notes from the build floor.',
      description: 'Short fragments from systems that refused to stay simple.',
      items: [
        { id: 'retry-cost', label: 'note_01', description: 'A retry is not safe until duplicate cost is impossible.', visible: true, order: 0, icon: 'sync' },
        { id: 'preview-promise', label: 'note_02', description: 'A preview is a promise. The render should keep it.', visible: true, order: 1, icon: 'media' },
        { id: 'missing-job', label: 'note_03', description: 'If a job disappears, the system should know where it went.', visible: true, order: 2, icon: 'trace' },
        { id: 'logs', label: 'note_04', description: 'Logs are not decoration. They are the crime scene tape.', visible: true, order: 3, icon: 'log' },
        { id: 'calm-ui', label: 'note_05', description: 'The best UI makes the machine feel calm.', visible: true, order: 4, icon: 'layout' },
      ],
    },

    operatingManual: {
      enabled: true,
      sectionLabel: 'Collaboration',
      title: 'How to work with me.',
      description: 'Defaults for founders, teams, and collaborators deciding what to hand over.',
      items: [
        { id: 'real-problem', label: 'problem framing', description: 'Give me the real problem, not just the ticket.', visible: true, order: 0, icon: 'problem' },
        { id: 'ownership', label: 'ownership', description: 'I work best with clear stakes and room to own the outcome.', visible: true, order: 1, icon: 'work' },
        { id: 'feedback', label: 'feedback', description: 'Direct feedback beats polite confusion.', visible: true, order: 2, icon: 'signal' },
        { id: 'verification', label: 'verification', description: 'I like proving behavior with tests, logs, and working demos.', visible: true, order: 3, icon: 'proof' },
        { id: 'certainty', label: 'communication', description: 'I can explain the system without faking certainty.', visible: true, order: 4, icon: 'person' },
        { id: 'experience', label: 'finish line', description: 'The final user experience still counts as engineering.', visible: true, order: 5, icon: 'spark' },
      ],
    },

    builderModes: {
      enabled: true,
      sectionLabel: 'Project lenses',
      title: 'Two views. One case file.',
      description: 'Story names the stakes. System opens the machinery.',
      modes: [
        { id: 'story', label: 'Story', description: 'Problem, stakes, product feel, and what changed.', icon: 'story' },
        { id: 'system', label: 'System', description: 'Architecture, workers, retries, state, rendering, and failure behavior.', icon: 'system' },
      ],
    },

    projects: [
      {
        id: 'seone', name: 'SEONE', caseNumber: '01', type: 'AI-native media automation pipeline', featured: true, status: 'active', confidenceLabel: 'high',
        storyDescription: ['SEONE turns long-form video into social-ready assets without treating media automation like a prompt and a spinner.', 'The important part is the trace: every download, transcript, analysis, render, worker, queue, and asset keeps a job trail.'],
        systemDescription: 'Distributed workers, queues, leases, heartbeats, golden-thread job IDs, render parity, structured logs, health probes, and observable execution.',
        systemFlow: ['ingest', 'transcribe', 'analyze', 'render'],
        problem: 'Long-form video workflows break when every step is a manual edit instead of a traceable, recoverable pipeline.',
        system: 'A staged media pipeline: ingest -> transcribe -> analyze -> render, backed by workers, queues, storage, and job trails.',
        stack: 'Azure Container Apps, KEDA, Azure Blob Storage, Redis, serverless GPUs, T4 GPUs, FFmpeg, Vercel, structured logging, Prometheus, health probes.',
        proofThemes: 'Distributed workers, queue systems, lease tokens, heartbeats, golden-thread job IDs, render parity, observability.',
        shows: 'Aryan can reason across media, backend orchestration, infra, state, and the reliability work that makes automation credible.',
        links: {},
        proofDrawer: getProofDrawerDefaults(),
      },
      {
        id: 'content-lab', name: 'CONTENT LAB', caseNumber: '02', type: 'AI-native creative production system', featured: true, status: 'active', confidenceLabel: 'high',
        storyDescription: ['Content Lab treats creative generation like a production system, not a prompt window.', 'It plans, respects brand constraints, verifies output, and prepares assets for review and export.'],
        systemDescription: 'Provider abstraction, state-machine validation, idempotency, sequential carousel generation, outbox reliability, and brand consistency contracts.',
        systemFlow: ['intent', 'planning', 'brand contract', 'generation', 'verification', 'review/export'],
        problem: 'AI creative output often collapses under brand consistency, multi-page sequencing, and production review.',
        system: 'intent -> planning -> brand contract -> generation -> verification -> review/export, with validation at the boundaries.',
        stack: 'Gemini-family models, Google Nano Banana Pro, provider abstraction, Pydantic, Firestore, Pub/Sub, outbox pattern, state-machine validation.',
        proofThemes: 'Idempotency, state transitions, sequential carousel generation, brand consistency, provider abstraction.',
        shows: 'Aryan can turn AI generation into a governed product workflow with contracts, state, review surfaces, and production semantics.',
        links: {},
        proofDrawer: getProofDrawerDefaults(),
      },
    ],

    tasteLayer: {
      enabled: true,
      sectionLabel: 'visual_taste',
      title: 'Visual taste',
      description: 'Details should feel discovered, not announced.',
      items: [
        { id: 'cold-light', label: 'cold light', description: 'clear edges / low noise', visible: true, order: 0, icon: 'spark' },
        { id: 'quiet-interfaces', label: 'quiet interfaces', description: 'calm surfaces / visible machinery', visible: true, order: 1, icon: 'layout' },
        { id: 'night-skies', label: 'night skies', description: 'scale without spectacle', visible: true, order: 2, icon: 'signal' },
        { id: 'system-diagrams', label: 'system diagrams', description: 'structure worth inspecting', visible: true, order: 3, icon: 'system' },
      ],
    },

    controlRoomModules: {
      title: 'Control Room',
      description: 'Edit the live identity system without guessing where each setting lives.',
      items: [
        { id: 'theme-controls', title: 'Theme engine', description: 'Tune themes, typography, color, background, motion, and layout.', status: 'online', targetPanel: 'theme', href: '', visible: true, order: 0, icon: 'theme' },
        { id: 'proof-files', title: 'Proof drawers', description: 'Attach real artifacts and keep missing evidence clearly marked.', status: 'ready', targetPanel: 'projects', href: '', visible: true, order: 1, icon: 'proof' },
        { id: 'identity-layer', title: 'Working style', description: 'Edit diagnostics, refusals, field notes, collaboration defaults, and taste.', status: 'ready', targetPanel: 'identity-layer', href: '', visible: true, order: 2, icon: 'signal' },
        { id: 'site-settings', title: 'Site structure', description: 'Control section order, visibility, metadata, and navigation.', status: 'online', targetPanel: 'sections', href: '', visible: true, order: 3, icon: 'settings' },
        { id: 'resume', title: 'Resume', description: 'Open the current resume asset.', status: 'attached', targetPanel: '', href: '/Aryan_Sharma_Resume.pdf', visible: true, order: 4, icon: 'resume' },
        { id: 'now-building', title: 'Now building', description: 'Proof-first identity systems, AI-native workflows, and calmer interfaces.', status: 'current', targetPanel: '', href: '', visible: true, order: 5, icon: 'current' },
      ],
    },

    proofCards: [
      { id: 'idempotency', index: '01', title: 'Idempotency', description: 'Retries should not become duplicates.', accentColor: null, visible: true, order: 0 },
      { id: 'observability', index: '02', title: 'Observability', description: 'Logs, metrics, and health checks make production inspectable.', accentColor: null, visible: true, order: 1 },
      { id: 'render-parity', index: '03', title: 'Render parity', description: 'Preview and final output should match.', accentColor: null, visible: true, order: 2 },
      { id: 'state-machines', index: '04', title: 'State machines', description: 'Vibes are not a transition rule.', accentColor: null, visible: true, order: 3 },
      { id: 'golden-threads', index: '05', title: 'Golden threads', description: 'Every job needs a trail.', accentColor: null, visible: true, order: 4 },
      { id: 'tests-before-code', index: '06', title: 'Tests before code', description: 'Correctness first. Implementation second.', accentColor: null, visible: true, order: 5 },
    ],

    skillGroups: [
      { id: 'interface', name: 'Interface', description: 'React, React Native, responsive UI, visual editors, clean hierarchy.', skills: ['React', 'React Native', 'responsive UI', 'visual editors', 'clean hierarchy'], displayStyle: 'matrix', order: 0 },
      { id: 'backend', name: 'Backend', description: 'Java, Spring Boot, Python, APIs, Pydantic, validation.', skills: ['Java', 'Spring Boot', 'Python', 'APIs', 'Pydantic', 'validation'], displayStyle: 'matrix', order: 1 },
      { id: 'cloud-infra', name: 'Cloud/Infra', description: 'Azure, Container Apps, Blob Storage, Redis, KEDA, Vercel.', skills: ['Azure', 'Azure Container Apps', 'Blob Storage', 'Redis', 'KEDA', 'Vercel'], displayStyle: 'matrix', order: 2 },
      { id: 'media-systems', name: 'Media Systems', description: 'FFmpeg, overlays, rendering, VFR/CFR handling, preview/render parity.', skills: ['FFmpeg', 'overlays', 'rendering', 'VFR/CFR handling', 'preview/render parity'], displayStyle: 'matrix', order: 3 },
      { id: 'ai-systems', name: 'AI Systems', description: 'Gemini, Google Nano Banana Pro, AI orchestration, provider abstraction, prompt control.', skills: ['Gemini', 'Google Nano Banana Pro', 'AI orchestration', 'provider abstraction', 'prompt control'], displayStyle: 'matrix', order: 4 },
      { id: 'reliability', name: 'Reliability', description: 'Queues, leases, heartbeats, idempotency, logs, Prometheus, health probes.', skills: ['queues', 'lease tokens', 'heartbeats', 'idempotency', 'structured logs', 'Prometheus', 'health probes'], displayStyle: 'matrix', order: 5 },
    ],

    philosophy: [
      { id: 'p1', text: 'Proof over vibes.', intensity: 'sharp', largeType: true, order: 0 },
      { id: 'p2', text: 'First principles before frameworks.', intensity: 'sharp', largeType: true, order: 1 },
      { id: 'p3', text: 'Systems should be traceable, editable, recoverable.', intensity: 'quiet', largeType: true, order: 2 },
      { id: 'p4', text: 'Products win on stage. Agents stay backstage.', intensity: 'quiet', largeType: true, order: 3 },
      { id: 'p5', text: 'No corporate fog. No fake certainty.', intensity: 'loud', largeType: true, order: 4 },
    ],

    humanLayer: {
      glitchesSectionLabel: 'human_glitches',
      glitchesTitle: 'Small calibrations',
      motifs: [
        { id: 'm1', text: 'night rain', symbol: '', visible: true, order: 0 },
        { id: 'm2', text: 'cold blue light', symbol: '', visible: true, order: 1 },
        { id: 'm3', text: 'skylines', symbol: '', visible: true, order: 2 },
        { id: 'm4', text: 'space and mysteries', symbol: '', visible: true, order: 3 },
        { id: 'm5', text: 'basketball / gymnastics', symbol: '', visible: true, order: 4 },
        { id: 'm6', text: 'dry humor', symbol: '', visible: true, order: 5 },
      ],
      glitches: [
        { id: 'basketball', label: 'basketball', description: 'gave me tempo', visible: true, order: 0, icon: 'status' },
        { id: 'gymnastics', label: 'gymnastics', description: 'gave me body control', visible: true, order: 1, icon: 'motion' },
        { id: 'friends', label: 'friends', description: 'gave me defensive humor', visible: true, order: 2, icon: 'person' },
        { id: 'space', label: 'space', description: 'made scale feel normal', visible: true, order: 3, icon: 'spark' },
        { id: 'rain-night', label: 'rain / night', description: 'make thinking easier', visible: true, order: 4, icon: 'signal' },
      ],
    },

    timeline: [
      { id: 't1', date: '2023.03 -> 2023.06', title: 'IBM Full Stack Software Developer Certificate', description: '', tags: ['certification'], visible: true, order: 0 },
      { id: 't2', date: '2025.11', title: 'Joined Creativefuel as Full Stack Developer', description: '', tags: ['work'], visible: true, order: 1 },
      { id: 't3', date: '2025.11 -> 2026.04', title: 'Built across AI automation, media systems, cloud infra, frontend tooling, and observability', description: '', tags: ['work', 'systems'], visible: true, order: 2 },
      { id: 't4', date: '2026', title: 'Rebuilding public identity around proof, systems, and taste', description: '', tags: ['identity'], visible: true, order: 3 },
    ],

    contact: {
      email: 'aryanteddys@gmail.com', handle: '@aryanteddys', location: 'India',
      ctaText: 'Email Aryan', ctaLink: 'mailto:aryanteddys@gmail.com',
      resumeLink: 'Aryan_Sharma_Resume.pdf', resumeLabel: 'View Resume',
      githubLink: '', linkedinLink: '', socialLinks: [],
      customLinks: [{ label: 'Inspect Case Files', href: '#systems-built' }],
    },

    typography: {
      displayFont: '"Space Grotesk", "Inter", "Segoe UI", sans-serif',
      bodyFont: '"Inter", "Geist", "Segoe UI", sans-serif',
      monoFont: '"JetBrains Mono", "IBM Plex Mono", "SFMono-Regular", Consolas, monospace',
      baseFontSize: '16px', headingScale: 1.0, lineHeight: 1.6, letterSpacing: '0',
      headingWeight: 700, bodyWeight: 400, sectionLabelStyle: 'uppercase',
      typeXs: '0.75rem', typeSm: '0.875rem', typeBase: '1rem', typeMd: '1.125rem',
      typeLg: '1.5rem', typeXl: '2rem', type2xl: 'clamp(2.5rem, 5vw, 4.5rem)',
      typeDisplay: 'clamp(4rem, 10.5vw, 8.5rem)',
    },

    typographySystem: getTypographySystemForTheme('nocturnal-signal'),

    colors: {
      bg: '#05070d', bgSecondary: '#0b111c', panel: '#101826',
      text: '#eaf0ff', textSecondary: '#aab4c8', textMuted: '#758197',
      accent: '#2f6bff', accentSecondary: '#5debff', accentEmotional: '#8b5cf6', accentProof: '#ff3b5c',
      border: '#1e2a3d', borderSubtle: '#142033', borderStrong: '#2e3f5c',
      glow: '#5debff', selection: '#5debff',
    },

    background: {
      enabled: true, dotSize: 1, dotSpacing: 34, dotOpacity: 0.045, dotRevealOpacity: 0.11,
      dotFieldOpacity: 0.52, radialGlowColor: '#5debff', radialGlowOpacity: 0.055,
      radialGlowSize: 28, radialGlowBlur: 44, radialGlowColor2: '#2f6bff',
      radialGlowOpacity2: 0.08, animationSpeed: 56, animationIntensity: 0.55,
      vignetteOpacity: 0.88, noiseOpacity: 0,
    },

    motion: {
      enabled: true, reducedMotion: false, revealType: 'translateY',
      revealDuration: 480, revealDelay: 60, hoverGlowIntensity: 0.55,
      projectExpansionSpeed: 300, commandPaletteEnabled: true,
      scrollParallaxIntensity: 0, cursorBlinkEnabled: true, rainNoiseEnabled: false,
      durationFast: 140, durationStandard: 220, durationSlow: 360,
    },

    layout: {
      maxContentWidth: '1248px', sectionPaddingTop: '112px', sectionPaddingBottom: '112px',
      cardPadding: '24px', gridGap: '16px', borderRadius: '2px', panelBlur: 16,
      navPosition: 'sticky', heroHeight: 'auto', sectionAlignment: 'left',
      densityMode: 'cinematic', headerHeight: '80px',
    },

    seo: {
      pageTitle: 'Aryan Sharma | AI-Native Media Systems',
      metaDescription: 'Aryan Sharma builds AI-native media systems, full-stack cloud automation, and proof-first production interfaces.',
      ogTitle: 'Aryan Sharma | AI-Native Media Systems',
      ogDescription: 'AI-native media systems, full-stack cloud automation, and proof-first production interfaces.',
      ogImage: '', favicon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%2305070D'/%3E%3Crect x='8' y='8' width='48' height='48' fill='%23101826' stroke='%235DEBFF' stroke-width='2'/%3E%3Ctext x='32' y='38' text-anchor='middle' font-family='monospace' font-size='18' font-weight='700' fill='%235DEBFF'%3EAS%3C/text%3E%3C/svg%3E",
      themeColor: '#05070d',
    },

    assets: {
      profileImage: 'assets/aryan-profile.png', resumeFile: 'Aryan_Sharma_Resume.pdf',
      ogImage: '', customLogo: '', projectImages: {}, backgroundTextures: {},
    },

    commandPalette: {
      title: 'Command channel', description: 'Jump to the useful parts.',
      commands: [
        { label: 'View Seone', target: '#systems-built', openProject: 'seone', kbd: '01' },
        { label: 'View Content Lab', target: '#systems-built', openProject: 'content-lab', kbd: '02' },
        { label: 'Show Stack', target: '#stack', openProject: null, kbd: '03' },
        { label: 'Read Philosophy', target: '#philosophy', openProject: null, kbd: '04' },
        { label: 'Contact Aryan', target: '#open-channel', openProject: null, kbd: '05' },
        { label: 'Open Control Room', target: '/control-room', openProject: null, kbd: 'CR' },
      ],
    },

    navigation: [
      { label: 'work', href: '#systems-built' },
      { label: 'proof', href: '#proof-layer' },
      { label: 'stack', href: '#stack' },
      { label: 'contact', href: '#open-channel' },
    ],

    themeEngine: {
      publicSelectorEnabled: false,
    },

    portrait: {
      enabled: true,
      src: 'assets/aryan-profile.png',
      alt: 'Aryan Sharma in cold outdoor light wearing winter layers and sunglasses.',
      placement: 'hero',
      variant: 'cinematic-panel',
      aspectRatio: '4 / 5',
      objectPosition: '52% 50%',
      showMetadata: false,
      metadata: [
        { label: 'trace_id', value: 'aryan.sharma' },
        { label: 'mode', value: 'nocturnal_builder' },
        { label: 'origin', value: 'india' },
        { label: 'signal', value: 'proof_over_vibes' },
      ],
      effects: {
        vignette: 0.34,
        glow: 0.14,
        grain: 0.04,
        hoverLift: false,
        scrollReveal: true,
      },
    },

    loader: {
      enabled: true,
      minimumDuration: 900,
      maxWaitTime: 2500,
      style: 'trace-boot',
      statusVisible: true,
      traceVisible: true,
      themeAware: true,
    },
  };
}
