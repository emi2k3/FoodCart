import { Component, OnInit, inject } from '@angular/core'; // Importa las funciones Component, OnInit e inject de Angular
import { CarritoService } from '../../servicios/carrito-service.service'; // Importa el servicio CarritoService
import { AuthService } from '../../servicios/auth.service'; // Importa el servicio AuthService
import { NavbarComponent } from '../../componentes/navbar/navbar.component'; // Importa el componente NavbarComponent
import { NgFor, NgIf } from '@angular/common'; // Importa las directivas NgFor y NgIf de Angular
import { FooterComponent } from '../../componentes/footer/footer.component'; // Importa el componente FooterComponent
import { GetDetallePedidosService } from '../../servicios/pedidos/get-detalle-pedidos.service'; // Importa el servicio GetDetallePedidosService
import GetPedidosService from '../../servicios/pedidos/get-pedidos.service'; // Importa el servicio GetPedidosService
import { GetProductosService } from '../../servicios/productos/get-productos.service'; // Importa el servicio GetProductosService
import { Router, RouterModule } from '@angular/router'; // Importa Router para la navegación de rutas
import { PutPedidoService } from '../../servicios/pedidos/put-pedido.service'; // Importa el servicio PutPedidoService
import { HttpErrorResponse } from '@angular/common/http';
import { Producto } from '../../interfaces/producto';
import { Pedido } from '../../interfaces/pedido';
import { AddToCartComponent } from '../../componentes/add-to-cart/add-to-cart.component';
import { ConfirmOrderComponent } from "../../componentes/confirm-order/confirm-order.component";


@Component({
  selector: 'app-carrito', // Define el selector del componente, que se utiliza en el HTML
  standalone: true, // Indica que el componente es autónomo
  imports: [NavbarComponent, NgFor, NgIf, AddToCartComponent, ConfirmOrderComponent], // Importa componentes necesarios
  templateUrl: './carrito.page.html', // Especifica la ubicación del archivo de plantilla HTML del componente

})
export class CarritoPage implements OnInit {
  // Inyecta los servicios utilizando la función inject
  private detallePedidoService: GetDetallePedidosService = inject(
    GetDetallePedidosService,
  );
  private getUserService: AuthService = inject(AuthService);
  private pedidoUsuario: GetPedidosService = inject(GetPedidosService);
  private carritoService: CarritoService = inject(CarritoService);
  private router: Router = inject(Router);


  // Variables para almacenar los datos del carrito
  userId: number = this.getUserService.getUserId();
  modalIsOpen: boolean = false;
  subTotal: number[] = [];
  id_pedido: number = 0;
  importe_total: number = 0;
  productosPedido: any[] = [];
  productos: any[] = [];
  pedidoaConfirmar: any;
  modalIsOpendir: boolean = false;
  actualizar: boolean = false;
  productoSeleccionado: any = null;

  constructor() { }

  // Método que se ejecuta al inicializar el componente
  ngOnInit() {
    this.cargarProductosDelCarrito();
  }

  // Método para cargar los productos del carrito
  async cargarProductosDelCarrito() {
    try {
      const pedidoUsuario = await this.pedidoUsuario.getPedidoById(
        this.userId.toString(),
      );

      if (pedidoUsuario.length > 0) {
        const pedidoPendiente = pedidoUsuario.find(
          (pedido: Pedido) => pedido.estado === 'PENDIENTE',
        );

        if (pedidoPendiente && pedidoPendiente.items) {
          this.id_pedido = pedidoPendiente.id_pedido;
          this.productos = pedidoPendiente.items.map((item: any) => ({
            id_producto: item.id_producto,
            nombre: item.producto,
            cantidad: item.cantidad,
            precio_unidad: item.precio_unidad,
            indicaciones: item.indicaciones,
          }));
          this.pedidoaConfirmar = pedidoPendiente;
          return;
        }
      }
      this.resetearEstadoCarrito();
    } catch (error) {
      console.error('Error al cargar el carrito:', error);
      this.resetearEstadoCarrito();
    }
  }

  async editarProducto(producto: any) {
    this.productoSeleccionado = producto;
    this.modalIsOpen = true;
    this.productoSeleccionado = {
      ...producto,
      cantidad: producto.cantidad,
      nota: producto.indicaciones,
    };
    this.actualizar = true;
  }

  private resetearEstadoCarrito() {
    this.productos = [];
    this.id_pedido = 0;
    this.pedidoaConfirmar = null;
  }

  closeModal() {
    this.productoSeleccionado = null;
    this.modalIsOpen = false;
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
    this.carritoService.decrementCart();
    await this.cargarProductosDelCarrito();
  }
  // Método para confirmar el pedido

  onConfirmar() {
    this.importe_total = this.getTotal();
    this.modalIsOpendir = true;
  }

  closeModalDir() {
    this.modalIsOpendir = false;
  }
  // onConfirmar() {
  //   this.pedidoaConfirmar.estado = 'CONFIRMADO';
  //   this.pedidoaConfirmar.importe_total = this.getTotal();
  //   this.putPedido.put(
  //     JSON.stringify(this.pedidoaConfirmar),
  //     this.id_pedido.toString(),
  //   );
  //   this.router.navigate(['/pedidos/ver']);
  // }
}
