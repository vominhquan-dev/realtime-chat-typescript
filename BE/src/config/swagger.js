import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Realtime Chat API",
      version: "1.0.0",
      description: "API documentation for Realtime Chat Application",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/features/*/*.routes.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
