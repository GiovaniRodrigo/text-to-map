import { describe, it, expect } from 'vitest';
import { cleanText, parseSegmentsLocally } from '../../src/utils/segmentParser';

describe('Text Cleaning Utility', () => {
  it('should strip HTML tags from raw input', () => {
    const input = '<div>Hello <b>world</b>!</div>';
    expect(cleanText(input)).toBe('Hello world!');
  });

  it('should normalize double tabs and excessive spacing', () => {
    const input = 'This   is    some   spaced \t  text.';
    expect(cleanText(input)).toBe('This is some spaced text.');
  });
});

describe('Local Fallback Segment Parser', () => {
  it('should split text into segments by double newlines', () => {
    const input = `Segment number one.

Segment number two.

Segment number three.`;

    const { segments, relationships } = parseSegmentsLocally(input);

    expect(segments).toHaveLength(3);
    expect(segments[0].id).toBe('seg-1');
    expect(segments[0].title).toBe('Segment number one');
    expect(segments[0].content).toBe('Segment number one.');
    expect(segments[0].category).toBe('concept');

    expect(relationships).toHaveLength(2);
    expect(relationships[0]).toEqual({
      id: 'r-seg-1-seg-2',
      sourceSegmentId: 'seg-1',
      targetSegmentId: 'seg-2',
      label: 'leads to',
    });
  });

  it('should fall back to single newlines if no double newlines exist', () => {
    const input = `Line one.
Line two.`;

    const { segments } = parseSegmentsLocally(input);
    expect(segments).toHaveLength(2);
    expect(segments[0].title).toBe('Line one');
    expect(segments[1].title).toBe('Line two');
  });

  it('should infer category warning, action, and question based on keywords', () => {
    const input = `You must run the task.

There is a warning error.

Why did this fail?`;

    const { segments } = parseSegmentsLocally(input);

    expect(segments).toHaveLength(3);
    expect(segments[0].category).toBe('action'); // contains "must", "run"
    expect(segments[1].category).toBe('warning'); // contains "warning", "error"
    expect(segments[2].category).toBe('question'); // contains "why"
  });

  it('should return empty structures for empty text', () => {
    const { segments, relationships } = parseSegmentsLocally('');
    expect(segments).toHaveLength(0);
    expect(relationships).toHaveLength(0);
  });
});
