import { inject, Injectable, signal } from '@angular/core';
import { FetchService } from './fetch.service';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private fetchService: FetchService = inject(FetchService);

  // Para el signal del numero de productos del carrito

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

  // #####################################

  async eliminarDetallePedido(idPedido: string, idProducto: string) {
    try {
      await this.fetchService.delete(
        `pedidos/detalle_pedidos/${idPedido}/${idProducto}`,
      );
    } catch (error) {
      console.log(error);
    }
  }
}
