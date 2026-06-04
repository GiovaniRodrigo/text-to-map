import { describe, it, expect } from 'vitest';
import { getLayoutedElements } from '../src/utils/layout';

describe('Layout Recalculation Engine', () => {
  const nodes = [
    { id: '1', data: { label: 'Node 1' }, position: { x: 0, y: 0 } },
    { id: '2', data: { label: 'Node 2' }, position: { x: 0, y: 0 } },
    { id: '3', data: { label: 'Node 3' }, position: { x: 0, y: 0 } },
  ];

  const edges = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3' },
  ];

  it('should layout elements hierarchically Top-Down (TD)', () => {
    const { nodes: layoutedNodes } = getLayoutedElements(nodes, edges, 'hierarchical-td');

    expect(layoutedNodes).toHaveLength(3);
    
    // In top-down layout, nodes should be separated vertically
    const n1 = layoutedNodes.find(n => n.id === '1');
    const n2 = layoutedNodes.find(n => n.id === '2');
    const n3 = layoutedNodes.find(n => n.id === '3');

    expect(n1.position.y).toBeLessThan(n2.position.y);
    expect(n2.position.y).toBeLessThan(n3.position.y);
    expect(typeof n1.position.x).toBe('number');
  });

  it('should layout elements hierarchically Left-to-Right (LR)', () => {
    const { nodes: layoutedNodes } = getLayoutedElements(nodes, edges, 'hierarchical-lr');

    expect(layoutedNodes).toHaveLength(3);

    // In left-to-right layout, nodes should be separated horizontally
    const n1 = layoutedNodes.find(n => n.id === '1');
    const n2 = layoutedNodes.find(n => n.id === '2');
    const n3 = layoutedNodes.find(n => n.id === '3');

    expect(n1.position.x).toBeLessThan(n2.position.x);
    expect(n2.position.x).toBeLessThan(n3.position.x);
    expect(typeof n1.position.y).toBe('number');
  });

  it('should layout elements in Mind Map structure using D3 tree coordinates', () => {
    const { nodes: layoutedNodes } = getLayoutedElements(nodes, edges, 'mind-map');

    expect(layoutedNodes).toHaveLength(3);
    
    const n1 = layoutedNodes.find(n => n.id === '1');
    const n2 = layoutedNodes.find(n => n.id === '2');
    
    // In horizontal tree layout, root (node 1) is at depth 0, child at depth > 0
    expect(n1.position.x).toBeLessThan(n2.position.x);
  });
});
