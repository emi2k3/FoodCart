import { Static, Type } from "@sinclair/typebox";
import _static from "../plugins/static.js";

export const IdCategoriaSchema = Type.Object({
  id_categoria: Type.Integer({
    description: "Identificador único de la categoria",
  }),
});
export type IdCategoriaType = Static<typeof IdCategoriaSchema>;

export const CategoriaPostSchema = Type.Object({
  nombre: Type.String({
    minLength: 3,
    maxLength: 20,
    pattern: "^[^\\d]+$",
    examples: ["Comida"],
  }),
});

export type CategoriaPostSchema = Static<typeof CategoriaPostSchema>;

export const Categoria = Type.Object({
  id_categoria: Type.Integer({
    description: "Identificador único de la categoria",
  }),
  nombre: Type.String({
    minLength: 3,
    maxLength: 20,
    pattern: "^[^\\d]+$",
    examples: ["Comida"],
  }),
});

export type Categoria = Static<typeof Categoria>;
