import { Component, EventEmitter, inject, OnInit, Output, output } from '@angular/core';
import { SearchComponent } from '../search/search.component';
import { FetchService } from '../../servicios/fetch.service';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { CRUDUsuariosService } from '../../servicios/crud-usuarios.service';

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
  private authservice: AuthService = inject(AuthService)
  private crudUsuarios: CRUDUsuariosService = inject(CRUDUsuariosService)
  private router: Router = inject(Router)
  @Output() searchValueChange = new EventEmitter<string>();

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
    this.authservice.Logut();
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  onSearchValue(value: string) {
    this.searchValueChange.emit(value);
  }
}
