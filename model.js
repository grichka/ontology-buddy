import _ from 'lodash';

/**
 * @typedef {Object} ClassHierarchy
 * @property {Object.<string, ClassDef>} classDefByIri
 * @property {Object.<string, PropertyDef>} propertyDefByIri
 */
  /**
   * @typedef {Object} ClassDef
   * @property {string} iri
   * @property {string} name
   * @property {Array<string>} subClassOf
   * @property {Array<string>} subClasses
   * @property {Array<PropertyDef>} properties
   */
  /**
   * @typedef {Object} PropertyDef
   * @property {string} iri
   * @property {string} name
   * @property {Object} type
   * @property {string} type.iri
   * @property {string} type.name
   * @property {string} cardinality
   * @property {string} comment
   */

/**
 * @param {import('./parser').ParsedRDF} parsedRDF
 * @returns {ClassHierarchy}
 */
function getClassHierarchy(parsedRDF) {
  /** @type {ClassHierarchy} */
  const classHierarchy = {
    classDefByIri: {},
    propertyDefByIri: {}
  };

  return classHierarchy;
}

export {
  getClassHierarchy
}