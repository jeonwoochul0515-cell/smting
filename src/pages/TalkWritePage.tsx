import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const categories = ['전체', '사진', '지역', '동네', '근처'];

export default function TalkWritePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('전체');
  const [posted, setPosted] = useState(false);

  const canPost = title.trim().length > 0 && content.trim().length > 0;

  const handlePost = () => {
    if (!canPost) return;
    setPosted(true);
    setTimeout(() => navigate('/talk'), 1000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #0A0A0A 0%, #120808 100%)',
    }}>
      <Header title="토크 쓰기" showBack onBack={() => navigate(-1)} />

      <div style={{ flex: 1, padding: '20px 16px' }}>
        {/* Category */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>카테고리</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  color: category === c ? '#C9A96E' : '#777',
                  background: category === c ? 'rgba(201,169,110,0.1)' : 'rgba(255,255,255,0.04)',
                  border: category === c ? '1px solid rgba(201,169,110,0.3)' : '1px solid rgba(255,255,255,0.08)',
                  transition: 'all 0.2s',
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>제목</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            style={inputStyle}
          />
        </div>

        {/* Content */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>내용</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="내용을 작성하세요..."
            rows={8}
            style={{
              ...inputStyle,
              resize: 'none',
              lineHeight: 1.6,
            }}
          />
          <div style={{ textAlign: 'right', fontSize: 12, color: '#555', marginTop: 6 }}>
            {content.length}자
          </div>
        </div>
      </div>

      {/* Post Button */}
      <div style={{ padding: '12px 16px 24px' }}>
        <button
          onClick={handlePost}
          disabled={!canPost}
          style={{
            width: '100%',
            padding: '14px 0',
            borderRadius: 14,
            fontSize: 16,
            fontWeight: 700,
            color: canPost ? '#fff' : '#555',
            background: canPost
              ? 'linear-gradient(135deg, #8B0000, #5C0029)'
              : 'rgba(255,255,255,0.04)',
            border: 'none',
            boxShadow: canPost ? '0 4px 16px rgba(139,0,0,0.35)' : 'none',
            cursor: canPost ? 'pointer' : 'default',
            transition: 'all 0.3s',
          }}
        >
          {posted ? '✓ 등록되었습니다' : '글 등록하기'}
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
  padding: '13px 16px',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.08)',
  backgroundColor: 'rgba(255,255,255,0.04)',
  color: '#F0F0F0',
  fontSize: 15,
};
