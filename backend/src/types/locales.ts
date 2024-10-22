import { Static, Type } from "@sinclair/typebox";

export const IdLocalSchema = Type.Object({
  id: Type.Integer({
    description: "Identificador único del local",
  }),
});
export type IdLocalType = Static<typeof IdLocalSchema>;

export const LocalPostSchema = Type.Object(
  {
    nombre: Type.String({
      minLength: 3,
      maxLength: 20,
      pattern: "^[^\\d]+$",
      examples: ["Chivitos Pro"],
    }),
    telefono: Type.String({
      minLength: 3,
      maxLength: 20,
      examples: ["099471882"],
    }),
    calle: Type.String({
      maxLength: 20,
      examples: ["Calle"],
    }),
    numero: Type.String({
      maxLength: 10,
      examples: ["123"],
    }),
    foto: Type.Optional(Type.Object({})),
  },
  { additionalProperties: false }
);

export type LocalPostSchema = Static<typeof LocalPostSchema>;

export const LocalSchema = Type.Object(
  {
    nombre: Type.String({
      minLength: 3,
      maxLength: 20,
      pattern: "^[^\\d]+$",
      examples: ["Chivitos Pro"],
    }),
    id_telefono: Type.Integer({ description: "Identificador del teléfono" }),
    id_direccion: Type.Integer({
      description: "Identificador de la dirección",
    }),
    foto: Type.Optional(Type.Object({})),
  },
  { additionalProperties: false }
);

export type LocalSchema = Static<typeof LocalSchema>;
