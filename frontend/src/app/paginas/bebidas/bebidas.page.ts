import { CarritoService } from '../../servicios/carrito-service.service';
import { Component, inject, OnInit } from '@angular/core';
import { GetProductosService } from '../../servicios/productos/get-productos.service';
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { DeleteProductoService } from '../../servicios/productos/delete-producto.service';
import { Producto } from '../../interfaces/producto';

@Component({
  selector: 'bebidas',
  standalone: true,
  imports: [NavbarComponent, NgFor, NgIf, RouterLink],
  templateUrl: './bebidas.page.html',
  styleUrl: './bebidas.page.css',
})
export class BebidasPage implements OnInit {
  bebidas: Producto[] = [];
  productosFiltrados: Producto[] = [];
  isAdmin: boolean = false;
  authService: AuthService = inject(AuthService);
  private cargarTabla: GetProductosService = inject(GetProductosService);
  private router: Router = inject(Router);
  private carritoService: CarritoService = inject(CarritoService); // Inyecta el servicio de carrito
  private deleteProduct: DeleteProductoService = inject(DeleteProductoService);

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargarTabla.getProductosByCategoria('2').then((data) => {
      this.bebidas = data;
      this.productosFiltrados = data;
      this.isAdmin = this.authService.isAdmin();
    });
  }

  actualizarFiltroDeProductos(searchValue: string) {
    this.productosFiltrados = this.bebidas.filter((bebidas) =>
      bebidas.nombre.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }
  // Método para agregar al carrito
  agregarAlCarrito(producto: any) {
    this.carritoService.agregarProducto(producto);
  }
  onDetalles(idProducto: string) {
    this.router.navigate(['producto/detalles/'], {
      queryParams: { id: idProducto },
    });
  }

  confirmarEliminacion(productoId: string): void {
    console.log(productoId);
    const confirmacion = window.confirm(
      '¿Estás seguro de que deseas eliminar este producto?',
    );
    if (confirmacion) {
      this.eliminarProducto(productoId);
    }
  }

  async eliminarProducto(productoId: string): Promise<void> {
    try {
      await this.deleteProduct.deleteProducto(productoId);
      this.cargarProductos();
    } catch (error) {
      console.error('Error eliminando el producto:', error);
    }

  }

  onCreate() {
    this.router.navigate(['productos/ingresar'])
  }
}
