import { describe, it, expect } from 'vitest';
import { formatFileSize } from './format-file-size';

describe('formatFileSize', () => {
  it('should return "0 Bytes" for 0 bytes', () => {
    expect(formatFileSize(0)).toBe('0 Bytes');
  });

  it('should format bytes correctly', () => {
    expect(formatFileSize(512)).toBe('512 Bytes');
    expect(formatFileSize(1023)).toBe('1023 Bytes');
  });

  it('should format kilobytes correctly', () => {
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(10240)).toBe('10 KB');
  });

  it('should format megabytes correctly', () => {
    expect(formatFileSize(1048576)).toBe('1 MB');
    expect(formatFileSize(2359296)).toBe('2.25 MB');
    expect(formatFileSize(5242880)).toBe('5 MB');
  });

  it('should format gigabytes correctly', () => {
    expect(formatFileSize(1073741824)).toBe('1 GB');
    expect(formatFileSize(3221225472)).toBe('3 GB');
    expect(formatFileSize(1610612736)).toBe('1.5 GB');
  });

  it('should round to 2 decimal places', () => {
    expect(formatFileSize(1126)).toBe('1.1 KB');
    expect(formatFileSize(1126.76)).toBe('1.1 KB');
    expect(formatFileSize(1127)).toBe('1.1 KB');
    expect(formatFileSize(2359296)).toBe('2.25 MB');
  });
});
