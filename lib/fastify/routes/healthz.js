/**
 * @param {import('fastify').FastifyInstance} fastify 
 */
const healthzRoutes = async (fastify) => {
  fastify.get('/healthz', {
    schema: {
      response: {
        200: {
          type: 'object',
          required: ['status'],
          properties: {
            status: { type: 'string' },
          }
        }
      }
    },
    handler: async (req, reply) => {
      reply.send({ status: 'OK' });
    }
  });
}

module.exports = healthzRoutes;