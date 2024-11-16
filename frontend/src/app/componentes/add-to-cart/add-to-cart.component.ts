import { NgIf } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  Inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';
import GetPedidosService from '../../servicios/pedidos/get-pedidos.service';
import { PostPedidosService } from '../../servicios/pedidos/post-pedidos.service';
import { PostDetallePedidoService } from '../../servicios/pedidos/post-detalle-pedido.service';
import { CarritoService } from '../../servicios/carrito-service.service';
import { GetDetallePedidosService } from '../../servicios/pedidos/get-detalle-pedidos.service';

@Component({
  selector: 'add-to-cart',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './add-to-cart.component.html',
})
export class AddToCartComponent {
  carritoService: CarritoService = inject(CarritoService);
  authService: AuthService = inject(AuthService);
  getDetallePedido: GetDetallePedidosService = inject(GetDetallePedidosService);
  getPedidoService: GetPedidosService = inject(GetPedidosService);
  postPedido: PostPedidosService = inject(PostPedidosService);
  postDetallePedido: PostDetallePedidoService = inject(
    PostDetallePedidoService,
  );

  @Input() product: any;
  @Input() isOpen: boolean = false;
  @Input() showNote: boolean = true;
  @Output() closeModal = new EventEmitter<void>();

  userId: string = this.authService.getUserId();
  quantity: number = 1;
  note: string = '';
  id_pedido: number = 9;

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

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
      console.log("ACA LLEGO1");
      if (pedidoPendiente.length > 0) {
        detallePedido.id_pedido = pedidoPendiente[0].id_pedido;
        const detalle = await this.postDetallePedido.postDetallePedido(
          JSON.stringify(detallePedido),
        );
        console.log("ACA LLEGO2");
        const detalleActualizado =
          await this.getDetallePedido.getDetallePedidoByID(
            pedidoPendiente[0].id_pedido,
          );
        this.carritoService.setCartCount(detalleActualizado.length);
      } else {
        console.log("ACA LLEGO3");
        const pedido = {
          estado: 'PENDIENTE',
          importe_total: 0,
          id_local: 1,
          id_usuario: parseInt(this.userId),
        };
        console.log("ACA LLEGO4");

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
    this.closeModal.emit();
  }

  close() {
    this.closeModal.emit();
    this.quantity = 1;
    this.note = '';
  }
}
