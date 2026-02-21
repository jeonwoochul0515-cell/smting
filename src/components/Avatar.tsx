import { useState } from 'react';

interface AvatarProps {
  color: string;
  size?: number;
  online?: boolean;
  nickname: string;
  showRing?: boolean;
  imageUrl?: string | null;
}

export default function Avatar({ color, size = 48, online, nickname, showRing, imageUrl }: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const showImage = imageUrl && !imageError;

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <div style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: showImage ? 'transparent' : `linear-gradient(135deg, ${color}, ${color}CC)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.38,
        color: '#fff',
        fontWeight: 700,
        border: showRing ? '2px solid #C9A96E' : '2px solid rgba(255,255,255,0.08)',
        boxShadow: showRing
          ? '0 0 12px rgba(201, 169, 110, 0.25)'
          : '0 2px 8px rgba(0,0,0,0.3)',
        overflow: 'hidden',
      }}>
        {showImage ? (
          <img
            src={imageUrl}
            alt={nickname}
            onError={() => setImageError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          nickname.charAt(0)
        )}
      </div>
      {online !== undefined && (
        <span style={{
          position: 'absolute',
          bottom: 1,
          right: 1,
          width: size * 0.24,
          height: size * 0.24,
          borderRadius: '50%',
          backgroundColor: online ? '#00C853' : '#444',
          border: '2px solid #0A0A0A',
          boxShadow: online ? '0 0 6px rgba(0, 200, 83, 0.4)' : 'none',
        }} />
      )}
    </div>
  );
}
