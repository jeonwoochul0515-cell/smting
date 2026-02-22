import { useNavigate } from 'react-router-dom';

const s = {
  container: { minHeight: '100vh', backgroundColor: '#0A0A0A', color: '#F0F0F0' } as React.CSSProperties,
  header: { position: 'sticky' as const, top: 0, zIndex: 100, backgroundColor: '#0A0A0A', borderBottom: '1px solid rgba(201,169,110,0.15)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 },
  back: { background: 'none', border: 'none', color: '#C9A96E', fontSize: 22, cursor: 'pointer', padding: '4px 8px 4px 0' } as React.CSSProperties,
  title: { fontSize: 17, fontWeight: 700, color: '#F0F0F0' },
  body: { padding: '24px 20px 60px', maxWidth: 680, margin: '0 auto' },
  h1: { fontSize: 22, fontWeight: 800, color: '#C9A96E', marginBottom: 6 },
  date: { fontSize: 13, color: '#666', marginBottom: 32 },
  section: { marginBottom: 32 },
  h2: { fontSize: 15, fontWeight: 700, color: '#C9A96E', marginBottom: 12, paddingLeft: 10, borderLeft: '3px solid #8B0000' },
  p: { fontSize: 14, color: '#C0C0C0', lineHeight: 1.8, marginBottom: 10 },
  table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: 13, marginBottom: 10 },
  th: { backgroundColor: 'rgba(139,0,0,0.25)', color: '#C9A96E', padding: '10px 12px', textAlign: 'left' as const, fontWeight: 600, border: '1px solid rgba(201,169,110,0.12)' },
  td: { padding: '10px 12px', color: '#C0C0C0', border: '1px solid rgba(255,255,255,0.06)', verticalAlign: 'top' as const, lineHeight: 1.6 },
  tdRed: { padding: '10px 12px', color: '#ffaaaa', border: '1px solid rgba(255,255,255,0.06)', verticalAlign: 'top' as const, lineHeight: 1.6 },
  box: { backgroundColor: 'rgba(139,0,0,0.12)', border: '1px solid rgba(139,0,0,0.3)', borderRadius: 10, padding: '14px 16px', fontSize: 13, color: '#C0C0C0', lineHeight: 1.7, marginBottom: 10 },
  warn: { backgroundColor: 'rgba(139,0,0,0.2)', border: '1px solid rgba(139,0,0,0.5)', borderRadius: 10, padding: '14px 16px', fontSize: 13, color: '#ffaaaa', lineHeight: 1.7, marginBottom: 10 },
  hr: { border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '0 0 32px' } as React.CSSProperties,
  gold: { color: '#C9A96E', fontWeight: 600 } as React.CSSProperties,
  red: { color: '#ff6b6b', fontWeight: 600 } as React.CSSProperties,
};

export default function TermsPage() {
  const navigate = useNavigate();
  return (
    <div style={s.container}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate(-1)}>←</button>
        <span style={s.title}>이용약관</span>
      </div>
      <div style={s.body}>
        <div style={s.h1}>이용약관</div>
        <div style={s.date}>시행일: 2026년 02월 22일</div>

        <div style={s.section}>
          <div style={s.h2}>제1조 (목적)</div>
          <p style={s.p}>본 약관은 SMting(이하 "서비스")이 제공하는 성인 성향 매칭 서비스의 이용 조건 및 절차, 회사와 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.</p>
        </div>
        <hr style={s.hr} />

        <div style={s.section}>
          <div style={s.h2}>제2조 (서비스의 목적 및 성격)</div>
          <p style={s.p}>SMting은 BDSM/SM 성향을 가진 성인들이 안전하고 자발적인 관계를 형성할 수 있도록 지원하는 성인 성향 기반 매칭 플랫폼입니다. 서비스는 이용자 간의 자발적인 소통을 지원하며, 이용자 간 발생하는 모든 관계 및 행위에 대해 회사는 책임을 지지 않습니다.</p>
          <div style={s.box}>본 서비스는 BDSM/SM 성향 관련 콘텐츠를 포함하며, 만 19세 이상 성인만 이용 가능합니다. SSC(Safe, Sane, Consensual) 원칙을 존중하고 준수하는 이용자만 이용할 수 있습니다.</div>
        </div>
        <hr style={s.hr} />

        <div style={s.section}>
          <div style={s.h2}>제3조 (이용 자격)</div>
          <p style={s.p}>
            1. <span style={s.gold}>연령 조건:</span> 대한민국 법령 기준 만 19세 이상 성인<br />
            2. <span style={s.gold}>동의 조건:</span> 본 이용약관 및 개인정보처리방침에 동의<br />
            3. <span style={s.gold}>법적 능력:</span> 서비스 이용 계약을 체결할 법적 능력 보유<br />
            4. <span style={s.gold}>중복 계정 금지:</span> 1인 1계정 원칙 준수
          </p>
          <div style={s.warn}><span style={s.red}>[중요]</span> 미성년자의 서비스 이용은 엄격히 금지됩니다. 미성년자로 확인되거나 의심되는 계정은 즉시 영구 정지 처리되며, 관련 법령에 따라 신고될 수 있습니다.</div>
        </div>
        <hr style={s.hr} />

        <div style={s.section}>
          <div style={s.h2}>제4조 (금지 행위)</div>
          <p style={s.p}><span style={s.red}>① 미성년자 관련</span><br />- 미성년자임을 숨기고 서비스 이용<br />- 미성년자를 대상으로 한 어떠한 접촉 시도<br />- 미성년자가 포함된 성적 콘텐츠 게시 또는 공유</p>
          <p style={s.p}><span style={s.red}>② 허위 정보 및 사기</span><br />- 나이, 성별, 성향 등 프로필 허위 기재<br />- 타인의 사진 또는 정보 도용<br />- 금전 요구, 사기, 도박 관련 행위</p>
          <p style={s.p}><span style={s.red}>③ 불법 행위</span><br />- 성매매 알선 또는 매춘 관련 행위<br />- 협박, 스토킹, 성희롱 등 타인에게 피해를 주는 행위<br />- 비동의 성적 콘텐츠 게시 또는 유포</p>
          <p style={s.p}><span style={s.red}>④ 커뮤니티 규범 위반</span><br />- SSC 원칙에 반하는 행위 조장<br />- 혐오 발언, 차별, 폭력 조장 콘텐츠 게시<br />- 스팸 메시지 대량 발송</p>
        </div>
        <hr style={s.hr} />

        <div style={s.section}>
          <div style={s.h2}>제5조 (계정 정지 및 삭제 정책)</div>
          <table style={s.table}>
            <thead><tr><th style={s.th}>위반 유형</th><th style={s.th}>조치</th></tr></thead>
            <tbody>
              <tr><td style={s.td}>미성년자 관련 위반</td><td style={s.tdRed}>즉시 영구 삭제, 수사기관 신고</td></tr>
              <tr><td style={s.td}>성매매·불법 행위</td><td style={s.tdRed}>즉시 영구 삭제</td></tr>
              <tr><td style={s.td}>허위 정보 기재</td><td style={s.td}>경고 후 미수정 시 삭제</td></tr>
              <tr><td style={s.td}>스팸·도배</td><td style={s.td}>1차 경고 → 7일 정지 → 영구 정지</td></tr>
              <tr><td style={s.td}>커뮤니티 규범 위반</td><td style={s.td}>경고 → 단기 정지 → 영구 정지</td></tr>
            </tbody>
          </table>
        </div>
        <hr style={s.hr} />

        <div style={s.section}>
          <div style={s.h2}>제6조 (회원 탈퇴)</div>
          <p style={s.p}>이용자는 언제든지 서비스 내 설정 메뉴를 통해 회원 탈퇴를 요청할 수 있습니다. 탈퇴 즉시 프로필, 매칭 정보, 게시물 등은 삭제됩니다. 단, 관계 법령에 따라 일부 기록은 지정된 기간 보존될 수 있습니다.</p>
        </div>
        <hr style={s.hr} />

        <div style={s.section}>
          <div style={s.h2}>제7조 (면책조항)</div>
          <p style={s.p}>1. 회사는 이용자 간의 분쟁, 거래, 또는 만남에서 발생하는 피해에 대해 책임을 지지 않습니다.<br />2. 회사는 이용자가 게시한 정보의 정확성을 보증하지 않습니다.<br />3. 천재지변, 서비스 장애 등 불가항력으로 인한 서비스 중단의 경우 책임을 지지 않습니다.</p>
          <div style={s.warn}><span style={s.red}>[안전 고지]</span><br />오프라인 만남 시에는 반드시 안전을 최우선으로 하시기 바랍니다. SSC(Safe, Sane, Consensual) 원칙을 항상 준수하고, 불안하거나 위험하다고 느껴지는 상황에서는 즉시 자리를 피하시기 바랍니다.</div>
        </div>
        <hr style={s.hr} />

        <div style={s.section}>
          <div style={s.h2}>제8조 (준거법 및 분쟁 해결)</div>
          <p style={s.p}>본 약관은 대한민국 법령에 따라 해석되고 적용됩니다. 서비스 이용과 관련하여 발생한 분쟁은 회사의 소재지를 관할하는 법원을 전속 관할 법원으로 합니다.</p>
        </div>
        <hr style={s.hr} />

        <div style={s.section}>
          <div style={s.h2}>제9조 (약관의 변경)</div>
          <p style={s.p}>회사는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 적용 7일 전 앱 내 공지사항을 통해 고지합니다. 변경 고지 후 계속 서비스를 이용하는 경우 변경된 약관에 동의한 것으로 간주합니다.</p>
        </div>

        <div style={{ ...s.box, textAlign: 'center' as const, color: '#888', fontSize: 12 }}>본 약관은 2026년 02월 22일부터 시행됩니다.</div>
      </div>
    </div>
  );
}
