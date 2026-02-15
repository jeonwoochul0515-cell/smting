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
      padding: '16px 18px',
      background: 'linear-gradient(135deg, #8B0000 0%, #5C0029 100%)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 4px 20px rgba(92, 0, 41, 0.4)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {showBack && (
          <button
            onClick={onBack}
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              fontSize: 16,
              padding: '4px 10px',
              borderRadius: 8,
              backdropFilter: 'blur(4px)',
            }}
          >
            ‹
          </button>
        )}
        <h1 style={{
          fontSize: 20,
          fontWeight: 800,
          color: '#C9A96E',
          letterSpacing: 1,
          textShadow: '0 1px 8px rgba(201, 169, 110, 0.3)',
        }}>
          {title}
        </h1>
      </div>
      {right && <div>{right}</div>}
    </header>
  );
}
