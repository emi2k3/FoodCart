import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { UsuarioLogin } from '../../interfaces/usuario';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf, NgClass],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css',
})
export class LoginPage {
  email: string = '';
  password: string = '';
  loginOkay: boolean = true;
  loginUser?: UsuarioLogin;
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  async onSubmit() {
    this.loginUser = {
      email: this.email,
      contraseña: this.password,
    };
    await this.authService.login(JSON.stringify(this.loginUser));

    if (localStorage.getItem('token')) {
      this.router.navigate(['/']);
    } else {
      this.loginOkay = false;
    }
  }

  redirectToGoogle() {
    window.location.href = 'https://localhost/backend/auth/login/google';
  }

  redirectToFacebook() {
    window.location.href = 'https://localhost/backend/auth/login/facebook';
  }

  redirectToRegister() {
    this.router.navigate(['registro']);
  }
}
