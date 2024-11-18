import { Component, inject, OnInit } from '@angular/core'; // Importa las funciones Component, inject y OnInit de Angular
import { NavbarComponent } from '../../componentes/navbar/navbar.component'; // Importa el componente NavbarComponent
import { AuthService } from '../../servicios/auth.service'; // Importa el servicio AuthService
import { GetPedidosService } from '../../servicios/pedidos/get-pedidos.service'; // Importa el servicio GetPedidosService
import { FooterComponent } from '../../componentes/footer/footer.component'; // Importa el componente FooterComponent
import { Router } from '@angular/router'; // Importa Router para la navegación de rutas
import { NgFor, NgIf } from '@angular/common'; // Importa NgFor y NgIf para directivas de Angular
import { GetDetallePedidosService } from '../../servicios/pedidos/get-detalle-pedidos.service'; // Importa el servicio GetDetallePedidosService
import { PutPedidoService } from '../../servicios/pedidos/put-pedido.service'; // Importa el servicio PutPedidoService

@Component({
  selector: 'app-ver-pedidos', // Define el selector del componente, que se utiliza en el HTML
  templateUrl: './ver-pedidos.page.html', // Especifica la ubicación del archivo de plantilla HTML del componente
  standalone: true, // Indica que el componente es autónomo
  imports: [NavbarComponent, NgFor, NgIf], // Importa componentes y directivas necesarias
})
export class VerPedidosPage implements OnInit {
  pedidos: any[] = []; // Define un array para almacenar los pedidos
  detalle_pedidos: any[] = []; // Define un array para almacenar los detalles de los pedidos
  isAdmin: boolean = false; // Define una propiedad para verificar si el usuario es administrador
  authService: AuthService = inject(AuthService); // Inyecta el servicio AuthService
  getPedidos: GetPedidosService = inject(GetPedidosService); // Inyecta el servicio GetPedidosService
  getDetalle_Pedido: GetDetallePedidosService = inject(
    GetDetallePedidosService,
  ); // Inyecta el servicio GetDetallePedidosService
  putPedido: PutPedidoService = inject(PutPedidoService); // Inyecta el servicio PutPedidoService
  router: Router = inject(Router); // Inyecta la clase Router

  // Constructor del componente
  constructor() {}

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin(); // Verifica si el usuario es administrador
    if (this.isAdmin == false) {
      const token = localStorage.getItem('token');
      if (token) {
        const idusuario = JSON.parse(atob(token.split('.')[1]));
        this.cargarPedidosbyID(idusuario.id); // Carga los pedidos por ID de usuario si el usuario no es administrador
      }
    } else {
      this.cargarPedidos(); // Carga todos los pedidos si el usuario es administrador
    }
  }

  // Método para cargar todos los pedidos
  async cargarPedidos() {
    let pedidossinfiltrar = await this.getPedidos.getAllPedidos();
    this.pedidos = pedidossinfiltrar.filter(
      (pedido: any) =>
        !['PENDIENTE', 'ENTREGADO', 'CANCELADO'].includes(pedido.estado),
    );
  }

  // Método para cargar los pedidos por ID de usuario
  async cargarPedidosbyID(id_usuario: string) {
    let pedidossinfiltrar = await this.getPedidos.getPedidoById(id_usuario);
    this.pedidos = pedidossinfiltrar.filter(
      (pedido: any) =>
        !['PENDIENTE', 'ENTREGADO', 'CANCELADO'].includes(pedido.estado),
    );
  }

  // Método para manejar el cambio de estado del pedido
  onChange(pedido: any, Eventochange: Event) {
    const Elemento = Eventochange.target as HTMLSelectElement;
    const estado = Elemento.value;
    pedido.estado = estado;
    this.putPedido.put(JSON.stringify(pedido), pedido.id_pedido); // Actualiza el estado del pedido
  }

  // Método para ver los detalles del pedido
  verDetalles(id_pedido: string) {
    this.router.navigate(['pedidos/detalles/'], {
      queryParams: { id: id_pedido },
    });
  }
}
