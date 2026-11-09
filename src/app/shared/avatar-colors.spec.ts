import { describe, expect, it } from 'vitest';
import { avatarColorsForUid } from './avatar-colors';

describe('avatarColorsForUid', () => {
  it('returns a stable palette color for a normalized UID', () => {
    expect(avatarColorsForUid('user-123')).toEqual(avatarColorsForUid(' USER-123 '));
  });

  it('returns foreground, background, and border colors', () => {
    expect(avatarColorsForUid('user-123')).toMatchObject({
      foreground: expect.stringMatching(/^#[0-9a-f]{6}$/i),
      background: expect.stringMatching(/^#[0-9a-f]{6}$/i),
      border: expect.stringMatching(/^rgba\(/),
    });
  });
});