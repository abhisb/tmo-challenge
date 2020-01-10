/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/

import { Server } from 'hapi';

const Wreck = require('@hapi/wreck');

const init = async () => {
  const server = new Server({
    port: 3333,
    host: 'localhost',
    cache: [{
      engine: require('catbox-redis'),
      name: 'redis-cache',
      host: '127.0.0.1',
      port: 3333
    }]
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return {
        hello: 'world'
      };
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
