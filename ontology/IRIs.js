const XSD = 'http://www.w3.org/2001/XMLSchema#';
const RDF = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
const RDFS = 'http://www.w3.org/2000/01/rdf-schema#';
const OWL = 'http://www.w3.org/2002/07/owl#';
const SWAP = 'http://www.w3.org/2000/10/swap/';

const NAMESPACES = {
  xsd: {
    decimal: `${XSD}decimal`,
    boolean: `${XSD}boolean`,
    double: `${XSD}double`,
    integer: `${XSD}integer`,
    string: `${XSD}string`,
    dateTime: `${XSD}dateTime`,
  },
  rdf: {
    type: `${RDF}type`,
    nil: `${RDF}nil`,
    first: `${RDF}first`,
    rest: `${RDF}rest`,
    langString: `${RDF}langString`,
  },
  rdfs: {
    subClassOf: `${RDFS}subClassOf`,
    domain: `${RDFS}domain`,
    range: `${RDFS}range`,
    comment: `${RDFS}comment`,
    label: `${RDFS}label`,
  },
  owl: {
    sameAs: `${OWL}sameAs`,
    Class: `${OWL}Class`,
    DatatypeProperty: `${OWL}DatatypeProperty`,
    ObjectProperty: `${OWL}ObjectProperty`,
    Restriction: `${OWL}Restriction`,
    onProperty: `${OWL}onProperty`,
    maxCardinality: `${OWL}maxCardinality`,
  },
  r: {
    forSome: `${SWAP}reify#forSome`,
    forAll: `${SWAP}reify#forAll`,
  },
  log: {
    implies: `${SWAP}log#implies`,
  },
};

module.exports = {
  NAMESPACES
}