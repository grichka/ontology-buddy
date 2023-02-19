const fs = require('fs');

const cache = {
  files: {}
};

/**
 * @param {string} filePath 
 * @returns {string}
 */
function getFileContent(filePath) {
  if (!cache.files[filePath]) {
    cache.files[filePath] = fs.readFileSync(filePath, 'utf-8');
  }
  return cache.files[filePath];
}

module.exports = {
  getFileContent
}