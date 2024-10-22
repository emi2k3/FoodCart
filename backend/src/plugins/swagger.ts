import swagger, { SwaggerOptions } from "@fastify/swagger";
import fp from "fastify-plugin";
import swaggerui from "@fastify/swagger-ui";

const options: SwaggerOptions = {
  openapi: {
    openapi: "3.0.0",
    info: {
      title: "FoodCartApi",
      description: "FoodCartApi",
      version: "0.1.0",
    },
    servers: [
      {
        url: "https://localhost/backend",
        description: "Development server",
      },
    ],
    tags: [
      { name: "Usuarios", description: "CRUD de usuarios" },
      { name: "Auth", description: "Autorización para logearse" },
      { name: "Bebidas", description: "CRUD de bebidas" },
      { name: "Locales", description: "CRUD de locales" },
      { name: "Pedidos", description: "CRUD de pedidos" },
      { name: "Productos", description: "CRUD de productos" },
    ],
    components: {
      securitySchemes: {
        apiKey: {
          type: "apiKey",
          name: "apiKey",
          in: "header",
        },
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    externalDocs: {
      url: "https://swagger.io",
      description: "Find more info here",
    },
  },
};

export default fp<SwaggerOptions>(async (fastify) => {
  await fastify.register(swagger, options);
  await fastify.register(swaggerui, {
    routePrefix: "docs",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });
});
