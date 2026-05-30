import { useState, useMemo } from 'react';
import type { NavGroup } from '../../types/siteConfig';
import Icon from '../icons/Icon';
import { controlGroupIconMap, controlNavIconMap } from '../icons/iconRegistry';

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Content', items: [
      { id: 'identity', label: 'Global Identity', index: '01' },
      { id: 'sections', label: 'Sections', index: '02' },
      { id: 'projects', label: 'Projects / Case Files', index: '03' },
      { id: 'proof', label: 'Proof Cards', index: '04' },
      { id: 'skills', label: 'Skills / Stack', index: '05' },
      { id: 'philosophy', label: 'Philosophy', index: '06' },
      { id: 'human', label: 'Human Layer', index: '07' },
      { id: 'timeline', label: 'Timeline / Build Log', index: '08' },
      { id: 'contact', label: 'Contact / Links', index: '09' },
    ],
  },
  {
    label: 'Design', items: [
      { id: 'theme', label: 'Theme Engine', index: '10' },
      { id: 'portrait', label: 'Portrait System', index: '11' },
      { id: 'typography', label: 'Typography Lab', index: '12' },
      { id: 'colors', label: 'Colors', index: '13' },
      { id: 'background', label: 'Background / Trace Grid', index: '14' },
      { id: 'motion', label: 'Motion / Animation', index: '15' },
      { id: 'layout', label: 'Layout / Spacing', index: '16' },
    ],
  },
  {
    label: 'System', items: [
      { id: 'seo', label: 'SEO / Meta', index: '17' },
      { id: 'assets', label: 'Assets', index: '18' },
      { id: 'json', label: 'Advanced JSON', index: '19' },
    ],
  },
];

interface Props {
  activePanel: string;
  onSelect: (id: string) => void;
}

export default function NavPanel({ activePanel, onSelect }: Props) {
  const [search, setSearch] = useState('');
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(NAV_GROUPS.map(g => g.label)));

  const filteredGroups = useMemo(() => {
    if (!search) return NAV_GROUPS;
    const q = search.toLowerCase();
    return NAV_GROUPS.map(g => ({
      ...g,
      items: g.items.filter(i => i.label.toLowerCase().includes(q)),
    })).filter(g => g.items.length > 0);
  }, [search]);

  const toggleGroup = (label: string) => {
    setOpenGroups(prev => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  };

  return (
    <aside className="cr-panel cr-nav-panel">
      <div className="cr-nav-search">
        <Icon name="search" size="xs" tone="muted" />
        <input
          type="text"
          aria-label="Search Control Room panels"
          placeholder="search controls..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <nav className="cr-nav" aria-label="Control Room navigation">
        {filteredGroups.map(group => {
          const isOpen = openGroups.has(group.label) || !!search;
          return (
            <div key={group.label} className={`cr-nav-group${isOpen ? ' is-open' : ''}`}>
              <button
                className="cr-nav-group-header icon-align-inline"
                type="button"
                aria-expanded={isOpen}
                onClick={() => toggleGroup(group.label)}
              >
                <Icon name={controlGroupIconMap[group.label] ?? 'archive'} size="xs" tone="muted" />
                <span>{group.label}</span>
                <Icon name="chevron" size="xs" tone="muted" className="cr-nav-chevron" />
              </button>
              <div className="cr-nav-group-items">
                {group.items.map(item => (
                  <button
                    key={item.id}
                    className={`cr-nav-item icon-align-inline${item.id === activePanel ? ' is-active' : ''}`}
                    type="button"
                    onClick={() => onSelect(item.id)}
                  >
                    <span className="cr-nav-item-index">{item.index}</span>
                    <Icon name={controlNavIconMap[item.id] ?? 'settings'} size="xs" tone={item.id === activePanel ? 'accent' : 'muted'} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
