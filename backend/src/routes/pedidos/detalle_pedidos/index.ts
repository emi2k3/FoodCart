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
            tags: ["Productos"],
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
                            indicaciones: "Hamburgesa sin carne."
                        }

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
}
export default detallePedidoRoute;
