import { GoogleGenerativeAI } from '@google/generative-ai';
import { parseSegmentsLocally } from '../utils/segmentParser';


/**
 * Calls the Gemini API using responseSchema configuration to extract nodes and relationships
 * from raw unstructured text.
 * Falls back to mock data generation if the API key is not configured.
 * @param {String} text - Raw input text
 * @returns {Promise<Object>} { nodes, edges }
 */
export const extractMapWithAI = async (text) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

  if (!apiKey) {
    console.warn('VITE_GEMINI_API_KEY is not set. Using local mock generator fallback.');
    return generateMockGraph(text);
  }

  try {
    const genAI = new GoogleGenerativeAI({ apiKey });
    
    // We enforce JSON schema response matching our data contract
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            nodes: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  id: { type: 'STRING', description: 'Unique kebab-case ID matching the node' },
                  label: { type: 'STRING', description: 'Short noun phrase visual label' },
                  category: { type: 'STRING', enum: ['concept', 'action', 'warning', 'question'] },
                  description: { type: 'STRING', description: 'Detailed explanatory paragraph context' },
                },
                required: ['id', 'label', 'category', 'description'],
              },
            },
            edges: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  source: { type: 'STRING', description: 'Source node ID' },
                  target: { type: 'STRING', description: 'Target node ID' },
                  label: { type: 'STRING', description: 'Description of relation (e.g. tracks, uses, implements)' },
                },
                required: ['source', 'target', 'label'],
              },
            },
          },
          required: ['nodes', 'edges'],
        },
      },
    });

    const prompt = `Analyze the following text. Extract key entities as nodes, classify their category (concept, action, warning, or question), write a detailed explanation description for each, and identify directional relationship links (edges) connecting them:\n\n"${text}"`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const parsed = JSON.parse(responseText);
    
    // Map to React Flow requirements
    const nodes = parsed.nodes.map((n) => ({
      id: n.id,
      data: {
        label: n.label,
        category: n.category,
        description: n.description,
      },
      position: { x: 0, y: 0 },
    }));

    const edges = parsed.edges.map((e) => ({
      id: `e-${e.source}-${e.target}`,
      source: e.source,
      target: e.target,
      label: e.label,
    }));

    return { nodes, edges };
  } catch (err) {
    console.error('Gemini API extraction failed:', err);
    throw new Error(`AI Extraction failed: ${err.message || 'Check connection and API key.'}`);
  }
};

/**
 * Generates mock graph structure based on text analyzer rules (fallback)
 */
const generateMockGraph = async (text) => {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const sentences = text
    .split(/[.!?]/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length === 0) {
    return { nodes: [], edges: [] };
  }

  const nodesMap = new Map();
  const edges = [];
  let prevId = null;

  sentences.forEach((sentence, idx) => {
    // Generate simple concepts based on sentence structures
    const words = sentence.split(/\s+/).filter(w => w.length > 3);
    if (words.length === 0) return;

    const label = words[0].replace(/[^a-zA-Z]/g, '');
    const id = label.toLowerCase();
    
    // Categorize mock nodes dynamically
    let category = 'concept';
    if (sentence.includes('must') || sentence.includes('should') || sentence.includes('run')) {
      category = 'action';
    } else if (sentence.includes('not') || sentence.includes('error') || sentence.includes('fail')) {
      category = 'warning';
    } else if (sentence.includes('why') || sentence.includes('how') || sentence.includes('?')) {
      category = 'question';
    }

    nodesMap.set(id, {
      id,
      data: {
        label: label.charAt(0).toUpperCase() + label.slice(1),
        category,
        description: `Mock detail: "${sentence}"`,
      },
      position: { x: 0, y: 0 },
    });

    if (prevId && prevId !== id) {
      edges.push({
        id: `e-${prevId}-${id}`,
        source: prevId,
        target: id,
        label: 'relates to',
      });
    }
    prevId = id;
  });

  return {
    nodes: Array.from(nodesMap.values()),
    edges,
  };
};

/**
 * Clean and segment raw text semantically using the Gemini API.
 * Falls back to local paragraph-splitting if the API is offline or has no key.
 * 
 * @param {String} text - Raw input text
 * @returns {Promise<Object>} { segments, relationships }
 */
export const segmentTextWithAI = async (text) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

  if (!apiKey) {
    console.warn('VITE_GEMINI_API_KEY is not set. Using local segment parser fallback.');
    return parseSegmentsLocally(text);
  }

  try {
    const genAI = new GoogleGenerativeAI({ apiKey });
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            segments: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  id: { type: 'STRING', description: 'Unique kebab-case ID matching the segment' },
                  title: { type: 'STRING', description: 'Concise title for the segment' },
                  content: { type: 'STRING', description: 'Summarized/cleaned content for the segment' },
                  category: { type: 'STRING', enum: ['concept', 'action', 'warning', 'question'] },
                },
                required: ['id', 'title', 'content', 'category'],
              },
            },
            relationships: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  source: { type: 'STRING', description: 'Source segment ID' },
                  target: { type: 'STRING', description: 'Target segment ID' },
                  label: { type: 'STRING', description: 'Short description of relationship (e.g. leads to)' },
                },
                required: ['source', 'target', 'label'],
              },
            },
          },
          required: ['segments', 'relationships'],
        },
      },
    });

    const prompt = `Analyze the following text. Clean it (remove HTML, boilerplate formatting) and segment it semantically into logical, thematic sections. For each section, provide a concise title, a cleaned summary content, and classify its category (concept, action, warning, or question). Also, identify semantic relationships connecting these sections:\n\n"${text}"`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsed = JSON.parse(responseText);

    const segments = parsed.segments.map((s) => ({
      id: s.id,
      title: s.title,
      content: s.content,
      category: s.category,
    }));

    const relationships = parsed.relationships.map((r) => ({
      id: `r-${r.source}-${r.target}`,
      sourceSegmentId: r.source,
      targetSegmentId: r.target,
      label: r.label,
    }));

    return { segments, relationships };
  } catch (err) {
    console.error('Gemini API segmentation failed, falling back to local:', err);
    return parseSegmentsLocally(text);
  }
};

