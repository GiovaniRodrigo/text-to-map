import { describe, it, expect } from 'vitest';
import { validateMap } from '../../src/utils/heuristics';

describe('Site-Wide Map Heuristics', () => {
  describe('Orphan Node Check', () => {
    it('should flag disconnected nodes with no edges', () => {
      const nodes = [
        { id: 'n1', data: { label: 'Node 1', category: 'concept' } },
        { id: 'n2', data: { label: 'Node 2', category: 'concept' } }
      ];
      const edges = [];

      const violations = validateMap(nodes, edges);
      const orphanViolations = violations.filter(v => v.ruleId === 'rule-orphan-node');

      expect(orphanViolations).toHaveLength(2);
      expect(orphanViolations[0].targetIds).toContain('n1');
      expect(orphanViolations[1].targetIds).toContain('n2');
    });

    it('should not flag nodes connected by edges', () => {
      const nodes = [
        { id: 'n1', data: { label: 'Node 1', category: 'concept' } },
        { id: 'n2', data: { label: 'Node 2', category: 'concept' } }
      ];
      const edges = [
        { id: 'e1-2', source: 'n1', target: 'n2' }
      ];

      const violations = validateMap(nodes, edges);
      const orphanViolations = violations.filter(v => v.ruleId === 'rule-orphan-node');

      expect(orphanViolations).toHaveLength(0);
    });
  });

  describe('Self-Loop Check', () => {
    it('should flag edges that link a node to itself', () => {
      const nodes = [
        { id: 'n1', data: { label: 'Node 1', category: 'concept' } }
      ];
      const edges = [
        { id: 'e1-1', source: 'n1', target: 'n1' }
      ];

      const violations = validateMap(nodes, edges);
      const selfLoopViolations = violations.filter(v => v.ruleId === 'rule-self-loop');

      expect(selfLoopViolations).toHaveLength(1);
      expect(selfLoopViolations[0].targetIds).toContain('e1-1');
    });

    it('should not flag standard edges connecting different nodes', () => {
      const nodes = [
        { id: 'n1', data: { label: 'Node 1', category: 'concept' } },
        { id: 'n2', data: { label: 'Node 2', category: 'concept' } }
      ];
      const edges = [
        { id: 'e1-2', source: 'n1', target: 'n2' }
      ];

      const violations = validateMap(nodes, edges);
      const selfLoopViolations = violations.filter(v => v.ruleId === 'rule-self-loop');

      expect(selfLoopViolations).toHaveLength(0);
    });
  });

  describe('Category Alignment Check', () => {
    it('should flag warning nodes that do not contain warning keywords', () => {
      const nodes = [
        { id: 'n1', data: { label: 'Safe node', description: 'Everything is working correctly.', category: 'warning' } }
      ];
      const edges = [];

      const violations = validateMap(nodes, edges);
      const alignmentViolations = violations.filter(v => v.ruleId === 'rule-category-alignment');

      expect(alignmentViolations).toHaveLength(1);
      expect(alignmentViolations[0].targetIds).toContain('n1');
      expect(alignmentViolations[0].message).toContain('Warning');
    });

    it('should not flag warning nodes that contain warning keywords', () => {
      const nodes = [
        { id: 'n1', data: { label: 'Danger zone', description: 'Avoid this area, do not enter.', category: 'warning' } }
      ];
      const edges = [];

      const violations = validateMap(nodes, edges);
      const alignmentViolations = violations.filter(v => v.ruleId === 'rule-category-alignment');

      expect(alignmentViolations).toHaveLength(0);
    });

    it('should flag action nodes that do not contain action verbs', () => {
      const nodes = [
        { id: 'n1', data: { label: 'Sleepy node', description: 'Just standing here doing nothing.', category: 'action' } }
      ];
      const edges = [];

      const violations = validateMap(nodes, edges);
      const alignmentViolations = violations.filter(v => v.ruleId === 'rule-category-alignment');

      expect(alignmentViolations).toHaveLength(1);
      expect(alignmentViolations[0].targetIds).toContain('n1');
    });

    it('should not flag action nodes that contain action verbs', () => {
      const nodes = [
        { id: 'n1', data: { label: 'Start application', description: 'Run the scripts to build assets.', category: 'action' } }
      ];
      const edges = [];

      const violations = validateMap(nodes, edges);
      const alignmentViolations = violations.filter(v => v.ruleId === 'rule-category-alignment');

      expect(alignmentViolations).toHaveLength(0);
    });
  });

  describe('Circular Cycle Check', () => {
    it('should flag nodes participating in a directed loop', () => {
      const nodes = [
        { id: 'a', data: { label: 'A' } },
        { id: 'b', data: { label: 'B' } },
        { id: 'c', data: { label: 'C' } }
      ];
      const edges = [
        { id: 'e-ab', source: 'a', target: 'b' },
        { id: 'e-bc', source: 'b', target: 'c' },
        { id: 'e-ca', source: 'c', target: 'a' }
      ];

      const violations = validateMap(nodes, edges);
      const cycleViolations = violations.filter(v => v.ruleId === 'rule-circular-cycle');

      expect(cycleViolations).toHaveLength(3);
      const affectedIds = cycleViolations.flatMap(v => v.targetIds);
      expect(affectedIds).toContain('a');
      expect(affectedIds).toContain('b');
      expect(affectedIds).toContain('c');
    });

    it('should not flag linear path flows', () => {
      const nodes = [
        { id: 'a', data: { label: 'A' } },
        { id: 'b', data: { label: 'B' } },
        { id: 'c', data: { label: 'C' } }
      ];
      const edges = [
        { id: 'e-ab', source: 'a', target: 'b' },
        { id: 'e-bc', source: 'b', target: 'c' }
      ];

      const violations = validateMap(nodes, edges);
      const cycleViolations = violations.filter(v => v.ruleId === 'rule-circular-cycle');

      expect(cycleViolations).toHaveLength(0);
    });
  });
});
