const path = require('path');
const { getFileContent } = require('../../test/utils.js');

const parser = require('../parser.js');
const model = require('../model.js');

test('#getClassHierarchy should return the ClassHierarchy of a parsed ontology', async () => {
  const baseIri = 'https://test.org/';
  const parsedRDF = await parser.parse(getFileContent(path.join(__dirname, 'testOntology.ttl')), baseIri, 'Turtle');
  const classHierarchy = model.getClassHierarchy(parsedRDF);

  expect(classHierarchy).not.toBe(undefined);
  expect(classHierarchy.baseIri).toBe(baseIri);
  expect(Object.keys(classHierarchy.classDefByIri).length).toBe(2);

  const testClassDef = classHierarchy.classDefByIri[`${baseIri}TestClass`];
  expect(testClassDef).not.toBe(undefined);
  expect(testClassDef.iri).toBe(`${baseIri}TestClass`);
  expect(testClassDef.name).toBe('TestClass');
  expect(testClassDef.properties.length).toBe(2);

  const otherClassDef = classHierarchy.classDefByIri[`${baseIri}OtherClass`];
  expect(otherClassDef).not.toBe(undefined);
  expect(otherClassDef.iri).toBe(`${baseIri}OtherClass`);
  expect(otherClassDef.name).toBe('OtherClass');
  expect(otherClassDef.properties.length).toBe(1);

  expect(Object.keys(classHierarchy.propertyDefByIri).length).toBe(3);

  const aPropertyDef = classHierarchy.propertyDefByIri[`${baseIri}TestClass#a`];
  expect(aPropertyDef).not.toBe(undefined);
  expect(aPropertyDef.iri).toBe(`${baseIri}TestClass#a`);
  expect(aPropertyDef.name).toBe('a');
  expect(aPropertyDef.cardinality.min).toBe('1');
  expect(aPropertyDef.cardinality.max).toBe('1');
  expect(aPropertyDef.comment).not.toBe(undefined);

  const bPropertyDef = classHierarchy.propertyDefByIri[`${baseIri}TestClass#b`];
  expect(bPropertyDef).not.toBe(undefined);
  expect(bPropertyDef.iri).toBe(`${baseIri}TestClass#b`);
  expect(bPropertyDef.name).toBe('b');
  expect(bPropertyDef.cardinality.min).toBe('0');
  expect(bPropertyDef.cardinality.max).toBe('*');
  expect(bPropertyDef.comment).not.toBe(undefined);

  const cPropertyDef = classHierarchy.propertyDefByIri[`${baseIri}OtherClass#c`];
  expect(cPropertyDef).not.toBe(undefined);
  expect(cPropertyDef.iri).toBe(`${baseIri}OtherClass#c`);
  expect(cPropertyDef.name).toBe('c');
  expect(cPropertyDef.cardinality.min).toBe('0');
  expect(cPropertyDef.cardinality.max).toBe('1');
  expect(cPropertyDef.comment).not.toBe(undefined);
});