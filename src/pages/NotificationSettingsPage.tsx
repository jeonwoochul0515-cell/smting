import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function NotificationSettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messageNotify, setMessageNotify] = useState(true);
  const [talkNotify, setTalkNotify] = useState(true);
  const [marketingNotify, setMarketingNotify] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('message_notify, talk_notify, marketing_notify').eq('id', user.id).single()
      .then(({ data }) => {
        if (data) {
          setMessageNotify(data.message_notify ?? true);
          setTalkNotify(data.talk_notify ?? true);
          setMarketingNotify(data.marketing_notify ?? false);
        }
      });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await supabase.from('profiles').update({ message_notify: messageNotify, talk_notify: talkNotify, marketing_notify: marketingNotify }).eq('id', user.id);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <div onClick={onChange} style={{ width: 48, height: 28, borderRadius: 14, backgroundColor: value ? '#8B0000' : '#333', position: 'relative', transition: 'background 0.2s', flexShrink: 0, cursor: 'pointer' }}>
      <div style={{ position: 'absolute', top: 4, left: value ? 24 : 4, width: 20, height: 20, borderRadius: '50%', backgroundColor: '#fff', transition: 'left 0.2s' }} />
    </div>
  );

  const items = [
    { label: '쪽지 알림', desc: '새 쪽지가 도착하면 알림을 받습니다', value: messageNotify, onChange: () => setMessageNotify(p => !p) },
    { label: '토크 알림', desc: '토크에 반응이 있으면 알림을 받습니다', value: talkNotify, onChange: () => setTalkNotify(p => !p) },
    { label: '마케팅 알림', desc: '이벤트 및 프로모션 정보를 받습니다', value: marketingNotify, onChange: () => setMarketingNotify(p => !p) },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0A', color: '#F0F0F0' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#0A0A0A', borderBottom: '1px solid rgba(201,169,110,0.15)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#C9A96E', fontSize: 22, cursor: 'pointer', padding: '4px 8px 4px 0' }}>←</button>
        <span style={{ fontSize: 17, fontWeight: 700 }}>알림 설정</span>
      </div>
      <div style={{ padding: '20px 16px 60px', maxWidth: 480, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
          {items.map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#F0F0F0', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: '#888' }}>{item.desc}</div>
              </div>
              <Toggle value={item.value} onChange={item.onChange} />
            </div>
          ))}
        </div>
        <button onClick={handleSave} disabled={saving} style={{ width: '100%', padding: '16px 0', borderRadius: 14, fontSize: 16, fontWeight: 700, color: '#fff', background: saved ? 'rgba(0,200,83,0.7)' : 'linear-gradient(135deg, #8B0000, #5C0029)', border: 'none', cursor: saving ? 'default' : 'pointer', transition: 'background 0.3s' }}>
          {saved ? '✓ 저장되었습니다' : saving ? '저장 중...' : '저장'}
        </button>
        <div style={{ marginTop: 16, padding: '14px', borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', fontSize: 12, color: '#666', lineHeight: 1.6 }}>
          브라우저 알림 권한을 허용해야 실제 알림이 작동합니다.<br />
          기기 설정에서 SMting 알림을 허용해주세요.
        </div>
      </div>
    </div>
  );
}
