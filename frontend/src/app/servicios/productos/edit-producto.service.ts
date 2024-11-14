import { inject, Injectable } from '@angular/core';
import { FetchMultipartService } from '../fetch-multipart.service';

@Injectable({
  providedIn: 'root',
})
export class PutProductoService {
  private fetchMultipartService: FetchMultipartService = inject(
    FetchMultipartService,
  );
  putProducto(body: FormData, id_producto: string) {
    try {
      return this.fetchMultipartService.put(`productos/${id_producto}`, body);
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  constructor() {}
}
