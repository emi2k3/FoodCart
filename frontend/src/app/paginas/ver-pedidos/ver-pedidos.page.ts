import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { AuthService } from '../../servicios/auth.service';
import { GetPedidosService } from '../../servicios/pedidos/get-pedidos.service';

@Component({
  selector: 'app-ver-pedidos',
  templateUrl: './ver-pedidos.page.html',
  styleUrls: ['./ver-pedidos.page.scss'],
  standalone: true,
  imports: [NavbarComponent]
})
export class VerPedidosPage implements OnInit {
  pedidos: any[] = [];
  isAdmin: boolean = false;
  authService: AuthService = inject(AuthService);
  getPedidos: GetPedidosService = inject(GetPedidosService);
  constructor() { }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    if (this.isAdmin == false) {
      const token = localStorage.getItem('token');
      if (token) {
        const idusuario = JSON.parse(atob(token.split('.')[1]));
        this.cargarPedidosbyID(idusuario.id);
      }
    }
    else {
      this.cargarPedidos();
    }

  }

  async cargarPedidos() {
    this.pedidos = await this.getPedidos.getAllPedidos()
  }
  async cargarPedidosbyID(id_usuario: string) {
    this.pedidos = await this.getPedidos.getAllPedidos()
  }

}
