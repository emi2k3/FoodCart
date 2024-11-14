import { Static, Type } from "@sinclair/typebox";

export const IdProductoSchema = Type.Object({
  id_producto: Type.Integer({
    description: "Identificador único del producto",
  }),
});
export type IdProductoType = Static<typeof IdProductoSchema>;

export const productoSchema = Type.Object(
  {
    id_producto: Type.Integer({
      description: "Identificador del producto",
    }),
    nombre: Type.String({
      minLength: 3,
      maxLength: 50,
      pattern: "^[^\\d]+$",
      examples: ["Hamburgesa Triple"],
    }),
    descripcion: Type.String({
      minLength: 3,
      maxLength: 300,
      examples: [
        `Tres patties de 100% carne de res con cebolla picada, ketchup, mostaza y dos fetas de queso americano.`,
      ],
    }),
    precio_unidad: Type.Number({
      examples: [300],
    }),
    id_categoria: Type.Integer({
      description: "Identificador de la categoría",
    }),
    foto: Type.Object({}, { additionalProperties: false }),
  },
  { additionalProperties: false }
);

export type productoSchemaType = Static<typeof productoSchema>;

export const productoPost = Type.Pick(productoSchema, [
  "nombre",
  "descripcion",
  "precio_unidad",
  "id_categoria",
  "foto",
]);
export type productoPostType = Static<typeof productoPost>;

export const productoGet = Type.Object({
  nombre: productoSchema.properties.nombre,
  descripcion: productoSchema.properties.descripcion,
  precio_unidad: productoSchema.properties.precio_unidad,
  id_categoria: productoSchema.properties.id_categoria,
  foto: Type.Boolean({
    description: "Indica si el producto tiene foto con un true."
  }),
}, { additionalProperties: false });
export type productoGetType = Static<typeof productoGet>;