import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';
import _ from 'lodash';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
 * @param {import("../ontology/model.js").ClassHierarchy} classHierarchy 
 * @param {boolean} validateDiagram (default: `true`)
 * @returns {string} Mermaid classdiagram
 */
export function getClassDiagram(classHierarchy) {
  const classDiagram = ejs.render(getTemplate(path.join(__dirname, 'templates', 'classDiagram.mmd.ejs')), {
    _,
    baseIri: classHierarchy.baseIri,
    cByIri: classHierarchy.classDefByIri,
    pByIri: classHierarchy.propertyDefByIri,
    diagram: {
      title: classHierarchy.baseIri
    }
  });

  return classDiagram;
}