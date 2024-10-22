import { Static, Type } from "@sinclair/typebox";

export const IdProductoSchema = Type.Object({
  id: Type.Integer({
    description: "Identificador único del producto",
  }),
});
export type IdProductoType = Static<typeof IdProductoSchema>;

export const productoSchema = Type.Object(
  {
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
    foto: Type.Optional(Type.Object({})),
  },
  { additionalProperties: false }
);

export type productoSchema = Static<typeof productoSchema>;
