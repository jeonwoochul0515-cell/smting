interface SubTabsProps {
  tabs: string[];
  active: string;
  onSelect: (tab: string) => void;
}

export default function SubTabs({ tabs, active, onSelect }: SubTabsProps) {
  return (
    <div style={{
      display: 'flex',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      backgroundColor: 'rgba(20, 20, 20, 0.9)',
      backdropFilter: 'blur(10px)',
      overflowX: 'auto',
    }}>
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onSelect(tab)}
          style={{
            flex: 'none',
            padding: '11px 16px',
            fontSize: 13,
            fontWeight: active === tab ? 700 : 400,
            color: active === tab ? '#C9A96E' : '#777',
            background: 'none',
            borderBottom: active === tab ? '2px solid #C9A96E' : '2px solid transparent',
            whiteSpace: 'nowrap',
            borderRadius: 0,
            transition: 'color 0.2s',
            letterSpacing: 0.3,
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
