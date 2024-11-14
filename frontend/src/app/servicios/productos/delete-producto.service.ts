import { inject, Injectable } from '@angular/core';
import { FetchService } from '../fetch.service';

@Injectable({
  providedIn: 'root',
})
export class DeleteProductoService {
  private fetchService: FetchService = inject(FetchService);

  async deleteProducto(id_producto: string) {
    try {
      await this.fetchService.delete(`productos/${id_producto}`);
    } catch (error) {
      console.log(error);
    }
  }
  constructor() {}
}
