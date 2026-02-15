interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  right?: React.ReactNode;
}

export default function Header({ title = 'SMting', showBack, onBack, right }: HeaderProps) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 16px',
      backgroundColor: '#8B0000',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {showBack && (
          <button
            onClick={onBack}
            style={{ background: 'none', color: '#fff', fontSize: 18, padding: '0 4px' }}
          >
            ‹
          </button>
        )}
        <h1 style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>{title}</h1>
      </div>
      {right && <div>{right}</div>}
    </header>
  );
}
