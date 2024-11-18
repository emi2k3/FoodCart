import { FastifyPluginAsync } from "fastify";

const websocket: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get("/", { websocket: true }, (socket /* WebSocket */, req /* FastifyRequest */) => {
        socket.on('message', message => {
            socket.send('Socket abierto')
        })
    })
}
export default websocket;
