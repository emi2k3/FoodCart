import { Static, Type } from "@sinclair/typebox";

export const bebidaSchema = Type.Object({
  tipo_bebida: Type.String({
    minLength: 4,
    maxLength: 50,
    examples: ["Gaseosa"],
  }),
});

export type bebidaSchema = Static<typeof bebidaSchema>;
