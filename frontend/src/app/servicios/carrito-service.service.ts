import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private productosEnCarrito: any[] = this.cargarCarrito();

  agregarProducto(producto: any) {
    const productoExistente = this.productosEnCarrito.find(
      (p) => p.id_producto === producto.id_producto,
    );
    if (productoExistente) {
      productoExistente.cantidad += 1;
      console.log('Cantidad del producto actualizada:', productoExistente);
    } else {
      this.productosEnCarrito.push({ ...producto, cantidad: 1 });
      console.log('Producto añadido al carrito:', producto);
    }
    this.guardarCarrito();
  }

  obtenerProductos() {
    console.log('Productos en el carrito:', this.productosEnCarrito);
    return this.productosEnCarrito;
  }

  eliminarProducto(idProducto: string) {
    this.productosEnCarrito = this.productosEnCarrito.filter(
      (producto) => producto.id_producto !== idProducto,
    );
    console.log('Producto eliminado del carrito:', idProducto);
    this.guardarCarrito();
  }

  private guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(this.productosEnCarrito));
  }

  private cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  }
}
