import type { ThemeDefinition } from '../../themes/themeTypes';

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
          <span>{theme.source === 'custom' ? 'custom' : 'default'}</span>
        </span>
        <span className="theme-preview-desc">{theme.shortDescription}</span>
        <span className="theme-preview-meta">{theme.emotionalTone}</span>
      </span>

      <span className="theme-preview-swatches" aria-hidden="true">
        {theme.preview.swatches.map(color => <span key={color} style={{ background: color }} />)}
      </span>

      <span className="theme-preview-tags">
        <span>{theme.preview.densityLabel}</span>
        <span>{theme.preview.motionLabel}</span>
        {dirty && <span className="is-dirty">unsaved</span>}
      </span>
    </button>
  );
}

