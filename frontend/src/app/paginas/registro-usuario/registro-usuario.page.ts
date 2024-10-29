import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { UsuarioRegister } from '../../interfaces/usuario';
@Component({
  selector: 'app-registro-usuario',
  standalone: true,
  imports: [FormsModule, NgIf, NgClass],
  templateUrl: './registro-usuario.page.html',
  styleUrl: './registro-usuario.page.css',
})
export class RegistroUsuarioPage implements OnInit {
  ngOnInit(): void {
    const queryString = window.location.search;
    if (queryString != null) {
      const UrlParams = new URLSearchParams(queryString);
      this.nombre = UrlParams.get('given_name') ?? '';
      this.apellido = UrlParams.get('family_name') ?? '';
      this.email = UrlParams.get('email') ?? '';
    }
  }
  nombre: string = '';
  apellido: string = '';
  email: string = '';
  telefono: string = '';
  calle: string = '';
  numero: string = '';
  apto: string = '';
  password: string = '';
  foto: object = {};
  confirmarContrasena: string = '';
  contraigual: boolean = false;
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
      repetirContraseña: this.confirmarContrasena,
      foto: this.foto,
    };
    let response = await this.authService.registro(
      JSON.stringify(this.registerUser),
    );
    if (response != null) {
      this.router.navigate(['auth/login']);
    } else {
      alert(
        'Hubo un error al intentar registrarlo, porfavor pruebe con otros datos.',
      );
    }
  }
  checkInput() {
    if (this.confirmarContrasena == this.password) {
      this.contraigual = true;
    } else {
      this.contraigual = false;
    }
  }
  redirectToLogin() {
    this.router.navigate(['auth/login']);
  }
}
