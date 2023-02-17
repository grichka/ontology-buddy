import * as fs from 'fs';
import * as path from 'path';

import * as parser from "./parser.js";

async function run() {
  console.log('Running...');
  const parsedRDF = await parser.parse(fs.readFileSync(path.join('__test__', 'Ontology.ttl'), 'utf-8'), 'Turtle', 'https://onerecord.iata.org/');

  fs.writeFileSync(path.join('__test__', 'quads.json'), JSON.stringify(parsedRDF.quads, null, 2));
  fs.writeFileSync(path.join('__test__', 'classQuads.json'), JSON.stringify(parsedRDF.classQuads, null, 2));
  fs.writeFileSync(path.join('__test__', 'subClassQuads.json'), JSON.stringify(parsedRDF.subClassQuads, null, 2));
}

await run();