import { Component, inject } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { UsuarioRegister } from '../../interfaces/usuario';
@Component({
  selector: 'app-registro-usuario',
  standalone: true,
  imports: [FormsModule, NgIf, NgClass],
  templateUrl: './registro-usuario.page.html',
  styleUrl: './registro-usuario.page.css',
})
export class RegistroUsuarioPage {
  nombre: string = '';
  apellido: string = '';
  email: string = '';
  telefono: string = '';
  calle: string = '';
  numero: string = '';
  apto: string = '';
  password: string = '';
  repetirContraseña: string = '';
  foto: object = {};
  confirmarContrasena: string = '';
  registerUser?: UsuarioRegister;
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  async onSubmit() {
    this.registerUser = {
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      telefono: this.telefono,
      calle: this.calle,
      numero: this.numero,
      apto: this.apto,
      contraseña: this.password,
      repetirContraseña: this.repetirContraseña,
      foto: this.foto,
    };
    await this.authService.registro(JSON.stringify(this.registerUser));
    if (this.registerUser != undefined || this.registerUser != null) {
      this.router.navigate(['auth/login']);
    }
  }
  redirectToLogin() {
    this.router.navigate(['auth/login']);
  }
}
