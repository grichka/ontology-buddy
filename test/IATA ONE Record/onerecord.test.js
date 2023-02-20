const fs = require('fs');
const path = require('path');

const parser = require('../../lib/ontology/parser.js');
const model = require('../../lib/ontology/model.js');
const mermaid = require('../../lib/mermaid/mermaid.js');

test('[Integration] Experiment with IATA ONE Record ontology', async () => {
  console.log('Running...');
  
  const parsedRDF = await parser.parse(fs.readFileSync(path.join(__dirname, '1ROntology_fixed.ttl'), 'utf-8'), 'https://onerecord.iata.org/', 'Turtle');

  console.log(`Ontology ______________ ${parsedRDF.baseIri}`);
  console.log(`Quads _________________ ${parsedRDF.quads.length}`);
  console.log(`ClassQuads ____________ ${parsedRDF.classQuads.length}`);
  console.log(`SubClassQuads _________ ${parsedRDF.subClassQuads.length}`);
  console.log(`DatatypePropertyQuads _ ${parsedRDF.datatypePropertyQuads.length}`);
  console.log(`ObjectPropertyQuads ___ ${parsedRDF.objectPropertyQuads.length}`);
  console.log(`RestrictionQuads ______ ${parsedRDF.restrictionQuads.length}`);

  fs.writeFileSync(path.join(__dirname, '__debug__', 'quads.json'), JSON.stringify(parsedRDF.quads, null, 2));
  fs.writeFileSync(path.join(__dirname, '__debug__', 'classQuads.json'), JSON.stringify(parsedRDF.classQuads, null, 2));
  fs.writeFileSync(path.join(__dirname, '__debug__', 'subClassQuads.json'), JSON.stringify(parsedRDF.subClassQuads, null, 2));
  fs.writeFileSync(path.join(__dirname, '__debug__', 'datatypePropertyQuads.json'), JSON.stringify(parsedRDF.datatypePropertyQuads, null, 2));
  fs.writeFileSync(path.join(__dirname, '__debug__', 'objectPropertyQuads.json'), JSON.stringify(parsedRDF.objectPropertyQuads, null, 2));
  fs.writeFileSync(path.join(__dirname, '__debug__', 'restrictionQuads.json'), JSON.stringify(parsedRDF.restrictionQuads, null, 2));

  const classHierarchy = model.getClassHierarchy(parsedRDF);

  fs.writeFileSync(path.join(__dirname, '__debug__', 'classHierarchy.json'), JSON.stringify(classHierarchy, null, 2));

  const mermaidClassDiagram = mermaid.getClassDiagram(classHierarchy);

  fs.writeFileSync(path.join(__dirname, '__debug__', 'classDiagram.mmd'), mermaidClassDiagram);

  console.log('Done!');
});