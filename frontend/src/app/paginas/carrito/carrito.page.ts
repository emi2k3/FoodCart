import { Component, OnInit, inject } from '@angular/core';
import { CarritoService } from '../../servicios/carrito-service.service';
import { AuthService } from '../../servicios/auth.service';
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [NavbarComponent, NgIf, NgFor],
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {
  productosEnCarrito: any[] = [];
  private carritoService: CarritoService = inject(CarritoService);
  private authService: AuthService = inject(AuthService);
  isAdmin: boolean = false;

  constructor() {}

  ngOnInit() {
    this.productosEnCarrito = this.carritoService.obtenerProductos();
    this.isAdmin = this.authService.isAdmin();
  }

  // Método para calcular el total
  getTotal() {
    return this.productosEnCarrito.reduce(
      (total, producto) => total + producto.precio * producto.cantidad,
      0,
    );
  }

  // Método para eliminar un producto del carrito
  eliminarDelCarrito(idProducto: string) {
    this.carritoService.eliminarProducto(idProducto);
    this.productosEnCarrito = this.carritoService.obtenerProductos();
  }
}
