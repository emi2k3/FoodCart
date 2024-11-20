import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { AuthService } from '../../../servicios/auth.service';
import { GetDetallePedidosService } from '../../../servicios/pedidos/get-detalle-pedidos.service';
import GetPedidosService from '../../../servicios/pedidos/get-pedidos.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'confirm-order',
  templateUrl: './confirm-order.component.html',
  standalone: true,
  imports: [NgIf, NgFor],
})
export class ConfirmOrderComponent {
  authService: AuthService = inject(AuthService);
  getDetallePedido: GetDetallePedidosService = inject(GetDetallePedidosService);
  getPedidoService: GetPedidosService = inject(GetPedidosService);
  direcciones = signal<any[]>([]);

  @Input() isOpen: boolean = false;
  @Input() id_pedido: Number = 0;
  @Output() closeModal = new EventEmitter<void>();

  userId: string = this.authService.getUserId();


  async addToCart() {

    this.closeModal.emit();
  }

  close() {
    this.closeModal.emit();

  }
  constructor() { }

}
