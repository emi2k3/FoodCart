import { Component, OnInit, inject } from '@angular/core';
import { CarritoService } from '../../servicios/carrito-service.service';
import { AuthService } from '../../servicios/auth.service';
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { NgFor, NgIf } from '@angular/common';
import { FooterComponent } from '../../componentes/footer/footer.component';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [FooterComponent, NavbarComponent, NgIf, NgFor],
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
    this.cargarProductosDelCarrito();
    this.isAdmin = this.authService.isAdmin();
  }

  cargarProductosDelCarrito() {
    this.productosEnCarrito = this.carritoService.obtenerProductos();
    console.log(
      'Productos en el carrito después de cargar:',
      this.productosEnCarrito,
    );
  }

  getTotal() {
    const total = this.productosEnCarrito.reduce((total, producto) => {
      const precio = parseFloat(producto.precio_unidad);
      console.log('Precio del producto:', precio);
      if (isNaN(precio)) {
        console.error(
          `Precio inválido para el producto ${producto.nombre}:`,
          producto.precio_unidad,
        );
        return total;
      }
      return total + precio * producto.cantidad;
    }, 0);
    console.log('Total del carrito:', total);
    return total.toFixed(2);
  }

  eliminarDelCarrito(idProducto: string) {
    this.carritoService.eliminarProducto(idProducto);
    this.cargarProductosDelCarrito();
  }
}
