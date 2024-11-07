import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { SearchComponent } from '../search/search.component';
import { FetchService } from '../../servicios/fetch.service';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SearchComponent, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  usuario = {
    nombre: '',
    foto: 'assets/default-user.png', // Setea una foto mientras no haya.
  };

  @Output() searchValueChange = new EventEmitter<string>();
  private authService: AuthService = inject(AuthService);
  private fetchService: FetchService = inject(FetchService);
  private router: Router = inject(Router);

  async ngOnInit() {
    if (this.authService.isValidUser()) {
      try {
        const userData = await this.fetchService.get('/usuarios');
        this.usuario.nombre = userData.nombre || 'Usuario';
        this.usuario.foto = userData.fotoUrl || 'assets/default-user.png';
      } catch (error) {
        console.error('Error extrayendo los datos del usuario:', error);
      }
    }
  }

  logout() {
    this.authService.Logut();
    localStorage.removeItem('token');
    this.router.navigate(['/auth/login']);
  }

  onSearchValue(value: string) {
    this.searchValueChange.emit(value);
  }
}
