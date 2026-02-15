import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: SplashScreenProps) {
  const [phase, setPhase] = useState(0); // 0: logo, 1: tagline, 2: fade out

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1800);
    const t3 = setTimeout(onDone, 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(180deg, #0A0A0A 0%, #1A0508 50%, #0A0A0A 100%)',
      zIndex: 9999,
      opacity: phase === 2 ? 0 : 1,
      transition: 'opacity 0.4s ease',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        width: 250,
        height: 250,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,0,0,0.2) 0%, transparent 70%)',
        filter: 'blur(50px)',
      }} />

      {/* Logo */}
      <div style={{
        fontSize: 52,
        fontWeight: 900,
        background: 'linear-gradient(135deg, #C9A96E, #E8D5B0)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: 4,
        position: 'relative',
        zIndex: 1,
        opacity: phase >= 0 ? 1 : 0,
        transform: phase >= 0 ? 'scale(1)' : 'scale(0.8)',
        transition: 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }}>
        SMting
      </div>

      {/* Tagline */}
      <div style={{
        fontSize: 13,
        color: '#888',
        letterSpacing: 3,
        marginTop: 12,
        position: 'relative',
        zIndex: 1,
        opacity: phase >= 1 ? 1 : 0,
        transform: phase >= 1 ? 'translateY(0)' : 'translateY(10px)',
        transition: 'all 0.5s ease',
      }}>
        YOUR DESIRE, YOUR MATCH
      </div>

      {/* Bottom branding */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        fontSize: 11,
        color: '#333',
        letterSpacing: 1,
        opacity: phase >= 1 ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}>
        Safe · Trusted · Matched
      </div>
    </div>
  );
}
