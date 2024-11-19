import { inject, Injectable } from '@angular/core';
import { FetchService } from '../fetch.service';

@Injectable({
  providedIn: 'root',
})
export class GetDetallePedidosService {
  private apiService: FetchService = inject(FetchService);
  async getDetallePedidoByID(id_pedido: string) {
    try {
      const response = await this.apiService.get(
        `pedidos/detalle_pedidos/${id_pedido}`,
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  constructor() {}
}
