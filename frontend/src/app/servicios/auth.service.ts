import { inject, Injectable } from '@angular/core';
import { FetchService } from './fetch.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiSerivce: FetchService = inject(FetchService);
  async login(body: string) {
    try {
      const response = await this.apiSerivce.post('auth/login', body);
      localStorage.setItem('token', response.token);
    } catch (error) {
      console.log(error);
    }
  }

  async registro(body: string): Promise<any> {
    try {
      const response = await this.apiSerivce.post('usuarios/', body);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  isValidUser(): boolean {
    return !!localStorage.getItem('token');
  }
  isAdmin(): boolean {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const admin = JSON.parse(atob(token.split('.')[1]));
        return admin.isAdmin === true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  getUserId() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const user = JSON.parse(atob(token.split('.')[1]));
        return user.id;
      }
      return undefined;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }
  constructor() {}
}
