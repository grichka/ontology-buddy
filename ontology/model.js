import _ from 'lodash';

import NAMESPACES from './IRIs.js';

/**
 * @typedef {Object} ClassHierarchy
 * @property {string} baseIri Ontology base IRI
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
   * @property {PropertyDefType} type
   * @property {string} cardinality 0..* | 1..* | 1
   * @property {string} comment
   */
    /**
     * @typedef PropertyDefType
     * @property {string} iri
     * @property {string} name
     */

/**
 * @param {import('./parser').ParsedRDF} parsedRDF
 * @returns {ClassHierarchy}
 */
function getClassHierarchy(parsedRDF) {
  /** @type {ClassHierarchy} */
  const classHierarchy = {
    baseIri: parsedRDF.baseIri,
    classDefByIri: {},
    propertyDefByIri: {}
  };

  // -------
  // Classes
  // -------
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

  // -----------
  // Inheritance
  // -----------
  for (const subClassQuad of parsedRDF.subClassQuads) {
    const parentClassIri = subClassQuad.object.value;
    const parentClassDef = classHierarchy.classDefByIri[parentClassIri];
    const childClassIri = subClassQuad.subject.value;
    const childClassDef = classHierarchy.classDefByIri[childClassIri];
    parentClassDef.subClasses = _.union(parentClassDef.subClasses, [childClassIri]);
    childClassDef.subClassOf = _.union(childClassDef.subClassOf, [parentClassIri]);
  }

  // ------------------
  // datatypeProperties
  // ------------------
  for (const datatypePropertyQuad of parsedRDF.datatypePropertyQuads) {
    const datatypeProperty = datatypePropertyQuad.subject.value;
    const datatypePropertySplit = datatypeProperty.split('#');
    /** @type {PropertyDef} */
    const propertyDef = {
      iri: datatypeProperty,
      name: datatypePropertySplit[datatypePropertySplit.length - 1],
      cardinality: '*'
    };
    classHierarchy.propertyDefByIri[propertyDef.iri] = propertyDef;

    // domain(s)
    const domainQuads = parsedRDF.quads.filter(q => {
      return q.subject.value === propertyDef.iri && q.subject.termType === 'NamedNode' &&
            q.predicate.value === NAMESPACES.rdfs.domain && q.predicate.termType === 'NamedNode'
    });
    for (const domainQuad of domainQuads) {
      const classDef = classHierarchy.classDefByIri[domainQuad.object.value];
      classDef.properties = _.union(classDef.properties, [propertyDef]);
    }

    // range(s)
    const rangeQuads = parsedRDF.quads.filter(q => {
      return q.subject.value === propertyDef.iri && q.subject.termType === 'NamedNode' &&
            q.predicate.value === NAMESPACES.rdfs.range && q.predicate.termType === 'NamedNode'
    });
    if(rangeQuads.length >= 1) {
      // FIXME handle list of restrictions (possibly with several types)
      if (rangeQuads[0].object.termType === 'NamedNode') {
        propertyDef.type = getPropertyType(rangeQuads[0].object.value, parsedRDF.baseIri);
      } else {
        // FIXME get real type instead of string
        console.warn(`[WARN] Unsupported ranges for datatypeProperty=${propertyDef.iri}`);
        propertyDef.type = getPropertyType(NAMESPACES.xsd.string, parsedRDF.baseIri);
      }
    } else {
      console.error(`[ERROR] No range defined for datatypeProperty=${propertyDef.iri}`);
    }

    // comment(s)[0]
    const commentQuads = parsedRDF.quads.filter(q => {
      return q.subject.value === propertyDef.iri && q.subject.termType === 'NamedNode' &&
            q.predicate.value === NAMESPACES.rdfs.comment && q.predicate.termType === 'NamedNode' &&
            q.object.language === 'en'
    });
    for (const commentQuad of commentQuads) {
      if (propertyDef.comment) {
        propertyDef.comment.concat(propertyDef.comment, '\n', commentQuad.object.value);
      } else {
        propertyDef.comment = commentQuad.object.value;
      }
    }
  }

  // ----------------
  // objectProperties
  // ----------------
  for (const objectPropertyQuad of parsedRDF.objectPropertyQuads) {
    const objectProperty = objectPropertyQuad.subject.value;
    const objectPropertySplit = objectProperty.split('#');
    /** @type {PropertyDef} */
    const propertyDef = {
      iri: objectProperty,
      name: objectPropertySplit[objectPropertySplit.length - 1],
      cardinality: '*'
    };
    classHierarchy.propertyDefByIri[propertyDef.iri] = propertyDef;

    // domain(s)
    const domainQuads = parsedRDF.quads.filter(q => {
      return q.subject.value === propertyDef.iri && q.subject.termType === 'NamedNode' &&
            q.predicate.value === NAMESPACES.rdfs.domain && q.predicate.termType === 'NamedNode'
    });
    for (const domainQuad of domainQuads) {
      const classDef = classHierarchy.classDefByIri[domainQuad.object.value];
      classDef.properties = _.union(classDef.properties, [propertyDef]);
    }

    // range(s)
    const rangeQuads = parsedRDF.quads.filter(q => {
      return q.subject.value === propertyDef.iri && q.subject.termType === 'NamedNode' &&
            q.predicate.value === NAMESPACES.rdfs.range && q.predicate.termType === 'NamedNode'
    });
    if(rangeQuads.length >= 1) {
      // FIXME handle list of restrictions (possibly with several types)
      if (rangeQuads[0].object.termType === 'NamedNode') {
        propertyDef.type = getPropertyType(rangeQuads[0].object.value, parsedRDF.baseIri);
      } else {
        // FIXME get real type instead of string
        console.warn(`[WARN] Unsupported ranges for objectProperty=${propertyDef.iri}`);
        propertyDef.type = getPropertyType(NAMESPACES.xsd.string, parsedRDF.baseIri);
      }
    } else {
      console.error(`[ERROR] No range defined for objectProperty=${propertyDef.iri}`);
    }

    // comment(s)[0]
    const commentQuads = parsedRDF.quads.filter(q => {
      return q.subject.value === propertyDef.iri && q.subject.termType === 'NamedNode' &&
            q.predicate.value === NAMESPACES.rdfs.comment && q.predicate.termType === 'NamedNode' &&
            q.object.language === 'en'
    });
    for (const commentQuad of commentQuads) {
      if (propertyDef.comment) {
        propertyDef.comment.concat(propertyDef.comment, '\n', commentQuad.object.value);
      } else {
        propertyDef.comment = commentQuad.object.value;
      }
    }
  }

  // ------------
  // Restrictions
  // ------------
  for (const restrictionQuad of parsedRDF.restrictionQuads) {
    const restrictionLinkedQuads = parsedRDF.quads.filter(q => {
      return q.subject.value === restrictionQuad.subject.value;
    });
    // cardinality
    // TODO handle all cases
    const onPropertyQuad = restrictionLinkedQuads.find(q => {
      return q.predicate.value === NAMESPACES.owl.onProperty;
    });
    if (onPropertyQuad) {
      const propertyDef = classHierarchy.propertyDefByIri[onPropertyQuad.object.value];
      if (propertyDef) {
        const maxCardinalityQuads = restrictionLinkedQuads.filter(q => {
          return q.predicate.value === NAMESPACES.owl.maxCardinality;
        });
        for (const maxCardinalityQuad of maxCardinalityQuads) {
          if (maxCardinalityQuad.object.value === '1') {
            propertyDef.cardinality = '0..1';
          }
        }
      }
    }
  }

  return classHierarchy;
}

/**
 * @param {string} typeIri
 * @param {string} baseIri Ontology base IRI
 * @returns {PropertyDefType} 
 */
function getPropertyType(typeIri, baseIri) {
  /** @type {PropertyDefType} */
  const propertyDefType = {
    iri : typeIri
  };

  switch (typeIri) {
    case NAMESPACES.xsd.boolean:
      propertyDefType.name = 'Boolean';
      break;
    case NAMESPACES.xsd.dateTime:
      propertyDefType.name = 'Date';
      break;
    case NAMESPACES.xsd.decimal:
      propertyDefType.name = 'Decimal';
      break;
    case NAMESPACES.xsd.double:
      propertyDefType.name = 'Double';
      break;
    case NAMESPACES.xsd.integer:
      propertyDefType.name = 'Integer';
      break;
    case NAMESPACES.xsd.string:
      propertyDefType.name = 'String';
      break;
  
    default:
      propertyDefType.name = typeIri.startsWith(baseIri) ? typeIri.replace(baseIri, '') : 'UNDEFINED';
      break;
  }

  return propertyDefType;
}

export {
  getClassHierarchy
}