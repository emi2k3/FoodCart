import { FastifyPluginAsync } from "fastify";

const localesRoute: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  // ################################################### GET ###################################################

  fastify.get("/", {
    schema: {
      summary: "Listado de todos los locales",
      description: " ",
      tags: ["Locales"],
      security: [{ BearerAuth: [] }],
      response: {
        200: {},
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {},
  });

  // ################################################### PUT ###################################################

  fastify.put("/:id", {
    schema: {
      summary: "Modificación de un local por su id",
      description: " ",
      tags: ["Locales"],
      security: [{ BearerAuth: [] }],
      response: {
        200: {},
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {},
  });

  // ################################################### DELETE ##################################################

  fastify.delete("/:id", {
    schema: {
      description: " ",
      tags: ["Locales"],
      security: [{ BearerAuth: [] }],
      response: {
        200: {},
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {},
  });

  // ################################################### POST ###################################################

  fastify.post("/", {
    schema: {
      description: " ",
      tags: ["Locales"],
      security: [{ BearerAuth: [] }],
      response: {
        200: {},
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {},
  });
};
export default localesRoute;
