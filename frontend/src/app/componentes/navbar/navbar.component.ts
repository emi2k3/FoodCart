import {
  Component,
  EventEmitter,
  inject,
  OnInit,
  Output,
  HostListener,
} from '@angular/core'; // Importa las funciones necesarias de Angular
import { SearchComponent } from '../search/search.component'; // Importa el componente SearchComponent
import { FetchService } from '../../servicios/fetch.service'; // Importa el servicio FetchService
import { AuthService } from '../../servicios/auth.service'; // Importa el servicio AuthService
import { Router } from '@angular/router'; // Importa Router para la navegación de rutas
import { NgIf } from '@angular/common'; // Importa NgIf para directivas de Angular
import { CommonModule } from '@angular/common'; // Importa CommonModule para directivas comunes de Angular
import { CRUDUsuariosService } from '../../servicios/crud-usuarios.service'; // Importa el servicio CRUDUsuariosService
import GetPedidosService from '../../servicios/pedidos/get-pedidos.service'; // Importa el servicio GetPedidosService
import { GetProductosService } from '../../servicios/productos/get-productos.service'; // Importa el servicio GetProductosService
import { GetDetallePedidosService } from '../../servicios/pedidos/get-detalle-pedidos.service'; // Importa el servicio GetDetallePedidosService
import { CarritoService } from '../../servicios/carrito-service.service'; // Importa el servicio CarritoService
import { determinant } from 'ol/transform';

@Component({
  selector: 'app-navbar', // Define el selector del componente, que se utiliza en el HTML
  standalone: true, // Indica que el componente es autónomo
  imports: [SearchComponent, NgIf, CommonModule], // Importa módulos y componentes necesarios
  templateUrl: './navbar.component.html', // Especifica la ubicación del archivo de plantilla HTML del componente
})
export class NavbarComponent implements OnInit {
  usuario = {
    nombre: '',
    foto: 'assets/default-user.png',
  }; // Define un objeto para almacenar los datos del usuario

  isDropdownOpen = false; // Define una propiedad para controlar el estado del menú desplegable
  private authservice: AuthService = inject(AuthService); // Inyecta el servicio AuthService
  private crudUsuarios: CRUDUsuariosService = inject(CRUDUsuariosService); // Inyecta el servicio CRUDUsuariosService
  private router: Router = inject(Router); // Inyecta el servicio Router
  carritoService: CarritoService = inject(CarritoService); // Inyecta el servicio CarritoService
  private getPedido: GetPedidosService = inject(GetPedidosService); // Inyecta el servicio GetPedidosService
  private getDetallePedido: GetDetallePedidosService = inject(
    GetDetallePedidosService,
  ); // Inyecta el servicio GetDetallePedidosService

  @Output() searchValueChange = new EventEmitter<string>(); // Define un EventEmitter para emitir el valor de búsqueda al componente padre

  constructor() {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const dropdownElement = (event.target as HTMLElement).closest('.relative');
    if (!dropdownElement) {
      this.isDropdownOpen = false;
    }
  } // Escucha clics en el documento para cerrar el menú desplegable si se hace clic fuera de él

  // Método que se ejecuta al inicializar el componente
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

  // Método para alternar el estado del menú desplegable
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Método para cerrar sesión
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['']);
    this.isDropdownOpen = false;
  }

  // Método para manejar el valor de búsqueda
  onSearchValue(value: string) {
    this.searchValueChange.emit(value);
  }
}
