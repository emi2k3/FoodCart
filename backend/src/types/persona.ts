 import { Static, Type } from '@sinclair/typebox';

 const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&_-])[A-Za-z\d!@#$%^&_-]{8,20}$/;
 const cedulaRegex = /^\d{1,3}\.\d{3}\.\d{3}-\d$/;


 export const PersonaPostSchema = Type.Object(
     {
         email: Type.String({ format: "email" }),
         contraseña: Type.String({ minLength: 5, maxLength: 20, pattern: passwordRegex.source }),
         repetirContraseña: Type.String({ minLength: 5, maxLength: 20, pattern: passwordRegex.source }),
         cedula: Type.String({ pattern: cedulaRegex.source }),
         foto: Type.Object({})
     },
     { additionalProperties: false }
 )

// export type PersonaPostSchema = Static<typeof PersonaPostSchema>