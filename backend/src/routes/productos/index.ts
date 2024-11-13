import { FastifyPluginAsync } from "fastify";
import {
  IdProductoSchema,
  productoPost,
  productoPostType,
  productoSchema,
  productoGet,
} from "../../types/productos.js";
import { query } from "../../services/database.js";
import { writeFileSync } from "fs";
import { join } from "node:path";

const productosRoute: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  // ################################################### GET ###################################################

  fastify.get("/", {
    schema: {
      summary: "Listado de productos completo",
      description: "### Implementa y valida: \n " + "- token",
      tags: ["Productos"],
      security: [{ BearerAuth: [] }],
      response: {
        200: {
          description: "Proporciona todos los productos y sus datos",
          type: "array",
          properties: {
            ...IdProductoSchema.properties,
            ...productoSchema.properties,
          },
          examples: [
            {
              id_producto: 0,
              nombre: "Hamburgesa Triple",
              descripcion:
                "Tres patties de 100% carne de res con cebolla picada, ketchup, mostaza y dos fetas de queso americano.",
              precio_unidad: 500,
              id_categoria: 1,
              foto: true,
            },
          ],
        },
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {
      const response = await query("SELECT * FROM producto");
      if (response.rows.length == 0 || !response.rows) {
        return reply.status(404).send("No se encontro ningun producto");
      }
      reply.code(200);
      return response.rows;
    },
  });

  // ################################################### GET BY ID_CATEGORIA ########################################################################

  fastify.get("/categoria/:id_categoria", {
    schema: {
      summary: "Listado de productos filtrados por categoría",
      description: "### Implementa y valida: \n" + "- token \n" + "- params",
      tags: ["Productos"],
      security: [{ BearerAuth: [] }],
      params: {
        type: "object",
        properties: {
          id_categoria: { type: "string" },
        },
        required: ["id_categoria"],
      },
      response: {
        200: {
          description: "Proporciona los productos filtrados por categoría",
          type: "array",
          items: {
            type: "object",
            properties: {
              ...IdProductoSchema.properties,
              ...productoGet.properties,
            },
          },
          examples: [
            {
              id_producto: 0,
              nombre: "Hamburgesa Triple",
              descripcion:
                "Tres patties de 100% carne de res con cebolla picada, ketchup, mostaza y dos fetas de queso americano.",
              precio_unidad: 500,
              id_categoria: 1,
              foto: true,
            },
          ],
        },
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {
      const id_categoria = (request.params as { id_categoria: string })
        .id_categoria;
      // const fs = require('fs');
      try {
        const response = await query(
          "SELECT * FROM producto WHERE id_categoria = $1",
          [id_categoria]
        );

        if (response.rows.length === 0) {
          return reply.status(404).send({
            error: "No se encontraron productos para la categoría especificada",
          });
        }
        // response.rows.forEach(element => {
        //   if (element.foto) {
        //     let filePath = join(process.cwd(), 'Resources', 'img', 'productos', `${element.id_producto}.png`);
        //     let fileBuffer = fs.readFileSync(filePath);
        //     if (fs.existsSync(filePath)) {
        //       let base64Image = `data:image/png;base64,${fileBuffer.toString('base64')}`;
        //     }
        //   }

        // });
        reply.code(200).send(response.rows);
      } catch (error) {
        return reply.status(500).send(error);
      }
    },
  });

  // ######################################################### GET BY ID_PRODUCTO ####################################################################

  fastify.get("/:id_producto", {
    schema: {
      summary: "Listado de productos filtrados por categoría",
      description: "### Implementa y valida: \n" + "- token \n" + "- params",
      tags: ["Productos"],
      security: [{ BearerAuth: [] }],
      params: {
        type: "object",
        properties: {
          id_producto: { type: "string" },
        },
        required: ["id_producto"],
      },
      response: {
        200: {
          description: "Proporciona los productos filtrados por categoría",
          type: "array",
          items: {
            type: "object",
            properties: {
              ...IdProductoSchema.properties,
              ...productoSchema.properties,
            },
          },
          examples: [
            {
              id_producto: 0,
              nombre: "Hamburgesa Triple",
              descripcion:
                "Tres patties de 100% carne de res con cebolla picada, ketchup, mostaza y dos fetas de queso americano.",
              precio_unidad: 500,
              id_categoria: 1,
              foto: true,
            },
          ],
        },
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {
      const id_producto = (request.params as { id_producto: string })
        .id_producto;

      try {
        const response = await query(
          "SELECT * FROM producto WHERE id_producto = $1",
          [id_producto]
        );

        if (response.rows.length === 0) {
          return reply.status(404).send({
            error: "No se encontro el producto con el id especificado",
          });
        }

        reply.code(200).send(response.rows);
      } catch (error) {
        return reply.status(500).send(error);
      }
    },
  });

  // ########################################################### PUT #################################################################################

  fastify.put("/:id_producto", {
    schema: {
      summary: "Modificación de un producto por su id",
      description:
        "### Implementa y valida: \n " +
        " - token \n " +
        " - params \n " +
        " - body \n " +
        " - que el usuario que ejecuta es admin \n " +
        " - response. \n ",
      tags: ["Productos"],
      security: [{ BearerAuth: [] }],
      params: {
        type: "object",
        properties: {
          id_producto: { type: "string" },
        },
        required: ["id_producto"],
      },
      body: productoPost,
      response: {
        200: {
          description:
            "Muestra los cambios que tiene las propiedades del producto.",
          type: "object",
          properties: {
            ...productoPost.properties,
          },
        },
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {
      const bodyProducto: productoPostType = request.body as productoPostType;
      const id_producto = (request.params as { id_producto: string })
        .id_producto;

      try {
        if (bodyProducto.foto && Object.keys(bodyProducto.foto).length > 0) {
          const fileBuffer = bodyProducto.foto as unknown as Buffer;
          const fileName = `${bodyProducto.nombre.replace(
            /\s+/g,
            "_"
          )}_${Date.now()}.jpg`;
          const filePath = join(process.cwd(), "Resources", fileName);
          writeFileSync(filePath, fileBuffer);
          // var fileUrl = `/Resources/${fileName}`;
        }

        //para que no funcione como un post verificamos que el producto exista
        const existingProduct = await query(
          "SELECT * FROM producto WHERE id_producto = $1",
          [id_producto]
        );

        if (existingProduct.rows.length === 0) {
          return reply.status(404).send({ error: "Producto no encontrado" });
        }

        const result = await query(
          `UPDATE producto SET
            nombre = $1,
            descripcion = $2,
            precio_unidad = $3,
            id_categoria = $4
          WHERE id_producto = $5
          RETURNING *`,
          [
            bodyProducto.nombre,
            bodyProducto.descripcion,
            bodyProducto.precio_unidad,
            bodyProducto.id_categoria,
            id_producto,
          ]
        );

        reply.code(200).send(result.rows[0]);
      } catch (error) {
        return reply.status(500).send(error);
      }
    },
  });

  // ################################################### DELETE #################################################

  fastify.delete("/:id_producto", {
    schema: {
      summary: "Eliminación un producto por su id",
      description:
        "### Implementa y valida: \n " +
        " - token \n " +
        " - params \n " +
        " - que el usuario que ejecuta es administrador o el creador \n " +
        " - response. \n ",
      tags: ["Productos"],
      security: [{ BearerAuth: [] }],
      params: {
        type: "object",
        properties: {
          id_producto: { type: "string" },
        },
        required: ["id_producto"],
      },

      response: {
        204: {
          description: "Producto eliminado correctamente",
          type: "null",
        },
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {
      const id_producto = (request.params as { id_producto: string })
        .id_producto;

      try {
        await query("DELETE FROM producto WHERE id_producto = $1", [
          id_producto,
        ]);
      } catch (error) {
        return reply.status(500).send(error);
      }
      reply.code(204);
    },
  });

  // ################################################### POST ###################################################

  fastify.post("/", {
    schema: {
      summary: "Creación de un producto",
      tags: ["Productos"],
      description: "Creación de un producto ",
      security: [{ BearerAuth: [] }],
      body: productoPost,
      response: {
        201: {
          description: "Muestra el objeto resultante del producto creado",
          type: "object",
          properties: {
            ...productoPost.properties,
          },
        },
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {
      const bodyProducto: productoPostType = request.body as productoPostType;
      var tieneFoto: boolean = false;

      if (bodyProducto.foto && Object.keys(bodyProducto.foto).length > 0) {
        tieneFoto = true;
      } else {
        tieneFoto = false;
      }

      const result = await query(
        `INSERT INTO producto(
          nombre,
          descripcion,
          precio_unidad,
          id_categoria, 
          foto
        ) VALUES($1,$2,$3,$4,$5) RETURNING *`,
        [
          bodyProducto.nombre,
          bodyProducto.descripcion,
          bodyProducto.precio_unidad,
          bodyProducto.id_categoria,
          tieneFoto,
        ]
      );

      try {
        if (tieneFoto) {
          const fileBuffer = bodyProducto.foto as Buffer;
          const filename = result.rows[0].id_producto + ".jpg";
          const filePath = join(
            process.cwd(),
            "Resources",
            "img",
            "productos",
            filename
          );

          writeFileSync(filePath, fileBuffer);
        }

        reply.code(201).send(result.rows[0]);
      } catch (error) {
        return reply.status(500).send(error);
      }
    },
  });

  // ################################################### GET BY ID_PRODUCTO ########################################################################

  fastify.get("/:id_producto", {
    schema: {
      summary: "Conseguir un producto por su id.",
      description: "### Implementa y valida: \n" + "- token \n" + "- params",
      tags: ["Productos"],
      security: [{ BearerAuth: [] }],
      params: {
        type: "object",
        properties: {
          id_producto: { type: "string" },
        },
        required: ["id_producto"],
      },
      response: {
        200: {
          description: "Proporciona los productos filtrados por categoría",
          type: "object",
          properties: {
            ...IdProductoSchema.properties,
            ...productoGet.properties,
          },
          example:
          {
            id_producto: 0,
            nombre: "Hamburgesa Triple",
            descripcion:
              "Tres patties de 100% carne de res con cebolla picada, ketchup, mostaza y dos fetas de queso americano.",
            precio_unidad: 500,
            id_categoria: 1,
            foto: "/ruta/imagen.jpg",
          },

        },
      },
    },
    onRequest: [fastify.authenticate],
    handler: async function (request, reply) {
      const id_producto = (request.params as { id_producto: string })
        .id_producto;
      // const fs = require('fs');
      try {
        const response = await query(
          "SELECT * FROM producto WHERE id_producto = $1",
          [id_producto]
        );

        if (response.rows.length === 0) {
          return reply.status(404).send({
            error: "No se encontro el producto con la id especificada.",
          });
        }
        // response.rows.forEach(element => {
        //   if (element.foto) {
        //     let filePath = join(process.cwd(), 'Resources', 'img', 'productos', `${element.id_producto}.png`);
        //     let fileBuffer = fs.readFileSync(filePath);
        //     if (fs.existsSync(filePath)) {
        //       let base64Image = `data:image/png;base64,${fileBuffer.toString('base64')}`;
        //     }
        //   }

        // });
        reply.code(200).send(response.rows[0]);
      } catch (error) {
        return reply.status(500).send(error);
      }
    },
  });
};
export default productosRoute;
