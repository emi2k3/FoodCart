import { Component, inject } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-registro-usuario',
  standalone: true,
  imports: [FormsModule, NgIf, NgClass],
  templateUrl: './registro-usuario.page.html',
  styleUrl: './registro-usuario.page.css',
})
export class RegistroUsuarioPage {
  email: string = '';
  password: string = '';
  register?: Promise<any>;

  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  async onSubmit() {
    this.register = await this.authService.registro(
      JSON.stringify({ email: this.email, contraseña: this.password }),
    );

    if (this.register != undefined || this.register != null) {
      this.router.navigate(['auth/login']);
    }
  }
}
