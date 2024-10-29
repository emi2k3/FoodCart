import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifyPluginAsync,
} from "fastify";
import got from "got";
import { query } from "../../../../services/database.js";
import { OAuth2Namespace } from "@fastify/oauth2";

declare module "fastify" {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace;
  }
}

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

const googleRoutes: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts: any
): Promise<void> => {
  fastify.get(
    "/callback",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const { token: googletoken } =
        await fastify.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(
          request
        );

      console.log({ googletoken });
      //En caso de obtenerlo, muestra que funcionó todo bien

      const userInfo: GoogleUserInfo = await got
        .get("https://www.googleapis.com/oauth2/v2/userinfo", {
          headers: {
            Authorization: `Bearer ${googletoken.access_token}`,
          },
        })
        .json();

      console.log({ userInfo });
      const res = await query("SELECT * FROM usuario WHERE email=$1", [
        userInfo.email,
      ]);

      //Si no existe el mail en la bd
      if (res.rowCount === 0) {
        ``;
        const formUrl = `https://localhost/registro?email=${encodeURIComponent(
          userInfo.email
        )}&given_name=${encodeURIComponent(
          userInfo.given_name
        )}&family_name=${encodeURIComponent(userInfo.family_name || "")}`;
        return reply.redirect(formUrl);
      }

      const payload = {
        id: res.rows[0].id,
        email: res.rows[0].email,
        isAdmin: res.rows[0].isAdmin,
        expiresIn: "3h",
      };

      const token = fastify.jwt.sign(payload);
      const url = `https://localhost/?token=${token}`;
      return reply.redirect(url);
    }
  );
};

export default googleRoutes;
