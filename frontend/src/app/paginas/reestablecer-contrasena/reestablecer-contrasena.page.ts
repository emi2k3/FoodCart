import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-restablecer-contrasena',
  standalone: true,
  imports: [FormsModule, NgClass, NgIf],
  templateUrl: './reestablecer-contrasena.page.html',
  styleUrls: ['./reestablecer-contrasena.page.scss'],
})
export class RestablecerContrasenaPage {
  user = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  onSubmit() {
    if (this.user.newPassword === this.user.confirmPassword) {
      this.http
        .post('/api/reset-password', {
          currentPassword: this.user.currentPassword,
          newPassword: this.user.newPassword,
        })
        .subscribe(
          () => {
            // Redirigir a la página de login o mostrar un mensaje de éxito
            this.router.navigate(['/login']);
          },
          (error) => {
            console.error('Error al restablecer la contraseña:', error);
            // Manejar errores aquí, mostrar un mensaje de error al usuario
          },
        );
    } else {
      console.error('Las contraseñas no coinciden');
    }
  }
}
