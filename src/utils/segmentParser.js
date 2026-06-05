/**
 * Clean HTML tags and excessive spacing from text.
 * @param {string} text - Raw input text
 * @returns {string} Cleaned text
 */
export const cleanText = (text) => {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .replace(/[ \t]+/g, ' ') // Normalize spaces
    .trim();
};

/**
 * Perform local fallback segmentation on text when Gemini API is unavailable.
 * Splits text into paragraphs, extracts titles, and infers categories.
 * Generates sequential relationships between adjacent segments.
 * 
 * @param {string} text - Raw input text
 * @returns {Object} { segments, relationships }
 */
export const parseSegmentsLocally = (text) => {
  const cleaned = cleanText(text);
  if (!cleaned) {
    return { segments: [], relationships: [] };
  }

  // Split by double newlines or fall back to single newlines if no double newlines are present
  let paragraphs = cleaned
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length <= 1) {
    paragraphs = cleaned
      .split(/\n/)
      .map((p) => p.trim())
      .filter(Boolean);
  }

  const segments = paragraphs.map((paragraph, index) => {
    const id = `seg-${index + 1}`;
    
    // Extract first 4 words for a concise title
    const words = paragraph.split(/\s+/);
    let title = words.slice(0, 4).join(' ');
    if (words.length > 4) {
      title += '...';
    }

    // Clean title from punctuation for clean display
    title = title.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').trim();
    if (title.length > 0) {
      title = title.charAt(0).toUpperCase() + title.slice(1);
    } else {
      title = `Segment ${index + 1}`;
    }

    // Infer category based on key phrases
    const lowerPara = paragraph.toLowerCase();
    let category = 'concept';
    if (/\b(why|how|\?)\b/.test(lowerPara) || lowerPara.includes('?')) {
      category = 'question';
    } else if (/\b(must|should|run|execute|action)\b/.test(lowerPara)) {
      category = 'action';
    } else if (/\b(not|error|fail|warn|warning)\b/.test(lowerPara)) {
      category = 'warning';
    }

    return {
      id,
      title,
      content: paragraph,
      category,
    };
  });

  const relationships = [];
  for (let i = 0; i < segments.length - 1; i++) {
    relationships.push({
      id: `r-${segments[i].id}-${segments[i + 1].id}`,
      sourceSegmentId: segments[i].id,
      targetSegmentId: segments[i + 1].id,
      label: 'leads to',
    });
  }

  return { segments, relationships };
};
