import { Component, OnInit } from '@angular/core';
import { SearchComponent } from '../search/search.component';
import { FetchService } from '../../servicios/fetch.service';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SearchComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  usuario = {
    nombre: '',
    foto: 'assets/default-user.png', // Setea una foto mientras no haya.
  };

  constructor(
    private authservice: AuthService,
    private fetchService: FetchService,
    private router: Router,
  ) {}

  async ngOnInit() {
    if (this.authservice.isValidUser()) {
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
    this.authservice.Logut();
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  onSearchValue(value: string) {
    console.log('print del serach value');
  }
}
