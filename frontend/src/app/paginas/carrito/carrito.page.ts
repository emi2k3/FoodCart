import { Component, OnInit, inject } from '@angular/core'; // Importa las funciones Component, OnInit e inject de Angular
import { CarritoService } from '../../servicios/carrito-service.service'; // Importa el servicio CarritoService
import { AuthService } from '../../servicios/auth.service'; // Importa el servicio AuthService
import { NavbarComponent } from '../../componentes/navbar/navbar.component'; // Importa el componente NavbarComponent
import { NgFor, NgIf } from '@angular/common'; // Importa las directivas NgFor y NgIf de Angular
import { FooterComponent } from '../../componentes/footer/footer.component'; // Importa el componente FooterComponent
import { GetDetallePedidosService } from '../../servicios/pedidos/get-detalle-pedidos.service'; // Importa el servicio GetDetallePedidosService
import GetPedidosService from '../../servicios/pedidos/get-pedidos.service'; // Importa el servicio GetPedidosService
import { GetProductosService } from '../../servicios/productos/get-productos.service'; // Importa el servicio GetProductosService
import { Router } from '@angular/router'; // Importa Router para la navegación de rutas
import { PutPedidoService } from '../../servicios/pedidos/put-pedido.service'; // Importa el servicio PutPedidoService

@Component({
  selector: 'app-carrito', // Define el selector del componente, que se utiliza en el HTML
  standalone: true, // Indica que el componente es autónomo
  imports: [NavbarComponent, NgFor], // Importa componentes necesarios
  templateUrl: './carrito.page.html', // Especifica la ubicación del archivo de plantilla HTML del componente
})
export class CarritoPage implements OnInit {
  // Inyecta los servicios utilizando la función inject
  private detallePedidoService: GetDetallePedidosService = inject(
    GetDetallePedidosService,
  );
  private getUserService: AuthService = inject(AuthService);
  private pedidoUsuario: GetPedidosService = inject(GetPedidosService);
  private cargarProducto: GetProductosService = inject(GetProductosService);
  private carritoService: CarritoService = inject(CarritoService);
  private router: Router = inject(Router);
  private putPedido: PutPedidoService = inject(PutPedidoService);

  // Variables para almacenar los datos del carrito
  userId: number = this.getUserService.getUserId();
  subTotal: number[] = [];
  id_pedido: number = 0;
  productosPedido: any[] = [];
  productos: any[] = [];
  pedidoaConfirmar: any;

  constructor() {}

  // Método que se ejecuta al inicializar el componente
  ngOnInit() {
    this.cargarProductosDelCarrito();
  }

  // Método para cargar los productos del carrito
  async cargarProductosDelCarrito() {
    const pedidosUsuarioFiltrado = await this.pedidoUsuario.getPedidoById(
      this.userId.toString(),
    );

    const pedidoPendiente = pedidosUsuarioFiltrado.filter((pedido: any) =>
      ['PENDIENTE'].includes(pedido.estado),
    );

    this.id_pedido = pedidoPendiente[0].id_pedido;
    this.pedidoaConfirmar = pedidoPendiente[0];

    const productosPedido =
      await this.detallePedidoService.getDetallePedidoByID(
        this.id_pedido.toString(),
      );

    const productosLista = productosPedido.map(
      async (detalle: { id_producto: string; cantidad: number }) => {
        const producto = await this.cargarProducto.getProductoById(
          detalle.id_producto,
        );
        return {
          ...producto,
          cantidad: detalle.cantidad,
        };
      },
    );

    this.productos = await Promise.all(productosLista);
  }

  // Método para disminuir la cantidad de un producto
  decreaseQuantity(producto: any): void {
    if (producto.cantidad > 1) {
      producto.cantidad--;
    }
  }

  // Método para aumentar la cantidad de un producto
  increaseQuantity(producto: any): void {
    producto.cantidad++;
  }

  // Método para obtener la cantidad de un producto por su ID
  getCantidad(id_producto: string) {
    const producto = this.productosPedido.find(
      (producto) => producto.id_producto == id_producto,
    );
    return producto.cantidad;
  }

  // Método para calcular el total del carrito
  getTotal(): number {
    return this.productos.reduce((total, producto) => {
      return total + producto.precio_unidad * producto.cantidad;
    }, 0);
  }

  // Método para ver los detalles de un producto
  onDetalles(idProducto: string) {
    this.router.navigate(['producto/detalles/'], {
      queryParams: { id: idProducto },
    });
  }

  // Método para confirmar la eliminación de un producto del carrito
  confirmarEliminacion(id_producto: string): void {
    const confirmacion = window.confirm(
      '¿Estás seguro de que deseas eliminar este producto del carrito?',
    );
    if (confirmacion) {
      this.eliminarDetallePedido(id_producto);
    }
  }

  // Método para eliminar un producto del carrito
  async eliminarDetallePedido(id_producto: string): Promise<void> {
    try {
      await this.carritoService.eliminarDetallePedido(
        this.id_pedido.toString(),
        id_producto,
      );
    } catch (error) {
      console.error('Error eliminando el producto:', error);
    }
    await this.cargarProductosDelCarrito();
  }

  // Método para confirmar el pedido
  onConfirmar() {
    this.pedidoaConfirmar.estado = 'CONFIRMADO';
    this.pedidoaConfirmar.importe_total = this.getTotal();
    this.putPedido.put(
      JSON.stringify(this.pedidoaConfirmar),
      this.id_pedido.toString(),
    );
    this.router.navigate(['/pedidos/ver']);
  }
}
