import { Inject, Injectable } from '@angular/core';
import { FetchService } from '../fetch.service';

@Injectable({
  providedIn: 'root',
})
export class PostPedidosService {
  private fetchService: FetchService = Inject(FetchService);

  postProducto(body: string) {
    try {
      return this.fetchService.post('pedidos/', body);
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  constructor() {}
}
