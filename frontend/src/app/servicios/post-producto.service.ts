import { inject, Injectable } from '@angular/core';
import { FetchMultipartService } from './fetch-multipart.service';

@Injectable({
  providedIn: 'root'
})
export class PostProductoService {
  private fetchService: FetchMultipartService = inject(FetchMultipartService)
  post(body: FormData) {
    this.fetchService.post("productos/", body);
  }
  constructor() { }
}
