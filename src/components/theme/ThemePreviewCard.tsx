import type { ThemeDefinition } from '../../themes/themeTypes';
import Icon from '../icons/Icon';

interface Props {
  theme: ThemeDefinition;
  active: boolean;
  dirty?: boolean;
  onSelect: (themeId: string) => void;
}

export default function ThemePreviewCard({ theme, active, dirty, onSelect }: Props) {
  return (
    <button
      className={`theme-preview-card${active ? ' is-active' : ''}`}
      type="button"
      onClick={() => onSelect(theme.id)}
      aria-pressed={active}
    >
      <span className="theme-preview-art" style={{ background: theme.preview.gradient }}>
        <span
          className="theme-preview-dots"
          style={{
            backgroundImage: `radial-gradient(circle, ${theme.colors.textMuted} 0 ${theme.background.dotSize}px, transparent ${theme.background.dotSize + 0.4}px)`,
            backgroundSize: `${theme.background.dotSpacing / 2}px ${theme.background.dotSpacing / 2}px`,
            opacity: theme.background.dotFieldOpacity,
          }}
        />
        <span className="theme-preview-panel" style={{ borderColor: theme.colors.border, background: theme.colors.surfaceElevated }}>
          <span style={{ background: theme.colors.accentSecondary }} />
          <span style={{ background: theme.colors.borderStrong }} />
          <span style={{ color: theme.colors.text, fontFamily: theme.typography.displayFont }}>Aa</span>
        </span>
      </span>

      <span className="theme-preview-copy">
        <span className="theme-preview-title-row">
          <strong>{theme.name}</strong>
          <span className="icon-align-status"><Icon name={theme.source === 'custom' ? 'edit' : 'lock'} size="xs" tone="muted" />{theme.source === 'custom' ? 'custom' : 'default'}</span>
        </span>
        <span className="theme-preview-desc">{theme.shortDescription}</span>
        <span className="theme-preview-meta">{theme.emotionalTone}</span>
      </span>

      <span className="theme-preview-swatches" aria-hidden="true">
        {theme.preview.swatches.map(color => <span key={color} style={{ background: color }} />)}
      </span>

      <span className="theme-preview-tags">
        <span className="icon-align-status"><Icon name="layout" size="xs" tone="muted" />{theme.preview.densityLabel}</span>
        <span className="icon-align-status"><Icon name="motion" size="xs" tone="muted" />{theme.preview.motionLabel}</span>
        {active && <span className="icon-align-status is-synced"><Icon name="success" size="xs" tone="success" />active</span>}
        {dirty && <span className="icon-align-status is-dirty"><Icon name="warning" size="xs" tone="warning" />unsaved</span>}
      </span>
    </button>
  );
}
