import fp from "fastify-plugin";
import cors, { FastifyCorsOptions } from "@fastify/cors";

export default fp<FastifyCorsOptions>(async (fastify) => {
  fastify.register(cors, {
    origin: ["https://10.4.201.213", "https://localhost"],
  });
  console.log("registre cors");
});
