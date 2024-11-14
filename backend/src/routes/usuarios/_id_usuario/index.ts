import { FastifyPluginAsync } from "fastify";
import { IdUsuario, IdUsuarioSchema, usuarioGet, UsuarioPostSchema } from "../../../types/usuario.js";
import { join } from "node:path";
import { writeFileSync } from "node:fs";
import { query } from "../../../services/database.js";

const usuarioIdRoute: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  // ####################################################### PUT #####################################################

  fastify.put("/", {
    onRequest: [fastify.authenticate],
    schema: {
      summary: "Editar un usuario por su id",
      tags: ["Usuarios"],
      description: "Editar un usuario",
      body: UsuarioPostSchema,
      security: [{ BearerAuth: [] }],
      params: IdUsuarioSchema,
      response: {
        200: {
          description: "El usuario se editó correctamente",
        },
      },
    },
    handler: async function (request, reply) {
      const postUsuario = request.body as UsuarioPostSchema;

      const id = request.params as IdUsuario;
      const idt = request.user.id;
      if (id.id_usuario != parseInt(idt)) {
        return reply
          .status(401)
          .send({ error: "No tiene permisos para hacer esto." });
      }

      if (postUsuario.contraseña != postUsuario.repetirContraseña) {
        return reply
          .status(400)
          .send({ error: "Las contraseñas no coinciden" });
      }

      try {
        if (postUsuario.foto && Object.keys(postUsuario.foto).length > 0) {
          const fileBuffer = postUsuario.foto as Buffer;
          const fileName = join(
            process.cwd(),
            "Resources",
            postUsuario.email + ".jpg"
          );
          writeFileSync(fileName, fileBuffer);
        }
      } catch (error) {
        console.error("Error al intentar crear la imagen:", error);
        return reply
          .status(500)
          .send("Hubo un error al intentar crear la imagen");
      }

      if (postUsuario.apto != null || postUsuario.apto != undefined) {
        try {
          await query(
            "UPDATE direccion set numero = $1 , calle = $2 , apto = $3 WHERE id_usuario = $4",
            [postUsuario.numero, postUsuario.calle, postUsuario.apto, idt]
          );
        } catch {
          return reply
            .status(500)
            .send("Hubo un error al intentar actualizar la dirección.");
        }
      } else {
        try {
          await query(
            "UPDATE direccion set numero = $1 , calle = $2 WHERE id_usuario = $4",
            [postUsuario.numero, postUsuario.calle, idt]
          );
        } catch {
          return reply
            .status(500)
            .send("Hubo un error al intentar actualizar la dirección.");
        }
      }

      try {
        await query(
          "UPDATE telefono set numeroTel = $1 WHERE id_usuario = $2",
          [postUsuario.telefono, idt]
        );
      } catch (error) {
        return reply
          .status(500)
          .send("Hubo un error al intentar actualizar el teléfono.");
      }

      try {
        await query(
          "UPDATE usuario set nombre = $1, email = $2, contraseña = crypt($3, gen_salt('bf')) WHERE id = $4",
          [postUsuario.nombre, postUsuario.email, postUsuario.contraseña, idt]
        );
        return reply.status(201).send("El usuario se editó correctamente");
      } catch (error) {
        return reply.status(500).send(error);
      }
    },
  });

  // ##################################################### DELETE #####################################################

  fastify.delete("/", {
    onRequest: [fastify.authenticate],
    schema: {
      summary: "Borrar un usuario por su id",
      tags: ["Usuarios"],
      security: [{ BearerAuth: [] }],
      description: "Borrar un usuario",
      params: IdUsuarioSchema
    },
    handler: async function (request, reply) {
      const id = request.params as IdUsuario;
      const idt = request.user.id;
      if (id.id_usuario != parseInt(idt)) {
        return reply
          .status(401)
          .send({ error: "No tiene permisos para hacer esto." });
      }
      try {
        await query("DELETE FROM usuario WHERE id = $1", [idt]);
      } catch (error) {
        return reply.status(500).send(error);
      }
      return reply.status(204).send();
    },
  });

  fastify.get("/:id_usuario", {
    schema: {
      summary: "Se consiguen los datos del usuario",
      description: "### Implementa y valida: \n" + "- token \n" + "- params",
      tags: ["Usuarios"],
      security: [{ BearerAuth: [] }],
      params: IdUsuarioSchema,
      response: {
        200: {
          description: "Proporciona los datos del usuario",
          type: "object",
          properties: {
            ...usuarioGet.properties,
          },
          example:
          {

            id: 1,
            nombre: "ad",
            apellido: "min",
            email: "admin@example.com",
            id_direccion: 1,
            id_telefono: 1,
            foto: false,
            admin: true

          },

        },
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {
      const { id_usuario } = request.params as IdUsuario;
      const idt = request.user.id;
      if (id_usuario != parseInt(idt)) {
        return reply
          .status(401)
          .send({ error: "No tiene permisos para hacer esto." });
      }
      const response = await query("SELECT * from usuario WHERE id=$1", [idt]);

      reply.status(200);
      return response.rows[0];
    },
  });
};



export default usuarioIdRoute;
