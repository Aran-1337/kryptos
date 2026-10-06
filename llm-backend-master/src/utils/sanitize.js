/**
 * Escapes special regex characters in a string to prevent ReDoS and regex injection.
 * Enforces maximum string length to prevent CPU exhaustion on oversized inputs.
 * @param {string} str
 * @param {number} [maxLength=100]
 * @returns {string}
 */
const escapeRegex = (str, maxLength = 100) => {
  if (typeof str !== 'string') return '';
  const trimmed = str.trim().slice(0, maxLength);
  return trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

module.exports = { escapeRegex };
