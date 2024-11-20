import { Component, inject, OnInit } from '@angular/core'; // Importa las funciones Component, inject y OnInit de Angular
import { GetProductosService } from '../../servicios/productos/get-productos.service'; // Importa el servicio GetProductosService
import { NavbarComponent } from '../../componentes/navbar/navbar.component'; // Importa el componente NavbarComponent
import { NgFor, NgIf } from '@angular/common'; // Importa las directivas NgFor y NgIf de Angular
import { Router } from '@angular/router'; // Importa Router para la navegación de rutas
import { AuthService } from '../../servicios/auth.service'; // Importa el servicio AuthService
import { RouterLink } from '@angular/router'; // Importa RouterLink para el enlace de rutas
import { DeleteProductoService } from '../../servicios/productos/delete-producto.service'; // Importa el servicio DeleteProductoService
import { Producto } from '../../interfaces/producto'; // Importa la interfaz Producto
import { FooterComponent } from '../../componentes/footer/footer.component'; // Importa el componente FooterComponent
import { AddToCartComponent } from '../../componentes/add-to-cart/add-to-cart.component'; // Importa el componente AddToCartComponent
import { GetPedidosService } from '../../servicios/pedidos/get-pedidos.service'; // Importa el servicio GetPedidosService
import { GetDetallePedidosService } from '../../servicios/pedidos/get-detalle-pedidos.service';
import { Pedido, PedidoItem } from '../../interfaces/pedido';

@Component({
  selector: 'app-comidas', // Define el selector del componente, que se utiliza en el HTML
  standalone: true, // Indica que el componente es autónomo
  imports: [
    NavbarComponent,
    NgFor,
    RouterLink,
    NgIf,
    AddToCartComponent,
    FooterComponent,
  ], // Importa componentes necesarios
  templateUrl: './comidas.page.html', // Especifica la ubicación del archivo de plantilla HTML del componente
})
export class ComidasPage implements OnInit {
  productos: Producto[] = []; // Define un array para almacenar los productos
  productosFiltrados: Producto[] = []; // Define un array para almacenar los productos filtrados
  productoSeleccionado: any = null;
  isAdmin: boolean = false; // Define una propiedad para verificar si el usuario es administrador
  modalIsOpen: boolean = false; // Define una propiedad para controlar el estado del modal
  actualizar: boolean = false;
  authService: AuthService = inject(AuthService); // Inyecta el servicio AuthService
  getPedidoService: GetPedidosService = inject(GetPedidosService); // Inyecta el servicio GetPedidosService

  private cargarTabla: GetProductosService = inject(GetProductosService); // Inyecta el servicio GetProductosService
  private getDetallePedido: GetDetallePedidosService = inject(
    GetDetallePedidosService,
  );
  private router: Router = inject(Router); // Inyecta la clase Router
  private deleteProduct: DeleteProductoService = inject(DeleteProductoService); // Inyecta el servicio DeleteProductoService

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.cargarProductos();
  }

  // Método para cargar los productos
  cargarProductos(): void {
    this.cargarTabla.getProductosByCategoria('1').then((data) => {
      this.productos = data;
      this.productosFiltrados = data;
      this.isAdmin = this.authService.isAdmin();
    });
  }

  // Método para actualizar el filtro de productos
  actualizarFiltroDeProductos(searchValue: string) {
    this.productosFiltrados = this.productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }

  async agregarAlCarrito(producto: Producto) {
    this.productoSeleccionado = producto;
    console.log('este producto en comida page' + JSON.stringify(producto));
    try {
      const pedidosUsuario = await this.getPedidoService.getPedidoById(
        this.authService.getUserId(),
      );

      if (pedidosUsuario.length > 0) {
        const pedidoPendiente = pedidosUsuario.find(
          (pedido: Pedido) => pedido.estado === 'PENDIENTE',
        );
        console.log(
          'pedido pendiente' + JSON.stringify(pedidoPendiente, null, 2),
        );

        if (pedidoPendiente && pedidoPendiente.items) {
          const productoExistente = pedidoPendiente.items.find(
            (item: PedidoItem) => item.id_producto === producto.id_producto,
          );

          console.log(
            'producto existente ' + JSON.stringify(productoExistente),
          );
          if (productoExistente) {
            // Pasa los datos del producto existente al modal
            console.log('llega al true');
            this.modalIsOpen = true;
            this.productoSeleccionado = {
              ...producto,
              cantidad: productoExistente.cantidad,
              nota: productoExistente.indicaciones,
            };
            this.actualizar = true;
            return;
          }
        }
      }
      this.defaultAddToCart(producto);
    } catch (error) {
      console.error('Error al verificar el carrito:', error);
    }
  }

  defaultAddToCart(producto: Producto) {
    this.modalIsOpen = true;
    this.actualizar = false;
    this.productoSeleccionado = { ...producto, cantidad: 1, nota: '' };
  }

  // Método para cerrar el modal
  closeModal() {
    this.productoSeleccionado = null;
    this.modalIsOpen = false;
  }

  // Método para ver los detalles de un producto
  onDetalles(idProducto: string) {
    this.router.navigate(['producto/detalles/'], {
      queryParams: { id: idProducto },
    });
  }

  // Método para confirmar la eliminación de un producto
  confirmarEliminacion(productoId: string): void {
    const confirmacion = window.confirm(
      '¿Estás seguro de que deseas eliminar este producto?',
    );
    if (confirmacion) {
      this.eliminarProducto(productoId);
    }
  }

  // Método para eliminar un producto
  async eliminarProducto(productoId: string): Promise<void> {
    try {
      await this.deleteProduct.deleteProducto(productoId);
      this.cargarProductos();
    } catch (error) {
      console.error('Error eliminando el producto:', error);
    }
  }

  // Método para navegar a la página de creación de productos
  onCreate() {
    this.router.navigate(['productos/ingresar']);
  }
}
