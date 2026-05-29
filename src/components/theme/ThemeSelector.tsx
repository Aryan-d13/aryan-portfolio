import { useThemeEngine } from '../../hooks/useThemeEngine';

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
      <span>{label}</span>
      <select value={activeThemeId} onChange={event => handleChange(event.target.value)}>
        {allThemes.map(theme => (
          <option key={theme.id} value={theme.id}>
            {theme.name} - {theme.preview.vibeLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

