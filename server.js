const fastify = require('fastify')({ logger: true });
const closeWithGrace = require('close-with-grace');

fastify.register(require('./lib/fastify/app.js'));

const closeListeners = closeWithGrace({
  delay: process.env.FASTIFY_CLOSE_GRACE_DELAY ? parseInt(process.env.FASTIFY_CLOSE_GRACE_DELAY) : 500
}, async ({ signal, err, manual }) => {
  if (err) {
    fastify.log.error(err);
  }
  if (signal) {
    fastify.log.info(`Caught [signal=${signal}] - Exiting...`);
  }
  await fastify.close();
});

fastify.addHook('onClose', async (instance) => {
  closeListeners.uninstall();
});

const startServer = async () => {
  try {
    await fastify.listen({
      port: process.env.PORT || 3000
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

startServer();