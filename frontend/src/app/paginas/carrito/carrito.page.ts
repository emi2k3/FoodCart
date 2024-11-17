import { Component, OnInit, inject } from '@angular/core';
import { CarritoService } from '../../servicios/carrito-service.service';
import { AuthService } from '../../servicios/auth.service';
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { NgFor, NgIf } from '@angular/common';
import { FooterComponent } from '../../componentes/footer/footer.component';
import { GetDetallePedidosService } from '../../servicios/pedidos/get-detalle-pedidos.service';
import GetPedidosService from '../../servicios/pedidos/get-pedidos.service';
import { GetProductosService } from '../../servicios/productos/get-productos.service';
import { Router } from '@angular/router';
import { PutPedidoService } from '../../servicios/pedidos/put-pedido.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [NavbarComponent, NgFor],
  templateUrl: './carrito.page.html',
})
export class CarritoPage implements OnInit {
  private detallePedidoService: GetDetallePedidosService = inject(
    GetDetallePedidosService,
  );
  private getUserService: AuthService = inject(AuthService);
  private pedidoUsuario: GetPedidosService = inject(GetPedidosService);
  private cargarProducto: GetProductosService = inject(GetProductosService);
  private carritoService: CarritoService = inject(CarritoService);
  private router: Router = inject(Router);
  private putPedido: PutPedidoService = inject(PutPedidoService);

  userId: number = this.getUserService.getUserId();
  subTotal: number[] = [];
  id_pedido: number = 0;
  productosPedido: any[] = [];
  productos: any[] = [];
  pedidoaConfirmar: any;

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
    this.pedidoaConfirmar = pedidoPendiente[0];

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

  decreaseQuantity(producto: any): void {
    if (producto.cantidad > 1) {
      producto.cantidad--;
    }
  }

  increaseQuantity(producto: any): void {
    producto.cantidad++;
  }

  getCantidad(id_producto: string) {
    const producto = this.productosPedido.find(
      (producto) => producto.id_producto == id_producto,
    );
    return producto.cantidad;
  }

  getTotal(): number {
    return this.productos.reduce((total, producto) => {
      return total + producto.precio_unidad * producto.cantidad;
    }, 0);
  }

  onDetalles(idProducto: string) {
    this.router.navigate(['producto/detalles/'], {
      queryParams: { id: idProducto },
    });
  }

  confirmarEliminacion(id_producto: string): void {
    const confirmacion = window.confirm(
      '¿Estás seguro de que deseas eliminar este producto del carrito?',
    );
    if (confirmacion) {
      this.eliminarDetallePedido(id_producto);
    }
  }

  async eliminarDetallePedido(id_producto: string): Promise<void> {
    try {
      await this.carritoService.eliminarDetallePedido(
        this.id_pedido.toString(),
        id_producto,
      );
    } catch (error) {
      console.error('Error eliminando el producto:', error);
    }
    await this.cargarProductosDelCarrito();
  }

  onConfirmar() {
    this.pedidoaConfirmar.estado = 'CONFIRMADO';
    this.pedidoaConfirmar.importe_total = this.getTotal();
    this.putPedido.put(
      JSON.stringify(this.pedidoaConfirmar),
      this.id_pedido.toString(),
    );
    this.router.navigate(['/pedidos/ver']);
  }
}
