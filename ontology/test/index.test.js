const path = require('path');
const { getFileContent } = require('../../test/utils.js');

const { getClassHierarchy } = require('../index.js');

test('#getClassHierarchy should return the ClassHierarchy of valid ontology file', async () => {
  const classHierarchy = await getClassHierarchy(getFileContent(path.join(__dirname, 'testOntology.ttl')), 'https://test.org/', 'Turtle');
  expect(classHierarchy !== undefined);
});