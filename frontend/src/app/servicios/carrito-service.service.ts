import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private productosEnCarrito: any[] = [];

  agregarProducto(producto: any) {
    const productoExistente = this.productosEnCarrito.find(
      (p) => p.id === producto.id,
    );
    if (productoExistente) {
      productoExistente.cantidad += 1;
    } else {
      this.productosEnCarrito.push({ ...producto, cantidad: 1 });
    }
  }

  obtenerProductos() {
    return this.productosEnCarrito;
  }

  eliminarProducto(idProducto: string) {
    this.productosEnCarrito = this.productosEnCarrito.filter(
      (producto) => producto.id !== idProducto,
    );
  }
}
