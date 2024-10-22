import { inject, Injectable } from '@angular/core';
import { FetchService } from './fetch.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiSerivce: FetchService = inject(FetchService);
  async Login(body: string) {
    const response = await this.apiSerivce.post('auth/login', body);
    if (response == undefined) {
      return false;
    }
    localStorage.setItem('token', response.token);
    return true;
  }
  Logut() {
    localStorage.removeItem('token');
  }
  isValidUser(): boolean {
    return !!localStorage.getItem('token');
  }
  constructor() {}
}
