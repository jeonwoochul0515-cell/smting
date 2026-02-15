import { useParams, useNavigate } from 'react-router-dom';
import { users, playTypes } from '../data/mockData';
import Header from '../components/Header';
import Avatar from '../components/Avatar';
import TendencyBadge from '../components/TendencyBadge';
import { calcMatchRate } from '../utils/matchAlgo';

// Mock: assign random plays to users
const userPlays: Record<number, string[]> = {
  1: ['bondage', 'rope', 'sensual'],
  2: ['discipline', 'roleplay', 'maledom'],
  3: ['fetish', 'sensual', 'switching'],
  4: ['rope', 'bondage', 'sensual'],
  5: ['discipline', 'bondage', 'maledom'],
  6: ['sensual', 'petting', 'cosplay'],
  7: ['switching', 'roleplay', 'bondage'],
  8: ['femdom', 'discipline', 'choking'],
  9: ['bondage', 'rope', 'sensory'],
  10: ['rope', 'sensual', 'petting'],
  11: ['bondage', 'discipline', 'maledom'],
  12: ['switching', 'fetish', 'petplay'],
};

const userTopPlays: Record<number, string[]> = {
  1: ['bondage', 'rope', 'sensual'],
  2: ['discipline', 'roleplay', 'maledom'],
  3: ['fetish', 'sensual', 'switching'],
  4: ['rope', 'bondage', 'sensual'],
  5: ['discipline', 'bondage', 'maledom'],
  6: ['sensual', 'petting', 'cosplay'],
  7: ['switching', 'roleplay', 'bondage'],
  8: ['femdom', 'discipline', 'choking'],
  9: ['bondage', 'rope', 'sensory'],
  10: ['rope', 'sensual', 'petting'],
  11: ['bondage', 'discipline', 'maledom'],
  12: ['switching', 'fetish', 'petplay'],
};

const rankColors = [
  { bg: 'linear-gradient(135deg, #C9A96E, #E8D5B0)', color: '#1A1A1A', label: '1st' },
  { bg: 'linear-gradient(135deg, #888, #BBB)', color: '#1A1A1A', label: '2nd' },
  { bg: 'linear-gradient(135deg, #8B5E3C, #C4834E)', color: '#fff', label: '3rd' },
];

export default function UserProfilePage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const user = users.find(u => u.id === Number(userId));
  if (!user) return <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>사용자를 찾을 수 없습니다</div>;

  const plays = userPlays[user.id] || [];
  const topPlays = userTopPlays[user.id] || [];
  const myPlays = ['bondage', 'discipline', 'roleplay'];
  const matchRate = calcMatchRate(user.tendency, 'S', plays, myPlays);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0A0A0A 0%, #120808 100%)',
    }}>
      <Header title="프로필" showBack onBack={() => navigate(-1)} />

      {/* Profile Header */}
      <div style={{
        padding: '28px 20px',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          <Avatar color={user.avatar} nickname={user.nickname} size={80} online={user.online} showRing />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 22, fontWeight: 700 }}>{user.nickname}</span>
          <TendencyBadge tendency={user.tendency} />
        </div>
        <div style={{ fontSize: 14, color: '#888', marginBottom: 12 }}>
          {user.gender} · {user.age}세 · {user.distance}
        </div>

        {/* Match Rate */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 20px',
          borderRadius: 20,
          background: 'rgba(201, 169, 110, 0.08)',
          border: '1px solid rgba(201, 169, 110, 0.2)',
          marginBottom: 8,
        }}>
          <span style={{ fontSize: 13, color: '#C9A96E', fontWeight: 600 }}>궁합</span>
          <span style={{
            fontSize: 24,
            fontWeight: 800,
            background: 'linear-gradient(135deg, #C9A96E, #E8D5B0)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {matchRate}%
          </span>
        </div>
      </div>

      <div style={{ padding: '20px 16px' }}>
        {/* Intro */}
        <section style={{ marginBottom: 24 }}>
          <h3 style={sectionTitle}>소개</h3>
          <div style={{
            padding: '14px 16px',
            borderRadius: 12,
            backgroundColor: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
            fontSize: 14,
            color: '#ccc',
            lineHeight: 1.6,
          }}>
            {user.intro}
          </div>
        </section>

        {/* Top 3 Plays */}
        <section style={{ marginBottom: 24 }}>
          <h3 style={sectionTitle}>최애플 TOP 3</h3>
          <div style={{ display: 'flex', gap: 10 }}>
            {topPlays.slice(0, 3).map((playId, idx) => {
              const play = playTypes.find(p => p.id === playId);
              if (!play) return null;
              return (
                <div key={playId} style={{
                  flex: 1,
                  padding: '16px 8px',
                  borderRadius: 14,
                  textAlign: 'center',
                  backgroundColor: 'rgba(26,26,26,0.9)',
                  border: '1px solid rgba(201, 169, 110, 0.2)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}>
                  <span style={{
                    display: 'inline-block',
                    fontSize: 10,
                    fontWeight: 800,
                    background: rankColors[idx].bg,
                    color: rankColors[idx].color,
                    padding: '2px 10px',
                    borderRadius: 8,
                    marginBottom: 8,
                  }}>{rankColors[idx].label}</span>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{play.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#E8D5B0' }}>{play.name}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* All Play Tags */}
        <section style={{ marginBottom: 24 }}>
          <h3 style={sectionTitle}>관심 플레이</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {plays.map(playId => {
              const play = playTypes.find(p => p.id === playId);
              if (!play) return null;
              const isShared = myPlays.includes(playId);
              return (
                <span key={playId} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 13,
                  color: isShared ? '#C9A96E' : '#999',
                  backgroundColor: isShared ? 'rgba(201,169,110,0.08)' : 'rgba(255,255,255,0.02)',
                  padding: '6px 14px',
                  borderRadius: 12,
                  border: isShared ? '1px solid rgba(201,169,110,0.25)' : '1px solid rgba(255,255,255,0.06)',
                }}>
                  <span>{play.icon}</span>
                  <span>{play.name}</span>
                  {isShared && <span style={{ fontSize: 10, color: '#C9A96E' }}>공통</span>}
                </span>
              );
            })}
          </div>
        </section>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          <button
            onClick={() => navigate(`/chat/${user.id}`)}
            style={{
              flex: 1,
              padding: '14px 0',
              borderRadius: 14,
              fontSize: 15,
              fontWeight: 700,
              color: '#fff',
              background: 'linear-gradient(135deg, #8B0000, #5C0029)',
              border: 'none',
              boxShadow: '0 4px 16px rgba(139,0,0,0.35)',
              cursor: 'pointer',
            }}
          >
            쪽지 보내기
          </button>
        </div>
      </div>
    </div>
  );
}

const sectionTitle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: '#C9A96E',
  marginBottom: 12,
  letterSpacing: 0.5,
};
