module.exports = {
  env: 'local',
  port: 3000,
  enableSwagger: true,
  apiPrefix: '/api',
  publicUrl: {
    host: 'localhost',
    port: 3000,
    schema: 'http',
  },
  database: {
    host: 'localhost',
    name: 'StarWars',
  }
};
