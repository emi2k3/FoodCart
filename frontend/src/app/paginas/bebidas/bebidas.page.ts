import { CarritoService } from '../../servicios/carrito-service.service'; // Importa el servicio CarritoService
import { Component, inject, OnInit } from '@angular/core'; // Importa las funciones Component, inject y OnInit de Angular
import { GetProductosService } from '../../servicios/productos/get-productos.service'; // Importa el servicio GetProductosService
import { NavbarComponent } from '../../componentes/navbar/navbar.component'; // Importa el componente NavbarComponent
import { NgFor, NgIf } from '@angular/common'; // Importa las directivas NgFor y NgIf de Angular
import { Router, RouterLink } from '@angular/router'; // Importa Router y RouterLink para la navegación de rutas
import { AuthService } from '../../servicios/auth.service'; // Importa el servicio AuthService
import { DeleteProductoService } from '../../servicios/productos/delete-producto.service'; // Importa el servicio DeleteProductoService
import { Producto } from '../../interfaces/producto'; // Importa la interfaz Producto
import { FooterComponent } from '../../componentes/footer/footer.component'; // Importa el componente FooterComponent
import { AddToCartComponent } from '../../componentes/add-to-cart/add-to-cart.component'; // Importa el componente AddToCartComponent

@Component({
  selector: 'bebidas', // Define el selector del componente, que se utiliza en el HTML
  standalone: true, // Indica que el componente es autónomo
  imports: [
    NavbarComponent,
    NgFor,
    NgIf,
    RouterLink,
    AddToCartComponent,
    FooterComponent,
  ], // Importa componentes necesarios
  templateUrl: './bebidas.page.html', // Especifica la ubicación del archivo de plantilla HTML del componente
})
export class BebidasPage implements OnInit {
  bebidas: Producto[] = []; // Define un array para almacenar los productos de bebidas
  productosFiltrados: Producto[] = []; // Define un array para almacenar los productos filtrados
  isAdmin: boolean = false; // Define una propiedad para verificar si el usuario es administrador
  modalIsOpen: boolean = false; // Define una propiedad para controlar el estado del modal
  authService: AuthService = inject(AuthService); // Inyecta el servicio AuthService
  private cargarTabla: GetProductosService = inject(GetProductosService); // Inyecta el servicio GetProductosService
  private router: Router = inject(Router); // Inyecta la clase Router
  private carritoService: CarritoService = inject(CarritoService); // Inyecta el servicio CarritoService
  private deleteProduct: DeleteProductoService = inject(DeleteProductoService); // Inyecta el servicio DeleteProductoService

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.cargarProductos();
  }

  // Método para cargar los productos de bebidas
  cargarProductos(): void {
    this.cargarTabla.getProductosByCategoria('2').then((data) => {
      this.bebidas = data;
      this.productosFiltrados = data;
      this.isAdmin = this.authService.isAdmin();
    });
  }

  // Método para actualizar el filtro de productos
  actualizarFiltroDeProductos(searchValue: string) {
    this.productosFiltrados = this.bebidas.filter((bebida) =>
      bebida.nombre.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }

  // Método para agregar un producto al carrito
  agregarAlCarrito() {
    this.modalIsOpen = true;
  }

  // Método para cerrar el modal
  closeModal() {
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
