import {
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  HostListener,
} from '@angular/core';
import { SearchComponent } from '../search/search.component';
import { FetchService } from '../../servicios/fetch.service';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { CRUDUsuariosService } from '../../servicios/crud-usuarios.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SearchComponent, NgIf, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  usuario = {
    nombre: '',
    foto: 'assets/default-user.png',
  };

  isDropdownOpen = false;
  private authservice: AuthService = inject(AuthService);
  private crudUsuarios: CRUDUsuariosService = inject(CRUDUsuariosService);
  private router: Router = inject(Router);

  @Output() searchValueChange = new EventEmitter<string>();

  constructor() {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const dropdownElement = (event.target as HTMLElement).closest('.relative');
    if (!dropdownElement) {
      this.isDropdownOpen = false;
    }
  } // para que no haya que tocar usuario de nuevo para sacar el dropdown si no se quiere hacer algo

  async ngOnInit() {
    if (this.authservice.isValidUser()) {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const idToken = JSON.parse(atob(token.split('.')[1]));
          const usuarioGet = await this.crudUsuarios.getUserById(idToken.id);
          this.usuario.nombre = `${usuarioGet.nombre}`;
          if (usuarioGet.foto == true) {
            this.usuario.foto = `https://localhost/backend/Resources/img/usuarios/${usuarioGet.id}.jpg`;
          } else {
            this.usuario.foto = 'assets/default-user.png';
          }
        }
      } catch (error) {
        console.error('Error extrayendo los datos del usuario:', error);
      }
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['']);
    this.isDropdownOpen = false;
  }

  onSearchValue(value: string) {
    this.searchValueChange.emit(value);
  }
}
