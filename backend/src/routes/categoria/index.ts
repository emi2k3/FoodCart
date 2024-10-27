import { FastifyPluginAsync } from "fastify";
import {
  IdCategoriaSchema,
  CategoriaPostSchema,
  Categoria,
} from "../../types/categoria.js";
import { query } from "../../services/database.js";

const categoriasRoute: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  // ################################################### GET ###################################################

  fastify.get("/", {
    schema: {
      summary: "Listado de categorías completo",
      description: "### Implementa y valida: \n " + "- token",
      tags: ["Categorias"],
      security: [{ BearerAuth: [] }],
      response: {
        200: {
          description: "Proporciona todas las categorías y sus datos",
          type: "array",
          properties: {
            ...IdCategoriaSchema.properties,
            ...Categoria.properties,
          },
          examples: [
            {
              id_categoria: 1,
              nombre: "COMIDA",
            },
          ],
        },
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {
      const response = await query("SELECT * FROM categoria");
      if (response.rows.length == 0 || !response.rows) {
        return reply.status(404).send("No se encontró ninguna categoría");
      }
      reply.code(200);
      return response.rows;
    },
  });

  // ################################################### PUT ###################################################

  fastify.put("/:id_categoria", {
    schema: {
      summary: "Modificación de una categoría por su id",
      description:
        "### Implementa y valida: \n " +
        " - token \n " +
        " - params \n " +
        " - body \n " +
        " - response. \n ",
      tags: ["Categorias"],
      security: [{ BearerAuth: [] }],
      params: {
        type: "object",
        properties: {
          id_categoria: { type: "string" },
        },
        required: ["id_categoria"],
      },
      body: CategoriaPostSchema,
      response: {
        200: {
          description:
            "Muestra los cambios que tiene las propiedades de la categoría.",
          type: "object",
          properties: {
            ...Categoria.properties,
          },
        },
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {
      const bodyCategoria = request.body as CategoriaPostSchema;
      const id_categoria = (request.params as { id_categoria: string })
        .id_categoria;

      try {
        await query(`UPDATE categoria SET nombre=$1 WHERE id_categoria=$2`, [
          bodyCategoria.nombre.toUpperCase(),
          id_categoria,
        ]);
        reply.code(200).send({
          id_categoria: parseInt(id_categoria),
          ...bodyCategoria,
        });
      } catch (error) {
        return reply.status(500).send(error);
      }
    },
  });

  // ################################################### DELETE #################################################

  fastify.delete("/:id_categoria", {
    schema: {
      summary: "Eliminación de una categoría por su id",
      description:
        "### Implementa y valida: \n " +
        " - token \n " +
        " - params \n " +
        " - que el usuario que ejecuta es administrador \n " +
        " - response. \n ",
      tags: ["Categorias"],
      security: [{ BearerAuth: [] }],
      params: {
        type: "object",
        properties: {
          id_categoria: { type: "string" },
        },
        required: ["id_categoria"],
      },
      response: {
        204: {
          description: "Categoría eliminada correctamente",
          type: "null",
        },
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {
      const id_categoria = (request.params as { id_categoria: string })
        .id_categoria;

      try {
        await query("DELETE FROM categoria WHERE id_categoria = $1", [
          id_categoria,
        ]);
      } catch (error) {
        return reply.status(500).send(error);
      }
      reply.code(204);
    },
  });

  // ################################################### POST ###################################################

  fastify.post("/", {
    schema: {
      summary: "Creación de una categoría",
      tags: ["Categorias"],
      description: "Creación de una nueva categoría",
      security: [{ BearerAuth: [] }],
      body: CategoriaPostSchema,
      response: {
        201: {
          description: "Muestra el objeto resultante de la categoría creada",
          type: "object",
          properties: {
            ...Categoria.properties,
          },
        },
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {
      const bodyCategoria = request.body as CategoriaPostSchema;
      try {
        const result = await query(
          `INSERT INTO categoria (nombre) VALUES($1) RETURNING *`,
          [bodyCategoria.nombre.toUpperCase()]
        );
        reply.code(201).send(result.rows[0]);
      } catch (error) {
        return reply.status(500).send(error);
      }
    },
  });
};

export default categoriasRoute;
