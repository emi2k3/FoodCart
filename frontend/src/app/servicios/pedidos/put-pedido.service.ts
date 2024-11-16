import { inject, Injectable } from '@angular/core';
import { FetchService } from '../fetch.service';

@Injectable({
  providedIn: 'root'
})
export class PutPedidoService {
  private fetchService: FetchService = inject(FetchService);
  put(body: string, id_pedido: string) {
    try {
      return this.fetchService.put(`pedidos/${id_pedido}`, body);
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  constructor() { }
}
