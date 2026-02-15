interface AvatarProps {
  color: string;
  size?: number;
  online?: boolean;
  nickname: string;
}

export default function Avatar({ color, size = 48, online, nickname }: AvatarProps) {
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <div style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.4,
        color: '#fff',
        fontWeight: 700,
      }}>
        {nickname.charAt(0)}
      </div>
      {online !== undefined && (
        <span style={{
          position: 'absolute',
          bottom: 1,
          right: 1,
          width: size * 0.24,
          height: size * 0.24,
          borderRadius: '50%',
          backgroundColor: online ? '#00C853' : '#666',
          border: '2px solid #0D0D0D',
        }} />
      )}
    </div>
  );
}
