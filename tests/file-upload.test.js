import { describe, it, expect, vi, beforeAll } from 'vitest';
import { validateFile, readFileContent } from '../src/utils/fileUpload';

// Polyfill FileReader for Node.js test environment
beforeAll(() => {
  if (typeof global.FileReader === 'undefined') {
    global.FileReader = class FileReader {
      constructor() {
        this.onload = null;
        this.onerror = null;
        this.result = '';
      }
      
      readAsText(file) {
        file.text().then(
          (text) => {
            this.result = text;
            if (this.onload) this.onload();
          },
          (err) => {
            if (this.onerror) this.onerror(err);
          }
        );
      }
    };
  }
});

describe('File Validation and Reading Utilities', () => {
  describe('validateFile', () => {
    it('should validate plain text files under 500KB', () => {
      const file = new File(['small content'], 'notes.txt', { type: 'text/plain' });
      const result = validateFile(file);
      expect(result.valid).toBe(true);
    });

    it('should validate markdown files under 500KB', () => {
      const file = new File(['# Heading'], 'outline.md', { type: 'text/markdown' });
      const result = validateFile(file);
      expect(result.valid).toBe(true);
    });

    it('should validate files with plain text extensions even if type is empty', () => {
      const file = new File(['flowchart TD'], 'diagram.mermaid', { type: '' });
      const result = validateFile(file);
      expect(result.valid).toBe(true);
    });

    it('should reject files exceeding 500KB', () => {
      const bigContent = 'a'.repeat(501 * 1024);
      const file = new File([bigContent], 'large.txt', { type: 'text/plain' });
      const result = validateFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('File exceeds the maximum limit of 500KB.');
    });

    it('should reject non-text files (e.g., images)', () => {
      const file = new File(['binarydata'], 'image.png', { type: 'image/png' });
      const result = validateFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Only plain text files are supported.');
    });
  });

  describe('readFileContent', () => {
    it('should read file content successfully', async () => {
      const file = new File(['Hello World!'], 'hello.txt', { type: 'text/plain' });
      const content = await readFileContent(file);
      expect(content).toBe('Hello World!');
    });

    it('should handle read failures gracefully', async () => {
      const file = new File(['Hello World!'], 'hello.txt', { type: 'text/plain' });
      
      const readAsTextSpy = vi.spyOn(global.FileReader.prototype, 'readAsText');
      readAsTextSpy.mockImplementationOnce(function () {
        if (this.onerror) {
          this.onerror(new Error('Failed to read the file.'));
        }
      });

      await expect(readFileContent(file)).rejects.toThrow('Failed to read the file.');
      readAsTextSpy.mockRestore();
    });
  });
});
