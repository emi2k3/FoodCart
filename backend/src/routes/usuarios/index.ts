import { FastifyPluginAsync } from "fastify"
import { UsuarioPostSchema } from "../../types/usuario.js";
import { join } from "node:path";
import { writeFileSync } from "node:fs";
import { query } from "../../../services/database.js";

const usuarioRoute: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post('/', {
    schema: {
      body: UsuarioPostSchema
    },
    handler: async function (request, reply) {
      const postUsuario = request.body as UsuarioPostSchema;

      if (postUsuario.contraseña != postUsuario.repetirContraseña) {
        return reply.status(400).send({ error: "Las contraseñas no coinciden" });
      }

      const fileBuffer = (postUsuario.foto as Buffer);
      const fileName = join(process.cwd(), "archivos", postUsuario.email + ".jpg")
      writeFileSync(fileName, fileBuffer);

      await query("INSERT INTO personas(nombre, apellido, email, contraseña) VALUES ($1,$2, $3, crypt($4, gen_salt('bf')))",
        [postUsuario.nombre, postUsuario.email, postUsuario.contraseña])
      return reply.status(201).send("El usuario se creó correctamente")
    }
  });


}

export default usuarioRoute;
