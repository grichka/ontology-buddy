const path = require('path');
const { getFileContent } = require('../../test/utils.js');

const parser = require('../parser.js');

test('#parse should parse a valid TTL ontology file (with baseIri) without error and return quads', async () => {
  const parsedRDF = await parser.parse(getFileContent(path.join(__dirname, 'testOntology.ttl')), 'https://test.org/', 'Turtle');
  expect(parsedRDF !== undefined);
  expect(parsedRDF.quads.length);
});

test('#parse should parse a valid TTL ontology file (with baseIri) and return all Class quads', async () => {
  const parsedRDF = await parser.parse(getFileContent(path.join(__dirname, 'testOntology.ttl')), 'https://test.org/', 'Turtle');
  expect(parsedRDF.classQuads.length === 1);
  const TestClassQuad = parsedRDF.classQuads[0];
  expect(TestClassQuad.subject.value === 'https://test.org/TestClass');
});
