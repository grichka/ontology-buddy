# ontology-buddy

## ✨ Features

- [x] Parse ontology to get quads
- [x] Get class hierarchy javascript object structure
  - [x] Classes
  - [x] Inheritance
  - [ ] 🚧 WIP: Class members (DataProperties and ObjectProperties)
    - [x] Types
    - [x] Cardinalities
    - [x] Comments
    - [ ] Format restrictions
- [x] Get Mermaid class diagram from class hierarchy
- [ ] App server
  - [x] Exposing API for generating class hierarchy from ontology file
  - [x] Exposing API for generating Mermaid class diagram from ontology file
  - [ ] Swagger API

## Locally

### Install

```bash
git clone git@github.com:grichka/ontology-buddy.git
npm i
```

### Run Tests

```bash
npm test
```

### Run App Server

```bash
npm start
```

## Docker

### Build image

```bash
docker build . -f docker/Dockerfile -t ontology-buddy
```

### Run Docker image

```bash
docker run -d --name ontology-buddy -p 3000:3000 ontology-buddy
```
