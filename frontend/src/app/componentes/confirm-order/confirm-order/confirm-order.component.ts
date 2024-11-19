import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../servicios/auth.service';
import { GetDetallePedidosService } from '../../../servicios/pedidos/get-detalle-pedidos.service';
import GetPedidosService from '../../../servicios/pedidos/get-pedidos.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'confirm-order',
  templateUrl: './confirm-order.component.html',
  standalone: true,
  imports: [NgIf],
})
export class ConfirmOrderComponent {
  authService: AuthService = inject(AuthService);
  getDetallePedido: GetDetallePedidosService = inject(GetDetallePedidosService);
  getPedidoService: GetPedidosService = inject(GetPedidosService);


  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  userId: string = this.authService.getUserId();
  quantity: number = 1;
  note: string = '';
  id_pedido: number = 9;


  async addToCart() {

    this.closeModal.emit();
  }

  close() {
    this.closeModal.emit();
    this.quantity = 1;
    this.note = '';
  }
  constructor() { }

}
