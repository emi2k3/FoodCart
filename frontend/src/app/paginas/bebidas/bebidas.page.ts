import { Component, inject, OnInit } from '@angular/core';
import { GetProductosService } from '../../servicios/get-productos.service';
import { CarritoService } from '../../servicios/carrito-service.service'; // Importa el servicio de carrito
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'bebidas',
  standalone: true,
  imports: [NavbarComponent, NgFor],
  templateUrl: './bebidas.page.html',
  styleUrl: './bebidas.page.css',
})
export class BebidasPage implements OnInit {
  bebidas: any[] = [];
  productosFiltrados: any[] = [];
  private cargarTabla: GetProductosService = inject(GetProductosService);
  private carritoService: CarritoService = inject(CarritoService); // Inyecta el servicio de carrito

  ngOnInit(): void {
    this.cargarTabla.getProductosByCategoria('2').then((data) => {
      this.bebidas = data;
      this.productosFiltrados = data;
    });
  }

  actualizarFiltroDeProductos(searchValue: string) {
    this.productosFiltrados = this.bebidas.filter((bebida) =>
      bebida.nombre.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }

  // Método para agregar al carrito
  agregarAlCarrito(bebida: any) {
    this.carritoService.agregarProducto(bebida);
  }
}
