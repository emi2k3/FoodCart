import { FastifyPluginAsync } from "fastify";
import { IdProductoSchema, productoSchema } from "../../types/productos.js";
import { query } from "../../services/database.js";

const productosRoute: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  // ################################################### GET ###################################################

  fastify.get("/", {
    schema: {
      summary: "Listado de productos completo",
      description: "### Implementa y valida: \n " + "- token",
      tags: ["Productos"],
      security: [{ BearerAuth: [] }],
      response: {
        200: {
          description: "Proporciona todos los productos y sus datos",
          type: "array",
          properties: {
            ...IdProductoSchema.properties,
            ...productoSchema.properties,
          },
          examples: [
            {
              id: 0,
              nombre: "Hamburgesa Triple",
              descripción:
                "Tres patties de 100% carne de res con cebolla picada, ketchup, mostaza y dos fetas de queso americano.",
              precio_unidad: 500,
              foto: {},
            },
          ],
        },
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {
      const response = await query("SELECT * FROM producto");
      if (response.rows.length == 0 || !response.rows) {
        return reply.status(404).send("No se encontro ningun producto");
      }
      reply.code(200);
      return response.rows;
    },
  });

  // ################################################### PUT ###################################################

  fastify.put("/:id_producto", {
    schema: {
      summary: "Modificación de un producto por su id",
      description:
        "### Implementa y valida: \n " +
        " - token \n " +
        " - params \n " +
        " - body \n " +
        " - que el usuario que ejecuta es admin \n " +
        " - response. \n ",
      tags: ["Productos"],
      security: [{ BearerAuth: [] }],
      params: {
        type: "object",
        properties: {
          id_producto: { type: "string" },
        },
        required: ["id_producto"],
      },
      body: productoSchema,
      response: {
        200: {
          description:
            "Muestra los cambios que tiene las propiedades del producto.",
          type: "object",
          properties: {
            ...productoSchema.properties,
          },
        },
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {
      const bodyProducto: productoSchema = request.body as productoSchema;
      const id_producto = (request.params as { id_producto: string })
        .id_producto;

      try {
        await query(
          ` UPDATE producto SET 
            nombre=$1,descripcion=$2,precio_unidad=$3 WHERE id=$4`,
          [
            bodyProducto.nombre,
            bodyProducto.descripcion,
            bodyProducto.precio_unidad,
            id_producto,
          ]
        );
        reply.code(200).send(bodyProducto);
      } catch (error) {
        return reply.status(500).send(error);
      }
    },
  });

  // ################################################### DELETE #################################################

  fastify.delete("/:id_producto", {
    schema: {
      summary: "Eliminación un producto por su id",
      description:
        "### Implementa y valida: \n " +
        " - token \n " +
        " - params \n " +
        " - que el usuario que ejecuta es administrador o el creador \n " +
        " - response. \n ",
      tags: ["Productos"],
      security: [{ BearerAuth: [] }],
      params: {
        type: "object",
        properties: {
          id_producto: { type: "string" },
        },
        required: ["id_producto"],
      },

      response: {
        204: {
          description: "Producto eliminado correctamente",
          type: "null",
        },
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {
      const id_producto = (request.params as { id_producto: string })
        .id_producto;

      try {
        await query("DELETE FROM producto WHERE id = $1", [id_producto]);
      } catch (error) {
        return reply.status(500).send(error);
      }
      reply.code(204);
    },
  });

  // ################################################### POST ###################################################

  fastify.post("/", {
    schema: {
      summary: "Creación de un producto",
      tags: ["Productos"],
      description: "Creación de un producto ",
      security: [{ BearerAuth: [] }],
      body: productoSchema,
      response: {
        201: {
          description: "Muestra el objeto resultante del producto creado",
          type: "object",
          properties: {
            ...productoSchema.properties,
          },
        },
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {
      const bodyProducto: productoSchema = request.body as productoSchema;
      try {
        await query(
          `INSERT INTO producto(nombre,descripcion,precio_unidad) VALUES($1,$2,$3)`,
          [
            bodyProducto.nombre,
            bodyProducto.descripcion,
            bodyProducto.precio_unidad,
          ]
        );
        reply.code(201).send(bodyProducto);
      } catch (error) {
        return reply.status(500).send(error);
      }
    },
  });
};
export default productosRoute;
