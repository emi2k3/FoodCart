import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { IdUsuario, ImagenUsuario } from "../../../../types/usuario.js";
import { extname, join } from "node:path";
import { writeFileSync } from "fs";
import { query } from "../../../../services/database.js";

const rutasImagenUsuario: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts
): Promise<void> => {
  fastify.post("/", {
    handler: async function (request, reply) {
      const body = request.body as ImagenUsuario;
      const params = request.params as IdUsuario;
      const fileBuffer = body.imagen._buf as Buffer;
      const extension = extname(body.imagen.filename);
      const filename = params.id_usuario + extension;
      const destinoArchivo = join(
        process.cwd(),
        "Resources",
        "img",
        "usuarios",
        filename
      );
      writeFileSync(destinoArchivo, fileBuffer);
      const urlUsuario = "Resources/img/usuarios/" + filename;
      try {
        await query("UPDATE usuario set foto = $1 WHERE id = $2", [
          urlUsuario,
          params.id_usuario,
        ]);
        return reply.status(201).send("La imagen se creó correctamente");
      } catch (error) {
        return reply.status(500).send(error);
      }
    },
  });
};

export default rutasImagenUsuario;
