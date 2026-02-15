import { useNavigate } from 'react-router-dom';
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
  { label: '프로필 수정', icon: '✏️', path: '/profile/edit' },
  { label: '성향 설정', icon: '⚙️', path: '/profile/edit' },
  { label: '차단 관리', icon: '🚫', path: '/block-list' },
  { label: '알림 설정', icon: '🔔', path: '' },
  { label: '이용약관', icon: '📄', path: '' },
  { label: '고객센터', icon: '💡', path: '' },
  { label: '로그아웃', icon: '🚪', path: '/' },
];

export default function MorePage() {
  const navigate = useNavigate();

  return (
    <div style={{ paddingBottom: 60 }}>
      <Header />

      {/* Profile Card */}
      <div
        onClick={() => navigate('/profile/edit')}
        style={{
          margin: 16,
          padding: 22,
          backgroundColor: 'rgba(26, 26, 26, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: 18,
          border: '1px solid rgba(201, 169, 110, 0.12)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <Avatar color={myProfile.avatar} nickname={myProfile.nickname} size={64} online showRing />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 18, fontWeight: 700 }}>{myProfile.nickname}</span>
              <TendencyBadge tendency={myProfile.tendency} />
            </div>
            <span style={{ fontSize: 13, color: '#888' }}>
              {myProfile.gender} · {myProfile.age}세
            </span>
          </div>
          <span style={{ marginLeft: 'auto', color: '#C9A96E', fontSize: 14 }}>편집 ›</span>
        </div>
        <div style={{ fontSize: 14, color: '#bbb', marginBottom: 14, lineHeight: 1.5 }}>{myProfile.intro}</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {myProfile.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 12,
              color: '#C9A96E',
              backgroundColor: 'rgba(201, 169, 110, 0.08)',
              padding: '4px 12px',
              borderRadius: 12,
              border: '1px solid rgba(201, 169, 110, 0.15)',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div style={{ margin: '0 16px' }}>
        {menuItems.map((item, i) => (
          <div
            key={item.label}
            onClick={() => item.path && navigate(item.path)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '15px 6px',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              cursor: item.path ? 'pointer' : 'default',
              fontSize: 15,
              animation: `fadeIn 0.3s ease ${i * 0.05}s both`,
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(139,0,0,0.06)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{item.icon}</span>
            <span>{item.label}</span>
            <span style={{ marginLeft: 'auto', color: '#444', fontSize: 16 }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}
