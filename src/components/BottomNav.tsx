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
      backgroundColor: '#111111',
      borderTop: '1px solid var(--border-color)',
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
              gap: 2,
              background: 'none',
              color: isActive ? '#8B0000' : '#666666',
              fontSize: 11,
              position: 'relative',
              borderRadius: 0,
            }}
          >
            <span style={{ fontSize: 20, lineHeight: 1 }}>{tab.icon}</span>
            <span style={{ fontWeight: isActive ? 700 : 400 }}>{tab.label}</span>
            {isActive && (
              <span style={{
                position: 'absolute',
                top: 0,
                left: '20%',
                right: '20%',
                height: 2,
                backgroundColor: '#8B0000',
                borderRadius: '0 0 2px 2px',
              }} />
            )}
          </button>
        );
      })}
    </nav>
  );
}
