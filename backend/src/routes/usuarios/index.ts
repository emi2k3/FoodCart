import { FastifyPluginAsync } from "fastify";
import { UsuarioPostSchema } from "../../types/usuario.js";
import { join } from "node:path";
import { writeFileSync } from "node:fs";
import { query } from "../../services/database.js";

const usuarioRoute: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.post("/", {
    schema: {
      body: UsuarioPostSchema,
    },
    handler: async function (request, reply) {
      const postUsuario = request.body as UsuarioPostSchema;

      if (postUsuario.contraseña != postUsuario.repetirContraseña) {
        return reply
          .status(400)
          .send({ error: "Las contraseñas no coinciden" });
      }

      const fileBuffer = postUsuario.foto as Buffer;
      const fileName = join(
        process.cwd(),
        "archivos",
        postUsuario.email + ".jpg"
      );
      writeFileSync(fileName, fileBuffer);

      await query(
        "INSERT INTO personas(nombre, apellido, email, contraseña) VALUES ($1,$2, $3, crypt($4, gen_salt('bf')))",
        [postUsuario.nombre, postUsuario.email, postUsuario.contraseña]
      );
      return reply.status(201).send("El usuario se creó correctamente");
    },
  });

  fastify.get("/", {
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {
      const response = await query("SELECT * from personas");
      return response.rows;
    },
  });

  fastify.put("/", {
    onRequest: [fastify.authenticate],
    schema: {
      body: UsuarioPostSchema,
    },
    handler: async function (request, reply) {
      const postUsuario = request.body as UsuarioPostSchema;

      const id = (request.params as { id: string }).id;
      const idt = request.user.id;
      if (id != idt) {
        return reply
          .status(401)
          .send({ error: "No tiene permisos para hacer esto." });
      }

      if (postUsuario.contraseña != postUsuario.repetirContraseña) {
        return reply
          .status(400)
          .send({ error: "Las contraseñas no coinciden" });
      }

      const fileBuffer = postUsuario.foto as Buffer;
      const fileName = join(
        process.cwd(),
        "archivos",
        postUsuario.email + ".jpg"
      );
      writeFileSync(fileName, fileBuffer);
      try {
        await query(
          "UPDATE direccion set numero = $1 , calle = $2 , apto = $3 WHERE id_usuario = $4)",
          [postUsuario.numero, postUsuario.calle, postUsuario.apto, idt]
        );
      } catch {
        return reply
          .status(500)
          .send("Hubo un error al intentar actualizar la dirección.");
      }

      try {
        await query(
          "UPDATE telefono set numeroTel = $1 where id_usuario = $2)",
          [postUsuario.telefono, idt]
        );
      } catch (error) {
        return reply
          .status(500)
          .send("Hubo un error al intentar actualizar el telefono.");
      }

      try {
        await query(
          "UPDATE personas set nombre = $1, email = $2, contraseña = crypt($3, gen_salt('bf')) where id = $4)",
          [postUsuario.nombre, postUsuario.email, postUsuario.contraseña, idt]
        );
        return reply.status(201).send("El usuario se editó correctamente");
      } catch (error) {
        return reply
          .status(500)
          .send("Hubo un error al intentar actualizar al usuario.");
      }
    },
  });

  fastify.delete("/:id", {
    onRequest: [fastify.authenticate],
    schema: {
      params: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
        required: ["id"],
      },
    },
    handler: async function (request, reply) {
      const id = (request.params as { id: string }).id;
      const idt = request.user.id;
      if (id != idt) {
        return reply
          .status(401)
          .send({ error: "No tiene permisos para hacer esto." });
      }
      try {
        await query("DELETE FROM personas WHERE id = $1", [id]);
        return reply.status(204).send();
      } catch (error) {
        return reply
          .status(500)
          .send("Hubo un error al intentar borrar al usuario.");
      }
    },
  });
};
export default usuarioRoute;
