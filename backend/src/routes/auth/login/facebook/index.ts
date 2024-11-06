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
    facebookOAuth2: OAuth2Namespace;
  }
}

interface FacebookUserInfo {
  id: string;
  email: string;
  name: string;
  first_name: string;
  last_name: string;
  picture: {
    data: {
      url: string;
    };
  };
}

const facebookRoutes: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts: any
): Promise<void> => {
  fastify.get(
    "/callback",
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        const { token: facebookToken } =
          await fastify.facebookOAuth2.getAccessTokenFromAuthorizationCodeFlow(
            request
          );

        console.log({ facebookToken });

        const userInfo: FacebookUserInfo = await got
          .get(
            "https://graph.facebook.com/me?fields=id,email,first_name,last_name,picture",
            {
              headers: {
                Authorization: `Bearer ${facebookToken.access_token}`,
              },
            }
          )
          .json();

        console.log({ userInfo });
        const res = await query("SELECT * FROM usuario WHERE email=$1", [
          userInfo.email,
        ]);

        if (res.rowCount === 0) {
          const formUrl = `https://localhost/registro?email=${encodeURIComponent(
            userInfo.email
          )}&given_name=${encodeURIComponent(
            userInfo.first_name
          )}&family_name=${encodeURIComponent(userInfo.last_name || "")}`;
          return reply.redirect(formUrl);
        }

        const payload = {
          id: res.rows[0].id,
          email: res.rows[0].email,
          isAdmin: res.rows[0].admin,
          expiresIn: "3h",
        };

        const token = fastify.jwt.sign(payload);
        const url = `https://localhost/?token=${token}`;
        return reply.redirect(url);
      } catch (error) {
        return reply.redirect("https://localhost");
      }
    }
  );
};

export default facebookRoutes;
