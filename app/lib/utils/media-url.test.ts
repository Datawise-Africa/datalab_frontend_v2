import { describe, expect, it } from 'vitest';
import { resolveMediaUrl } from './media-url';

const API_BASE = 'https://staging-backend.datalabafrica.com/api';

describe('resolveMediaUrl', () => {
  it('returns null for empty, null, or undefined input', () => {
    expect(resolveMediaUrl(null, API_BASE)).toBeNull();
    expect(resolveMediaUrl(undefined, API_BASE)).toBeNull();
    expect(resolveMediaUrl('', API_BASE)).toBeNull();
  });

  it('prefixes a relative media path with the backend origin (drops /api)', () => {
    expect(
      resolveMediaUrl('/media/dataset_images/69dc2cec-302.jpg', API_BASE)
    ).toBe(
      'https://staging-backend.datalabafrica.com/media/dataset_images/69dc2cec-302.jpg'
    );
  });

  it('adds a leading slash when the path has none', () => {
    expect(resolveMediaUrl('media/x.jpg', API_BASE)).toBe(
      'https://staging-backend.datalabafrica.com/media/x.jpg'
    );
  });

  it('leaves absolute http(s) URLs untouched', () => {
    const abs = 'https://cdn.example.com/media/x.jpg';
    expect(resolveMediaUrl(abs, API_BASE)).toBe(abs);
    expect(resolveMediaUrl('http://cdn.example.com/x.jpg', API_BASE)).toBe(
      'http://cdn.example.com/x.jpg'
    );
  });

  it('leaves data: and blob: URLs untouched (local previews)', () => {
    expect(resolveMediaUrl('data:image/png;base64,abc', API_BASE)).toBe(
      'data:image/png;base64,abc'
    );
    expect(resolveMediaUrl('blob:http://localhost/abc', API_BASE)).toBe(
      'blob:http://localhost/abc'
    );
  });

  it('handles a base url without a trailing /api segment', () => {
    expect(resolveMediaUrl('/media/x.jpg', 'http://localhost:8080')).toBe(
      'http://localhost:8080/media/x.jpg'
    );
  });
});
