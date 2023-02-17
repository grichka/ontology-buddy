import _ from 'lodash';

/**
 * @typedef {Object} ClassHierarchy
 * @property {Object.<string, ClassDef>} classDefByIri
 * @property {Object.<string, PropertyDef>} propertyDefByIri
 */
  /**
   * @typedef {Object} ClassDef
   * @property {string} iri
   * @property {string} className
   */
  /**
   * @typedef {Object} PropertyDef
   * @property {string} iri
   * @property {string} propertyName
   */

/**
 * @param {import('./parser').ParsedRDF} parsedRDF
 * @returns {ClassHierarchy}
 */
function getClassHierarchy(parsedRDF) {
  // TODO
}

export {
  getClassHierarchy
}