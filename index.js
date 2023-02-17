import * as fs from 'fs';
import * as path from 'path';

import * as parser from "./parser.js";
import * as model from "./model.js";

async function run() {
  console.log('Running...');

  const parsedRDF = await parser.parse(fs.readFileSync(path.join('.', 'Ontology.ttl'), 'utf-8'), 'Turtle', 'https://onerecord.iata.org/');

  console.log(`Ontology ______________ ${parsedRDF.baseIri}`);
  console.log(`Quads _________________ ${parsedRDF.quads.length}`);
  console.log(`ClassQuads ____________ ${parsedRDF.classQuads.length}`);
  console.log(`SubClassQuads _________ ${parsedRDF.subClassQuads.length}`);
  console.log(`DatatypePropertyQuads _ ${parsedRDF.datatypePropertyQuads.length}`);
  console.log(`ObjectPropertyQuads ___ ${parsedRDF.objectPropertyQuads.length}`);
  console.log(`RestrictionQuads ______ ${parsedRDF.restrictionQuads.length}`);

  fs.writeFileSync(path.join('__debug__', 'quads.json'), JSON.stringify(parsedRDF.quads, null, 2));
  fs.writeFileSync(path.join('__debug__', 'classQuads.json'), JSON.stringify(parsedRDF.classQuads, null, 2));
  fs.writeFileSync(path.join('__debug__', 'subClassQuads.json'), JSON.stringify(parsedRDF.subClassQuads, null, 2));
  fs.writeFileSync(path.join('__debug__', 'datatypePropertyQuads.json'), JSON.stringify(parsedRDF.datatypePropertyQuads, null, 2));
  fs.writeFileSync(path.join('__debug__', 'objectPropertyQuads.json'), JSON.stringify(parsedRDF.objectPropertyQuads, null, 2));
  fs.writeFileSync(path.join('__debug__', 'restrictionQuads.json'), JSON.stringify(parsedRDF.restrictionQuads, null, 2));

  const classHierarchy = model.getClassHierarchy(parsedRDF);

  fs.writeFileSync(path.join('__debug__', 'classHierarchy.json'), JSON.stringify(classHierarchy, null, 2));

  console.log('Done!');
}

await run();