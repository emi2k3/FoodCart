import { Component, inject, OnInit } from '@angular/core';
import { CarritoService } from '../../servicios/carrito-service.service'; // Importa el servicio de carrito
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { GetProductosService } from '../../servicios/productos/get-productos.service';
import { NgFor, NgIf } from '@angular/common';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'inicio',
  standalone: true,
  imports: [NavbarComponent, NgFor, NgIf],
  templateUrl: './inicio.page.html',
  styleUrl: './inicio.page.css',
})
export class InicioPage implements OnInit {
  productos: any[] = [];
  private cargarTabla: GetProductosService = inject(GetProductosService);
  private authService: AuthService = inject(AuthService);
  private carritoService: CarritoService = inject(CarritoService); // Inyecta el servicio de carrito
  isAdmin: boolean = false;
  agregarAlCarrito(producto: any) {
    console.log('Producto agregado al carrito:', producto); // Log para verificar el producto agregado
    this.carritoService.agregarProducto(producto);
    console.log(
      'Estado del carrito tras agregar producto:',
      this.carritoService.obtenerProductos(),
    ); // Log para verificar estado del carrito
  }
  productosFiltrados: any[] = [];
  private router: Router = inject(Router);

  ngOnInit(): void {
    this.cargarTabla.getProductos().then((data) => {
      this.productos = data;
      this.productosFiltrados = data;
      this.isAdmin = this.authService.isAdmin();
    });
  }
  actualizarFiltroDeProductos(searchValue: string) {
    this.productosFiltrados = this.productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }
  onDetalles(idProducto: string) {
    this.router.navigate(['producto/detalles/'], {
      queryParams: { id: idProducto },
    });
  }
}
