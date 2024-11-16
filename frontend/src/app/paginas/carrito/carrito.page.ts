import { Component, OnInit, inject } from '@angular/core';
import { CarritoService } from '../../servicios/carrito-service.service';
import { AuthService } from '../../servicios/auth.service';
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { NgFor, NgIf } from '@angular/common';
import { FooterComponent } from '../../componentes/footer/footer.component';
import { GetDetallePedidosService } from '../../servicios/pedidos/get-detalle-pedidos.service';
import GetPedidosService from '../../servicios/pedidos/get-pedidos.service';
import { GetProductosService } from '../../servicios/productos/get-productos.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [FooterComponent, NavbarComponent, NgFor],
  templateUrl: './carrito.page.html',
})
export class CarritoPage implements OnInit {
  private detallePedidoService: GetDetallePedidosService = inject(
    GetDetallePedidosService,
  );
  private getUserService: AuthService = inject(AuthService);
  private pedidoUsuario: GetPedidosService = inject(GetPedidosService);
  private cargarProducto: GetProductosService = inject(GetProductosService);

  userId: number = this.getUserService.getUserId();
  subTotal: number[] = [];
  id_pedido: number = 0;
  productosPedido: any[] = [];
  productos: any[] = [];

  constructor() {}

  ngOnInit() {
    this.cargarProductosDelCarrito();
  }

  async cargarProductosDelCarrito() {
    const pedidosUsuarioFiltrado = await this.pedidoUsuario.getPedidoById(
      this.userId.toString(),
    );

    const pedidoPendiente = pedidosUsuarioFiltrado.filter((pedido: any) =>
      ['PENDIENTE'].includes(pedido.estado),
    );

    this.id_pedido = pedidoPendiente[0].id_pedido;

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

  getCantidad(id_producto: string) {
    console.log('id producto' + id_producto);
    const producto = this.productosPedido.find(
      (producto) => producto.id_producto == id_producto,
    );
    return producto.cantidad;
  }

  getTotal() {}

  eliminarDelCarrito(idProducto: string) {}
}
