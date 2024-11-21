import { FastifyPluginAsync } from "fastify";

const websocket: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/", { websocket: true }, (socket, req) => {
    socket.on("message", (message) => {
      socket.send("Socket abierto");
    });
    socket.on("connection", (message) => {
      console.log("Se conecto el usuario.");
    });

    socket.on("close", (message) => {
      console.log("Se cerro la conexión.");
    });
  });
};
export default websocket;
