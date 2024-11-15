import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ResetPassword } from '../../interfaces/usuario';
import { AuthService } from '../../servicios/auth.service';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-restablecer-contrasena',
  templateUrl: './reestablecer-contrasena.page.html',
  styleUrls: ['./reestablecer-contrasena.page.scss'],
  standalone: true,
  imports: [FormsModule, NgClass, NgIf],
})
export class RestablecerContrasenaPage {
  user: ResetPassword = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  async onSubmit() {
    if (this.user.newPassword === this.user.confirmPassword) {
      const body = JSON.stringify({
        currentPassword: this.user.currentPassword,
        newPassword: this.user.newPassword,
      });
      try {
        await this.authService.resetPassword(body);
        this.router.navigate(['/login']);
      } catch (error) {
        console.error('Error al restablecer la contraseña:', error);
      }
    } else {
      console.error('Las contraseñas no coinciden');
    }
  }
}
