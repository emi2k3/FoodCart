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
import GetPedidosService from '../../servicios/pedidos/get-pedidos.service';
import { GetProductosService } from '../../servicios/productos/get-productos.service';
import { GetDetallePedidosService } from '../../servicios/pedidos/get-detalle-pedidos.service';
import { CarritoService } from '../../servicios/carrito-service.service';
import { determinant } from 'ol/transform';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SearchComponent, NgIf, CommonModule],
  templateUrl: './navbar.component.html',
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
  carritoService: CarritoService = inject(CarritoService);
  private getPedido: GetPedidosService = inject(GetPedidosService);
  private getDetallePedido: GetDetallePedidosService = inject(
    GetDetallePedidosService,
  );

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

          const pedidosUsuarioFiltrado = await this.getPedido.getPedidoById(
            idToken.id,
          );

          const pedidoPendiente = pedidosUsuarioFiltrado.filter((pedido: any) =>
            ['PENDIENTE'].includes(pedido.estado),
          );

          if (pedidoPendiente.length > 0) {
            const id_pedido = pedidoPendiente[0].id_pedido;
            const detallePedido =
              await this.getDetallePedido.getDetallePedidoByID(id_pedido);
            this.carritoService.setCartCount(detallePedido.length);
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
