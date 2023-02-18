import * as parser from "./parser.js";
import * as model from "./model.js";

/**
 * @param {string} ontologyFile Content of an OWL ontology file
 * @param {*} format Format (default: `Turtle`)
 * @param {*} baseIri Ontology base IRI
 * @returns {import("./model.js").ClassHierarchy}
 */
async function getClassHierarchy(ontologyFile, baseIri, format = 'Turtle') {
  return model.getClassHierarchy(await parser.parse(ontologyFile, baseIri, format));
}

export {
  getClassHierarchy
}