const ontology = require('../../ontology');
const mermaid = require('../../mermaid');

const ontologyActionRequestBody = require('../schemas/ontologyActionRequestBody.js');

/**
 * @param {import('fastify').FastifyInstance} fastify 
 * @param {import('fastify').RouteShorthandOptions} options 
 */
const ontologyRoutes = async (fastify, options) => {
  await fastify.register(import('@fastify/rate-limit'), {
    max: process.env.ONTOLOGY_ACTION_RATELIMIT_MAX_PER_MINUTE || 30,
    timeWindow: '1 minute'
  });

  fastify.post('/actions/generate-class-hierarchy', {
    schema: {
      body: ontologyActionRequestBody,
      response: {
        200: { type: 'object' }
      }
    },
    handler: async (req, reply) => {
      const classHierarchy = await ontology.getClassHierarchy(req.body.ontologyFile, req.body.baseIri, req.body.format);
      reply.send(classHierarchy);
    }
  });
  
  fastify.post('/actions/generate-mermaid-class-diagram', {
    schema: {
      body: ontologyActionRequestBody,
      response: {
        200: { type: 'string' }
      }
    },
    handler: async (req, reply) => {
      const classHierarchy = await ontology.getClassHierarchy(req.body.ontologyFile, req.body.baseIri, req.body.format);
      const classDiagram = mermaid.getClassDiagram(classHierarchy);
      reply.send(classDiagram);
    }
  });
};

module.exports = ontologyRoutes;
