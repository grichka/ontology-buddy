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

  for (const classQuad of parsedRDF.classQuads) {
    /** @type {ClassDef} */
    const classDef = {
      iri: classQuad.subject.value,
      name: classQuad.subject.value.replace(parsedRDF.baseIri, ''),
      subClassOf: [],
      subClasses: [],
      properties: []
    };
    classHierarchy.classDefByIri[classDef.iri] = classDef;
  }

  for (const subClassQuad of parsedRDF.subClassQuads) {
    const parentClassIri = subClassQuad.object.value;
    const parentClassDef = classHierarchy.classDefByIri[parentClassIri];
    const childClassIri = subClassQuad.subject.value;
    const childClassDef = classHierarchy.classDefByIri[childClassIri];
    parentClassDef.subClasses = _.union(parentClassDef.subClasses, [childClassIri]);
    childClassDef.subClassOf = _.union(childClassDef.subClassOf, [parentClassIri]);
  }

  return classHierarchy;
}

export {
  getClassHierarchy
}