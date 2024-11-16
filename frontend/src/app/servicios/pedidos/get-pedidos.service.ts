import { inject, Injectable } from '@angular/core';
import { FetchService } from '../fetch.service';

@Injectable({
  providedIn: 'root',
})
export class GetPedidosService {
  private apiService: FetchService = inject(FetchService);

  async getPedidoById(id_usuario: string) {
    try {
      const response = await this.apiService.get(
        `pedidos/usuario/${id_usuario}`,
      );
      return response;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
  async getAllPedidos() {
    try {
      const response = await this.apiService.get(`pedidos/`);
      return response;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
  constructor() { }
}

export default GetPedidosService;
