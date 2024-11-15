import { NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';
import GetPedidosService from '../../servicios/pedidos/get-pedidos.service';
import { PostPedidosService } from '../../servicios/pedidos/post-pedidos.service';

@Component({
  selector: 'add-to-cart',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './add-to-cart.component.html',
})
export class AddToCartComponent {
  authService: AuthService = inject(AuthService);
  getPedidoService: GetPedidosService = inject(GetPedidosService);
  postPedido: PostPedidosService = inject(PostPedidosService);

  @Input() product: any;
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  userId: string = this.authService.getUserId();
  quantity: number = 1;
  note: string = '';

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  async addToCart() {
    try {
      const respuestaFiltrada = await this.getPedidoService.getPedidoById(
        this.userId,
      );
      const pedidoPendiente = respuestaFiltrada.filter(
        (pedido: any) => pedido.estado === 'PENDIENTE',
      );

      if (pedidoPendiente.length > 0) {
        const pedidoId = pedidoPendiente[0].id;
        console.log(pedidoId);
      } else {
        const pedido = {
          estado: 'PENDIENTE',
          importe_total: 0,
          id_local: 1,
          id_usuario: parseInt(this.userId),
        };

        const respuesta = await this.postPedido.postPedido(
          JSON.stringify(pedido),
        );
        console.log('Pedido creado exitosamente:', respuesta);
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
