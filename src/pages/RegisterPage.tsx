import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { playTypes } from '../data/mockData';
import type { Tendency, Gender } from '../data/mockData';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const STEP_TITLES = ['기본 정보', '플레이 선택', '최애플 TOP 3'];

const rankColors = [
  { bg: 'linear-gradient(135deg, #C9A96E, #E8D5B0)', color: '#1A1A1A', label: '1st', shadow: '0 0 16px rgba(201, 169, 110, 0.4)' },
  { bg: 'linear-gradient(135deg, #888, #BBB)', color: '#1A1A1A', label: '2nd', shadow: '0 0 12px rgba(136, 136, 136, 0.3)' },
  { bg: 'linear-gradient(135deg, #8B5E3C, #C4834E)', color: '#fff', label: '3rd', shadow: '0 0 12px rgba(139, 94, 60, 0.3)' },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);

  // Step 1
  const [nickname, setNickname] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [tendency, setTendency] = useState<Tendency | ''>('');

  // Step 2
  const [selectedPlays, setSelectedPlays] = useState<string[]>([]);

  // Step 3
  const [topPlays, setTopPlays] = useState<string[]>([]);

  const togglePlay = (id: string) => {
    setSelectedPlays(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
    // Remove from top plays if deselected
    setTopPlays(prev => prev.filter(p => p !== id));
  };

  const toggleTopPlay = (id: string) => {
    setTopPlays(prev => {
      if (prev.includes(id)) return prev.filter(p => p !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const canNext = () => {
    if (step === 0) return nickname.trim() && age && gender && tendency;
    if (step === 1) return selectedPlays.length >= 3;
    if (step === 2) return topPlays.length === 3;
    return false;
  };

  const handleNext = async () => {
    if (step < 2) {
      setStep(step + 1);
      return;
    }

    // Step 3 완료: 프로필 저장
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .insert([{
          id: user.id,
          nickname,
          age: parseInt(age),
          gender,
          tendency,
          intro: '',
          avatar: '#8B0000',
          top_plays: topPlays,
          all_plays: selectedPlays,
        }]);

      if (error) throw error;
      navigate('/nearby');
    } catch (err: any) {
      alert('프로필 저장 실패: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #0A0A0A 0%, #120808 100%)',
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 18px 16px',
        background: 'linear-gradient(135deg, #8B0000 0%, #5C0029 100%)',
        boxShadow: '0 4px 20px rgba(92, 0, 41, 0.4)',
      }}>
        <h1 style={{
          fontSize: 22,
          fontWeight: 800,
          color: '#C9A96E',
          letterSpacing: 1,
          textShadow: '0 1px 8px rgba(201, 169, 110, 0.3)',
          marginBottom: 16,
        }}>
          SMting
        </h1>

        {/* Progress */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          {STEP_TITLES.map((_, i) => (
            <div key={i} style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              backgroundColor: 'rgba(255,255,255,0.15)',
              overflow: 'hidden',
            }}>
              <div style={{
                width: i <= step ? '100%' : '0%',
                height: '100%',
                background: 'linear-gradient(90deg, #C9A96E, #E8D5B0)',
                borderRadius: 2,
                transition: 'width 0.4s ease',
              }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
            STEP {step + 1} / 3
          </span>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>
            {STEP_TITLES[step]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '20px 16px', overflowY: 'auto' }}>

        {/* Step 1: Basic Info */}
        {step === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeIn 0.4s ease' }}>
            <div>
              <label style={labelStyle}>닉네임</label>
              <input
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                placeholder="닉네임을 입력하세요"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>나이</label>
              <input
                value={age}
                onChange={e => setAge(e.target.value.replace(/\D/g, ''))}
                placeholder="나이를 입력하세요"
                type="number"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>성별</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {(['남', '여'] as Gender[]).map(g => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    style={{
                      ...chipStyle,
                      ...(gender === g ? chipActiveStyle : {}),
                    }}
                  >
                    {g === '남' ? '남성' : '여성'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>성향</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {([
                  { v: 'S' as Tendency, label: 'S (새디스트)', color: '#8B0000' },
                  { v: 'M' as Tendency, label: 'M (마조히스트)', color: '#4A0080' },
                  { v: 'SW' as Tendency, label: 'SW (스위치)', color: '#005C5C' },
                ]).map(t => (
                  <button
                    key={t.v}
                    onClick={() => setTendency(t.v)}
                    style={{
                      flex: 1,
                      padding: '12px 8px',
                      borderRadius: 12,
                      fontSize: 13,
                      fontWeight: 600,
                      color: tendency === t.v ? '#fff' : '#888',
                      background: tendency === t.v
                        ? `linear-gradient(135deg, ${t.color}, ${t.color}CC)`
                        : 'rgba(255,255,255,0.04)',
                      border: tendency === t.v
                        ? `1px solid ${t.color}`
                        : '1px solid rgba(255,255,255,0.08)',
                      boxShadow: tendency === t.v
                        ? `0 4px 12px ${t.color}44`
                        : 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Play Selection */}
        {step === 1 && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 16, lineHeight: 1.5 }}>
              관심 있는 플레이를 모두 선택하세요 (최소 3개)
              <br />
              <span style={{ color: '#C9A96E' }}>선택: {selectedPlays.length}개</span>
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 10,
            }}>
              {playTypes.map((play, i) => {
                const selected = selectedPlays.includes(play.id);
                return (
                  <button
                    key={play.id}
                    onClick={() => togglePlay(play.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '14px 12px',
                      borderRadius: 12,
                      textAlign: 'left',
                      background: selected
                        ? 'rgba(201, 169, 110, 0.08)'
                        : 'rgba(255,255,255,0.02)',
                      border: selected
                        ? '1px solid rgba(201, 169, 110, 0.4)'
                        : '1px solid rgba(255,255,255,0.06)',
                      color: selected ? '#E8D5B0' : '#999',
                      boxShadow: selected
                        ? '0 2px 12px rgba(201, 169, 110, 0.12)'
                        : 'none',
                      transition: 'all 0.2s',
                      animation: `fadeIn 0.3s ease ${i * 0.03}s both`,
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center' }}><Icon name={play.icon} size={22} color="currentColor" /></span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{play.name}</div>
                      <div style={{ fontSize: 10, color: '#666', marginTop: 2 }}>{play.description}</div>
                    </div>
                    {selected && (
                      <span style={{
                        marginLeft: 'auto',
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #C9A96E, #E8D5B0)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        color: '#1A1A1A',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}>
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Top 3 Plays */}
        {step === 2 && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 8, lineHeight: 1.5 }}>
              선택한 플레이 중 가장 좋아하는 <span style={{ color: '#C9A96E', fontWeight: 700 }}>TOP 3</span>를 순서대로 탭하세요
            </p>

            {/* Top 3 Slots */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
              {[0, 1, 2].map(idx => {
                const playId = topPlays[idx];
                const play = playTypes.find(p => p.id === playId);
                const rank = rankColors[idx];
                return (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      padding: '16px 8px',
                      borderRadius: 14,
                      textAlign: 'center',
                      background: play ? 'rgba(26,26,26,0.9)' : 'rgba(255,255,255,0.02)',
                      border: play
                        ? '1px solid rgba(201, 169, 110, 0.25)'
                        : '1px dashed rgba(255,255,255,0.1)',
                      boxShadow: play ? rank.shadow : 'none',
                      transition: 'all 0.3s',
                      minHeight: 100,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <span style={{
                      fontSize: 11,
                      fontWeight: 800,
                      background: rank.bg,
                      color: rank.color,
                      padding: '2px 10px',
                      borderRadius: 8,
                      letterSpacing: 1,
                    }}>
                      {rank.label}
                    </span>
                    {play ? (
                      <>
                        <span style={{ display: 'flex', alignItems: 'center' }}><Icon name={play.icon} size={28} color="#C9A96E" /></span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#E8D5B0' }}>{play.name}</span>
                      </>
                    ) : (
                      <span style={{ fontSize: 12, color: '#444' }}>탭하여 선택</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Play List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selectedPlays.map((playId, i) => {
                const play = playTypes.find(p => p.id === playId);
                if (!play) return null;
                const topIdx = topPlays.indexOf(playId);
                const isTop = topIdx >= 0;
                return (
                  <button
                    key={play.id}
                    onClick={() => toggleTopPlay(play.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '14px 14px',
                      borderRadius: 12,
                      textAlign: 'left',
                      background: isTop
                        ? 'rgba(201, 169, 110, 0.06)'
                        : 'rgba(255,255,255,0.02)',
                      border: isTop
                        ? '1px solid rgba(201, 169, 110, 0.3)'
                        : '1px solid rgba(255,255,255,0.06)',
                      color: isTop ? '#E8D5B0' : '#999',
                      transition: 'all 0.2s',
                      animation: `fadeIn 0.3s ease ${i * 0.04}s both`,
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center' }}><Icon name={play.icon} size={22} color="currentColor" /></span>
                    <span style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>{play.name}</span>
                    {isTop && (
                      <span style={{
                        fontSize: 11,
                        fontWeight: 800,
                        background: rankColors[topIdx].bg,
                        color: rankColors[topIdx].color,
                        padding: '3px 10px',
                        borderRadius: 8,
                        boxShadow: rankColors[topIdx].shadow,
                      }}>
                        {rankColors[topIdx].label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Button */}
      <div style={{
        padding: '12px 16px 20px',
        display: 'flex',
        gap: 10,
      }}>
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            style={{
              padding: '14px 24px',
              borderRadius: 14,
              fontSize: 15,
              fontWeight: 600,
              color: '#888',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            이전
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!canNext() || saving}
          style={{
            flex: 1,
            padding: '14px 0',
            borderRadius: 14,
            fontSize: 15,
            fontWeight: 700,
            color: canNext() ? '#fff' : '#555',
            background: canNext()
              ? 'linear-gradient(135deg, #8B0000, #5C0029)'
              : 'rgba(255,255,255,0.04)',
            border: 'none',
            boxShadow: canNext()
              ? '0 4px 16px rgba(139,0,0,0.35)'
              : 'none',
            transition: 'all 0.3s',
            cursor: canNext() ? 'pointer' : 'default',
            letterSpacing: 0.5,
          }}
        >
          {saving ? '저장 중...' : step === 2 ? '가입 완료' : '다음'}
        </button>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: '#C9A96E',
  marginBottom: 8,
  letterSpacing: 0.5,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.08)',
  backgroundColor: 'rgba(255,255,255,0.04)',
  color: '#F0F0F0',
  fontSize: 15,
};

const chipStyle: React.CSSProperties = {
  flex: 1,
  padding: '12px 16px',
  borderRadius: 12,
  fontSize: 14,
  fontWeight: 600,
  color: '#888',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  transition: 'all 0.2s',
};

const chipActiveStyle: React.CSSProperties = {
  color: '#C9A96E',
  background: 'rgba(201, 169, 110, 0.08)',
  border: '1px solid rgba(201, 169, 110, 0.4)',
  boxShadow: '0 2px 12px rgba(201, 169, 110, 0.15)',
};
