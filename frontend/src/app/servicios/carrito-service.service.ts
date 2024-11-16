import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private productosEnCarrito: any[] = this.cargarCarrito();

  cartCount = signal(0);

  incrementCart() {
    this.cartCount.update((count) => count + 1);
  }

  decrementCart() {
    this.cartCount.update((count) => Math.max(0, count - 1));
  }

  setCartCount(count: number) {
    this.cartCount.set(count);
  }

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
