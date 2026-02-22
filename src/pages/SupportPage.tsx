import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const faqs = [
  { q: '케인은 어떻게 충전하나요?', a: '더보기 → 케인 충전 메뉴에서 원하는 패키지를 선택하여 충전할 수 있습니다.' },
  { q: '쪽지 전송 비용은 얼마인가요?', a: '처음 대화를 시작할 때 3 케인이 차감됩니다. 이후 대화는 무료입니다.' },
  { q: '토크를 작성하면 케인을 받나요?', a: '네, 매일 첫 번째 토크 작성 시 10 케인을 무료로 받습니다.' },
  { q: '차단한 사용자는 어떻게 관리하나요?', a: '더보기 → 차단 관리에서 차단 목록을 확인하고 해제할 수 있습니다.' },
  { q: '개인정보는 어떻게 처리되나요?', a: '더보기 → 개인정보처리방침에서 자세한 내용을 확인하실 수 있습니다.' },
  { q: '탈퇴하면 데이터가 삭제되나요?', a: '탈퇴 즉시 프로필, 쪽지, 토크 등 모든 데이터가 삭제됩니다.' },
];

export default function SupportPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim() || !user) return;
    setSending(true);
    try {
      await supabase.from('reports').insert([{
        reporter_id: user.id,
        reported_id: user.id,
        reason: `[문의] ${subject}: ${message}`,
      }]);
      setSent(true);
      setSubject('');
      setMessage('');
    } catch {
      alert('전송 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', color: '#F0F0F0' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#0A0A0A', borderBottom: '1px solid rgba(201,169,110,0.15)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#C9A96E', fontSize: 22, cursor: 'pointer', padding: '4px 8px 4px 0' }}>←</button>
        <span style={{ fontSize: 17, fontWeight: 700 }}>고객센터</span>
      </div>
      <div style={{ padding: '24px 16px 60px', maxWidth: 480, margin: '0 auto' }}>

        {/* 연락처 */}
        <div style={{ backgroundColor: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)', borderRadius: 14, padding: '16px', marginBottom: 28, fontSize: 13, color: '#C0C0C0', lineHeight: 1.8 }}>
          <div style={{ fontWeight: 700, color: '#C9A96E', marginBottom: 8 }}>운영팀 연락처</div>
          이메일: support@smting.app<br />
          운영시간: 평일 10:00 ~ 18:00<br />
          답변 기간: 접수 후 2 영업일 이내
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#C9A96E', marginBottom: 12 }}>자주 묻는 질문</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.02)', border: 'none', color: '#F0F0F0', fontSize: 14, fontWeight: 600, textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {faq.q}
                  <span style={{ color: '#888', fontSize: 14, marginLeft: 8, flexShrink: 0 }}>{openFaq === i ? '▲' : '▼'}</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '12px 16px 14px', backgroundColor: 'rgba(139,0,0,0.06)', fontSize: 13, color: '#C0C0C0', lineHeight: 1.7, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 1:1 문의 */}
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#C9A96E', marginBottom: 12 }}>1:1 문의</div>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '32px', backgroundColor: 'rgba(0,200,83,0.06)', border: '1px solid rgba(0,200,83,0.2)', borderRadius: 14 }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>✓</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#00C853', marginBottom: 6 }}>문의가 접수되었습니다</div>
              <div style={{ fontSize: 13, color: '#888' }}>2 영업일 이내에 답변 드리겠습니다</div>
              <button onClick={() => setSent(false)} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 10, fontSize: 14, fontWeight: 600, color: '#C9A96E', background: 'none', border: '1px solid rgba(201,169,110,0.3)', cursor: 'pointer' }}>새 문의하기</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="문의 제목" required style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.04)', color: '#F0F0F0', fontSize: 14, outline: 'none' }} />
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="문의 내용을 입력해주세요" rows={5} required style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.04)', color: '#F0F0F0', fontSize: 14, outline: 'none', fontFamily: 'inherit', resize: 'none' }} />
              <button type="submit" disabled={sending || !subject.trim() || !message.trim()} style={{ padding: '14px 0', borderRadius: 12, fontSize: 15, fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg, #8B0000, #5C0029)', border: 'none', cursor: sending ? 'default' : 'pointer' }}>
                {sending ? '전송 중...' : '문의 접수'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
