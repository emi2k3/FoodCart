import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FetchService {
  readonly baseurl = 'https://localhost/backend/';

  private getHeaders(): HeadersInit {
    if (localStorage.getItem('token')) {
      return {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-type': 'application/json',
      };
    } else {
      return {
        'Content-type': 'application/json',
      };
    }
  }

  async post<T = any>(url: string, body: string): Promise<T> {
    console.log(body);
    try {
      const response = await fetch(`${this.baseurl}${url}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: body,
      });
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json(); //Por si es un objeto.
      } else {
        data = await response.text(); //Cualquier otro mensaje.
      }
      if (response.ok) {
        return data;
      } else if (response.status == 401) {
        throw new Error('Usuario no verificado.');
      } else {
        throw new Error(data);
      }
    } catch (error) {
      throw error;
    }
  }

  async get<T = any>(url: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseurl}${url}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json(); //Por si es un objeto.
      } else {
        data = await response.text(); //Cualquier otro mensaje.
      }
      if (response.ok) {
        return data;
      } else if (response.status == 401) {
        throw new Error('Usuario no verificado');
      } else {
        throw new Error(data);
      }
    } catch (error) {
      throw error;
    }
  }

  constructor() {}
}
