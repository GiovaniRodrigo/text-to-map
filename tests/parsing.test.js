import { describe, it, expect } from 'vitest';
import { parseMermaid } from '../src/utils/mermaid';
import { parseMarkdown } from '../src/utils/markdown';

describe('Mermaid Local Parser', () => {
  it('should parse a basic top-down flowchart with nodes and edges', () => {
    const input = `flowchart TD
      A[Start Project] --> B[Write Plan]
      B --> C[Write Code]`;
    
    const { nodes, edges } = parseMermaid(input);
    
    expect(nodes).toHaveLength(3);
    expect(nodes.map(n => n.id)).toEqual(['A', 'B', 'C']);
    expect(nodes.find(n => n.id === 'A').data.label).toBe('Start Project');
    expect(nodes.find(n => n.id === 'A').data.category).toBe('concept');
    
    expect(edges).toHaveLength(2);
    expect(edges[0]).toEqual({
      id: 'e-A-B',
      source: 'A',
      target: 'B',
      label: '',
    });
  });

  it('should parse connection labels successfully', () => {
    const input = `flowchart LR
      User[Active User] -- triggers --> Auth[Authentication]`;
    
    const { nodes, edges } = parseMermaid(input);
    expect(nodes).toHaveLength(2);
    expect(edges).toHaveLength(1);
    expect(edges[0].label).toBe('triggers');
  });

  it('should return empty nodes and edges for empty or invalid input', () => {
    const { nodes, edges } = parseMermaid('not mermaid code');
    expect(nodes).toHaveLength(0);
    expect(edges).toHaveLength(0);
  });
});

describe('Markdown Local Parser', () => {
  it('should parse an indented list into a tree of nodes and edges', () => {
    const input = `- Web App
  - Frontend
    - React Flow
  - Backend`;

    const { nodes, edges } = parseMarkdown(input);

    expect(nodes).toHaveLength(4);
    expect(nodes.map(n => n.data.label)).toEqual(['Web App', 'Frontend', 'React Flow', 'Backend']);

    // Check that edges link Web App -> Frontend, Frontend -> React Flow, and Web App -> Backend
    const webAppNode = nodes.find(n => n.data.label === 'Web App');
    const frontendNode = nodes.find(n => n.data.label === 'Frontend');
    const reactFlowNode = nodes.find(n => n.data.label === 'React Flow');
    const backendNode = nodes.find(n => n.data.label === 'Backend');

    expect(edges).toContainEqual({
      id: `e-${webAppNode.id}-${frontendNode.id}`,
      source: webAppNode.id,
      target: frontendNode.id,
      label: 'has child',
    });
    expect(edges).toContainEqual({
      id: `e-${frontendNode.id}-${reactFlowNode.id}`,
      source: frontendNode.id,
      target: reactFlowNode.id,
      label: 'has child',
    });
    expect(edges).toContainEqual({
      id: `e-${webAppNode.id}-${backendNode.id}`,
      source: webAppNode.id,
      target: backendNode.id,
      label: 'has child',
    });
  });

  it('should handle space-indented and tab-indented lists robustly', () => {
    const input = `- Root
\t- TabChild
    - SpaceChild`;

    const { nodes, edges } = parseMarkdown(input);
    expect(nodes).toHaveLength(3);
    expect(edges).toHaveLength(2);
  });
});
