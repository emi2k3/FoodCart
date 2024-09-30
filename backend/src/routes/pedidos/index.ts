import { FastifyPluginAsync } from "fastify";


const productosRoute: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get('/', {
        schema: {
          description: ' ',
          tags: ['Pedidos'],
          security: [{ BearerAuth: [] }],
          response: {
            200: {}
          },
        },
        onRequest: [fastify.authenticate],
        handler: async function (request, reply) {

        }
      });
      fastify.put('/:id', {
        schema: {
          description: ' ',
          tags: ['Pedidos'],
          security: [{ BearerAuth: [] }],
          response: {
            200: {}
          },
        },
        onRequest: [fastify.authenticate],
        handler: async function (request, reply) {

        }
      });
      fastify.delete('/:id', {
        schema: {
          description: ' ',
          tags: ['Pedidos'],
          security: [{ BearerAuth: [] }],
          response: {
            200: {}
          },
        },
        onRequest: [fastify.authenticate],
        handler: async function (request, reply) {

        }
      });
      fastify.post('/', {
        schema: {
          description: ' ',
          tags: ['Pedidos'],
          security: [{ BearerAuth: [] }],
          response: {
            200: {}
          },
        },
        onRequest: [fastify.authenticate],
        handler: async function (request, reply) {

        }
      });
}
export default productosRoute;