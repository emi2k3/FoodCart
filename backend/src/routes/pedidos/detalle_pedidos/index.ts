import { FastifyPluginAsync } from "fastify";
import { query } from "../../../services/database.js";
import { detalle_pedido } from "../../../types/detalle_pedido.js";

const detallePedidoRoute: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.get("/:id_pedido", {
    schema: {
      summary: "Listado de detalle de pedidos conseguidos por id",
      description: "### Implementa y valida: \n " + "- token",
      tags: ["Detalle_Pedidos"],
      security: [{ BearerAuth: [] }],
      response: {
        200: {
          description: "Proporciona todos los productos y sus datos",
          type: "array",
          properties: {
            ...detalle_pedido.properties,
          },
          examples: [
            {
              id_pedido: 1,
              id_producto: 1,
              cantidad: 1,
              indicaciones: "Hamburgesa sin carne.",
            },
          ],
        },
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {
      const id_pedido = (request.params as { id_pedido: string }).id_pedido;

      try {
        const response = await query(
          "SELECT * FROM detalle_pedido WHERE id_pedido = $1",
          [id_pedido]
        );

        if (response.rows.length === 0) {
          return reply.status(404).send("Detalle de pedido no encontrado");
        }
        reply.code(200);
        return response.rows;
      } catch (error) {
        return reply.status(500).send(error);
      }
    },
  });

  fastify.post("/", {
    schema: {
      summary: "Crear un nuevo detalle de pedido",
      description: "### Implementa y valida: \n " + "- token \n - body",
      tags: ["Detalle_Pedidos"],
      security: [{ BearerAuth: [] }],
      body: {
        type: "object",
        properties: {
          cantidad: { type: "integer" },
          indicaciones: { type: ["string", "null"], nullable: true },
          id_pedido: { type: "integer" },
          id_producto: { type: "integer" },
        },
        required: ["cantidad", "id_pedido", "id_producto"],
      },
      response: {
        201: {
          description: "Detalle de pedido creado exitosamente",
          type: "object",
          properties: {
            ...detalle_pedido.properties,
          },
        },
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {
      const { cantidad, indicaciones, id_pedido, id_producto } =
        request.body as {
          cantidad: number;
          indicaciones: string;
          id_pedido: number;
          id_producto: number;
        };

      try {
        // Verificar si el pedido existe
        const pedidoExists = await query(
          "SELECT id_pedido FROM pedido WHERE id_pedido = $1",
          [id_pedido]
        );

        if (pedidoExists.rows.length === 0) {
          return reply.status(404).send("El pedido especificado no existe");
        }

        // Verificar si el producto existe
        const productoExists = await query(
          "SELECT id_producto FROM producto WHERE id_producto = $1",
          [id_producto]
        );

        if (productoExists.rows.length === 0) {
          return reply.status(404).send("El producto especificado no existe");
        }

        const response = await query(
          `INSERT INTO detalle_pedido(
                        cantidad,
                        indicaciones,
                        id_pedido,
                        id_producto
                    ) VALUES($1, $2, $3, $4) RETURNING *`,
          [cantidad, indicaciones, id_pedido, id_producto]
        );

        reply.code(201);
        return response.rows[0];
      } catch (error) {
        console.error("Error al crear detalle de pedido:", error);
        return reply.status(500).send(error);
      }
    },
  });
};

export default detallePedidoRoute;
