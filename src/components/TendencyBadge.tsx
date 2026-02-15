import type { Tendency } from '../data/mockData';

const badgeColors: Record<Tendency, string> = {
  S: '#8B0000',
  M: '#4A0080',
  SW: '#005C5C',
};

const badgeLabels: Record<Tendency, string> = {
  S: 'S',
  M: 'M',
  SW: 'SW',
};

export default function TendencyBadge({ tendency, size = 'md' }: { tendency: Tendency; size?: 'sm' | 'md' }) {
  const fontSize = size === 'sm' ? 10 : 12;
  const padding = size === 'sm' ? '1px 5px' : '2px 8px';

  return (
    <span style={{
      display: 'inline-block',
      backgroundColor: badgeColors[tendency],
      color: '#fff',
      fontSize,
      fontWeight: 700,
      padding,
      borderRadius: 4,
      lineHeight: 1.4,
    }}>
      {badgeLabels[tendency]}
    </span>
  );
}
