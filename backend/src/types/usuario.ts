 import { Static, Type } from '@sinclair/typebox';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&_-])[A-Za-z\d!@#$%^&_-]{8,20}$/;

export const UsuarioPostSchema = Type.Object(
    {
        nombre: Type.String({ minLength: 3, maxLength: 20, pattern: "^[^\\d]+$" }),
        apellido: Type.String({ minLength: 3, maxLength: 20, pattern: "^[^\\d]+$" }),
        email: Type.String({ format: "email" }),
        contraseña: Type.String({ minLength: 5, maxLength: 20, pattern: passwordRegex.source }),
        repetirContraseña: Type.String({ minLength: 5, maxLength: 20, pattern: passwordRegex.source }),
        foto: Type.Object({})
    },
    { additionalProperties: false }
)

export type UsuarioPostSchema = Static<typeof UsuarioPostSchema>
