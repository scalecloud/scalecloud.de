export interface AvatarColors {
  foreground: string;
  background: string;
  border: string;
}

const AVATAR_PALETTE: readonly AvatarColors[] = [
  { foreground: '#a5f3fc', background: '#18303a', border: 'rgba(103, 232, 249, 0.24)' },
  { foreground: '#ddd6fe', background: '#2a2440', border: 'rgba(196, 181, 253, 0.24)' },
  { foreground: '#a7f3d0', background: '#17352b', border: 'rgba(110, 231, 183, 0.24)' },
  { foreground: '#fde68a', background: '#3a2f18', border: 'rgba(253, 230, 138, 0.24)' },
  { foreground: '#fecdd3', background: '#3a2028', border: 'rgba(253, 164, 175, 0.24)' },
  { foreground: '#bfdbfe', background: '#1f2c42', border: 'rgba(147, 197, 253, 0.24)' },
];

export function avatarColorsForUid(uid: string): AvatarColors {
  const identity = uid.trim().toLowerCase() || 'anonymous';
  let hash = 2166136261;

  for (const character of identity) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619) >>> 0;
  }

  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
}