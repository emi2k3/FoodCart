import { inject, Injectable } from '@angular/core';
import { FetchService } from './fetch.service';

@Injectable({
  providedIn: 'root',
})
export class GetProductosService {
  private apiService: FetchService = inject(FetchService);
  async getProductos() {
    try {
      const response = await this.apiService.get('/productos');
      return response
    } catch (error) {
      console.log(error);
    }
  }

  async getProductosByCategoria(id_categoria: string) {
    try {
      const response = await this.apiService.get(`/productos/categoria/${id_categoria}`);
      return response;
    } catch (error) {
      console.log(error)
    }
  }

  async getProductosById(id_producto: string) {
    try {
      const response = await this.apiService.get(`/productos/${id_producto}`);
      return response;
    } catch (error) {
      console.log(error);
    }

  }
}
