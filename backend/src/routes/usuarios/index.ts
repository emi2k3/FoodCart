import { FastifyPluginAsync } from "fastify";
import { UsuarioPostSchema } from "../../types/usuario.js";
import { join } from "node:path";
import { writeFileSync } from "node:fs";
import { pool, query } from "../../services/database.js";

const usuarioRoute: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.post("/", {
    schema: {
      summary: "Crear un usuario",
      tags: ["Usuarios"],
      description: "Crear un usuario",
      body: UsuarioPostSchema,
      response: {
        201: {
          description: "El usuario se creó correctamente",
        },
      },
    },
    handler: async function (request, reply) {
      const postUsuario = request.body as UsuarioPostSchema;
      if (postUsuario.contraseña != postUsuario.repetirContraseña) {
        return reply
          .status(400)
          .send({ error: "Las contraseñas no coinciden" });
      }

      if (postUsuario.foto && Object.keys(postUsuario.foto).length > 0) {
        try {
          const fileBuffer = postUsuario.foto as Buffer;
          const fileName = join(
            process.cwd(),
            "Resources",
            postUsuario.email + ".jpg"
          );
          writeFileSync(fileName, fileBuffer);
        } catch (error) {
          console.error("Error al intentar crear la imagen:", error);
          return reply
            .status(500)
            .send("Hubo un error al intentar crear la imagen");
        }
      }

      const client = await pool.connect();

      try {
        await client.query("BEGIN");

        const baseQuery = `
          WITH direccionid AS (
            INSERT INTO direccion (numero, calle${
              postUsuario.apto ? ", apto" : ""
            }) 
            VALUES ($1, $2${postUsuario.apto ? ", $3" : ""}) 
            RETURNING id
          ),
          telefonoid AS (
            INSERT INTO telefono (numeroTel) 
            VALUES ($${postUsuario.apto ? "8" : "7"}) 
            RETURNING id
          ),
          usuarioid AS (
            INSERT INTO usuario(nombre, apellido, email, contraseña, id_direccion, id_telefono) 
            VALUES ($${postUsuario.apto ? "4" : "3"}, $${
          postUsuario.apto ? "5" : "4"
        }, 
                    $${postUsuario.apto ? "6" : "5"}, crypt($${
          postUsuario.apto ? "7" : "6"
        }, gen_salt('bf')), 
                    (SELECT id FROM direccionid), (SELECT id FROM telefonoid)) 
            RETURNING id
          ),
          usuario_direccion AS (
            INSERT INTO usuarios_direcciones(id_usuario, id_direccion) 
            VALUES ((SELECT id FROM usuarioid), (SELECT id FROM direccionid))
            RETURNING (SELECT id FROM usuarioid) as user_id
          )
          SELECT user_id FROM usuario_direccion`;

        const params = postUsuario.apto
          ? [
              postUsuario.numero,
              postUsuario.calle,
              postUsuario.apto,
              postUsuario.nombre,
              postUsuario.apellido,
              postUsuario.email,
              postUsuario.contraseña,
              postUsuario.telefono,
            ]
          : [
              postUsuario.numero,
              postUsuario.calle,
              postUsuario.nombre,
              postUsuario.apellido,
              postUsuario.email,
              postUsuario.contraseña,
              postUsuario.telefono,
            ];

        await client.query(baseQuery, params);
        await client.query("COMMIT");

        return reply.status(201).send("Se creó correctamente el usuario");
      } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error al intentar crear al usuario:", error);
        return reply
          .status(500)
          .send("Hubo un error al intentar crear al usuario.");
      } finally {
        client.release();
      }
    },
  });

  fastify.get("/", {
    schema: {
      summary: "Obtener todos los usuarios",
      tags: ["Usuarios"],
      description: "Obtener todos los usuarios",
      security: [{ BearerAuth: [] }],
      response: {
        200: {},
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {
      const response = await query("SELECT * from usuario");
      reply.code(200);
      return response.rows;
    },
  });
};

export default usuarioRoute;
