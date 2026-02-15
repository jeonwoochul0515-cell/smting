import Header from '../components/Header';

const themes = [
  { id: 1, name: '본디지', icon: '🔗', count: 128, color: '#8B0000' },
  { id: 2, name: '로프', icon: '🪢', count: 95, color: '#5C0029' },
  { id: 3, name: '롤플레이', icon: '🎭', count: 203, color: '#4A0080' },
  { id: 4, name: '페티쉬', icon: '👠', count: 167, color: '#2D033B' },
  { id: 5, name: '디시플린', icon: '📏', count: 84, color: '#3D0C11' },
  { id: 6, name: '센슈얼', icon: '🌹', count: 312, color: '#6B0848' },
  { id: 7, name: '펨돔', icon: '👑', count: 76, color: '#005C5C' },
  { id: 8, name: '스위치', icon: '🔄', count: 145, color: '#1A3A4A' },
  { id: 9, name: '초보환영', icon: '🌱', count: 256, color: '#2A4A2A' },
];

export default function ThemePage() {
  return (
    <div style={{ paddingBottom: 60 }}>
      <Header />
      <div style={{ padding: 16 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
        }}>
          {themes.map(theme => (
            <div
              key={theme.id}
              style={{
                backgroundColor: '#1A1A1A',
                borderRadius: 12,
                padding: '20px 12px',
                textAlign: 'center',
                cursor: 'pointer',
                border: '1px solid #333',
                transition: 'border-color 0.2s',
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>{theme.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{theme.name}</div>
              <div style={{ fontSize: 11, color: '#999' }}>{theme.count}명 참여중</div>
              <div style={{
                marginTop: 8,
                height: 3,
                borderRadius: 2,
                backgroundColor: '#333',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${Math.min(theme.count / 3, 100)}%`,
                  height: '100%',
                  backgroundColor: theme.color,
                  borderRadius: 2,
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
