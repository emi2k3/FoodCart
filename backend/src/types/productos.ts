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
      maxLength: 20,
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
    foto: Type.Optional(
      Type.Union([Type.Null(), Type.Object({}), Type.String()])
    ),
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
