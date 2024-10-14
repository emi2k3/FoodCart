import { Static, Type } from "@sinclair/typebox";

const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;

export const UsuarioPostSchema = Type.Object(
    {
        nombre: Type.String({
            minLength: 3,
            maxLength: 20,
            pattern: "^[^\\d]+$",
            examples: ["Emilio"]
        }),
        apellido: Type.String({
            minLength: 3,
            maxLength: 20,
            pattern: "^[^\\d]+$",
            examples: ["Rodriguez"]
        }),
        email: Type.String({
            format: "email",
            examples: ["emilio.rodriguez@example.com"]

        }),
        telefono: Type.String({
            minLength: 3,
            maxLength: 20,
            examples: ["099471882"]
        }),
        calle: Type.String({
            maxLength: 20,
            examples: ["Calle"]

        }),
        numero: Type.String({
            maxLength: 10,
            examples: ["123"]
        }),
        apto: Type.Optional(
            Type.String({
                maxLength: 5,
                examples: ["A11"]
            })),
        contraseña: Type.String({
            minLength: 5,
            maxLength: 20,
            pattern: passwordRegex.source,
            examples: ["Contraseña123!"]
        }),
        repetirContraseña: Type.String({
            minLength: 5,
            maxLength: 20,
            pattern: passwordRegex.source,
            examples: ["Contraseña123!"]
        }),
        foto: Type.Optional(
            Type.Object({}))
    },
    { additionalProperties: false }
);

export type UsuarioPostSchema = Static<typeof UsuarioPostSchema>;
