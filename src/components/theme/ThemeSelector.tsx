import { useThemeEngine } from '../../hooks/useThemeEngine';
import Icon from '../icons/Icon';

interface Props {
  compact?: boolean;
  label?: string;
  onThemeSelected?: (themeId: string) => void;
}

export default function ThemeSelector({ compact, label = 'Active theme', onThemeSelected }: Props) {
  const { allThemes, activeThemeId, setActiveTheme } = useThemeEngine();

  const handleChange = (themeId: string) => {
    setActiveTheme(themeId);
    onThemeSelected?.(themeId);
  };

  return (
    <label className={`theme-selector${compact ? ' theme-selector-compact' : ''}`}>
      <span className="icon-align-inline"><Icon name="palette" size="xs" tone="accent" />{label}</span>
      <select value={activeThemeId} aria-label={label} onChange={event => handleChange(event.target.value)}>
        {allThemes.map(theme => (
          <option key={theme.id} value={theme.id}>
            {theme.name} - {theme.preview?.vibeLabel ?? 'Custom theme'}
          </option>
        ))}
      </select>
    </label>
  );
}
