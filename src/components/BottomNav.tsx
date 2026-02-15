import { useLocation, useNavigate } from 'react-router-dom';

const tabs = [
  { path: '/talk', label: '토크', icon: '💬' },
  { path: '/nearby', label: '주변', icon: '👤' },
  { path: '/theme', label: '테마', icon: '#' },
  { path: '/messages', label: '쪽지', icon: '✉️' },
  { path: '/more', label: '더보기', icon: '•••' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 430,
      display: 'flex',
      backgroundColor: 'rgba(10, 10, 10, 0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(201, 169, 110, 0.12)',
      zIndex: 100,
    }}>
      {tabs.map(tab => {
        const isActive = location.pathname.startsWith(tab.path);
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '10px 0 8px',
              gap: 3,
              background: 'none',
              color: isActive ? '#C9A96E' : '#555',
              fontSize: 11,
              position: 'relative',
              borderRadius: 0,
              transition: 'color 0.2s',
            }}
          >
            <span style={{ fontSize: 20, lineHeight: 1 }}>{tab.icon}</span>
            <span style={{
              fontWeight: isActive ? 700 : 400,
              fontSize: 10,
              letterSpacing: 0.5,
            }}>
              {tab.label}
            </span>
            {isActive && (
              <span style={{
                position: 'absolute',
                top: 0,
                left: '25%',
                right: '25%',
                height: 2,
                background: 'linear-gradient(90deg, transparent, #C9A96E, transparent)',
                borderRadius: '0 0 2px 2px',
              }} />
            )}
          </button>
        );
      })}
    </nav>
  );
}
