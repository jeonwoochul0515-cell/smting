import { useUnreadCount } from '../context/NotificationContext';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  right?: React.ReactNode;
  kane?: number;
}

export default function Header({ title = 'SMting', showBack, onBack, right, kane }: HeaderProps) {
  const { unreadCount } = useUnreadCount();

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
        <div>
          <h1 style={{
            fontSize: 20,
            fontWeight: 800,
            color: '#C9A96E',
            letterSpacing: 1,
            textShadow: '0 1px 8px rgba(201, 169, 110, 0.3)',
            margin: 0,
          }}>
            {title}
          </h1>
          {kane !== undefined && (
            <div style={{
              fontSize: 11,
              color: '#E8D5B0',
              marginTop: 2,
              fontWeight: 600,
            }}>
              {kane} 케인
            </div>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {unreadCount > 0 && (
          <div style={{
            backgroundColor: '#FF4444',
            color: '#fff',
            fontSize: 11,
            fontWeight: 700,
            padding: '3px 7px',
            borderRadius: 10,
            minWidth: 20,
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(255, 68, 68, 0.4)',
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
        {right && <div>{right}</div>}
      </div>
    </header>
  );
}
