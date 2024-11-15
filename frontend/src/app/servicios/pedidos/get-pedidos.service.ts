import { inject, Injectable } from '@angular/core';
import { FetchService } from '../fetch.service';

@Injectable({
  providedIn: 'root'
})
export class GetPedidosService {
  private apiService: FetchService = inject(FetchService);
  async getPedidoById(id_usuario: string) {
    try {
      const response = await this.apiService.get(`pedidos/usuario/${id_usuario}`);
      let respuestaFiltrada = response.filter((pedido: any) => !["PENDIENTE", "ENTREGADO", "CANCELADO"].includes(pedido.estado));
      console.log(await respuestaFiltrada);
      return respuestaFiltrada;
    } catch (error) {
      console.log(error);
    }
  }
  async getAllPedidos() {
    try {
      const response = await this.apiService.get(`pedidos/`);;
      let respuestaFiltrada = response.filter((pedido: any) => !["PENDIENTE", "ENTREGADO", "CANCELADO"].includes(pedido.estado));

      return respuestaFiltrada;
    } catch (error) {
      console.log(error);
    }
  }
  constructor() { }
}
