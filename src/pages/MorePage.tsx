import Header from '../components/Header';
import Avatar from '../components/Avatar';
import TendencyBadge from '../components/TendencyBadge';

const myProfile = {
  nickname: '나의프로필',
  age: 28,
  gender: '남' as const,
  tendency: 'S' as const,
  avatar: '#8B0000',
  tags: ['#본디지', '#디시플린', '#롤플레이'],
  intro: '매너 있는 S입니다. 대화부터 시작해요.',
};

const menuItems = [
  { label: '프로필 수정', icon: '✏️' },
  { label: '성향 설정', icon: '⚙️' },
  { label: '차단 관리', icon: '🚫' },
  { label: '알림 설정', icon: '🔔' },
  { label: '이용약관', icon: '📄' },
  { label: '고객센터', icon: '💡' },
  { label: '로그아웃', icon: '🚪' },
];

export default function MorePage() {
  return (
    <div style={{ paddingBottom: 60 }}>
      <Header />

      {/* Profile Card */}
      <div style={{
        margin: 16,
        padding: 20,
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        border: '1px solid #333',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <Avatar color={myProfile.avatar} nickname={myProfile.nickname} size={64} online />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 18, fontWeight: 700 }}>{myProfile.nickname}</span>
              <TendencyBadge tendency={myProfile.tendency} />
            </div>
            <span style={{ fontSize: 13, color: '#999' }}>
              {myProfile.gender} · {myProfile.age}세
            </span>
          </div>
        </div>
        <div style={{ fontSize: 14, color: '#ccc', marginBottom: 12 }}>{myProfile.intro}</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {myProfile.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 12,
              color: '#8B0000',
              backgroundColor: '#1A0000',
              padding: '3px 10px',
              borderRadius: 12,
              border: '1px solid #330000',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div style={{ margin: '0 16px' }}>
        {menuItems.map(item => (
          <div
            key={item.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 4px',
              borderBottom: '1px solid #1A1A1A',
              cursor: 'pointer',
              fontSize: 15,
            }}
          >
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <span>{item.label}</span>
            <span style={{ marginLeft: 'auto', color: '#666', fontSize: 14 }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}
