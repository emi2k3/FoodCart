import { inject, Injectable } from '@angular/core';
import { FetchService } from './fetch.service';

@Injectable({
  providedIn: 'root'
})
export class CRUDUsuariosService {
  private apiService: FetchService = inject(FetchService);
  async getUserById(id_usuario: string) {
    try {
      const response = await this.apiService.get(`usuarios/_id_usuario/${id_usuario}`);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
  constructor() { }
}
