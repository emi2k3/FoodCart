import { FastifyPluginAsync } from "fastify";
import { query } from "../../../services/database.js";
import { detalle_pedido } from "../../../types/detalle_pedido.js";

const detallePedidoRoute: FastifyPluginAsync = async (
    fastify,
    opts
): Promise<void> => {
    fastify.get("/:id_pedido", {
        schema: {
            summary: "Obtener un detalle pedido por la id de un pedido",
            description: "### Implementa y valida: \n " + "- token \n - params",
            tags: ["Detalle_Pedidos"],
            security: [{ BearerAuth: [] }],
            params: {
                type: "object",
                properties: {
                    id_pedido: { type: "string" },
                },
                required: ["id_pedido"],
            },
            response: {
                200: {
                    description: "Detalles del pedido solicitado",
                    type: "object",
                    properties: {
                        ...detalle_pedido.properties,
                    },
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
                return response.rows[0];
            } catch (error) {
                return reply.status(500).send(error);
            }
        },
    });
}
export default detallePedidoRoute;
