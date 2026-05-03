const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gamified Learning Platform API',
      version: '1.0.0',
      description: 'AI-enabled Gamified Learning Platform REST API Documentation',
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 5000}/api` }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
