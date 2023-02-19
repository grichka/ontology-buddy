const n3 = require('n3');
const { NAMESPACES } = require('./IRIs.js');

/**
 * @typedef {Object} ParsedRDF
 * @property {string} baseIri
 * @property {Array<n3.Quad>} quads
 * @property {Object.<string, string>} prefixes
 * @property {Array<n3.Quad>} classQuads
 * @property {Array<n3.Quad>} subClassQuads
 * @property {Array<n3.Quad>} datatypePropertyQuads
 * @property {Array<n3.Quad>} objectPropertyQuads
 * @property {Array<n3.Quad>} restrictionQuads
 */

/**
 * @param {string} ontologyFile
 * @param {string} baseIri
 * @param {string} format
 * @returns {ParsedRDF}
 */
async function parse(ontologyFile, baseIri, format = 'Turtle') {
  /** @type {ParsedRDF} */
  const parsedRDF = {
    baseIri,
    quads: []
  };

  const parser = new n3.Parser({format, baseIRI: baseIri});

  await new Promise(resolve => {
    parser.parse(ontologyFile, (error, quad, prefixes) => {
      if (error) {
        throw error;
      }
      if (quad) {
        parsedRDF.quads.push(quad);
      } else {
        parsedRDF.prefixes = prefixes;
        resolve();
      }
    });
  });

  parsedRDF.classQuads = parsedRDF.quads.filter(q => {
    return q.subject.termType === 'NamedNode' &&
          q.predicate.value === NAMESPACES.rdf.type && q.predicate.termType === 'NamedNode' &&
          q.object.value === NAMESPACES.owl.Class && q.object.termType === 'NamedNode';
  });

  parsedRDF.subClassQuads = parsedRDF.quads.filter(q => {
    return q.subject.termType === 'NamedNode' &&
          q.predicate.value === NAMESPACES.rdfs.subClassOf && q.predicate.termType === 'NamedNode' &&
          q.object.termType === 'NamedNode';
  });

  parsedRDF.datatypePropertyQuads = parsedRDF.quads.filter(q => {
    return q.subject.termType === 'NamedNode' &&
          q.predicate.value === NAMESPACES.rdf.type && q.predicate.termType === 'NamedNode' &&
          q.object.value === NAMESPACES.owl.DatatypeProperty && q.object.termType === 'NamedNode';
  });

  parsedRDF.objectPropertyQuads = parsedRDF.quads.filter(q => {
    return q.subject.termType === 'NamedNode' &&
          q.predicate.value === NAMESPACES.rdf.type && q.predicate.termType === 'NamedNode' &&
          q.object.value === NAMESPACES.owl.ObjectProperty && q.object.termType === 'NamedNode';
  });

  parsedRDF.restrictionQuads = parsedRDF.quads.filter(q => {
    return q.predicate.value === NAMESPACES.rdf.type && q.predicate.termType === 'NamedNode' &&
          q.object.value === NAMESPACES.owl.Restriction && q.object.termType === 'NamedNode';
  });

  return parsedRDF;
}

module.exports = {
  parse
}