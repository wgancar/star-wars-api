module.exports = {
  env: 'test',
  port: 3000,
  enableSwagger: false,
  apiPrefix: '/api',
  publicUrl: {
    host: 'localhost',
    port: 3000,
    schema: 'http',
  },
  database: {
    host: 'localhost',
    name: 'StarWarsTest',
  }
};
