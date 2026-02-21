import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { playTypes } from '../data/mockData';
import type { Tendency } from '../data/mockData';
import Header from '../components/Header';
import Icon from '../components/Icon';
import Avatar from '../components/Avatar';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { uploadAndSetAvatar, removeAvatar } from '../utils/imageUpload';

const avatarColors = ['#8B0000', '#A0153E', '#5C0029', '#2D033B', '#3D0C11', '#6B0848', '#4A0080', '#005C5C'];

const rankColors = [
  { bg: 'linear-gradient(135deg, #C9A96E, #E8D5B0)', color: '#1A1A1A', label: '1st' },
  { bg: 'linear-gradient(135deg, #888, #BBB)', color: '#1A1A1A', label: '2nd' },
  { bg: 'linear-gradient(135deg, #8B5E3C, #C4834E)', color: '#fff', label: '3rd' },
];

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nickname, setNickname] = useState('나의프로필');
  const [age, setAge] = useState('28');
  const [intro, setIntro] = useState('매너 있는 S입니다. 대화부터 시작해요.');
  const [tendency, setTendency] = useState<Tendency>('S');
  const [avatarColor, setAvatarColor] = useState('#8B0000');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [selectedPlays, setSelectedPlays] = useState<string[]>(['bondage', 'discipline', 'roleplay']);
  const [topPlays, setTopPlays] = useState<string[]>(['bondage', 'discipline', 'roleplay']);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // 앱 로드 시 DB에서 프로필 데이터 불러오기
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found

        if (data) {
          setNickname(data.nickname || '나의프로필');
          setAge(data.age?.toString() || '28');
          setIntro(data.intro || '');
          setTendency(data.tendency || 'S');
          setAvatarColor(data.avatar || '#8B0000');
          setAvatarUrl(data.avatar_url || null);
          setSelectedPlays(data.all_plays || []);
          setTopPlays(data.top_plays || []);
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const togglePlay = (id: string) => {
    setSelectedPlays(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
    setTopPlays(prev => prev.filter(p => p !== id));
  };

  const toggleTopPlay = (id: string) => {
    setTopPlays(prev => {
      if (prev.includes(id)) return prev.filter(p => p !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const result = await uploadAndSetAvatar(user.id, file, avatarUrl);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        setAvatarUrl(result.url);
        setTimeout(() => setUploadProgress(0), 500);
      } else {
        alert(result.error);
        setUploadProgress(0);
      }
    } catch (err) {
      console.error('Image upload error:', err);
      alert('이미지 업로드 중 오류가 발생했습니다.');
      setUploadProgress(0);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user || !avatarUrl) return;

    if (!confirm('프로필 사진을 삭제하시겠습니까?')) return;

    setUploading(true);
    try {
      const result = await removeAvatar(user.id, avatarUrl);
      if (result.success) {
        setAvatarUrl(null);
      } else {
        alert(result.error);
      }
    } catch (err) {
      console.error('Remove avatar error:', err);
      alert('이미지 삭제 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          nickname,
          age: parseInt(age),
          intro,
          tendency,
          avatar: avatarColor,
          all_plays: selectedPlays,
          top_plays: topPlays,
        })
        .eq('id', user.id);

      if (error) throw error;

      setSaved(true);
      setTimeout(() => navigate('/more'), 1000);
    } catch (err: any) {
      alert('저장 실패: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0A0A0A 0%, #120808 100%)',
    }}>
      <Header title="프로필 수정" showBack onBack={() => navigate(-1)} />

      <div style={{ padding: '20px 16px', paddingBottom: 100 }}>
        {/* Profile Image Upload */}
        <section style={{ marginBottom: 28 }}>
          <label style={labelStyle}>프로필 사진</label>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            padding: 20,
            borderRadius: 16,
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            {/* Avatar Preview */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}>
              <Avatar
                color={avatarColor}
                size={80}
                nickname={nickname}
                imageUrl={avatarUrl}
              />
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: 13,
                  color: '#888',
                  marginBottom: 8,
                  lineHeight: 1.5,
                }}>
                  {avatarUrl ? '프로필 사진이 설정되었습니다' : '프로필 사진을 업로드하거나 아래에서 컬러를 선택하세요'}
                </div>
                {avatarUrl && (
                  <button
                    onClick={handleRemoveAvatar}
                    disabled={uploading}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      color: '#FF4444',
                      background: 'rgba(255,68,68,0.1)',
                      border: '1px solid rgba(255,68,68,0.3)',
                      cursor: uploading ? 'default' : 'pointer',
                      opacity: uploading ? 0.5 : 1,
                      transition: 'all 0.2s',
                    }}
                  >
                    사진 삭제
                  </button>
                )}
              </div>
            </div>

            {/* Upload Button */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{
                padding: '12px 16px',
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 600,
                color: uploading ? '#666' : '#E8D5B0',
                background: uploading ? 'rgba(255,255,255,0.02)' : 'rgba(201,169,110,0.08)',
                border: uploading ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(201,169,110,0.25)',
                cursor: uploading ? 'default' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Icon name="camera" size={18} color="currentColor" />
              <span>{uploading ? '업로드 중...' : '사진 선택'}</span>
            </button>

            {/* Upload Progress */}
            {uploadProgress > 0 && (
              <div style={{
                width: '100%',
                height: 4,
                borderRadius: 2,
                background: 'rgba(255,255,255,0.1)',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${uploadProgress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #C9A96E, #E8D5B0)',
                  transition: 'width 0.3s ease',
                }} />
              </div>
            )}

            {/* File Info */}
            <div style={{
              fontSize: 11,
              color: '#666',
              lineHeight: 1.5,
            }}>
              JPG, PNG, WEBP 형식 지원 • 최대 5MB
            </div>
          </div>
        </section>

        {/* Avatar Color */}
        <section style={{ marginBottom: 28 }}>
          <label style={labelStyle}>프로필 컬러 (사진 미설정시 표시)</label>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {avatarColors.map(c => (
              <button
                key={c}
                onClick={() => setAvatarColor(c)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${c}, ${c}CC)`,
                  border: avatarColor === c ? '3px solid #C9A96E' : '3px solid transparent',
                  boxShadow: avatarColor === c ? '0 0 12px rgba(201,169,110,0.3)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                {avatarColor === c ? nickname.charAt(0) : ''}
              </button>
            ))}
          </div>
        </section>

        {/* Nickname */}
        <section style={{ marginBottom: 24 }}>
          <label style={labelStyle}>닉네임</label>
          <input value={nickname} onChange={e => setNickname(e.target.value)} style={inputStyle} />
        </section>

        {/* Age */}
        <section style={{ marginBottom: 24 }}>
          <label style={labelStyle}>나이</label>
          <input value={age} onChange={e => setAge(e.target.value.replace(/\D/g, ''))} style={inputStyle} />
        </section>

        {/* Intro */}
        <section style={{ marginBottom: 24 }}>
          <label style={labelStyle}>한줄소개</label>
          <textarea
            value={intro}
            onChange={e => setIntro(e.target.value)}
            rows={2}
            style={{ ...inputStyle, resize: 'none', lineHeight: 1.5 }}
          />
        </section>

        {/* Tendency */}
        <section style={{ marginBottom: 28 }}>
          <label style={labelStyle}>성향</label>
          <div style={{ display: 'flex', gap: 10 }}>
            {([
              { v: 'S' as Tendency, label: 'S', color: '#8B0000' },
              { v: 'M' as Tendency, label: 'M', color: '#4A0080' },
              { v: 'SW' as Tendency, label: 'SW', color: '#005C5C' },
            ]).map(t => (
              <button
                key={t.v}
                onClick={() => setTendency(t.v)}
                style={{
                  flex: 1,
                  padding: '12px 8px',
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 700,
                  color: tendency === t.v ? '#fff' : '#888',
                  background: tendency === t.v
                    ? `linear-gradient(135deg, ${t.color}, ${t.color}CC)`
                    : 'rgba(255,255,255,0.04)',
                  border: tendency === t.v
                    ? `1px solid ${t.color}`
                    : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: tendency === t.v ? `0 4px 12px ${t.color}44` : 'none',
                  transition: 'all 0.2s',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </section>

        {/* Play Tags */}
        <section style={{ marginBottom: 28 }}>
          <label style={labelStyle}>관심 플레이 (최소 3개)</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {playTypes.map(play => {
              const selected = selectedPlays.includes(play.id);
              return (
                <button
                  key={play.id}
                  onClick={() => togglePlay(play.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 10px',
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 500,
                    color: selected ? '#E8D5B0' : '#777',
                    background: selected ? 'rgba(201,169,110,0.08)' : 'rgba(255,255,255,0.02)',
                    border: selected ? '1px solid rgba(201,169,110,0.3)' : '1px solid rgba(255,255,255,0.06)',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}><Icon name={play.icon} size={18} color="currentColor" /></span>
                  <span>{play.name}</span>
                  {selected && <span style={{ marginLeft: 'auto', color: '#C9A96E', fontSize: 14 }}>✓</span>}
                </button>
              );
            })}
          </div>
        </section>

        {/* Top 3 */}
        {selectedPlays.length >= 3 && (
          <section style={{ marginBottom: 28 }}>
            <label style={labelStyle}>최애플 TOP 3 (탭하여 선택)</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {[0, 1, 2].map(idx => {
                const playId = topPlays[idx];
                const play = playTypes.find(p => p.id === playId);
                return (
                  <div key={idx} style={{
                    flex: 1,
                    padding: '12px 6px',
                    borderRadius: 12,
                    textAlign: 'center',
                    background: play ? 'rgba(26,26,26,0.9)' : 'rgba(255,255,255,0.02)',
                    border: play ? '1px solid rgba(201,169,110,0.25)' : '1px dashed rgba(255,255,255,0.1)',
                    minHeight: 70,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                  }}>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 800,
                      background: rankColors[idx].bg,
                      color: rankColors[idx].color,
                      padding: '1px 8px',
                      borderRadius: 6,
                    }}>{rankColors[idx].label}</span>
                    {play ? (
                      <>
                        <span style={{ display: 'flex', alignItems: 'center' }}><Icon name={play.icon} size={20} color="#C9A96E" /></span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#E8D5B0' }}>{play.name}</span>
                      </>
                    ) : (
                      <span style={{ fontSize: 11, color: '#444' }}>선택</span>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {selectedPlays.map(playId => {
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
                      gap: 10,
                      padding: '10px 12px',
                      borderRadius: 10,
                      fontSize: 13,
                      color: isTop ? '#E8D5B0' : '#888',
                      background: isTop ? 'rgba(201,169,110,0.06)' : 'rgba(255,255,255,0.02)',
                      border: isTop ? '1px solid rgba(201,169,110,0.25)' : '1px solid rgba(255,255,255,0.06)',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center' }}><Icon name={play.icon} size={18} color="currentColor" /></span>
                    <span style={{ fontWeight: 600 }}>{play.name}</span>
                    {isTop && (
                      <span style={{
                        marginLeft: 'auto',
                        fontSize: 10,
                        fontWeight: 800,
                        background: rankColors[topIdx].bg,
                        color: rankColors[topIdx].color,
                        padding: '2px 8px',
                        borderRadius: 6,
                      }}>{rankColors[topIdx].label}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Save Button */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 430,
        padding: '12px 16px 20px',
        background: 'linear-gradient(transparent, #0A0A0A 30%)',
      }}>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          style={{
            width: '100%',
            padding: '14px 0',
            borderRadius: 14,
            fontSize: 16,
            fontWeight: 700,
            color: '#fff',
            background: 'linear-gradient(135deg, #8B0000, #5C0029)',
            border: 'none',
            boxShadow: '0 4px 16px rgba(139,0,0,0.4)',
            cursor: saving || loading ? 'default' : 'pointer',
            opacity: saving || loading ? 0.6 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          {saving ? '저장 중...' : saved ? '✓ 저장되었습니다' : '저장하기'}
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
  marginBottom: 10,
  letterSpacing: 0.5,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '13px 16px',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.08)',
  backgroundColor: 'rgba(255,255,255,0.04)',
  color: '#F0F0F0',
  fontSize: 15,
};
