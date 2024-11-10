import { Component, inject, OnInit } from '@angular/core';
import { GetProductosService } from '../../servicios/get-productos.service';
import { CarritoService } from '../../servicios/carrito-service.service'; // Importa el servicio de carrito
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { NgFor, NgIf } from '@angular/common';
import { AuthService } from '../../servicios/auth.service';

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

  ngOnInit(): void {
    this.cargarTabla
      .getProductos()
      .then((data) => {
        this.productos = data;
        this.isAdmin = this.authService.isAdmin();
      })
      .catch((error) => {
        console.error('Error al cargar productos:', error); // Log para capturar errores
      });
  }

  agregarAlCarrito(producto: any) {
    console.log('Producto agregado al carrito:', producto); // Log para verificar el producto agregado
    this.carritoService.agregarProducto(producto);
    console.log(
      'Estado del carrito tras agregar producto:',
      this.carritoService.obtenerProductos(),
    ); // Log para verificar estado del carrito
  }
}
