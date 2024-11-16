import { inject, Injectable } from '@angular/core';
import { FetchService } from '../fetch.service';

@Injectable({
  providedIn: 'root',
})
export class PostDetallePedidoService {
  private fetchService: FetchService = inject(FetchService);

  postDetallePedido(body: string) {
    try {
      return this.fetchService.post('pedidos/detalle_pedidos', body);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  constructor() {}
}
