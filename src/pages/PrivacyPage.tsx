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
  box: { backgroundColor: 'rgba(139,0,0,0.12)', border: '1px solid rgba(139,0,0,0.3)', borderRadius: 10, padding: '14px 16px', fontSize: 13, color: '#C0C0C0', lineHeight: 1.7, marginBottom: 10 },
  hr: { border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '0 0 32px' } as React.CSSProperties,
  gold: { color: '#C9A96E', fontWeight: 600 } as React.CSSProperties,
};

export default function PrivacyPage() {
  const navigate = useNavigate();
  return (
    <div style={s.container}>
      <div style={s.header}>
        <button style={s.back} onClick={() => navigate(-1)}>←</button>
        <span style={s.title}>개인정보처리방침</span>
      </div>
      <div style={s.body}>
        <div style={s.h1}>개인정보처리방침</div>
        <div style={s.date}>시행일: 2026년 02월 22일</div>

        <div style={s.section}>
          <div style={s.h2}>제1조 (목적)</div>
          <p style={s.p}>SMting(이하 "서비스")은 개인정보보호법 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보처리방침을 수립·공개합니다.</p>
        </div>
        <hr style={s.hr} />

        <div style={s.section}>
          <div style={s.h2}>제2조 (개인정보의 처리 목적 및 수집 항목)</div>
          <p style={s.p}>서비스는 다음의 목적을 위하여 개인정보를 처리합니다.</p>
          <table style={s.table}>
            <thead><tr><th style={s.th}>수집 항목</th><th style={s.th}>수집 목적</th><th style={s.th}>보유 기간</th></tr></thead>
            <tbody>
              <tr><td style={s.td}>이메일 주소</td><td style={s.td}>회원 식별, 로그인 인증</td><td style={s.td}>회원 탈퇴 시까지</td></tr>
              <tr><td style={s.td}>닉네임</td><td style={s.td}>서비스 내 사용자 구분</td><td style={s.td}>회원 탈퇴 시까지</td></tr>
              <tr><td style={s.td}>나이(연령)</td><td style={s.td}>성인 인증, 매칭 제공</td><td style={s.td}>회원 탈퇴 시까지</td></tr>
              <tr><td style={s.td}>성별</td><td style={s.td}>매칭 서비스 제공</td><td style={s.td}>회원 탈퇴 시까지</td></tr>
              <tr><td style={s.td}>성향 정보 (S/M/SW)</td><td style={s.td}>성향 기반 매칭 서비스 제공</td><td style={s.td}>회원 탈퇴 시까지</td></tr>
              <tr><td style={s.td}>위치정보</td><td style={s.td}>근처 사용자 탐색 (위치기반 서비스)</td><td style={s.td}>이용 종료 즉시 파기</td></tr>
              <tr><td style={s.td}>접속 기록 (IP, 접속 시간)</td><td style={s.td}>부정이용 방지, 보안</td><td style={s.td}>3개월 (통신비밀보호법)</td></tr>
              <tr><td style={s.td}>프로필 이미지</td><td style={s.td}>프로필 표시</td><td style={s.td}>회원 탈퇴 시까지</td></tr>
            </tbody>
          </table>
          <div style={s.box}>본 서비스는 성인 성향 매칭 서비스로서, 성향 정보는 민감정보에 준하여 처리됩니다. 해당 정보는 서비스 제공 목적 외에 절대 이용되지 않습니다.</div>
        </div>
        <hr style={s.hr} />

        <div style={s.section}>
          <div style={s.h2}>제3조 (개인정보의 보유 및 이용 기간)</div>
          <p style={s.p}>개인정보는 수집·이용 목적이 달성된 후 지체 없이 파기합니다. 단, 관계 법령에 의하여 일정 기간 보존이 필요한 경우는 아래와 같습니다.</p>
          <table style={s.table}>
            <thead><tr><th style={s.th}>보존 항목</th><th style={s.th}>보존 기간</th><th style={s.th}>근거 법령</th></tr></thead>
            <tbody>
              <tr><td style={s.td}>계약 또는 청약철회 기록</td><td style={s.td}>5년</td><td style={s.td}>전자상거래법</td></tr>
              <tr><td style={s.td}>소비자 불만 또는 분쟁 처리 기록</td><td style={s.td}>3년</td><td style={s.td}>전자상거래법</td></tr>
              <tr><td style={s.td}>접속 로그, 접속 IP 정보</td><td style={s.td}>3개월</td><td style={s.td}>통신비밀보호법</td></tr>
            </tbody>
          </table>
        </div>
        <hr style={s.hr} />

        <div style={s.section}>
          <div style={s.h2}>제4조 (개인정보의 제3자 제공)</div>
          <p style={s.p}>서비스는 원칙적으로 정보주체의 개인정보를 제3자에게 제공하지 않습니다. 다만, 정보주체가 사전 동의한 경우 또는 법령의 규정에 의거하는 경우에는 예외로 합니다.</p>
          <div style={s.box}><span style={s.gold}>[수탁업체 안내]</span><br />서비스는 원활한 서비스 제공을 위해 Supabase Inc.에 데이터 저장 및 인증 처리를 위탁합니다. 수탁자는 위탁 목적 범위 내에서만 개인정보를 처리합니다.</div>
        </div>
        <hr style={s.hr} />

        <div style={s.section}>
          <div style={s.h2}>제5조 (위치정보의 처리 — 위치정보보호법 제18조)</div>
          <p style={s.p}>서비스는 위치정보보호법 제18조에 따라 위치기반 서비스 제공을 위해 이용자의 위치정보를 수집·이용합니다.</p>
          <table style={s.table}>
            <thead><tr><th style={s.th}>구분</th><th style={s.th}>내용</th></tr></thead>
            <tbody>
              <tr><td style={s.td}>수집 목적</td><td style={s.td}>근처 사용자 탐색(Nearby) 기능 제공</td></tr>
              <tr><td style={s.td}>수집 방법</td><td style={s.td}>기기 GPS 또는 네트워크 기반 위치 정보</td></tr>
              <tr><td style={s.td}>보유 기간</td><td style={s.td}>서비스 이용 종료 즉시 파기</td></tr>
              <tr><td style={s.td}>제3자 제공</td><td style={s.td}>없음</td></tr>
            </tbody>
          </table>
          <p style={s.p}>위치정보 수집은 이용자가 앱에서 위치 권한을 허용한 경우에만 동작합니다. 권한을 거부하면 Nearby 기능이 제한되며, 다른 서비스 이용에는 영향을 주지 않습니다.</p>
        </div>
        <hr style={s.hr} />

        <div style={s.section}>
          <div style={s.h2}>제6조 (정보주체의 권리)</div>
          <p style={s.p}>이용자는 개인정보 보호법에 따라 열람, 정정·삭제, 처리 정지, 동의 철회를 언제든지 요청할 수 있습니다. 앱 내 "프로필 수정" 메뉴 또는 아래 연락처를 통해 요청하시면 10일 이내에 처리합니다.</p>
          <div style={s.box}>개인정보 보호 담당자: SMting 운영팀<br />이메일: privacy@smting.app<br />처리 기간: 접수 후 10일 이내</div>
        </div>
        <hr style={s.hr} />

        <div style={s.section}>
          <div style={s.h2}>제7조 (개인정보처리방침 변경)</div>
          <p style={s.p}>이 개인정보처리방침은 시행일로부터 적용되며, 변경 내용이 있는 경우 변경사항의 시행 7일 전부터 앱 내 공지사항을 통해 고지합니다. 이용자의 권리에 중요한 변경이 발생하는 경우에는 최소 30일 전에 고지합니다.</p>
        </div>

        <div style={{ ...s.box, textAlign: 'center' as const, color: '#888', fontSize: 12 }}>본 방침은 2026년 02월 22일부터 시행됩니다.</div>
      </div>
    </div>
  );
}
