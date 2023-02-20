const path = require('path');
const { getFileContent } = require('./utils.js');

const ontology = require('../../ontology');
const mermaid = require('../mermaid.js');

const expectedDiagram = `---\n\
title: https://test.org/\n\
---\n\
classDiagram\n\
direction BT\n\
class TestClass {\n\
    +String a\n\
    +List~OtherClass~ b\n\
}\n\
TestClass "1" o-- "*" OtherClass : has *\n\
\n\
class OtherClass {\n\
    +String c\n\
}\n\
`

test('#getClassDiagram should return the Mermaid class diagram of a given ClassHierarchy', async () => {
  const classHierarchy = await ontology.getClassHierarchy(getFileContent(path.join(__dirname, '..', '..', 'ontology', 'test', 'testOntology.ttl')), 'https://test.org/', 'Turtle');
  const classDiagram = mermaid.getClassDiagram(classHierarchy);

  expect(classDiagram).not.toBe(undefined);
  expect(classDiagram).toBe(expectedDiagram);
});