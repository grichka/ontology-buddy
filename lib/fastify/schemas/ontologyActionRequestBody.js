module.exports = {
  type: 'object',
  required: ['ontologyFile', 'baseIri', 'format'],
  properties: {
    ontologyFile: { type: 'string' },
    baseIri: { type: 'string' },
    format: { type: 'string' }
  }
};