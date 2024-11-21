import { inject, Injectable } from '@angular/core';
import { FetchService } from '../fetch.service';

@Injectable({
  providedIn: 'root'
})
export class CRUDdireccionesService {
  private apiService: FetchService = inject(FetchService);

  async getDireccionesByUserID(id_usuario: string) {
    try {
      const response = await this.apiService.get(
        `usuarios/direcciones/${id_usuario}`,
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  constructor() { }
}
