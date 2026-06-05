import { describe, it, expect, vi } from 'vitest';
import { extractMapWithAI } from '../src/services/gemini';

describe('AI Mapping Service', () => {
  it('should fallback to mock data when no API key is present', async () => {
    // Spy on console.warn to verify fallback warnings
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Ensure API Key env var is empty
    vi.stubEnv('VITE_GEMINI_API_KEY', '');

    const result = await extractMapWithAI('Database stores tables.');

    expect(warnSpy).toHaveBeenCalled();
    expect(result.nodes).toBeDefined();
    expect(result.nodes.length).toBeGreaterThan(0);
    expect(result.edges).toBeDefined();

    const firstNode = result.nodes[0];
    expect(firstNode.data.label).toBeDefined();
    expect(firstNode.data.category).toBeDefined();

    vi.unstubAllEnvs();
    warnSpy.mockRestore();
  });
});
