import type { ProofDrawerConfig, SiteConfig } from '../types/siteConfig';
import { getTypographySystemForTheme } from '../utils/textEffects';

function getProofDrawerDefaults(): ProofDrawerConfig {
  return {
    enabled: true,
    label: 'Open Proof File',
    title: 'Proof slots ready.',
    description: 'Evidence stays visibly incomplete until a real artifact or reference is attached.',
    items: [
      { id: 'architecture', label: 'Add architecture notes', description: 'Document boundaries, services, and state flow.', status: 'placeholder', href: '', icon: 'flow', order: 0 },
      { id: 'diagram', label: 'Add diagram', description: 'Attach a system map when it is ready to inspect.', status: 'placeholder', href: '', icon: 'system', order: 1 },
      { id: 'commits', label: 'Add commit references', description: 'Link implementation history without manufacturing receipts.', status: 'placeholder', href: '', icon: 'trace', order: 2 },
      { id: 'tests', label: 'Add test cases', description: 'Record behavior checks and failure-path coverage.', status: 'placeholder', href: '', icon: 'proof', order: 3 },
      { id: 'failure-modes', label: 'Add failure modes', description: 'List the cases the system is expected to survive.', status: 'placeholder', href: '', icon: 'warning', order: 4 },
      { id: 'constraints', label: 'Add production constraints', description: 'Capture scale, latency, and operational boundaries.', status: 'placeholder', href: '', icon: 'status', order: 5 },
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
        'AI-native media systems builder',
        'Full Stack Developer',
        'AI & Automation Engineer',
      ],
      location: 'India',
      email: 'aryanteddys@gmail.com',
      shortBio: 'I build systems where media, AI, infrastructure, and taste stop being separate departments.',
      heroStatement: 'I build systems where media, AI, infrastructure, and taste stop being separate departments.',
      heroStatementDirect: 'Full-stack, AI automation, cloud infrastructure, observability, and media pipelines.',
      heroKicker: 'THE PROOF OF WORK INTERFACE',
      brandSubtitle: 'proof.interface',
      brandGlyph: 'AS',
      ctaPrimary: { text: 'Inspect Work', href: '#systems-built' },
      ctaSecondary: { text: 'Open Channel', href: '#open-channel' },
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
      { id: 'trace-begins', sectionId: 'trace_begins', signal: 'cold_boot', proofLevel: 'identity', systemStatus: 'awake', type: 'hero', title: 'Hero', kicker: 'THE PROOF OF WORK INTERFACE', visible: true, order: 0, animationStyle: 'reveal', backgroundIntensity: 1.0 },
      { id: 'identity', sectionId: 'not_template_developer', signal: 'anti_template', proofLevel: 'positioning', systemStatus: 'clear', type: 'statement', title: 'Identity Statement', kicker: 'IDENTITY', railLabel: 'not_a_template_developer', visible: true, order: 1, animationStyle: 'reveal', backgroundIntensity: 1.0, bodyAtmospheric: "I'm not interested in looking like another startup landing page wearing a developer badge. I build from first principles, chase traceability, and care about whether the thing survives contact with production.", bodyDirect: 'I build production-minded systems from first principles: traceable, testable, observable, and maintainable.' },
      { id: 'signal-profile', sectionId: 'signal_profile', signal: 'identity_diagnostic', proofLevel: 'personal', systemStatus: 'calibrated', type: 'signal-profile', title: 'Signal Profile', kicker: 'SIGNAL PROFILE', icon: 'signal', railLabel: 'personality_debug', heading: 'A working style, rendered as a diagnostic.', visible: true, order: 2, animationStyle: 'reveal', backgroundIntensity: 1.0 },
      { id: 'systems-built', sectionId: 'systems_built', signal: 'case_files', proofLevel: 'high', systemStatus: 'inspectable', type: 'projects', title: 'Systems Built', kicker: 'SYSTEMS BUILT', railLabel: 'case_files', heading: 'Work as dossiers, not tiles.', descriptionAtmospheric: 'Each project opens as a system record: problem, machinery, stack, proof themes, and what the build demonstrates under pressure.', descriptionDirect: 'Two dossiers: AI media automation and AI creative production.', visible: true, order: 3, animationStyle: 'reveal', backgroundIntensity: 1.0 },
      { id: 'proof-layer', sectionId: 'proof_layer', signal: 'receipts_not_vibes', proofLevel: 'black_box', systemStatus: 'recording', type: 'proof', title: 'Proof Layer', kicker: 'PROOF LAYER', railLabel: 'receipts_not_vibes', heading: 'A black-box inspection panel.', descriptionAtmospheric: 'The rules Aryan trusts when production stops behaving politely.', descriptionDirect: 'Reliability principles used as product and engineering constraints.', visible: true, order: 4, animationStyle: 'reveal', backgroundIntensity: 1.0 },
      { id: 'anti-patterns', sectionId: 'anti_patterns', signal: 'refusal_list', proofLevel: 'taste', systemStatus: 'enforced', type: 'anti-patterns', title: 'Anti-Patterns', kicker: 'ANTI-PATTERNS', icon: 'warning', railLabel: 'things_i_avoid', heading: 'Things I do not ship on purpose.', visible: false, order: 5, animationStyle: 'reveal', backgroundIntensity: 1.0 },
      { id: 'stack', sectionId: 'stack_clusters', signal: 'tools_with_context', proofLevel: 'practical', systemStatus: 'available', type: 'stack', title: 'Stack', kicker: 'STACK', railLabel: 'tools_i_think_with', heading: 'No progress bars. Working surfaces.', descriptionAtmospheric: 'Tools are grouped by the kind of system pressure they help Aryan reason through.', descriptionDirect: 'Interface, backend, cloud, media, AI, and reliability clusters.', visible: true, order: 6, animationStyle: 'reveal', backgroundIntensity: 1.0 },
      { id: 'field-notes', sectionId: 'field_notes', signal: 'build_floor_fragments', proofLevel: 'working_notes', systemStatus: 'collecting', type: 'field-notes', title: 'Field Notes', kicker: 'FIELD NOTES', icon: 'log', railLabel: 'fragments_from_the_floor', heading: 'Small notes from systems that refused to stay simple.', visible: false, order: 7, animationStyle: 'reveal', backgroundIntensity: 1.0 },
      { id: 'philosophy', sectionId: 'operating_principles', signal: 'manifesto', proofLevel: 'values', systemStatus: 'stable', type: 'philosophy', title: 'Philosophy', kicker: 'PHILOSOPHY', railLabel: 'operating_principles', visible: true, order: 8, animationStyle: 'reveal', backgroundIntensity: 1.0 },
      { id: 'operating-manual', sectionId: 'operating_manual', signal: 'collaboration_protocol', proofLevel: 'practical', systemStatus: 'readable', type: 'operating-manual', title: 'Operating Manual', kicker: 'OPERATING MANUAL', icon: 'person', railLabel: 'how_to_work_with_me', heading: 'Useful defaults for working together.', visible: false, order: 9, animationStyle: 'reveal', backgroundIntensity: 1.0 },
      { id: 'human-layer', sectionId: 'weather_inside_machine', signal: 'human_layer', proofLevel: 'subtle', systemStatus: 'breathing', type: 'human', title: 'Human Layer', kicker: 'HUMAN LAYER', railLabel: 'weather_inside_machine', heading: 'Cold weather. Blue light. A little silence.', descriptionAtmospheric: 'I like systems because chaos gets quieter when it has shape. I like night because everything fake loses volume.', descriptionDirect: 'Motifs: rain, night, blue, neon, space, mysteries, skylines, basketball, gymnastics, fiction, dry humor.', visible: true, order: 10, animationStyle: 'reveal', backgroundIntensity: 1.0 },
      { id: 'build-log', sectionId: 'build_log', signal: 'timeline', proofLevel: 'receipts', systemStatus: 'indexed', type: 'timeline', title: 'Build Log', kicker: 'BUILD LOG', railLabel: 'timeline', heading: 'Not a resume timeline. A trace.', visible: true, order: 11, animationStyle: 'reveal', backgroundIntensity: 1.0 },
      { id: 'open-channel', sectionId: 'open_channel', signal: 'contact', proofLevel: 'direct', systemStatus: 'listening', type: 'contact', title: 'Contact', kicker: 'CONTACT / OPEN CHANNEL', heading: 'For AI-native media systems, full-stack cloud engineering, automation, or strange high-leverage product ideas:', visible: true, order: 12, animationStyle: 'reveal', backgroundIntensity: 1.0 },
    ],

    signalProfile: {
      enabled: true,
      sectionLabel: 'personality_debug',
      title: 'A working style, rendered as a diagnostic.',
      description: 'A compact read on how I turn unclear product pressure into inspectable systems.',
      items: [
        { id: 'ambiguity', label: 'input', description: 'ambiguity in / structure out', visible: true, order: 0, icon: 'trace' },
        { id: 'confidence', label: 'confidence', description: 'proof before confidence', visible: true, order: 1, icon: 'proof' },
        { id: 'taste', label: 'taste', description: 'taste matters / behavior matters more', visible: true, order: 2, icon: 'spark' },
        { id: 'evidence', label: 'systems', description: 'leave evidence behind', visible: true, order: 3, icon: 'status' },
        { id: 'humor', label: 'survival tool', description: 'dry humor / carefully rate-limited', visible: true, order: 4, icon: 'terminal' },
      ],
    },

    antiPatterns: {
      enabled: true,
      sectionLabel: 'refusal_list',
      title: 'Things I do not ship on purpose.',
      description: 'Taste is easier to inspect when the refusal list is visible.',
      items: [
        { id: 'fragile-demos', label: 'fragile demos', description: 'Demos that collapse under real users.', visible: true, order: 0, icon: 'warning' },
        { id: 'empty-polish', label: 'empty polish', description: 'Pretty screens with no system underneath.', visible: true, order: 1, icon: 'layout' },
        { id: 'ai-wrappers', label: 'ai wrappers', description: 'Prompt windows pretending to be products.', visible: true, order: 2, icon: 'ai' },
        { id: 'hidden-failures', label: 'hidden failures', description: 'Failure states that disappear instead of explaining themselves.', visible: true, order: 3, icon: 'error' },
        { id: 'untraceable-jobs', label: 'untraceable jobs', description: 'Async work with no trail, owner, or answer.', visible: true, order: 4, icon: 'trace' },
        { id: 'corporate-fog', label: 'corporate fog', description: 'Language that consumes space and says nothing.', visible: true, order: 5, icon: 'terminal' },
      ],
    },

    fieldNotes: {
      enabled: true,
      sectionLabel: 'build_floor_fragments',
      title: 'Small notes from systems that refused to stay simple.',
      description: 'Short fragments. No keynote voice.',
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
      sectionLabel: 'collaboration_protocol',
      title: 'Useful defaults for working together.',
      description: 'For founders, collaborators, and anyone deciding how much ownership to hand over.',
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
      sectionLabel: 'two_lenses',
      title: 'Read each case file in two modes.',
      description: 'Story Mode keeps the stakes legible. System Mode opens the machinery.',
      modes: [
        { id: 'story', label: 'Story Mode', description: 'Problem, stakes, product feel, and what changed.', icon: 'story' },
        { id: 'system', label: 'System Mode', description: 'Architecture, workers, retries, state, rendering, and failure behavior.', icon: 'system' },
      ],
    },

    projects: [
      {
        id: 'seone', name: 'SEONE', caseNumber: '01', type: 'AI-native media automation pipeline', featured: true, status: 'active', confidenceLabel: 'high',
        storyDescription: ['SEONE turns long-form video into short-form, social-ready output without pretending media automation is just a prompt and a progress spinner.', 'The system preserves a job trail across download, transcription, analysis, rendering, workers, queues, storage, and final assets.'],
        systemDescription: 'Built around distributed workers, queue systems, lease tokens, heartbeats, golden-thread job IDs, render parity, structured logging, health probes, and observable execution.',
        systemFlow: ['download', 'transcribe', 'analyze', 'render'],
        problem: 'Long-form video workflows break when every step is treated as a manual edit instead of a traceable, recoverable pipeline.',
        system: 'A staged media system: download -> transcribe -> analyze -> render, with queue-backed workers and a job trail that survives asynchronous execution.',
        stack: 'Azure Container Apps, KEDA, Azure Blob Storage, Redis, serverless GPUs, T4 GPUs, FFmpeg, Vercel, structured logging, Prometheus, health probes.',
        proofThemes: 'Distributed workers, queue systems, lease tokens, heartbeats, golden-thread job IDs, render parity, observability.',
        shows: 'Aryan can reason across media, backend orchestration, infra, state, and the reliability work that makes automation credible.',
        links: {},
        proofDrawer: getProofDrawerDefaults(),
      },
      {
        id: 'content-lab', name: 'CONTENT LAB', caseNumber: '02', type: 'AI-native creative production system', featured: true, status: 'active', confidenceLabel: 'high',
        storyDescription: ['Content Lab treats creative generation like a production system, not a prompt window. It plans, respects brand constraints, verifies output, and prepares assets for review and export.', 'The point is not "AI made an image." The point is controlled variation, layout accuracy, and a system that can keep a brand intact under repeated generation.'],
        systemDescription: 'Built around provider abstraction, state-machine validation, idempotency, sequential carousel generation, outbox reliability, and brand consistency contracts.',
        systemFlow: ['intent', 'planning', 'brand contract', 'generation', 'verification', 'review/export'],
        problem: 'AI creative output often collapses under brand consistency, multi-page sequencing, and production review requirements.',
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
      title: 'Basement lab index',
      description: 'The private operating interface behind the public site.',
      items: [
        { id: 'theme-controls', title: 'Theme controls', description: 'Tune the ten-theme visual system and its typography behavior.', status: 'online', targetPanel: 'theme', href: '', visible: true, order: 0, icon: 'theme' },
        { id: 'proof-files', title: 'Proof drawer management', description: 'Stage real artifacts and keep missing evidence visibly missing.', status: 'ready', targetPanel: 'projects', href: '', visible: true, order: 1, icon: 'proof' },
        { id: 'identity-layer', title: 'Identity mechanics', description: 'Edit diagnostics, refusals, field notes, collaboration defaults, and taste.', status: 'ready', targetPanel: 'identity-layer', href: '', visible: true, order: 2, icon: 'signal' },
        { id: 'site-settings', title: 'Site settings', description: 'Control section order, motion, layout, metadata, and visibility.', status: 'online', targetPanel: 'sections', href: '', visible: true, order: 3, icon: 'settings' },
        { id: 'resume', title: 'Resume download', description: 'Open the current resume artifact from the public asset bundle.', status: 'attached', targetPanel: '', href: '/Aryan_Sharma_Resume.pdf', visible: true, order: 4, icon: 'resume' },
        { id: 'now-building', title: 'Now building', description: 'Proof-first identity systems, AI-native workflows, and calmer interfaces.', status: 'current', targetPanel: '', href: '', visible: true, order: 5, icon: 'current' },
      ],
    },

    proofCards: [
      { id: 'idempotency', index: '01', title: 'idempotency', description: 'Because retries should not become duplicates.', accentColor: null, visible: true, order: 0 },
      { id: 'observability', index: '02', title: 'observability', description: 'Because production lies unless logs, metrics, and health checks testify.', accentColor: null, visible: true, order: 1 },
      { id: 'render-parity', index: '03', title: 'render parity', description: 'Because preview and final output must not live in different realities.', accentColor: null, visible: true, order: 2 },
      { id: 'state-machines', index: '04', title: 'state machines', description: 'Because vibes are not a valid transition rule.', accentColor: null, visible: true, order: 3 },
      { id: 'golden-threads', index: '05', title: 'golden threads', description: 'Because every job needs a trail.', accentColor: null, visible: true, order: 4 },
      { id: 'tests-before-code', index: '06', title: 'tests before code', description: 'Correctness first. Implementation second.', accentColor: null, visible: true, order: 5 },
    ],

    skillGroups: [
      { id: 'interface', name: 'Interface', description: 'React, React Native, responsive UI, visual editors, clean hierarchy', skills: ['React', 'React Native', 'responsive UI', 'visual editors', 'clean hierarchy'], displayStyle: 'matrix', order: 0 },
      { id: 'backend', name: 'Backend', description: 'Java, Spring Boot, Python, APIs, Pydantic, validation', skills: ['Java', 'Spring Boot', 'Python', 'APIs', 'Pydantic', 'validation'], displayStyle: 'matrix', order: 1 },
      { id: 'cloud-infra', name: 'Cloud/Infra', description: 'Azure, Azure Container Apps, Blob Storage, Redis, KEDA, Vercel', skills: ['Azure', 'Azure Container Apps', 'Blob Storage', 'Redis', 'KEDA', 'Vercel'], displayStyle: 'matrix', order: 2 },
      { id: 'media-systems', name: 'Media Systems', description: 'FFmpeg, overlays, rendering, VFR/CFR handling, preview/render parity', skills: ['FFmpeg', 'overlays', 'rendering', 'VFR/CFR handling', 'preview/render parity'], displayStyle: 'matrix', order: 3 },
      { id: 'ai-systems', name: 'AI Systems', description: 'Gemini, Google Nano Banana Pro, AI orchestration, provider abstraction, prompt control', skills: ['Gemini', 'Google Nano Banana Pro', 'AI orchestration', 'provider abstraction', 'prompt control'], displayStyle: 'matrix', order: 4 },
      { id: 'reliability', name: 'Reliability', description: 'queues, lease tokens, heartbeats, idempotency, structured logs, Prometheus, health probes', skills: ['queues', 'lease tokens', 'heartbeats', 'idempotency', 'structured logs', 'Prometheus', 'health probes'], displayStyle: 'matrix', order: 5 },
    ],

    philosophy: [
      { id: 'p1', text: 'Proof over vibes.', intensity: 'sharp', largeType: true, order: 0 },
      { id: 'p2', text: 'First principles before frameworks.', intensity: 'sharp', largeType: true, order: 1 },
      { id: 'p3', text: 'Systems should be traceable, editable, recoverable.', intensity: 'quiet', largeType: true, order: 2 },
      { id: 'p4', text: 'Tests before code when correctness matters.', intensity: 'sharp', largeType: true, order: 3 },
      { id: 'p5', text: 'Agents are backstage. Products win on stage.', intensity: 'quiet', largeType: true, order: 4 },
      { id: 'p6', text: 'Cloud is convenience. Ownership is power.', intensity: 'sharp', largeType: true, order: 5 },
      { id: 'p7', text: 'No corporate fog. No fake certainty.', intensity: 'loud', largeType: true, order: 6 },
    ],

    humanLayer: {
      glitchesSectionLabel: 'human_glitches',
      glitchesTitle: 'Small calibrations',
      motifs: [
        { id: 'm1', text: 'rain', symbol: '🌧', visible: true, order: 0 },
        { id: 'm2', text: 'night', symbol: '🌙', visible: true, order: 1 },
        { id: 'm3', text: 'blue', symbol: '🔵', visible: true, order: 2 },
        { id: 'm4', text: 'cold weather', symbol: '❄', visible: true, order: 3 },
        { id: 'm5', text: 'neon', symbol: '💡', visible: true, order: 4 },
        { id: 'm6', text: 'space', symbol: '🚀', visible: true, order: 5 },
        { id: 'm7', text: 'mysteries', symbol: '🔍', visible: true, order: 6 },
        { id: 'm8', text: 'skylines', symbol: '🏙', visible: true, order: 7 },
        { id: 'm9', text: 'basketball', symbol: '🏀', visible: true, order: 8 },
        { id: 'm10', text: 'gymnastics', symbol: '🤸', visible: true, order: 9 },
        { id: 'm11', text: 'meaningful fiction', symbol: '📖', visible: true, order: 10 },
        { id: 'm12', text: 'dry humor', symbol: '😐', visible: true, order: 11 },
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
      ctaText: 'open_channel()', ctaLink: 'mailto:aryanteddys@gmail.com',
      resumeLink: 'Aryan_Sharma_Resume.pdf', resumeLabel: 'view_resume',
      githubLink: '', linkedinLink: '', socialLinks: [],
      customLinks: [{ label: 'inspect_projects', href: '#systems-built' }],
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
      enabled: true, dotSize: 1, dotSpacing: 32, dotOpacity: 0.07, dotRevealOpacity: 0.16,
      dotFieldOpacity: 0.68, radialGlowColor: '#5debff', radialGlowOpacity: 0.08,
      radialGlowSize: 28, radialGlowBlur: 44, radialGlowColor2: '#2f6bff',
      radialGlowOpacity2: 0.12, animationSpeed: 46, animationIntensity: 1.0,
      vignetteOpacity: 0.88, noiseOpacity: 0,
    },

    motion: {
      enabled: true, reducedMotion: false, revealType: 'translateY',
      revealDuration: 680, revealDelay: 80, hoverGlowIntensity: 1.0,
      projectExpansionSpeed: 360, commandPaletteEnabled: true,
      scrollParallaxIntensity: 0, cursorBlinkEnabled: true, rainNoiseEnabled: false,
      durationFast: 140, durationStandard: 220, durationSlow: 360,
    },

    layout: {
      maxContentWidth: '1248px', sectionPaddingTop: '128px', sectionPaddingBottom: '128px',
      cardPadding: '24px', gridGap: '16px', borderRadius: '2px', panelBlur: 16,
      navPosition: 'sticky', heroHeight: 'auto', sectionAlignment: 'left',
      densityMode: 'cinematic', headerHeight: '80px',
    },

    seo: {
      pageTitle: 'Aryan Sharma | Proof of Work Interface',
      metaDescription: 'Aryan Sharma, India-based Full Stack Developer and AI & Automation Engineer building AI-native media systems with proof-over-vibes engineering.',
      ogTitle: 'Aryan Sharma | Proof of Work Interface',
      ogDescription: 'Aryan Sharma, India-based Full Stack Developer and AI & Automation Engineer building AI-native media systems with proof-over-vibes engineering.',
      ogImage: '', favicon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%2305070D'/%3E%3Crect x='8' y='8' width='48' height='48' fill='%23101826' stroke='%235DEBFF' stroke-width='2'/%3E%3Ctext x='32' y='38' text-anchor='middle' font-family='monospace' font-size='18' font-weight='700' fill='%235DEBFF'%3EAS%3C/text%3E%3C/svg%3E",
      themeColor: '#05070d',
    },

    assets: {
      profileImage: 'assets/aryan-profile.png', resumeFile: 'Aryan_Sharma_Resume.pdf',
      ogImage: '', customLogo: '', projectImages: {}, backgroundTextures: {},
    },

    commandPalette: {
      title: 'Command channel', description: 'Jump through the proof interface.',
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
      variant: 'identity-card',
      aspectRatio: '4 / 5',
      objectPosition: '52% 50%',
      showMetadata: true,
      metadata: [
        { label: 'trace_id', value: 'aryan.sharma' },
        { label: 'mode', value: 'nocturnal_builder' },
        { label: 'origin', value: 'india' },
        { label: 'signal', value: 'proof_over_vibes' },
      ],
      effects: {
        vignette: 0.45,
        glow: 0.25,
        grain: 0.08,
        hoverLift: true,
        scrollReveal: true,
      },
    },

    loader: {
      enabled: true,
      minimumDuration: 600,
      maxWaitTime: 1500,
      style: 'trace-boot',
      statusVisible: true,
      traceVisible: true,
      themeAware: true,
    },
  };
}
