import { NgIf } from '@angular/common'; // Importa la directiva NgIf de Angular
import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  Inject,
} from '@angular/core'; // Importa las funciones necesarias de Angular
import { FormsModule } from '@angular/forms'; // Importa FormsModule para el manejo de formularios
import { AuthService } from '../../servicios/auth.service'; // Importa el servicio AuthService
import GetPedidosService from '../../servicios/pedidos/get-pedidos.service'; // Importa el servicio GetPedidosService
import { PostPedidosService } from '../../servicios/pedidos/post-pedidos.service'; // Importa el servicio PostPedidosService
import { PostDetallePedidoService } from '../../servicios/pedidos/post-detalle-pedido.service'; // Importa el servicio PostDetallePedidoService
import { CarritoService } from '../../servicios/carrito-service.service'; // Importa el servicio CarritoService
import { GetDetallePedidosService } from '../../servicios/pedidos/get-detalle-pedidos.service'; // Importa el servicio GetDetallePedidosService

@Component({
  selector: 'add-to-cart', // Define el selector del componente, que se utiliza en el HTML
  standalone: true, // Indica que el componente es autónomo
  imports: [NgIf, FormsModule], // Importa módulos necesarios
  templateUrl: './add-to-cart.component.html', // Especifica la ubicación del archivo de plantilla HTML del componente
})
export class AddToCartComponent {
  carritoService: CarritoService = inject(CarritoService); // Inyecta el servicio CarritoService
  authService: AuthService = inject(AuthService); // Inyecta el servicio AuthService
  getDetallePedido: GetDetallePedidosService = inject(GetDetallePedidosService); // Inyecta el servicio GetDetallePedidosService
  getPedidoService: GetPedidosService = inject(GetPedidosService); // Inyecta el servicio GetPedidosService
  postPedido: PostPedidosService = inject(PostPedidosService); // Inyecta el servicio PostPedidosService
  postDetallePedido: PostDetallePedidoService = inject(
    PostDetallePedidoService,
  ); // Inyecta el servicio PostDetallePedidoService

  @Input() product: any; // Define una propiedad de entrada para el producto
  @Input() isOpen: boolean = false; // Define una propiedad de entrada para el estado del modal
  @Input() showNote: boolean = true; // Define una propiedad de entrada para mostrar la nota
  @Output() closeModal = new EventEmitter<void>(); // Define un EventEmitter para emitir eventos de cierre del modal

  userId: string = this.authService.getUserId(); // Obtiene el ID del usuario del servicio AuthService
  quantity: number = 1; // Define la cantidad inicial del producto
  note: string = ''; // Define la nota inicial del producto
  id_pedido: number = 9; // Define un ID de pedido inicial (puede ser actualizado posteriormente)

  // Método para aumentar la cantidad del producto
  increaseQuantity() {
    this.quantity++;
  }

  // Método para disminuir la cantidad del producto
  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // Método asincrónico para agregar el producto al carrito
  async addToCart() {
    let detallePedido = {
      cantidad: this.quantity,
      indicaciones: this.note,
      id_pedido: this.id_pedido,
      id_producto: this.product.id_producto,
    };

    try {
      const pedidosUsuarioFiltrado = await this.getPedidoService.getPedidoById(
        this.userId,
      );

      const pedidoPendiente = pedidosUsuarioFiltrado.filter((pedido: any) =>
        ['PENDIENTE'].includes(pedido.estado),
      );
      console.log('ACA LLEGO1');
      if (pedidoPendiente.length > 0) {
        detallePedido.id_pedido = pedidoPendiente[0].id_pedido;
        const detalle = await this.postDetallePedido.postDetallePedido(
          JSON.stringify(detallePedido),
        );
        console.log('ACA LLEGO2');
        const detalleActualizado =
          await this.getDetallePedido.getDetallePedidoByID(
            pedidoPendiente[0].id_pedido,
          );
        this.carritoService.setCartCount(detalleActualizado.length);
      } else {
        console.log('ACA LLEGO3');
        const pedido = {
          estado: 'PENDIENTE',
          importe_total: 0,
          id_local: 1,
          id_usuario: parseInt(this.userId),
        };
        console.log('ACA LLEGO4');

        const respuesta = await this.postPedido.postPedido(
          JSON.stringify(pedido),
        );

        detallePedido.id_pedido = respuesta.id_pedido;
        const detalle = await this.postDetallePedido.postDetallePedido(
          JSON.stringify(detallePedido),
        );

        this.carritoService.setCartCount(1);
      }
    } catch (error) {
      console.log(error);
    }
    this.closeModal.emit(); // Emite el evento de cierre del modal
  }

  // Método para cerrar el modal
  close() {
    this.closeModal.emit(); // Emite el evento de cierre del modal
    this.quantity = 1; // Restablece la cantidad a 1
    this.note = ''; // Restablece la nota a una cadena vacía
  }
}
