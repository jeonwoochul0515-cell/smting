import type { Tendency } from '../data/mockData';

const badgeGradients: Record<Tendency, string> = {
  S: 'linear-gradient(135deg, #8B0000, #CC0000)',
  M: 'linear-gradient(135deg, #4A0080, #7B2FBE)',
  SW: 'linear-gradient(135deg, #005C5C, #008B8B)',
};

export default function TendencyBadge({ tendency, size = 'md' }: { tendency: Tendency; size?: 'sm' | 'md' }) {
  const fontSize = size === 'sm' ? 10 : 12;
  const padding = size === 'sm' ? '2px 6px' : '3px 10px';

  return (
    <span style={{
      display: 'inline-block',
      background: badgeGradients[tendency],
      color: '#fff',
      fontSize,
      fontWeight: 700,
      padding,
      borderRadius: 6,
      lineHeight: 1.4,
      letterSpacing: 0.5,
      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
    }}>
      {tendency}
    </span>
  );
}
