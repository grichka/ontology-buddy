const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const _ = require('lodash');

const cache = {
  templates: {}
};

/**
 * @param {string} templatePath 
 * @returns {string} EJS template (utf-8)
 */
function getTemplate(templatePath) {
  if (!cache.templates[templatePath]) {
    cache.templates[templatePath] = fs.readFileSync(templatePath, 'utf-8');
  } 
  return cache.templates[templatePath];
}

/**
 * @param {import('../ontology/model.js').PropertyDefCardinality} cardinality 
 * @returns {string}
 */
function getCardinality(cardinality) {
  if (cardinality.min === cardinality.max) {
    return cardinality.max;
  } else if (cardinality.min === '0' && cardinality.max === '*') {
    return '*';
  } else {
    return `${cardinality.min}..${cardinality.max}`;
  }
}

/**
 * @param {import("../ontology/model.js").ClassHierarchy} classHierarchy 
 * @param {boolean} validateDiagram (default: `true`)
 * @returns {string} Mermaid classdiagram
 */
function getClassDiagram(classHierarchy) {
  const classDiagram = ejs.render(getTemplate(path.join(__dirname, 'templates', 'classDiagram.mmd.ejs')), {
    _,
    baseIri: classHierarchy.baseIri,
    cByIri: classHierarchy.classDefByIri,
    pByIri: classHierarchy.propertyDefByIri,
    utils: {
      getCardinality
    },
    diagram: {
      title: classHierarchy.baseIri
    }
  });

  return classDiagram;
}

module.exports = {
  getClassDiagram
}