import { inject, Injectable } from '@angular/core';
import { FetchService } from './fetch.service';

@Injectable({
  providedIn: 'root',
})
export class GetProductosService {
  private apiService: FetchService = inject(FetchService);
  async getProductos() {
    const response = await this.apiService.get('/productos');
    if (response == undefined) {
      return undefined;
    }
    return response;
  }

  async getProductosByCategoria(id_categoria: string) {
    const response = await this.apiService.get(`/productos/${id_categoria}`);
    if (response == undefined) {
      return undefined;
    }
    return response;
  }
}
