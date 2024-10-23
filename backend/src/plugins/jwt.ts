import jwt, { FastifyJWTOptions } from "@fastify/jwt";
import { FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

const jwtOptions: FastifyJWTOptions = {
  secret: process.env.JWTSECRET || "defaultSecret",
};
export default fp<FastifyJWTOptions>(async (fastify) => {
  fastify.register(jwt, jwtOptions);
  fastify.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify();
      } catch (err) {
        throw reply.unauthorized("Algo salió mal");
      }
    }
  );

  fastify.decorate(
    "verifyAdmin",
    async function (request: FastifyRequest, reply: FastifyReply) {
      console.log("Verificando si es administrador.");
      const usuarioToken = request.user;
      if (!usuarioToken.is_admin)
        throw reply.unauthorized("Tienes que ser admin para hacer eso.");
    }
  );
});
