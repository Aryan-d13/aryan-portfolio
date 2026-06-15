import { useRef, useState } from 'react';
import type { IdentityModuleConfig, SiteConfig } from '../../../types/siteConfig';
import { getDefaultConfig } from '../../../config/siteConfig';
import { validateConfig } from '../../../config/configSchema';
import { Field, TextInput, TextArea, NumberInput, Toggle, ColorField, Range, Select, getPath } from '../../ui/FormControls';
import { toast, confirmDialog } from '../../ui/Toast';
import Icon, { type IconName } from '../../icons/Icon';
import { controlNavIconMap } from '../../icons/iconRegistry';
import { useThemeEngine } from '../../../hooks/useThemeEngine';
import { themePortraitMap, getPortraitForTheme } from '../../../config/themePortraitMap';
import type { TextTreatmentSlot, TypographyPresetName } from '../../../types/typographyConfig';
import {
  TEXT_EFFECT_OPTIONS,
  TEXT_MOTION_OPTIONS,
  TEXT_TEXTURE_OPTIONS,
  TYPOGRAPHY_PRESET_NAMES,
  getTypographyPreset,
  normalizeTypographySystem,
  validateTypographySystem,
} from '../../../utils/textEffects';

interface EditorProps {
  config: SiteConfig;
  onChange: () => void;
}

// ─── SHARED HELPERS ─────────────────────────────────────────────

function uid(): string { return Math.random().toString(36).slice(2, 9); }

function editorIcon(title: string): IconName {
  const key = title.toLowerCase();
  if (key.includes('identity')) return controlNavIconMap.identity;
  if (key.includes('section')) return controlNavIconMap.sections;
  if (key.includes('project')) return controlNavIconMap.projects;
  if (key.includes('proof')) return controlNavIconMap.proof;
  if (key.includes('skill') || key.includes('stack')) return controlNavIconMap.skills;
  if (key.includes('philosophy')) return controlNavIconMap.philosophy;
  if (key.includes('human')) return controlNavIconMap.human;
  if (key.includes('timeline') || key.includes('build')) return controlNavIconMap.timeline;
  if (key.includes('contact')) return controlNavIconMap.contact;
  if (key.includes('typography')) return controlNavIconMap.typography;
  if (key.includes('color')) return controlNavIconMap.colors;
  if (key.includes('background')) return controlNavIconMap.background;
  if (key.includes('motion')) return controlNavIconMap.motion;
  if (key.includes('layout')) return controlNavIconMap.layout;
  if (key.includes('seo')) return controlNavIconMap.seo;
  if (key.includes('asset')) return controlNavIconMap.assets;
  if (key.includes('json')) return controlNavIconMap.json;
  if (key.includes('portrait')) return controlNavIconMap.portrait;
  if (key.includes('lab')) return 'database';
  return 'settings';
}

function EditorHeader({ title, description, config, onChange }: { title: string; description: string; config: SiteConfig; onChange: () => void }) {
  const keyMap: Record<string, keyof SiteConfig | Array<keyof SiteConfig>> = {
    'Global Identity': 'identity', 'Sections': 'sections', 'Projects / Case Files': 'projects',
    'Proof Cards': 'proofCards', 'Skills / Stack': 'skillGroups', 'Philosophy': 'philosophy',
    'Human Layer': 'humanLayer', 'Timeline / Build Log': 'timeline', 'Contact / Links': 'contact',
    'Typography': 'typography', 'Typography Lab': 'typography', 'Colors': 'colors', 'Background / Soft Trace Grid': 'background',
    'Motion / Animation': 'motion', 'Layout / Spacing': 'layout', 'SEO / Meta': 'seo', 'Assets': 'assets',
    'Identity Mechanics': ['signalProfile', 'antiPatterns', 'fieldNotes', 'operatingManual', 'builderModes', 'tasteLayer'],
    'Lab Modules': 'controlRoomModules',
  };

  const resetGroup = async () => {
    const ok = await confirmDialog('Reset Group', `Reset "${title}" to defaults?`);
    if (ok) {
      const defaults = getDefaultConfig();
      const configKeys = keyMap[title];
      if (configKeys) {
        const keys = Array.isArray(configKeys) ? configKeys : [configKeys];
        keys.forEach(configKey => {
          (config as unknown as Record<string, unknown>)[configKey] = JSON.parse(JSON.stringify((defaults as unknown as Record<string, unknown>)[configKey]));
        });
        onChange();
        toast(`${title} reset to defaults`, 'info');
      }
    }
  };

  return (
    <div className="cr-editor-header">
      <h2 className="icon-align-inline"><Icon name={editorIcon(title)} size="md" tone="accent" />{title}</h2>
      <p>{description}</p>
      <div className="cr-editor-actions">
        <button className="cr-btn cr-btn-ghost cr-btn-sm icon-align-inline" type="button" onClick={resetGroup}><Icon name="reset" size="xs" tone="muted" />reset group</button>
      </div>
    </div>
  );
}

function SubEditor({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div className={`cr-sub-editor${open ? ' is-open' : ''}`}>
      <button className="cr-sub-editor-header icon-align-inline" type="button" aria-expanded={open} onClick={() => setOpen(!open)}><Icon name="chevron" size="xs" tone="muted" />{title}</button>
      <div className="cr-sub-editor-body">{children}</div>
    </div>
  );
}

// ─── 1. IDENTITY ────────────────────────────────────────────────

function IdentityModuleEditor({ config, modulePath, title, onChange }: EditorProps & { modulePath: keyof SiteConfig; title: string }) {
  const module = config[modulePath] as IdentityModuleConfig;
  const items = [...module.items].sort((a, b) => a.order - b.order);

  return (
    <SubEditor title={title}>
      <Field label="Enabled"><Toggle config={config} path={`${modulePath}.enabled`} label="Show this module" onChange={onChange} /></Field>
      <Field label="Section Label"><TextInput config={config} path={`${modulePath}.sectionLabel`} onChange={onChange} /></Field>
      <Field label="Title"><TextInput config={config} path={`${modulePath}.title`} onChange={onChange} /></Field>
      <Field label="Description"><TextArea config={config} path={`${modulePath}.description`} rows={2} onChange={onChange} /></Field>
      <div className="cr-section-label">Items</div>
      {items.map(item => {
        const idx = module.items.indexOf(item);
        return (
          <SubEditor key={item.id} title={`${String(item.order + 1).padStart(2, '0')} - ${item.label || 'Untitled item'}`}>
            <div className="cr-field-row">
              <Field label="Label"><TextInput config={config} path={`${modulePath}.items.${idx}.label`} onChange={onChange} /></Field>
              <Field label="Icon"><TextInput config={config} path={`${modulePath}.items.${idx}.icon`} onChange={onChange} /></Field>
              <Field label="Order"><NumberInput config={config} path={`${modulePath}.items.${idx}.order`} min={0} max={99} onChange={onChange} /></Field>
            </div>
            <Field label="Description"><TextArea config={config} path={`${modulePath}.items.${idx}.description`} rows={2} onChange={onChange} /></Field>
            <Field label="Visible"><Toggle config={config} path={`${modulePath}.items.${idx}.visible`} label="Show this item" onChange={onChange} /></Field>
            <button className="cr-btn cr-btn-danger cr-btn-sm icon-align-inline" type="button" onClick={() => { module.items.splice(idx, 1); onChange(); }}>
              <Icon name="delete" size="xs" tone="error" />delete item
            </button>
          </SubEditor>
        );
      })}
      <button className="cr-list-add-btn" type="button" onClick={() => {
        module.items.push({ id: `${String(modulePath)}-${uid()}`, label: '', description: '', visible: true, order: module.items.length, icon: 'trace' });
        onChange();
      }}><Icon name="duplicate" size="xs" tone="accent" />add item</button>
    </SubEditor>
  );
}

export function IdentityLayerEditor({ config, onChange }: EditorProps) {
  return (
    <div>
      <EditorHeader title="Identity Mechanics" description="Public diagnostics, refusal list, builder fragments, collaboration defaults, and visual taste" config={config} onChange={onChange} />
      <IdentityModuleEditor config={config} modulePath="signalProfile" title="Signal Profile" onChange={onChange} />
      <IdentityModuleEditor config={config} modulePath="antiPatterns" title="Anti-Patterns" onChange={onChange} />
      <IdentityModuleEditor config={config} modulePath="fieldNotes" title="Field Notes" onChange={onChange} />
      <IdentityModuleEditor config={config} modulePath="operatingManual" title="Operating Manual" onChange={onChange} />
      <IdentityModuleEditor config={config} modulePath="tasteLayer" title="Taste Layer" onChange={onChange} />

      <SubEditor title="Builder Modes" defaultOpen>
        <Field label="Enabled"><Toggle config={config} path="builderModes.enabled" label="Show builder mode guide" onChange={onChange} /></Field>
        <Field label="Section Label"><TextInput config={config} path="builderModes.sectionLabel" onChange={onChange} /></Field>
        <Field label="Title"><TextInput config={config} path="builderModes.title" onChange={onChange} /></Field>
        <Field label="Description"><TextArea config={config} path="builderModes.description" rows={2} onChange={onChange} /></Field>
        {config.builderModes.modes.map((mode, idx) => (
          <SubEditor key={mode.id} title={mode.label || mode.id}>
            <div className="cr-field-row">
              <Field label="Label"><TextInput config={config} path={`builderModes.modes.${idx}.label`} onChange={onChange} /></Field>
              <Field label="Icon"><TextInput config={config} path={`builderModes.modes.${idx}.icon`} onChange={onChange} /></Field>
            </div>
            <Field label="Description"><TextArea config={config} path={`builderModes.modes.${idx}.description`} rows={2} onChange={onChange} /></Field>
          </SubEditor>
        ))}
      </SubEditor>
    </div>
  );
}

export function IdentityEditor({ config, onChange }: EditorProps) {
  return (
    <div>
      <EditorHeader title="Global Identity" description="Core identity data: name, handle, roles, metadata" config={config} onChange={onChange} />
      <Field label="Name"><TextInput config={config} path="identity.name" placeholder="Aryan Sharma" onChange={onChange} /></Field>
      <Field label="Handle"><TextInput config={config} path="identity.handle" placeholder="@aryanteddys" onChange={onChange} /></Field>

      <div className="cr-section-label">Role Lines</div>
      {config.identity.roleLines.length === 0 ? (
        <div style={{ padding: '12px', textAlign: 'center', color: 'var(--cr-text-3)', fontFamily: 'var(--cr-font-mono)', fontSize: '11px' }}>
          No role lines defined. Add one below.
        </div>
      ) : (
        <div className="cr-table-container" style={{ marginBottom: '12px' }}>
          <table className="cr-table cr-table-soft density-compact cr-table-responsive">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Index</th>
                <th>Role Line Value</th>
                <th className="num-col" style={{ width: '60px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {config.identity.roleLines.map((_, i) => (
                <tr key={i}>
                  <td data-label="Index" style={{ fontFamily: 'var(--cr-font-mono)', fontSize: '11px', color: 'var(--cr-text-3)' }}>
                    #{String(i + 1).padStart(2, '0')}
                  </td>
                  <td data-label="Role Line">
                    <input className="cr-input" aria-label={`Role line ${i + 1}`} value={config.identity.roleLines[i]}
                      onChange={e => { config.identity.roleLines[i] = e.target.value; onChange(); }} placeholder="e.g. Full Stack Engineer" />
                  </td>
                  <td data-label="Actions" className="num-col">
                    <button className="cr-btn cr-btn-danger cr-btn-sm cr-btn-icon" type="button" aria-label={`Remove role line ${i + 1}`}
                      onClick={() => { config.identity.roleLines.splice(i, 1); onChange(); }}><Icon name="delete" size="xs" tone="error" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button className="cr-list-add-btn" type="button" onClick={() => { config.identity.roleLines.push(''); onChange(); }}><Icon name="duplicate" size="xs" tone="accent" />add role line</button>

      <div className="cr-divider" />
      <Field label="Location"><TextInput config={config} path="identity.location" onChange={onChange} /></Field>
      <Field label="Email"><TextInput config={config} path="identity.email" onChange={onChange} /></Field>
      <Field label="Short Bio"><TextArea config={config} path="identity.shortBio" rows={2} onChange={onChange} /></Field>
      <Field label="Hero Statement (Cinema)"><TextArea config={config} path="identity.heroStatement" rows={2} onChange={onChange} /></Field>
      <Field label="Hero Statement (Direct)"><TextArea config={config} path="identity.heroStatementDirect" rows={2} onChange={onChange} /></Field>
      <Field label="Hero Kicker"><TextInput config={config} path="identity.heroKicker" onChange={onChange} /></Field>
      <Field label="Brand Subtitle"><TextInput config={config} path="identity.brandSubtitle" onChange={onChange} /></Field>
      <Field label="Brand Glyph"><TextInput config={config} path="identity.brandGlyph" onChange={onChange} /></Field>

      <div className="cr-section-label">CTAs</div>
      <div className="cr-field-row">
        <Field label="Primary CTA Text"><TextInput config={config} path="identity.ctaPrimary.text" onChange={onChange} /></Field>
        <Field label="Primary CTA Link"><TextInput config={config} path="identity.ctaPrimary.href" onChange={onChange} /></Field>
      </div>
      <div className="cr-field-row">
        <Field label="Secondary CTA Text"><TextInput config={config} path="identity.ctaSecondary.text" onChange={onChange} /></Field>
        <Field label="Secondary CTA Link"><TextInput config={config} path="identity.ctaSecondary.href" onChange={onChange} /></Field>
      </div>

      <div className="cr-section-label">Metadata Labels</div>
      <div className="cr-table-container" style={{ marginBottom: '16px' }}>
        <table className="cr-table cr-table-soft density-compact cr-table-responsive">
          <thead>
            <tr>
              <th style={{ width: '180px' }}>Parameter / Key</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(config.identity.metadata).map(key => (
              <tr key={key}>
                <td>
                  <span style={{ fontFamily: 'var(--cr-font-mono)', fontSize: '11px', fontWeight: 600 }}>{key}</span>
                </td>
                <td data-label="Value">
                  <TextInput config={config} path={`identity.metadata.${key}`} onChange={onChange} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="cr-section-label">Portrait</div>
      <Field label="Caption Label"><TextInput config={config} path="identity.portraitCaption.label" onChange={onChange} /></Field>
      <Field label="Caption Value"><TextInput config={config} path="identity.portraitCaption.value" onChange={onChange} /></Field>
      <Field label="Portrait Alt"><TextInput config={config} path="identity.portraitAlt" onChange={onChange} /></Field>
    </div>
  );
}

// ─── 2. SECTIONS ────────────────────────────────────────────────

export function SectionsEditor({ config, onChange }: EditorProps) {
  const sections = [...config.sections].sort((a, b) => a.order - b.order);
  return (
    <div>
      <EditorHeader title="Sections" description="Manage section visibility, order, titles, and metadata" config={config} onChange={onChange} />
      {sections.map((sec, idx) => {
        const si = config.sections.indexOf(sec);
        return (
          <SubEditor key={sec.id} title={`${String(idx + 1).padStart(2, '0')} — ${sec.title || sec.id}`} defaultOpen>
            <Field label="Visible"><Toggle config={config} path={`sections.${si}.visible`} label="Show this section" onChange={onChange} /></Field>
            <Field label="Order"><NumberInput config={config} path={`sections.${si}.order`} min={0} max={20} onChange={onChange} /></Field>
            <Field label="Title"><TextInput config={config} path={`sections.${si}.title`} onChange={onChange} /></Field>
            <Field label="Kicker"><TextInput config={config} path={`sections.${si}.kicker`} onChange={onChange} /></Field>
            <Field label="Icon" hint="Optional icon registry key"><TextInput config={config} path={`sections.${si}.icon`} onChange={onChange} /></Field>
            {sec.heading !== undefined && <Field label="Heading"><TextInput config={config} path={`sections.${si}.heading`} onChange={onChange} /></Field>}
            {sec.descriptionAtmospheric !== undefined && <Field label="Description (Cinema)"><TextArea config={config} path={`sections.${si}.descriptionAtmospheric`} rows={2} onChange={onChange} /></Field>}
            {sec.descriptionDirect !== undefined && <Field label="Description (Direct)"><TextArea config={config} path={`sections.${si}.descriptionDirect`} rows={2} onChange={onChange} /></Field>}
            {sec.bodyAtmospheric !== undefined && <Field label="Body (Cinema)"><TextArea config={config} path={`sections.${si}.bodyAtmospheric`} rows={3} onChange={onChange} /></Field>}
            {sec.bodyDirect !== undefined && <Field label="Body (Direct)"><TextArea config={config} path={`sections.${si}.bodyDirect`} rows={3} onChange={onChange} /></Field>}
            <div className="cr-section-label">Section Metadata</div>
            <Field label="Section ID"><TextInput config={config} path={`sections.${si}.sectionId`} onChange={onChange} /></Field>
            <Field label="Signal"><TextInput config={config} path={`sections.${si}.signal`} onChange={onChange} /></Field>
            <Field label="Proof Level"><TextInput config={config} path={`sections.${si}.proofLevel`} onChange={onChange} /></Field>
            <Field label="System Status"><TextInput config={config} path={`sections.${si}.systemStatus`} onChange={onChange} /></Field>
          </SubEditor>
        );
      })}
    </div>
  );
}

// ─── 3. PROJECTS ────────────────────────────────────────────────

export function ProjectsEditor({ config, onChange }: EditorProps) {
  return (
    <div>
      <EditorHeader title="Projects / Case Files" description="Add, edit, reorder, and manage project dossiers" config={config} onChange={onChange} />
      {config.projects.map((project, idx) => (
        <SubEditor key={project.id} title={`${project.caseNumber || String(idx + 1).padStart(2, '0')} — ${project.name || 'Untitled'}`} defaultOpen={idx === 0}>
          <div className="cr-field-row">
            <Field label="Project Name"><TextInput config={config} path={`projects.${idx}.name`} onChange={onChange} /></Field>
            <Field label="Case Number"><TextInput config={config} path={`projects.${idx}.caseNumber`} onChange={onChange} /></Field>
          </div>
          <Field label="Type"><TextInput config={config} path={`projects.${idx}.type`} onChange={onChange} /></Field>
          <Field label="ID (slug)"><TextInput config={config} path={`projects.${idx}.id`} onChange={onChange} /></Field>
          <Field label="Featured"><Toggle config={config} path={`projects.${idx}.featured`} label="Featured project" onChange={onChange} /></Field>

          <div className="cr-section-label">Story Mode</div>
          {project.storyDescription.map((_, pi) => (
            <Field key={pi} label={`Paragraph ${pi + 1}`}>
              <TextArea config={config} path={`projects.${idx}.storyDescription.${pi}`} rows={2} onChange={onChange} />
            </Field>
          ))}
          <button className="cr-list-add-btn" type="button" onClick={() => { config.projects[idx].storyDescription.push(''); onChange(); }}><Icon name="duplicate" size="xs" tone="accent" />add paragraph</button>

          <div className="cr-section-label">System Mode</div>
          <Field label="System Description"><TextArea config={config} path={`projects.${idx}.systemDescription`} rows={2} onChange={onChange} /></Field>
          <Field label="System Flow (comma-separated)">
            <input className="cr-input" value={project.systemFlow.join(', ')}
              onChange={e => { config.projects[idx].systemFlow = e.target.value.split(',').map(s => s.trim()).filter(Boolean); onChange(); }} />
          </Field>

          <div className="cr-section-label">Dossier Tabs</div>
          <Field label="Problem"><TextArea config={config} path={`projects.${idx}.problem`} rows={2} onChange={onChange} /></Field>
          <Field label="System"><TextArea config={config} path={`projects.${idx}.system`} rows={2} onChange={onChange} /></Field>
          <Field label="Stack"><TextArea config={config} path={`projects.${idx}.stack`} rows={2} onChange={onChange} /></Field>
          <Field label="Proof Themes"><TextArea config={config} path={`projects.${idx}.proofThemes`} rows={2} onChange={onChange} /></Field>
          <Field label="What It Shows"><TextArea config={config} path={`projects.${idx}.shows`} rows={2} onChange={onChange} /></Field>

          <div className="cr-section-label">Proof Drawer</div>
          <Field label="Enabled"><Toggle config={config} path={`projects.${idx}.proofDrawer.enabled`} label="Show proof drawer" onChange={onChange} /></Field>
          <Field label="Trigger Label"><TextInput config={config} path={`projects.${idx}.proofDrawer.label`} onChange={onChange} /></Field>
          <Field label="Title"><TextInput config={config} path={`projects.${idx}.proofDrawer.title`} onChange={onChange} /></Field>
          <Field label="Description"><TextArea config={config} path={`projects.${idx}.proofDrawer.description`} rows={2} onChange={onChange} /></Field>
          {project.proofDrawer.items.map((item, proofIdx) => (
            <SubEditor key={item.id} title={`${String(proofIdx + 1).padStart(2, '0')} - ${item.label || 'Proof slot'}`}>
              <div className="cr-field-row">
                <Field label="Label"><TextInput config={config} path={`projects.${idx}.proofDrawer.items.${proofIdx}.label`} onChange={onChange} /></Field>
                <Field label="Icon"><TextInput config={config} path={`projects.${idx}.proofDrawer.items.${proofIdx}.icon`} onChange={onChange} /></Field>
                <Field label="Order"><NumberInput config={config} path={`projects.${idx}.proofDrawer.items.${proofIdx}.order`} min={0} max={99} onChange={onChange} /></Field>
              </div>
              <Field label="Description"><TextArea config={config} path={`projects.${idx}.proofDrawer.items.${proofIdx}.description`} rows={2} onChange={onChange} /></Field>
              <div className="cr-field-row">
                <Field label="Status"><Select config={config} path={`projects.${idx}.proofDrawer.items.${proofIdx}.status`} options={[
                  { value: 'placeholder', label: 'Placeholder / slot ready' },
                  { value: 'ready', label: 'Attached / ready' },
                ]} onChange={onChange} /></Field>
                <Field label="Artifact Link"><TextInput config={config} path={`projects.${idx}.proofDrawer.items.${proofIdx}.href`} placeholder="Leave empty until proof exists" onChange={onChange} /></Field>
              </div>
              <button className="cr-btn cr-btn-danger cr-btn-sm icon-align-inline" type="button" onClick={() => { config.projects[idx].proofDrawer.items.splice(proofIdx, 1); onChange(); }}>
                <Icon name="delete" size="xs" tone="error" />delete proof slot
              </button>
            </SubEditor>
          ))}
          <button className="cr-list-add-btn" type="button" onClick={() => {
            project.proofDrawer.items.push({ id: `proof-slot-${uid()}`, label: 'Add proof artifact', description: '', status: 'placeholder', href: '', icon: 'proof', order: project.proofDrawer.items.length });
            onChange();
          }}><Icon name="proof" size="xs" tone="accent" />add proof slot</button>

          <div className="cr-divider" />
          <button className="cr-btn cr-btn-danger cr-btn-sm" type="button" onClick={async () => {
            const ok = await confirmDialog('Delete Project', `Delete "${project.name}"?`);
            if (ok) { config.projects.splice(idx, 1); onChange(); toast(`Deleted: ${project.name}`, 'warning'); }
          }}>Delete Project</button>
        </SubEditor>
      ))}
      <button className="cr-list-add-btn" type="button" onClick={() => {
        config.projects.push({
          id: `project-${uid()}`, name: 'NEW PROJECT', caseNumber: String(config.projects.length + 1).padStart(2, '0'),
          type: '', featured: false, status: 'draft', confidenceLabel: '',
          storyDescription: [''], systemDescription: '', systemFlow: [],
          problem: '', system: '', stack: '', proofThemes: '', shows: '', links: {},
          proofDrawer: JSON.parse(JSON.stringify(getDefaultConfig().projects[0].proofDrawer)),
        });
        onChange(); toast('New project added', 'success');
      }}><Icon name="archive" size="xs" tone="accent" />add project</button>
    </div>
  );
}

// ─── 4. PROOF CARDS ─────────────────────────────────────────────

export function ProofEditor({ config, onChange }: EditorProps) {
  const cards = [...config.proofCards].sort((a, b) => a.order - b.order);
  return (
    <div>
      <EditorHeader title="Proof Cards" description="Reliability principles and proof items" config={config} onChange={onChange} />
      {cards.map((card) => {
        const idx = config.proofCards.indexOf(card);
        return (
          <SubEditor key={card.id} title={`${card.index} — ${card.title || 'Untitled'}`}>
            <div className="cr-field-row">
              <Field label="Index"><TextInput config={config} path={`proofCards.${idx}.index`} onChange={onChange} /></Field>
              <Field label="Order"><NumberInput config={config} path={`proofCards.${idx}.order`} min={0} max={20} onChange={onChange} /></Field>
            </div>
            <Field label="Title"><TextInput config={config} path={`proofCards.${idx}.title`} onChange={onChange} /></Field>
            <Field label="Description"><TextArea config={config} path={`proofCards.${idx}.description`} rows={2} onChange={onChange} /></Field>
            <Field label="Visible"><Toggle config={config} path={`proofCards.${idx}.visible`} label="Show this card" onChange={onChange} /></Field>
            <div className="cr-divider" />
            <button className="cr-btn cr-btn-danger cr-btn-sm" type="button" onClick={async () => {
              const ok = await confirmDialog('Delete Proof Card', `Delete "${card.title}"?`);
              if (ok) { config.proofCards.splice(idx, 1); onChange(); }
            }}>Delete</button>
          </SubEditor>
        );
      })}
      <button className="cr-list-add-btn" type="button" onClick={() => {
        config.proofCards.push({ id: `proof-${uid()}`, index: String(config.proofCards.length + 1).padStart(2, '0'), title: '', description: '', accentColor: null, visible: true, order: config.proofCards.length });
        onChange();
      }}><Icon name="proof" size="xs" tone="accent" />add proof card</button>
    </div>
  );
}

// ─── 5. SKILLS ──────────────────────────────────────────────────

export function SkillsEditor({ config, onChange }: EditorProps) {
  const groups = [...config.skillGroups].sort((a, b) => a.order - b.order);
  return (
    <div>
      <EditorHeader title="Skills / Stack" description="Skill groups, descriptions, and display style" config={config} onChange={onChange} />
      {groups.map((group) => {
        const idx = config.skillGroups.indexOf(group);
        return (
          <SubEditor key={group.id} title={group.name || 'Untitled Group'}>
            <Field label="Group Name"><TextInput config={config} path={`skillGroups.${idx}.name`} onChange={onChange} /></Field>
            <Field label="Description"><TextArea config={config} path={`skillGroups.${idx}.description`} rows={2} onChange={onChange} /></Field>
            <Field label="Order"><NumberInput config={config} path={`skillGroups.${idx}.order`} min={0} max={20} onChange={onChange} /></Field>
            <Field label="Display Style"><Select config={config} path={`skillGroups.${idx}.displayStyle`} options={[
              { value: 'matrix', label: 'Matrix' }, { value: 'chips', label: 'Chips' }, { value: 'compact', label: 'Compact' }, { value: 'terminal', label: 'Terminal' },
            ]} onChange={onChange} /></Field>
            <Field label="Skills (comma-separated)">
              <input className="cr-input" value={group.skills.join(', ')}
                onChange={e => { config.skillGroups[idx].skills = e.target.value.split(',').map(s => s.trim()).filter(Boolean); onChange(); }} />
            </Field>
            <div className="cr-divider" />
            <button className="cr-btn cr-btn-danger cr-btn-sm" type="button" onClick={async () => {
              const ok = await confirmDialog('Delete Skill Group', `Delete "${group.name}"?`);
              if (ok) { config.skillGroups.splice(idx, 1); onChange(); }
            }}>Delete Group</button>
          </SubEditor>
        );
      })}
      <button className="cr-list-add-btn" type="button" onClick={() => {
        config.skillGroups.push({ id: `skill-${uid()}`, name: 'New Group', description: '', skills: [], displayStyle: 'matrix', order: config.skillGroups.length });
        onChange();
      }}><Icon name="stack" size="xs" tone="accent" />add skill group</button>
    </div>
  );
}

// ─── 6. PHILOSOPHY ──────────────────────────────────────────────

export function PhilosophyEditor({ config, onChange }: EditorProps) {
  const lines = [...config.philosophy].sort((a, b) => a.order - b.order);
  return (
    <div>
      <EditorHeader title="Philosophy" description="Operating principles and manifesto lines" config={config} onChange={onChange} />
      {lines.length === 0 ? (
        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--cr-text-3)', fontFamily: 'var(--cr-font-mono)' }}>
          <Icon name="spark" size="md" tone="muted" style={{ marginBottom: '8px' }} />
          <div>No philosophy principles defined. Add one below.</div>
        </div>
      ) : (
        <div className="cr-table-container" style={{ marginTop: '16px' }}>
          <table className="cr-table cr-table-soft density-balanced cr-table-responsive">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Priority</th>
                <th>Manifesto Principle Statement</th>
                <th style={{ width: '130px' }}>Intensity</th>
                <th className="num-col" style={{ width: '60px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line, idx) => {
                const realIdx = config.philosophy.indexOf(line);
                return (
                  <tr key={line.id}>
                    <td data-label="Priority" style={{ fontFamily: 'var(--cr-font-mono)', fontSize: '11px', color: 'var(--cr-text-3)' }}>
                      #{String(idx + 1).padStart(2, '0')}
                    </td>
                    <td data-label="Principle Statement">
                      <input 
                        className="cr-input" 
                        aria-label="Philosophy line text" 
                        value={line.text} 
                        onChange={e => { config.philosophy[realIdx].text = e.target.value; onChange(); }} 
                        placeholder="Type principle text..."
                      />
                    </td>
                    <td data-label="Intensity">
                      <select 
                        className="cr-select" 
                        aria-label="Philosophy line intensity" 
                        value={line.intensity}
                        onChange={e => { config.philosophy[realIdx].intensity = e.target.value as 'quiet' | 'sharp' | 'loud'; onChange(); }}
                      >
                        <option value="quiet">quiet</option>
                        <option value="sharp">sharp</option>
                        <option value="loud">loud</option>
                      </select>
                    </td>
                    <td data-label="Actions" className="num-col">
                      <button 
                        className="cr-btn cr-btn-danger cr-btn-sm cr-btn-icon" 
                        type="button" 
                        aria-label="Remove philosophy line"
                        onClick={() => { config.philosophy.splice(realIdx, 1); onChange(); }}
                      >
                        <Icon name="delete" size="xs" tone="error" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <button className="cr-list-add-btn" type="button" onClick={() => {
        config.philosophy.push({ id: `p-${uid()}`, text: '', intensity: 'quiet', largeType: true, order: config.philosophy.length });
        onChange();
      }}><Icon name="spark" size="xs" tone="accent" />add philosophy line</button>
    </div>
  );
}

// ─── 7. HUMAN LAYER ─────────────────────────────────────────────

export function HumanEditor({ config, onChange }: EditorProps) {
  const motifs = [...(config.humanLayer?.motifs || [])].sort((a, b) => a.order - b.order);
  return (
    <div>
      <EditorHeader title="Human Layer" description="Personal motifs and atmospheric elements" config={config} onChange={onChange} />
      {motifs.length === 0 ? (
        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--cr-text-3)', fontFamily: 'var(--cr-font-mono)' }}>
          <Icon name="person" size="md" tone="muted" style={{ marginBottom: '8px' }} />
          <div>No personal motifs defined. Add one below.</div>
        </div>
      ) : (
        <div className="cr-table-container" style={{ marginTop: '16px' }}>
          <table className="cr-table cr-table-soft density-balanced cr-table-responsive">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Index</th>
                <th>Personal Motif Statement</th>
                <th style={{ width: '120px' }}>Visible</th>
                <th className="num-col" style={{ width: '60px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {motifs.map((motif, idx) => {
                const realIdx = config.humanLayer.motifs.indexOf(motif);
                return (
                  <tr key={motif.id}>
                    <td data-label="Index" style={{ fontFamily: 'var(--cr-font-mono)', fontSize: '11px', color: 'var(--cr-text-3)' }}>
                      #{String(idx + 1).padStart(2, '0')}
                    </td>
                    <td data-label="Motif Statement">
                      <input 
                        className="cr-input" 
                        aria-label="Human layer motif" 
                        value={motif.text}
                        onChange={e => { config.humanLayer.motifs[realIdx].text = e.target.value; onChange(); }} 
                        placeholder="Type personal motif text..."
                      />
                    </td>
                    <td data-label="Visible">
                      <div className="cr-toggle cr-toggle-compact">
                        <input 
                          type="checkbox" 
                          className="cr-toggle-switch" 
                          aria-label="Toggle motif visibility" 
                          checked={motif.visible}
                          onChange={e => { config.humanLayer.motifs[realIdx].visible = e.target.checked; onChange(); }} 
                        />
                        <span style={{ fontSize: '10px', color: motif.visible ? 'var(--table-accent)' : 'var(--table-text-muted)', fontFamily: 'var(--cr-font-mono)' }}>
                          {motif.visible ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                    </td>
                    <td data-label="Actions" className="num-col">
                      <button 
                        className="cr-btn cr-btn-danger cr-btn-sm cr-btn-icon" 
                        type="button" 
                        aria-label="Remove motif"
                        onClick={() => { config.humanLayer.motifs.splice(realIdx, 1); onChange(); }}
                      >
                        <Icon name="delete" size="xs" tone="error" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <button className="cr-list-add-btn" type="button" onClick={() => {
        config.humanLayer.motifs.push({ id: `m-${uid()}`, text: '', symbol: '', visible: true, order: config.humanLayer.motifs.length });
        onChange();
      }}><Icon name="person" size="xs" tone="accent" />add motif</button>

      <div className="cr-section-label">Human Glitches</div>
      <Field label="Section Label"><TextInput config={config} path="humanLayer.glitchesSectionLabel" onChange={onChange} /></Field>
      <Field label="Title"><TextInput config={config} path="humanLayer.glitchesTitle" onChange={onChange} /></Field>
      {config.humanLayer.glitches.map((item, idx) => (
        <SubEditor key={item.id} title={`${String(idx + 1).padStart(2, '0')} - ${item.label || 'Human glitch'}`}>
          <div className="cr-field-row">
            <Field label="Label"><TextInput config={config} path={`humanLayer.glitches.${idx}.label`} onChange={onChange} /></Field>
            <Field label="Icon"><TextInput config={config} path={`humanLayer.glitches.${idx}.icon`} onChange={onChange} /></Field>
            <Field label="Order"><NumberInput config={config} path={`humanLayer.glitches.${idx}.order`} min={0} max={99} onChange={onChange} /></Field>
          </div>
          <Field label="Description"><TextInput config={config} path={`humanLayer.glitches.${idx}.description`} onChange={onChange} /></Field>
          <Field label="Visible"><Toggle config={config} path={`humanLayer.glitches.${idx}.visible`} label="Show this item" onChange={onChange} /></Field>
          <button className="cr-btn cr-btn-danger cr-btn-sm icon-align-inline" type="button" onClick={() => { config.humanLayer.glitches.splice(idx, 1); onChange(); }}>
            <Icon name="delete" size="xs" tone="error" />delete item
          </button>
        </SubEditor>
      ))}
      <button className="cr-list-add-btn" type="button" onClick={() => {
        config.humanLayer.glitches.push({ id: `glitch-${uid()}`, label: '', description: '', visible: true, order: config.humanLayer.glitches.length, icon: 'signal' });
        onChange();
      }}><Icon name="signal" size="xs" tone="accent" />add human glitch</button>
    </div>
  );
}

// ─── 8. TIMELINE ────────────────────────────────────────────────

export function TimelineEditor({ config, onChange }: EditorProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const entries = [...config.timeline].sort((a, b) => a.order - b.order);
  return (
    <div>
      <EditorHeader title="Timeline / Build Log" description="Chronological entries" config={config} onChange={onChange} />
      {entries.length === 0 ? (
        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--cr-text-3)', fontFamily: 'var(--cr-font-mono)' }}>
          <Icon name="log" size="md" tone="muted" style={{ marginBottom: '8px' }} />
          <div>No timeline entries defined. Add one below.</div>
        </div>
      ) : (
        <div className="cr-table-container" style={{ marginTop: '16px' }}>
          <table className="cr-table cr-table-cards density-balanced cr-table-responsive">
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th style={{ width: '130px' }}>Date / Range</th>
                <th>Event Title</th>
                <th style={{ width: '70px' }} className="num-col">Order</th>
                <th style={{ width: '100px' }}>Status</th>
                <th className="num-col" style={{ width: '100px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => {
                const realIdx = config.timeline.indexOf(entry);
                const isExpanded = expandedIds.has(entry.id);
                return (
                  <tr key={entry.id} style={{ display: 'contents' }}>
                    <td style={{ display: 'none' }}></td>
                    <tr 
                      className={`cr-expand-row ${isExpanded ? 'is-selected' : ''}`}
                      onClick={() => toggleExpand(entry.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td data-label="Expand" className="center-col">
                        <Icon 
                          name="chevron" 
                          size="xs" 
                          tone="accent" 
                          state={isExpanded ? 'active' : 'idle'} 
                          style={{ 
                            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 150ms ease',
                            display: 'inline-block'
                          }} 
                        />
                      </td>
                      <td data-label="Date / Range" style={{ fontFamily: 'var(--cr-font-mono)', fontSize: '11px' }}>
                        {entry.date || '—'}
                      </td>
                      <td data-label="Event Title" style={{ fontWeight: 600 }}>
                        {entry.title || 'Untitled Entry'}
                      </td>
                      <td data-label="Order" className="num-col" style={{ fontFamily: 'var(--cr-font-mono)' }}>
                        {entry.order}
                      </td>
                      <td data-label="Status">
                        <span className={`cr-badge ${entry.visible ? 'cr-badge-success' : 'cr-badge-warning'}`}>
                          <Icon name={entry.visible ? 'success' : 'warning'} size="xs" tone={entry.visible ? 'success' : 'warning'} />
                          {entry.visible ? 'Visible' : 'Hidden'}
                        </span>
                      </td>
                      <td data-label="Actions" className="num-col" onClick={e => e.stopPropagation()}>
                        <div className="cr-row-actions">
                          <button 
                            className="cr-btn cr-btn-ghost cr-btn-sm cr-btn-icon" 
                            type="button" 
                            aria-label="Edit timeline entry"
                            onClick={() => toggleExpand(entry.id)}
                          >
                            <Icon name="edit" size="xs" tone="muted" />
                          </button>
                          <button 
                            className="cr-btn cr-btn-danger cr-btn-sm cr-btn-icon" 
                            type="button" 
                            aria-label="Delete entry"
                            onClick={async () => {
                              const ok = await confirmDialog('Delete Entry', `Delete "${entry.title}"?`);
                              if (ok) { config.timeline.splice(realIdx, 1); onChange(); }
                            }}
                          >
                            <Icon name="delete" size="xs" tone="error" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr 
                        className={`cr-detail-row is-expanded`}
                        onClick={e => e.stopPropagation()}
                      >
                        <td colSpan={6} style={{ padding: '16px 20px', borderBottom: '1px solid var(--table-border)' }}>
                          <div className="cr-detail-content" style={{ maxHeight: '500px', opacity: 1 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                              <Field label="Date / Range"><TextInput config={config} path={`timeline.${realIdx}.date`} onChange={onChange} /></Field>
                              <Field label="Title"><TextInput config={config} path={`timeline.${realIdx}.title`} onChange={onChange} /></Field>
                            </div>
                            
                            <Field label="Description"><TextArea config={config} path={`timeline.${realIdx}.description`} rows={2} onChange={onChange} /></Field>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '12px', alignItems: 'end' }}>
                              <Field label="Order"><NumberInput config={config} path={`timeline.${realIdx}.order`} min={0} max={99} onChange={onChange} /></Field>
                              <Field label="Visible"><Toggle config={config} path={`timeline.${realIdx}.visible`} label="Show this entry" onChange={onChange} /></Field>
                              <Field label="Tags (comma-separated)">
                                <input 
                                  className="cr-input" 
                                  value={entry.tags.join(', ')}
                                  onChange={e => { 
                                    config.timeline[realIdx].tags = e.target.value.split(',').map(s => s.trim()).filter(Boolean); 
                                    onChange(); 
                                  }} 
                                />
                              </Field>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <button className="cr-list-add-btn" type="button" onClick={() => {
        const newId = `t-${uid()}`;
        config.timeline.push({ id: newId, date: '', title: '', description: '', tags: [], visible: true, order: config.timeline.length });
        onChange();
        toggleExpand(newId);
      }}><Icon name="log" size="xs" tone="accent" />add timeline entry</button>
    </div>
  );
}

// ─── 9. CONTACT ─────────────────────────────────────────────────

export function ContactEditor({ config, onChange }: EditorProps) {
  return (
    <div>
      <EditorHeader title="Contact / Links" description="Email, social links, CTAs" config={config} onChange={onChange} />
      <Field label="Email"><TextInput config={config} path="contact.email" onChange={onChange} /></Field>
      <Field label="Handle"><TextInput config={config} path="contact.handle" onChange={onChange} /></Field>
      <Field label="Location"><TextInput config={config} path="contact.location" onChange={onChange} /></Field>
      <div className="cr-section-label">CTA</div>
      <Field label="CTA Text"><TextInput config={config} path="contact.ctaText" onChange={onChange} /></Field>
      <Field label="CTA Link"><TextInput config={config} path="contact.ctaLink" onChange={onChange} /></Field>
      <Field label="Resume Label"><TextInput config={config} path="contact.resumeLabel" onChange={onChange} /></Field>
      <Field label="Resume Link"><TextInput config={config} path="contact.resumeLink" onChange={onChange} /></Field>
      <div className="cr-section-label">Social Links</div>
      <Field label="GitHub"><TextInput config={config} path="contact.githubLink" onChange={onChange} /></Field>
      <Field label="LinkedIn"><TextInput config={config} path="contact.linkedinLink" onChange={onChange} /></Field>
      <div className="cr-section-label">Custom Links</div>
      {config.contact.customLinks.map((link, idx) => (
        <div key={idx} className="cr-field-row cr-field-row-end">
          <Field label="Label"><TextInput config={config} path={`contact.customLinks.${idx}.label`} onChange={onChange} /></Field>
          <Field label="Href"><TextInput config={config} path={`contact.customLinks.${idx}.href`} onChange={onChange} /></Field>
          <button className="cr-btn cr-btn-danger cr-btn-sm cr-field-action-bottom" type="button" aria-label={`Remove custom link ${link.label || idx + 1}`}
            onClick={() => { config.contact.customLinks.splice(idx, 1); onChange(); }}><Icon name="delete" size="xs" tone="error" /></button>
        </div>
      ))}
      <button className="cr-list-add-btn" type="button" onClick={() => {
        config.contact.customLinks.push({ label: '', href: '' }); onChange();
      }}><Icon name="externalLink" size="xs" tone="accent" />add custom link</button>
    </div>
  );
}

// ─── 10. TYPOGRAPHY ─────────────────────────────────────────────

export function LabModulesEditor({ config, onChange }: EditorProps) {
  const modules = [...config.controlRoomModules.items].sort((a, b) => a.order - b.order);

  return (
    <div>
      <EditorHeader title="Lab Modules" description="Control the private Control Room overview and its operating shortcuts" config={config} onChange={onChange} />
      <Field label="Title"><TextInput config={config} path="controlRoomModules.title" onChange={onChange} /></Field>
      <Field label="Description"><TextArea config={config} path="controlRoomModules.description" rows={2} onChange={onChange} /></Field>
      {modules.map(module => {
        const idx = config.controlRoomModules.items.indexOf(module);
        return (
          <SubEditor key={module.id} title={`${String(module.order + 1).padStart(2, '0')} - ${module.title || 'Lab module'}`}>
            <div className="cr-field-row">
              <Field label="Title"><TextInput config={config} path={`controlRoomModules.items.${idx}.title`} onChange={onChange} /></Field>
              <Field label="Status"><TextInput config={config} path={`controlRoomModules.items.${idx}.status`} onChange={onChange} /></Field>
              <Field label="Icon"><TextInput config={config} path={`controlRoomModules.items.${idx}.icon`} onChange={onChange} /></Field>
            </div>
            <Field label="Description"><TextArea config={config} path={`controlRoomModules.items.${idx}.description`} rows={2} onChange={onChange} /></Field>
            <div className="cr-field-row">
              <Field label="Target Panel"><TextInput config={config} path={`controlRoomModules.items.${idx}.targetPanel`} placeholder="e.g. projects" onChange={onChange} /></Field>
              <Field label="External Href"><TextInput config={config} path={`controlRoomModules.items.${idx}.href`} placeholder="Optional asset or URL" onChange={onChange} /></Field>
              <Field label="Order"><NumberInput config={config} path={`controlRoomModules.items.${idx}.order`} min={0} max={99} onChange={onChange} /></Field>
            </div>
            <Field label="Visible"><Toggle config={config} path={`controlRoomModules.items.${idx}.visible`} label="Show on lab overview" onChange={onChange} /></Field>
            <button className="cr-btn cr-btn-danger cr-btn-sm icon-align-inline" type="button" onClick={() => { config.controlRoomModules.items.splice(idx, 1); onChange(); }}>
              <Icon name="delete" size="xs" tone="error" />delete module
            </button>
          </SubEditor>
        );
      })}
      <button className="cr-list-add-btn" type="button" onClick={() => {
        config.controlRoomModules.items.push({ id: `lab-${uid()}`, title: 'New module', description: '', status: 'draft', targetPanel: '', href: '', visible: true, order: config.controlRoomModules.items.length, icon: 'settings' });
        onChange();
      }}><Icon name="database" size="xs" tone="accent" />add lab module</button>
    </div>
  );
}

export function TypographyEditor({ config, onChange }: EditorProps) {
  const themeEngine = useThemeEngine();
  const importRef = useRef<HTMLInputElement>(null);
  config.typographySystem = normalizeTypographySystem(config.typographySystem);
  const warnings = validateTypographySystem(config.typographySystem);

  const treatmentSlots: { slot: TextTreatmentSlot; label: string; hint: string }[] = [
    { slot: 'heroHeadline', label: 'Hero Headline', hint: 'Most expressive, used for Aryan Sharma.' },
    { slot: 'sectionTitle', label: 'Section Titles', hint: 'Editorial hierarchy and ghost layers.' },
    { slot: 'projectTitle', label: 'Project Titles', hint: 'Case-file / dossier identity.' },
    { slot: 'manifestoLine', label: 'Manifesto Lines', hint: 'Sharp operating principles.' },
    { slot: 'metadata', label: 'Metadata', hint: 'Mono signal labels and trace IDs.' },
    { slot: 'identityStatement', label: 'Identity Statement', hint: 'Restrained cinematic positioning.' },
    { slot: 'contactHeading', label: 'Contact Heading', hint: 'Final channel / CTA tone.' },
  ];

  const applyPreset = (name: TypographyPresetName) => {
    config.typographySystem = getTypographyPreset(name);
    onChange();
    toast(`Typography preset applied: ${name}`, 'info');
  };

  const resetToThemeDefault = () => {
    config.typographySystem = normalizeTypographySystem(themeEngine.activeTheme.typographySystem);
    onChange();
    toast('Typography reset to active theme default', 'info');
  };

  const saveCustomPreset = () => {
    localStorage.setItem('aryan_typography_custom_preset', JSON.stringify(config.typographySystem));
    toast('Custom typography preset saved locally', 'success');
  };

  const exportTypography = () => {
    const blob = new Blob([JSON.stringify(config.typographySystem, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aryan-typography-system.json';
    a.click();
    URL.revokeObjectURL(url);
    toast('Typography config exported', 'success');
  };

  const importTypography = async () => {
    const file = importRef.current?.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      config.typographySystem = normalizeTypographySystem(parsed);
      onChange();
      toast('Typography config imported', 'success');
    } catch (e) {
      toast(`Import failed: ${(e as Error).message}`, 'error');
    }
    if (importRef.current) importRef.current.value = '';
  };

  return (
    <div className="typography-lab">
      <EditorHeader title="Typography Lab" description="Theme-aware text direction, readability, treatments, and motion" config={config} onChange={onChange} />

      <div className="theme-engine-block typography-lab-toolbar">
        <Field label="Treatment Preset">
          <select className="cr-select" value={config.typographySystem.presetName} onChange={e => applyPreset(e.target.value as TypographyPresetName)}>
            {TYPOGRAPHY_PRESET_NAMES.map(name => <option key={name} value={name}>{name}</option>)}
          </select>
        </Field>
        <div className="typography-lab-actions">
          <button className="cr-btn cr-btn-ghost cr-btn-sm" type="button" onClick={resetToThemeDefault}>reset to theme default</button>
          <button className="cr-btn cr-btn-ghost cr-btn-sm" type="button" onClick={saveCustomPreset}>save custom preset</button>
          <button className="cr-btn cr-btn-ghost cr-btn-sm" type="button" onClick={exportTypography}>export typography</button>
          <button className="cr-btn cr-btn-ghost cr-btn-sm" type="button" onClick={() => importRef.current?.click()}>import typography</button>
        </div>
        <input ref={importRef} type="file" accept=".json" hidden onChange={importTypography} />
      </div>

      {warnings.length > 0 && (
        <div className="typography-warnings" role="status">
          {warnings.map(warning => <span key={warning.code}>{warning.message}</span>)}
        </div>
      )}

      <div className="cr-section-label">Global Font Controls</div>
      <Field label="Display Font" hint="--font-display"><TextInput config={config} path="typography.displayFont" onChange={onChange} /></Field>
      <Field label="Body Font" hint="--font-body"><TextInput config={config} path="typography.bodyFont" onChange={onChange} /></Field>
      <Field label="Mono Font" hint="--font-mono"><TextInput config={config} path="typography.monoFont" onChange={onChange} /></Field>

      <div className="cr-section-label">Heading Scale & Readability</div>
      <Field label="Base Font Size"><TextInput config={config} path="typography.baseFontSize" onChange={onChange} /></Field>
      <Field label="Heading Scale"><Range config={config} path="typographySystem.controls.headingScale" min={0.75} max={1.35} step={0.01} onChange={onChange} /></Field>
      <Field label="Line Height"><Range config={config} path="typographySystem.controls.lineHeight" min={1.15} max={2.0} step={0.01} onChange={onChange} /></Field>
      <Field label="Letter Spacing"><TextInput config={config} path="typographySystem.controls.letterSpacing" onChange={onChange} /></Field>
      <Field label="Heading Weight"><Range config={config} path="typography.headingWeight" min={100} max={900} step={50} onChange={onChange} /></Field>
      <Field label="Body Weight"><Range config={config} path="typography.bodyWeight" min={100} max={900} step={50} onChange={onChange} /></Field>

      <div className="cr-section-label">Treatment Selectors</div>
      {treatmentSlots.map(({ slot, label, hint }) => (
        <SubEditor key={slot} title={label} defaultOpen={slot === 'heroHeadline' || slot === 'sectionTitle'}>
          <Field label="Effect" hint={hint}>
            <Select config={config} path={`typographySystem.treatments.${slot}.effect`} options={TEXT_EFFECT_OPTIONS} onChange={onChange} />
          </Field>
          <div className="cr-field-row">
            <Field label="Motion"><Select config={config} path={`typographySystem.treatments.${slot}.motion`} options={TEXT_MOTION_OPTIONS} onChange={onChange} /></Field>
            <Field label="Texture"><Select config={config} path={`typographySystem.treatments.${slot}.texture`} options={TEXT_TEXTURE_OPTIONS} onChange={onChange} /></Field>
          </div>
          <Field label="Effect Intensity"><Range config={config} path={`typographySystem.treatments.${slot}.intensity`} min={0} max={1} step={0.01} onChange={onChange} /></Field>
          <Field label="Slot Glow"><Range config={config} path={`typographySystem.treatments.${slot}.glow`} min={0} max={0.5} step={0.01} onChange={onChange} /></Field>
          <Field label="Slot Outline"><Range config={config} path={`typographySystem.treatments.${slot}.outline`} min={0} max={1} step={0.01} onChange={onChange} /></Field>
        </SubEditor>
      ))}

      <div className="cr-section-label">Effect Intensity Sliders</div>
      <Field label="Text Animation Intensity"><Range config={config} path="typographySystem.controls.animationIntensity" min={0} max={1} step={0.01} onChange={onChange} /></Field>
      <Field label="Glow Intensity"><Range config={config} path="typographySystem.controls.glowIntensity" min={0} max={0.5} step={0.01} onChange={onChange} /></Field>
      <Field label="Outline Thickness"><Range config={config} path="typographySystem.controls.outlineThickness" min={0} max={4} step={0.1} suffix="px" onChange={onChange} /></Field>
      <Field label="Stroke Opacity"><Range config={config} path="typographySystem.controls.strokeOpacity" min={0} max={1} step={0.01} onChange={onChange} /></Field>
      <Field label="Masked Texture Opacity"><Range config={config} path="typographySystem.controls.maskedTextureOpacity" min={0} max={1} step={0.01} onChange={onChange} /></Field>
      <Field label="Grain Amount"><Range config={config} path="typographySystem.controls.grainAmount" min={0} max={0.4} step={0.01} onChange={onChange} /></Field>

      <div className="cr-section-label">Hero Animation Controls</div>
      <Field label="Kinetic Stagger Delay"><Range config={config} path="typographySystem.controls.kineticStaggerDelay" min={0} max={160} step={1} suffix="ms" onChange={onChange} /></Field>
      <Field label="Reveal Duration"><Range config={config} path="typographySystem.controls.revealDuration" min={100} max={900} step={10} suffix="ms" onChange={onChange} /></Field>

      <div className="cr-section-label">Case & Experimental Options</div>
      <Field label="Label Case"><Select config={config} path="typography.sectionLabelStyle" options={[
        { value: 'uppercase', label: 'UPPERCASE' }, { value: 'lowercase', label: 'lowercase' },
        { value: 'capitalize', label: 'Capitalize' }, { value: 'none', label: 'None' },
      ]} onChange={onChange} /></Field>
      <Field label="Global Case Behavior"><Select config={config} path="typographySystem.controls.caseBehavior" options={[
        { value: 'theme', label: 'Theme Default' }, { value: 'none', label: 'None' },
        { value: 'uppercase', label: 'UPPERCASE' }, { value: 'lowercase', label: 'lowercase' },
        { value: 'capitalize', label: 'Capitalize' },
      ]} onChange={onChange} /></Field>
      <div className="cr-field-row">
        <Field label="Path Text"><Toggle config={config} path="typographySystem.controls.pathTextEnabled" label="Enable rare circular identity stamp" onChange={onChange} /></Field>
        <Field label="Glitch States"><Toggle config={config} path="typographySystem.controls.glitchEnabled" label="Allow metadata hover glitch" onChange={onChange} /></Field>
      </div>

      <div className="cr-section-label">Accessibility Preview</div>
      <Field label="Reading Mode"><Toggle config={config} path="typographySystem.controls.readingMode" label="Disable decorative text effects" onChange={onChange} /></Field>
      <Field label="Reduced Motion Behavior"><Select config={config} path="typographySystem.controls.reducedMotionBehavior" options={[
        { value: 'respect-system', label: 'Respect System' },
        { value: 'force-reduced', label: 'Force Reduced Motion' },
        { value: 'reading-mode', label: 'Reading Mode' },
      ]} onChange={onChange} /></Field>
    </div>
  );
}

// ─── 11. COLORS ─────────────────────────────────────────────────

export function ColorsEditor({ config, onChange }: EditorProps) {
  const fields = [
    { key: 'bg', label: 'Base Background', variable: '--color-bg' },
    { key: 'bgSecondary', label: 'Secondary Background', variable: '--color-bg-secondary' },
    { key: 'panel', label: 'Panel Background', variable: '--color-panel' },
    { key: 'text', label: 'Primary Text', variable: '--color-text' },
    { key: 'textSecondary', label: 'Secondary Text', variable: '--color-text-secondary' },
    { key: 'textMuted', label: 'Muted Text', variable: '--color-text-muted' },
    { key: 'accent', label: 'Primary Accent', variable: '--color-accent' },
    { key: 'accentSecondary', label: 'Secondary Accent', variable: '--color-accent-secondary' },
    { key: 'accentEmotional', label: 'Emotional Accent', variable: '--color-accent-emotional' },
    { key: 'accentProof', label: 'Proof Accent', variable: '--color-accent-proof' },
    { key: 'border', label: 'Border', variable: '--color-border' },
    { key: 'borderSubtle', label: 'Border Subtle', variable: '--color-border-subtle' },
    { key: 'borderStrong', label: 'Border Strong', variable: '--color-border-strong' },
    { key: 'glow', label: 'Glow Color', variable: '--color-glow' },
    { key: 'selection', label: 'Selection Color', variable: '--color-selection' },
  ];
  return (
    <div>
      <EditorHeader title="Colors" description="Full theme color palette — all mapped to CSS variables" config={config} onChange={onChange} />
      <div className="cr-table-container" style={{ marginTop: '16px' }}>
        <table className="cr-table cr-table-soft density-compact">
          <thead>
            <tr>
              <th>Token Name</th>
              <th>CSS Variable</th>
              <th className="num-col">Hex Value / Color Picker</th>
            </tr>
          </thead>
          <tbody>
            {fields.map(f => (
              <tr key={f.key}>
                <td>
                  <strong>{f.label}</strong>
                </td>
                <td>
                  <code style={{ fontSize: '10px', opacity: 0.8 }}>{f.variable}</code>
                </td>
                <td className="num-col">
                  <div style={{ display: 'inline-block', width: '220px', textAlign: 'left' }}>
                    <ColorField config={config} path={`colors.${f.key}`} onChange={onChange} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── 12. BACKGROUND ─────────────────────────────────────────────

export function BackgroundEditor({ config, onChange }: EditorProps) {
  return (
    <div>
      <EditorHeader title="Background / Soft Trace Grid" description="Dot matrix, radial glow, vignette" config={config} onChange={onChange} />
      <Field label="Enable Background"><Toggle config={config} path="background.enabled" label="Show ambient dot-grid" onChange={onChange} /></Field>
      <div className="cr-section-label">Dot Grid</div>
      <Field label="Dot Size"><Range config={config} path="background.dotSize" min={0.5} max={4} step={0.1} suffix="px" onChange={onChange} /></Field>
      <Field label="Dot Spacing"><Range config={config} path="background.dotSpacing" min={8} max={128} step={2} suffix="px" onChange={onChange} /></Field>
      <Field label="Dot Opacity"><Range config={config} path="background.dotOpacity" min={0} max={0.5} step={0.01} onChange={onChange} /></Field>
      <Field label="Dot Field Opacity"><Range config={config} path="background.dotFieldOpacity" min={0} max={1} step={0.01} onChange={onChange} /></Field>
      <div className="cr-section-label">Radial Glow</div>
      <Field label="Glow Color"><ColorField config={config} path="background.radialGlowColor" onChange={onChange} /></Field>
      <Field label="Glow Opacity"><Range config={config} path="background.radialGlowOpacity" min={0} max={0.5} step={0.01} onChange={onChange} /></Field>
      <Field label="Glow Blur"><Range config={config} path="background.radialGlowBlur" min={0} max={100} step={1} suffix="px" onChange={onChange} /></Field>
      <div className="cr-section-label">Vignette</div>
      <Field label="Vignette Opacity"><Range config={config} path="background.vignetteOpacity" min={0} max={1} step={0.01} onChange={onChange} /></Field>
    </div>
  );
}

// ─── 13. MOTION ─────────────────────────────────────────────────

export function MotionEditor({ config, onChange }: EditorProps) {
  return (
    <div>
      <EditorHeader title="Motion / Animation" description="Global motion, reveals, hover, timing" config={config} onChange={onChange} />
      <Field label="Global Motion"><Toggle config={config} path="motion.enabled" label="Enable animations" onChange={onChange} /></Field>
      <Field label="Reduced Motion"><Toggle config={config} path="motion.reducedMotion" label="Force reduced motion" onChange={onChange} /></Field>
      <div className="cr-section-label">Reveal</div>
      <Field label="Reveal Type"><Select config={config} path="motion.revealType" options={[
        { value: 'translateY', label: 'Slide Up' }, { value: 'fadeIn', label: 'Fade In' },
        { value: 'scale', label: 'Scale' }, { value: 'none', label: 'None' },
      ]} onChange={onChange} /></Field>
      <Field label="Reveal Duration"><Range config={config} path="motion.revealDuration" min={0} max={2000} step={10} suffix="ms" onChange={onChange} /></Field>
      <Field label="Reveal Delay"><Range config={config} path="motion.revealDelay" min={0} max={500} step={10} suffix="ms" onChange={onChange} /></Field>
      <div className="cr-section-label">Interaction</div>
      <Field label="Hover Glow"><Range config={config} path="motion.hoverGlowIntensity" min={0} max={2} step={0.1} onChange={onChange} /></Field>
      <Field label="Expansion Speed"><Range config={config} path="motion.projectExpansionSpeed" min={100} max={1000} step={10} suffix="ms" onChange={onChange} /></Field>
      <div className="cr-section-label">Features</div>
      <Field label="Command Palette"><Toggle config={config} path="motion.commandPaletteEnabled" label="Enable" onChange={onChange} /></Field>
      <Field label="Cursor Blink"><Toggle config={config} path="motion.cursorBlinkEnabled" label="Enable" onChange={onChange} /></Field>
      <div className="cr-section-label">Duration Tokens</div>
      <Field label="Fast"><Range config={config} path="motion.durationFast" min={50} max={500} step={10} suffix="ms" onChange={onChange} /></Field>
      <Field label="Standard"><Range config={config} path="motion.durationStandard" min={100} max={800} step={10} suffix="ms" onChange={onChange} /></Field>
      <Field label="Slow"><Range config={config} path="motion.durationSlow" min={200} max={1500} step={10} suffix="ms" onChange={onChange} /></Field>
    </div>
  );
}

// ─── 14. LAYOUT ─────────────────────────────────────────────────

export function LayoutEditor({ config, onChange }: EditorProps) {
  return (
    <div>
      <EditorHeader title="Layout / Spacing" description="Width, padding, gaps, radius, density" config={config} onChange={onChange} />
      <Field label="Max Content Width"><TextInput config={config} path="layout.maxContentWidth" onChange={onChange} /></Field>
      <Field label="Header Height"><TextInput config={config} path="layout.headerHeight" onChange={onChange} /></Field>
      <div className="cr-section-label">Section Spacing</div>
      <Field label="Section Padding Top"><TextInput config={config} path="layout.sectionPaddingTop" onChange={onChange} /></Field>
      <Field label="Section Padding Bottom"><TextInput config={config} path="layout.sectionPaddingBottom" onChange={onChange} /></Field>
      <Field label="Card Padding"><TextInput config={config} path="layout.cardPadding" onChange={onChange} /></Field>
      <Field label="Grid Gap"><TextInput config={config} path="layout.gridGap" onChange={onChange} /></Field>
      <Field label="Border Radius"><TextInput config={config} path="layout.borderRadius" onChange={onChange} /></Field>
      <Field label="Panel Blur"><Range config={config} path="layout.panelBlur" min={0} max={100} step={1} suffix="px" onChange={onChange} /></Field>
      <div className="cr-section-label">Options</div>
      <Field label="Nav Position"><Select config={config} path="layout.navPosition" options={[
        { value: 'sticky', label: 'Sticky' }, { value: 'fixed', label: 'Fixed' }, { value: 'static', label: 'Static' },
      ]} onChange={onChange} /></Field>
      <Field label="Section Alignment"><Select config={config} path="layout.sectionAlignment" options={[
        { value: 'left', label: 'Left' }, { value: 'center', label: 'Center' },
      ]} onChange={onChange} /></Field>
      <Field label="Density"><Select config={config} path="layout.densityMode" options={[
        { value: 'compact', label: 'Compact' }, { value: 'balanced', label: 'Balanced' }, { value: 'cinematic', label: 'Cinematic' },
      ]} onChange={onChange} /></Field>
    </div>
  );
}

// ─── 15. SEO ────────────────────────────────────────────────────

export function SeoEditor({ config, onChange }: EditorProps) {
  return (
    <div>
      <EditorHeader title="SEO / Meta" description="Page title, meta description, OpenGraph" config={config} onChange={onChange} />
      <Field label="Page Title"><TextInput config={config} path="seo.pageTitle" onChange={onChange} /></Field>
      <Field label="Meta Description"><TextArea config={config} path="seo.metaDescription" rows={3} onChange={onChange} /></Field>
      <Field label="OG Title"><TextInput config={config} path="seo.ogTitle" onChange={onChange} /></Field>
      <Field label="OG Description"><TextArea config={config} path="seo.ogDescription" rows={2} onChange={onChange} /></Field>
      <Field label="OG Image URL"><TextInput config={config} path="seo.ogImage" onChange={onChange} /></Field>
      <Field label="Theme Color"><ColorField config={config} path="seo.themeColor" onChange={onChange} /></Field>
    </div>
  );
}

// ─── 16. ASSETS ─────────────────────────────────────────────────

export function AssetsEditor({ config, onChange }: EditorProps) {
  return (
    <div>
      <EditorHeader title="Assets" description="Profile image, resume, project images" config={config} onChange={onChange} />
      <Field label="Profile Image URL"><TextInput config={config} path="assets.profileImage" onChange={onChange} /></Field>
      <Field label="Resume File URL"><TextInput config={config} path="assets.resumeFile" onChange={onChange} /></Field>
      <Field label="OG Image URL"><TextInput config={config} path="assets.ogImage" onChange={onChange} /></Field>
      <Field label="Custom Logo URL"><TextInput config={config} path="assets.customLogo" onChange={onChange} /></Field>
    </div>
  );
}

// ─── 17. JSON EDITOR ────────────────────────────────────────────

export function JsonEditor({ config, onChange }: EditorProps) {
  const [json, setJson] = useState(JSON.stringify(config, null, 2));
  const [status, setStatus] = useState<{ type: 'valid' | 'error'; message: string } | null>(null);

  const validate = () => {
    try {
      const parsed = JSON.parse(json);
      const result = validateConfig(parsed);
      if (result.valid) setStatus({ type: 'valid', message: '✓ Valid configuration' });
      else setStatus({ type: 'error', message: result.errors.join('\n') });
    } catch (e) { setStatus({ type: 'error', message: `Parse Error: ${(e as Error).message}` }); }
  };

  const format = () => {
    try { setJson(JSON.stringify(JSON.parse(json), null, 2)); toast('JSON formatted', 'info'); }
    catch (e) { toast(`Invalid JSON: ${(e as Error).message}`, 'error'); }
  };

  const copy = () => { navigator.clipboard.writeText(json).then(() => toast('Copied', 'success')); };

  const apply = () => {
    try {
      const parsed = JSON.parse(json);
      const result = validateConfig(parsed);
      if (result.valid) {
        Object.assign(config, parsed);
        onChange();
        toast('Draft updated from JSON', 'info');
      } else { toast(`Validation failed: ${result.errors[0]}`, 'error'); }
    } catch { /* invalid JSON, ignore */ }
  };

  return (
    <div>
      <EditorHeader title="Advanced JSON Editor" description="Direct config editing, validation" config={config} onChange={onChange} />
      <div className="cr-editor-actions cr-editor-actions-spaced">
        <button className="cr-btn cr-btn-ghost" type="button" onClick={validate}>validate</button>
        <button className="cr-btn cr-btn-ghost" type="button" onClick={format}>format</button>
        <button className="cr-btn cr-btn-ghost" type="button" onClick={copy}>copy</button>
        <button className="cr-btn cr-btn-primary" type="button" onClick={apply}>apply json</button>
      </div>
      <textarea className="cr-json-editor" spellCheck={false} value={json} onChange={e => setJson(e.target.value)} />
      {status && (
        <div className={status.type === 'valid' ? 'cr-json-valid' : 'cr-json-error'}>{status.message}</div>
      )}
    </div>
  );
}

// ─── 18. PORTRAIT EDITOR ─────────────────────────────────────────

export function PortraitEditor({ config, onChange }: EditorProps) {
  const themeEngine = useThemeEngine();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const activeThemeSrc = getPortraitForTheme(themeEngine.activeThemeId);

  config.portrait = config.portrait || {
    enabled: true,
    src: 'assets/aryan-profile.png',
    alt: '',
    placement: 'hero',
    variant: 'cinematic-panel',
    aspectRatio: '4 / 5',
    objectPosition: '52% 50%',
    showMetadata: false,
    metadata: [],
    effects: { vignette: 0.34, glow: 0.14, grain: 0.04, hoverLift: false, scrollReveal: true }
  };
  config.portrait.metadata = config.portrait.metadata || [];
  config.portrait.effects = config.portrait.effects || { vignette: 0.34, glow: 0.14, grain: 0.04, hoverLift: false, scrollReveal: true };

  return (
    <div>
      <EditorHeader title="Portrait System" description="Manage personal picture rendering, placement, filters, and overlays" config={config} onChange={onChange} />
      
      <Field label="Enable Portrait"><Toggle config={config} path="portrait.enabled" label="Show image on site" onChange={onChange} /></Field>
      
      <div className="cr-section-label">Placement & Aspect</div>
      <Field label="Section Placement"><Select config={config} path="portrait.placement" options={[
        { value: 'hero', label: 'Hero Section (Console Column)' },
        { value: 'human-layer', label: 'Human Layer (Dossier Layout)' },
        { value: 'floating-card', label: 'Floating Picture Panel' },
        { value: 'cinematic-panel', label: 'Cinematic Sidebar' },
        { value: 'hidden', label: 'Hidden / Off' }
      ]} onChange={onChange} /></Field>

      <Field label="Design Variant"><Select config={config} path="portrait.variant" options={[
        { value: 'editorial', label: 'Editorial (Asymmetric Frame)' },
        { value: 'identity-card', label: 'Identity Card' },
        { value: 'bento', label: 'Bento Grid (Scrolling Logs + Stats)' },
        { value: 'archive', label: 'Archive (Classified File Stamp)' },
        { value: 'cinematic-panel', label: 'Cinematic Panel' }
      ]} onChange={onChange} /></Field>

      <div className="cr-field-row">
        <Field label="Aspect Ratio" hint="e.g. 4/5, 1/1, 9/16"><TextInput config={config} path="portrait.aspectRatio" onChange={onChange} /></Field>
        <Field label="Object Position" hint="e.g. 52% 50%"><TextInput config={config} path="portrait.objectPosition" onChange={onChange} /></Field>
      </div>

      <div className="cr-section-label">Source & Alt</div>
      <Field label="Image URL / Path"><TextInput config={config} path="portrait.src" onChange={onChange} /></Field>
      <Field label="Alt Text"><TextInput config={config} path="portrait.alt" onChange={onChange} /></Field>

      <div className="cr-section-label">Visual Effects</div>
      <Field label="Vignette Opacity"><Range config={config} path="portrait.effects.vignette" min={0} max={1} step={0.01} onChange={onChange} /></Field>
      <Field label="Accent Glow Intensity"><Range config={config} path="portrait.effects.glow" min={0} max={1} step={0.01} onChange={onChange} /></Field>
      <Field label="Grain Noise Opacity"><Range config={config} path="portrait.effects.grain" min={0} max={0.3} step={0.01} onChange={onChange} /></Field>
      <div className="cr-field-row cr-field-row-spaced">
        <Field label="Hover Lift Offset"><Toggle config={config} path="portrait.effects.hoverLift" label="Slight lift on hover" onChange={onChange} /></Field>
        <Field label="Scroll Reveal Fade"><Toggle config={config} path="portrait.effects.scrollReveal" label="Fade in on viewport enter" onChange={onChange} /></Field>
      </div>

      <div className="cr-divider" />
      <Field label="Show Metadata Overlay"><Toggle config={config} path="portrait.showMetadata" label="Display parameter tags" onChange={onChange} /></Field>

      <div className="cr-section-label">Metadata Tags</div>
      {config.portrait.metadata.length === 0 ? (
        <div style={{ padding: '16px', textAlign: 'center', color: 'var(--cr-text-3)', fontFamily: 'var(--cr-font-mono)', fontSize: '11px' }}>
          No metadata tags defined. Add one below.
        </div>
      ) : (
        <div className="cr-table-container" style={{ marginTop: '12px', marginBottom: '12px' }}>
          <table className="cr-table cr-table-soft density-compact cr-table-responsive">
            <thead>
              <tr>
                <th>Metadata Label</th>
                <th>Metadata Value</th>
                <th className="num-col" style={{ width: '60px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {config.portrait.metadata.map((item, idx) => (
                <tr key={idx}>
                  <td data-label="Label">
                    <input className="cr-input" aria-label="Portrait metadata label" placeholder="Label (e.g. mode)" value={item.label}
                      onChange={e => { config.portrait.metadata[idx].label = e.target.value; onChange(); }} />
                  </td>
                  <td data-label="Value">
                    <input className="cr-input" aria-label="Portrait metadata value" placeholder="Value (e.g. nocturnal)" value={item.value}
                      onChange={e => { config.portrait.metadata[idx].value = e.target.value; onChange(); }} />
                  </td>
                  <td data-label="Actions" className="num-col">
                    <button className="cr-btn cr-btn-danger cr-btn-sm cr-btn-icon" type="button" aria-label="Remove portrait metadata row"
                      onClick={() => { config.portrait.metadata.splice(idx, 1); onChange(); }}><Icon name="delete" size="xs" tone="error" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button className="cr-list-add-btn" type="button" onClick={() => { config.portrait.metadata.push({ label: '', value: '' }); onChange(); }}><Icon name="trace" size="xs" tone="accent" />add metadata row</button>

      <div className="cr-divider" />
      <div className="cr-section-label">Theme Portraits Mapping</div>
      
      <div className="theme-portraits-lab">
        <div className="cr-rich-row-card" style={{ marginBottom: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div className="theme-portrait-thumb theme-portrait-thumb-lg" style={{ width: '70px', height: '88px', borderRadius: '4px' }}>
            <img src={activeThemeSrc} alt="Active theme portrait" />
          </div>
          <div className="theme-portrait-copy" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span className="theme-portrait-label" style={{ fontSize: '10px', color: 'var(--table-text-muted)', fontFamily: 'var(--cr-font-mono)' }}>active theme portrait</span>
            <strong style={{ fontSize: '16px' }}>{themeEngine.activeTheme.name}</strong>
            <code style={{ fontSize: '11px', color: 'var(--table-accent)' }}>{activeThemeSrc}</code>
          </div>
        </div>

        <div className="cr-table-container">
          <table className="cr-table cr-table-cards density-balanced cr-table-responsive">
            <thead>
              <tr>
                <th style={{ width: '80px' }} className="center-col">Preview</th>
                <th>Theme / System ID</th>
                <th>Portrait Asset Path</th>
                <th style={{ width: '140px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {themeEngine.builtInThemes.map(t => {
                const src = themePortraitMap[t.id];
                const hasError = imageErrors[t.id] || !src;
                const isActiveTheme = themeEngine.activeThemeId === t.id;
                return (
                  <tr key={t.id} className={isActiveTheme ? 'is-selected' : ''}>
                    <td data-label="Preview" className="center-col">
                      <div className="theme-portrait-thumb" style={{ width: '42px', height: '52px', margin: '0 auto', borderRadius: '2px' }}>
                        {src ? (
                          <img 
                            src={src} 
                            alt={`${t.name} portrait`} 
                            onError={() => setImageErrors(prev => ({ ...prev, [t.id]: true }))}
                          />
                        ) : (
                          <span style={{ fontSize: '8px', color: 'var(--table-text-muted)' }}>NO MAP</span>
                        )}
                      </div>
                    </td>
                    <td data-label="Theme">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <strong style={{ fontSize: '12px' }}>{t.name}</strong>
                        <code style={{ fontSize: '9px', color: 'var(--table-text-muted)' }}>{t.id}</code>
                      </div>
                    </td>
                    <td data-label="Path">
                      {src ? (
                        <code style={{ color: 'var(--table-accent)', fontSize: '11px' }}>{src}</code>
                      ) : (
                        <span style={{ color: 'var(--table-text-muted)', fontStyle: 'italic', fontSize: '11px' }}>Unassigned fallback</span>
                      )}
                    </td>
                    <td data-label="Status">
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {isActiveTheme && (
                          <span className="cr-badge cr-badge-info">
                            <Icon name="success" size="xs" tone="accent" />
                            active
                          </span>
                        )}
                        {hasError ? (
                          <span className="cr-badge cr-badge-error">
                            <Icon name="error" size="xs" tone="error" />
                            missing file
                          </span>
                        ) : (
                          <span className="cr-badge cr-badge-success">
                            <Icon name="success" size="xs" tone="success" />
                            mapped
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
