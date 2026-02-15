interface SubTabsProps {
  tabs: string[];
  active: string;
  onSelect: (tab: string) => void;
}

export default function SubTabs({ tabs, active, onSelect }: SubTabsProps) {
  return (
    <div style={{
      display: 'flex',
      borderBottom: '1px solid #333',
      backgroundColor: '#1A1A1A',
      overflowX: 'auto',
    }}>
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onSelect(tab)}
          style={{
            flex: 'none',
            padding: '10px 16px',
            fontSize: 13,
            fontWeight: active === tab ? 700 : 400,
            color: active === tab ? '#fff' : '#999',
            background: 'none',
            borderBottom: active === tab ? '2px solid #8B0000' : '2px solid transparent',
            whiteSpace: 'nowrap',
            borderRadius: 0,
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
