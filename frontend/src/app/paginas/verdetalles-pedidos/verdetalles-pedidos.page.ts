import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { ActivatedRoute, Router } from '@angular/router';
import { GetDetallePedidosService } from '../../servicios/pedidos/get-detalle-pedidos.service';
import { GetProductosService } from '../../servicios/productos/get-productos.service';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-verdetalles-pedidos',
  templateUrl: './verdetalles-pedidos.page.html',
  standalone: true,
  imports: [NavbarComponent, NgFor, CommonModule],
})
export class VerdetallesPedidosPage implements OnInit {
  private cargarProducto: GetProductosService = inject(GetProductosService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  getDetalle_Pedido: GetDetallePedidosService = inject(
    GetDetallePedidosService,
  );

  detalle_pedidos: any[] = [];
  productos: any[] = [];
  constructor() { }
  getProducto(id_producto: string) {
    const producto = this.productos.find(
      (producto) => producto.id_producto == id_producto,
    );
    return producto.nombre;
  }

  async ngOnInit() {
    if (this.activatedRoute.snapshot.queryParams['id']) {
      this.detalle_pedidos = await this.getDetalle_Pedido.getDetallePedidoByID(
        this.activatedRoute.snapshot.queryParams['id'],
      );
      const productoslista = this.detalle_pedidos.map((detalle) =>
        this.cargarProducto.getProductoById(detalle.id_producto),
      );
      this.productos = await Promise.all(productoslista);
    } else {
      this.router.navigate(['']);
    }
  }
}
