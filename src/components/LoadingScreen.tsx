import { useState, useEffect } from 'react';
import Icon from './Icon';

const tips = [
  { text: '세이프워드를 미리 정해두면 더 안전한 플레이를 즐길 수 있어요', icon: 'shield' },
  { text: '프로필을 자세히 작성할수록 매칭률이 높아져요', icon: 'sparkle' },
  { text: '최애플 TOP 3를 설정하면 궁합이 더 정확해져요', icon: 'target' },
  { text: '매너 있는 대화가 좋은 만남의 시작이에요', icon: 'chat' },
  { text: '서로의 경계를 존중하는 것이 가장 중요해요', icon: 'heart' },
  { text: 'SMting에서 이미 1,000+명이 파트너를 찾았어요', icon: 'fire' },
];

export default function LoadingScreen() {
  const [tipIdx, setTipIdx] = useState(0);
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const tipTimer = setInterval(() => setTipIdx(i => (i + 1) % tips.length), 3000);
    const dotTimer = setInterval(() => setDotCount(d => (d + 1) % 4), 400);
    return () => { clearInterval(tipTimer); clearInterval(dotTimer); };
  }, []);

  const tip = tips[tipIdx];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 24px',
      textAlign: 'center',
      animation: 'fadeIn 0.3s ease',
    }}>
      {/* Brand animated loader */}
      <div style={{ position: 'relative', width: 60, height: 60, marginBottom: 24 }}>
        <div style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          border: '3px solid rgba(201,169,110,0.1)',
          borderTopColor: '#C9A96E',
          animation: 'spin 0.9s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          fontWeight: 900,
          color: '#C9A96E',
        }}>
          S
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Loading text */}
      <div style={{ fontSize: 14, color: '#888', marginBottom: 24 }}>
        로딩 중{'·'.repeat(dotCount)}
      </div>

      {/* Tip card */}
      <div style={{
        padding: '16px 20px',
        borderRadius: 14,
        backgroundColor: 'rgba(201,169,110,0.04)',
        border: '1px solid rgba(201,169,110,0.1)',
        maxWidth: 300,
        animation: 'fadeIn 0.5s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
          <Icon name={tip.icon} size={24} color="#C9A96E" />
        </div>
        <div style={{ fontSize: 13, color: '#bbb', lineHeight: 1.6 }}>
          {tip.text}
        </div>
      </div>

      {/* Branding */}
      <div style={{
        marginTop: 32,
        fontSize: 11,
        color: '#444',
        letterSpacing: 2,
      }}>
        SMting
      </div>
    </div>
  );
}
