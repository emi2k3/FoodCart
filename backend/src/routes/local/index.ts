import { FastifyPluginAsync } from "fastify";
import { query } from "../../services/database.js";
import {
  IdLocalSchema,
  LocalPostSchema,
  LocalSchema,
} from "../../types/locales.js";
import { join } from "path";
import { writeFileSync } from "fs";

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
        200: {
          description: "Proporciona todos los locales y sus datos",
          type: "array",
          properties: {
            ...IdLocalSchema.properties,
            ...LocalSchema.properties,
          },
          examples: [{}],
        },
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {
      const response = await query("SELECT * FROM local");
      if (response.rows.length == 0 || !response.rows) {
        return reply.status(404).send("No se encontró ningún local");
      }
      reply.code(200);
      return response.rows;
    },
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
      summary: "Borrar un local",
      description: " ",
      tags: ["Locales"],
      security: [{ BearerAuth: [] }],
      params: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
        required: ["id"],
      },
      response: {
        200: {},
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {
      const id = (request.params as { id: string }).id;
      // falta hacer lo del admin acá
      try {
        await query("DELETE FROM local WHERE id_local = $1", [id]);
      } catch (error) {
        return reply.status(500).send(error);
      }
      return reply.status(204).send();
    },
  });

  // ################################################### POST ###################################################

  fastify.post("/", {
    schema: {
      summary: "Creación de un local",
      tags: ["Locales"],
      description: "Creación de un local",
      security: [{ BearerAuth: [] }],
      body: LocalSchema,
      response: {
        201: {
          description: "Muestra el objeto resultante del local creado",
          type: "object",
          properties: {
            ...LocalSchema.properties,
          },
        },
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {
      const postLocal = request.body as LocalPostSchema;

      if (postLocal.foto && Object.keys(postLocal.foto).length > 0) {
        try {
          const fileBuffer = postLocal.foto as Buffer;
          const fileName = join(
            process.cwd(),
            "Resources",
            postLocal.nombre + ".jpg"
          );
          writeFileSync(fileName, fileBuffer);
        } catch (error) {
          console.error("Error al intentar crear la imagen:", error);
          return reply
            .status(500)
            .send("Hubo un error al intentar crear la imagen");
        }
      }

      //falta terminar por errores de pienso en la bdñ
    },
  });
};
export default localesRoute;
