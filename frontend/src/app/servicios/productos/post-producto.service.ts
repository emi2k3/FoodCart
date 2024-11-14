import { inject, Injectable } from '@angular/core';
import { FetchMultipartService } from '../fetch-multipart.service';

@Injectable({
  providedIn: 'root',
})
export class PostProductoService {
  private fetchMultipartService: FetchMultipartService = inject(
    FetchMultipartService,
  );
  postProducto(body: FormData) {
    try {
      return this.fetchMultipartService.post('productos/', body);
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  constructor() {}
}
