import { FastifyPluginAsync } from "fastify";
import { bebidaSchema } from "../../types/bebidas.js";
import { productoSchema } from "../../types/productos.js";
import { Type } from "@fastify/type-provider-typebox";

const bebidasRoute: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.get("/:id_producto", {
    schema: {
      description: "Consigue una bebida por su id.",
      tags: ["Bebidas"],
      security: [{ BearerAuth: [] }],
      params: {
        type: "object",
        properties: {
          id_producto: { type: "string" },
        },
        required: ["id_producto"],
      },
      response: {
        200: {
          description: "Proporciona todos los datos de la bebida",
          type: "object",
          properties: {
            // Estos ... lo que hacen es desarmar el schema en propiedades individuales, esta esto acá
            // pq no se puede utilizar Type.Intesect en properties :(
            ...productoSchema.properties,
            ...bebidaSchema.properties,
          },
          examples: [
            {
              nombre: "Coca-Cola Light",
              descripcion: "Cola sin azúcar y sin calorias",
              precio_unidad: 70,
              foto: {},
              tipo_bebida: "Gaseosa",
            },
          ],
        },
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {},
  });
  fastify.put("/:id_producto", {
    schema: {
      description: "Edita los datos de la bebida.",
      tags: ["Bebidas"],
      security: [{ BearerAuth: [] }],
      params: {
        type: "object",
        properties: {
          id_producto: { type: "string" },
        },
        required: ["id_producto"],
      },
      body: Type.Intersect([productoSchema, bebidaSchema]),
      response: {
        200: {
          description:
            "Muestra los cambios que tiene las propiedades de bebida.",
          type: "object",
          properties: {
            ...productoSchema.properties,
            ...bebidaSchema.properties,
          },
          examples: [
            {
              nombre: "Coca-Cola Light",
              descripcion: "Cola sin azúcar y sin calorias",
              precio_unidad: 70,
              foto: {},
              tipo_bebida: "Gaseosa",
            },
          ],
        },
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {},
  });
  fastify.delete("/:id_producto", {
    schema: {
      description: "Eliminamos un tipo de bebida por su id.",
      tags: ["Bebidas"],
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
          description: "Mensaje de exito.",
          type: "null",
        },
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {},
  });
  fastify.post("/", {
    schema: {
      description: "Creamos una bebida.",
      tags: ["Bebidas"],
      security: [{ BearerAuth: [] }],
      body: Type.Intersect([productoSchema, bebidaSchema]),
      response: {
        200: {
          description: "Muestra el objeto resultante por crear la bebida",
          type: "object",
          properties: {
            ...productoSchema.properties,
            ...bebidaSchema.properties,
          },
          examples: [
            {
              nombre: "Coca-Cola Light",
              descripcion: "Cola sin azúcar y sin calorias",
              precio_unidad: 70,
              foto: {},
              tipo_bebida: "Gaseosa",
            },
          ],
        },
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {},
  });
};
export default bebidasRoute;
