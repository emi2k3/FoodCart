import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { SearchComponent } from '../search/search.component';
import { FetchService } from '../../servicios/fetch.service';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CRUDUsuariosService } from '../../servicios/crud-usuarios.service';


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
  private authservice: AuthService = inject(AuthService)
  private crudUsuarios: CRUDUsuariosService = inject(CRUDUsuariosService)
  @Output() searchValueChange = new EventEmitter<string>();
  private authService: AuthService = inject(AuthService);
  private fetchService: FetchService = inject(FetchService);
  private router: Router = inject(Router);

  constructor() { }

  async ngOnInit() {
    if (this.authservice.isValidUser()) {

      try {
        const token = localStorage.getItem('token');
        if (token) {
          const idToken = JSON.parse(atob(token.split('.')[1]));
          const usuarioGet = await this.crudUsuarios.getUserById(idToken.id)
          this.usuario.nombre = `${usuarioGet.nombre}`;
          if (usuarioGet.foto == true) {
            this.usuario.foto = `https://localhost/backend/Resources/img/usuarios/${usuarioGet.id}.jpg`
          }
          else {
            this.usuario.foto = 'assets/default-user.png'
          }

        }

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
