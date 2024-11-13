import { inject, Injectable } from '@angular/core';
import { FetchService } from './fetch.service';
import { Producto } from '../interfaces/producto';

@Injectable({
  providedIn: 'root',
})
export class GetProductosService {
  private apiService: FetchService = inject(FetchService);

  async getProductos() {
    try {
      const response = await this.apiService.get('/productos');
      return response;
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return undefined;
    }
  }

  async getProductosByCategoria(id_categoria: string) {
    try {
      const response = await this.apiService.get(
        `/productos/categoria/${id_categoria}`,
      );
      return response;
    } catch (error) {
      console.error('Error al obtener productos por categoría:', error);
      return undefined;
    }
  }

  async getProductoById(id_producto: string) {
    try {
      const response = await this.apiService.get(`/productos/${id_producto}`);
      return response[0];
    } catch (error) {
      console.error('Error al obtener el producto por ID:', error);
      return undefined;
    }
  }
}
