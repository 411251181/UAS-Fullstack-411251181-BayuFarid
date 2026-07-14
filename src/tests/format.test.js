import { describe, expect, it } from 'vitest';
import { formatDateInput } from '../utils/format';

describe('formatDateInput', () => {
  it('returns empty string for empty value', () => {
    expect(formatDateInput('')).toBe('');
  });

  it('formats date to yyyy-mm-dd', () => {
    expect(formatDateInput('2026-01-03T00:00:00.000Z')).toBe('2026-01-03');
  });
});
