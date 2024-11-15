export interface UsuarioLogin {
  email: string;
  contraseña: string;
}
export interface UsuarioRegister extends UsuarioLogin {
  nombre: string;
  apellido: string;
  telefono: string;
  calle: string;
  numero: string;
  apto: string;
  repetirContraseña: string;
  foto: Object;
}
export interface ResetPassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
