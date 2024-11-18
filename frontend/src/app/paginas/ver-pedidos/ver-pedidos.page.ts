import { Component, inject, OnInit, signal } from '@angular/core';
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { AuthService } from '../../servicios/auth.service';
import { GetPedidosService } from '../../servicios/pedidos/get-pedidos.service';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { GetDetallePedidosService } from '../../servicios/pedidos/get-detalle-pedidos.service';
import { PutPedidoService } from '../../servicios/pedidos/put-pedido.service';
import { WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/webSocket';

@Component({
  selector: 'app-ver-pedidos',
  templateUrl: './ver-pedidos.page.html',
  standalone: true,
  imports: [NavbarComponent, NgFor, NgIf],
})
export class VerPedidosPage implements OnInit {
  pedidos = signal<any[]>([]);
  detalle_pedidos: any[] = [];
  isAdmin: boolean = false;
  authService: AuthService = inject(AuthService);
  getPedidos: GetPedidosService = inject(GetPedidosService);
  getDetalle_Pedido: GetDetallePedidosService = inject(
    GetDetallePedidosService,
  );
  putPedido: PutPedidoService = inject(PutPedidoService);
  router: Router = inject(Router);
  private wsSubject: WebSocketSubject<string>;

  constructor() {
    const config: WebSocketSubjectConfig<string> = {
      url: 'wss://localhost/backend/websocket',
      deserializer: (event: MessageEvent) => event.data,
    };

    this.wsSubject = new WebSocketSubject(config);

    this.wsSubject.subscribe(
      (message) => {
        if (message === 'Actualizacion_pedido') {
          this.cargarPedidos();
        }
      }
    );
  }


  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    if (this.isAdmin == false) {
      const token = localStorage.getItem('token');
      if (token) {
        const idusuario = JSON.parse(atob(token.split('.')[1]));
        this.cargarPedidosbyID(idusuario.id);
      }
    } else {
      this.cargarPedidos();
    }
  }

  async cargarPedidos() {
    let pedidossinfiltrar = await this.getPedidos.getAllPedidos();
    this.pedidos.set(pedidossinfiltrar.filter(
      (pedido: any) =>
        !['PENDIENTE', 'ENTREGADO', 'CANCELADO'].includes(pedido.estado),
    ));
  }
  async cargarPedidosbyID(id_usuario: string) {
    let pedidossinfiltrar = await this.getPedidos.getPedidoById(id_usuario);

    this.pedidos.set(pedidossinfiltrar.filter(
      (pedido: any) =>
        !['PENDIENTE', 'ENTREGADO', 'CANCELADO'].includes(pedido.estado),
    ));
  }
  onChange(pedido: any, Eventochange: Event) {
    const Elemento = Eventochange.target as HTMLSelectElement;
    const estado = Elemento.value;
    pedido.estado = estado;
    this.putPedido.put(JSON.stringify(pedido), pedido.id_pedido);
  }
  verDetalles(id_pedido: string) {
    this.router.navigate(['pedidos/detalles/'], {
      queryParams: { id: id_pedido },
    });
  }
}
