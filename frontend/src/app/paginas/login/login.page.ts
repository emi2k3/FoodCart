import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';

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
  loginokay: boolean = false;
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  async onSubmit() {
    this.loginokay = await this.authService.Login(
      JSON.stringify({ email: this.email, contraseña: this.password }),
    );

    if (this.loginokay) {
      this.router.navigate(['']);
    } else {
      this.loginokay = true;
    }
  }
}
