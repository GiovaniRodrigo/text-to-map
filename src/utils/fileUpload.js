/**
 * Validates a file for size and plain text type format.
 * Max size: 100KB (102,400 bytes).
 *
 * @param {File} file - The file object to validate.
 * @returns {{ valid: boolean, error?: string }} - Result of validation.
 */
export function validateFile(file) {
  const MAX_SIZE = 100 * 1024; // 100KB in bytes

  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: 'File exceeds the maximum limit of 100KB.',
    };
  }

  // Common plain text extensions
  const textExtensions = [
    'txt', 'md', 'mermaid', 'json', 'js', 'jsx', 'csv',
    'xml', 'yml', 'yaml', 'css', 'html', 'svg'
  ];

  const fileExt = file.name ? file.name.split('.').pop().toLowerCase() : '';
  const isTextType = file.type && (
    file.type.startsWith('text/') ||
    file.type === 'application/json' ||
    file.type === 'application/javascript'
  );

  const isTextExtension = textExtensions.includes(fileExt);

  if (!isTextType && !isTextExtension) {
    return {
      valid: false,
      error: 'Only plain text files are supported.',
    };
  }

  return { valid: true };
}

/**
 * Asynchronously reads a plain text file using the FileReader API.
 *
 * @param {File} file - The file to read.
 * @returns {Promise<string>} - Resolves with the text content.
 */
export function readFileContent(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = () => {
      reject(new Error('Failed to read the file.'));
    };

    reader.readAsText(file);
  });
}
