import { inject, Injectable } from '@angular/core';
import { FetchMultipartService } from './fetch-multipart.service';

@Injectable({
  providedIn: 'root',
})
export class PostProductoService {
  private fetchMultipartService: FetchMultipartService = inject(
    FetchMultipartService,
  );
  postProducto(body: FormData) {
    this.fetchMultipartService.post('productos/', body);
  }
  constructor() {}
}
