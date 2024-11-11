import { Component, inject } from '@angular/core';
import { GetProductosService } from '../../servicios/get-productos.service';
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'bebidas',
  standalone: true,
  imports: [NavbarComponent, NgFor],
  templateUrl: './bebidas.page.html',
  styleUrl: './bebidas.page.css',
})
export class BebidasPage {
  bebidas: any[] = [];
  productosFiltrados: any[] = [];

  private cargarTabla: GetProductosService = inject(GetProductosService);
  private router: Router = inject(Router);
  ngOnInit(): void {
    this.cargarTabla.getProductosByCategoria('2').then((data) => {
      console.log(data);
      this.bebidas = data;
      this.productosFiltrados = data;
    });
  }

  actualizarFiltroDeProductos(searchValue: string) {
    this.productosFiltrados = this.bebidas.filter((bebida) =>
      bebida.nombre.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }
  onDetalles(idProducto: string) {
    this.router.navigate(['producto/detalles/'], { queryParams: { id: idProducto } })
  }
}
