import { FastifyPluginAsync } from "fastify";


const bebidasRoute: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get('/', {
        schema: {
          description: ' ',
          tags: ['Bebidas'],
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
          tags: ['Bebidas'],
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
          tags: ['Bebidas'],
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
          tags: ['Bebidas'],
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
export default bebidasRoute;