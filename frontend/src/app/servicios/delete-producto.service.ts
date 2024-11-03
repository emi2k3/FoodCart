import { inject, Injectable } from '@angular/core';
import { FetchService } from './fetch.service';

@Injectable({
  providedIn: 'root',
})
export class DeleteProductoService {
  private fetchService: FetchService = inject(FetchService);

  async deleteProducto(idproducto: string) {
    try {
      this.fetchService.delete('');
    } catch (error) {
      console.log(error);
    }
  }
  constructor() {}
}
