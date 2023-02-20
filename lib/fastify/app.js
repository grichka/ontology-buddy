/**
 * @param {import('fastify').FastifyInstance} fastify 
 * @param {import('fastify').RouteShorthandOptions} options 
 */
const app = async (fastify, options) => {
  await fastify.register(require('@fastify/under-pressure'), {
    maxEventLoopDelay: 1000,
    maxHeapUsedBytes: 1000000000,
    maxRssBytes: 1000000000,
    maxEventLoopUtilization: 0.98,
    exposeStatusRoute: '/statusz'
  });
  
  fastify.register(require('@fastify/sensible'));

  await fastify.register(require('@fastify/cors'), {
    origin: false
  });

  await fastify.register(require('./routes/ontology.js'), {
    prefix: ''
  });
};

module.exports = app;