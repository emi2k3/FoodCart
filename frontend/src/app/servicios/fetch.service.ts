import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FetchService {
  readonly baseurl = 'https://localhost/backend/';

  private getHeaders(method: string): HeadersInit {
    const headers: HeadersInit = {};

    if (localStorage.getItem('token')) {
      headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
    }

    if (method !== 'DELETE') {
      headers['Content-type'] = 'application/json';
    }

    return headers;
  }

  async post<T = any>(url: string, body: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseurl}${url}`, {
        method: 'POST',
        headers: this.getHeaders('POST'),
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
        headers: this.getHeaders('GET'),
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

  async delete<T = any>(url: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseurl}${url}`, {
        method: 'DELETE',
        headers: this.getHeaders('DELETE'),
      });
      return response.text() as T;
    } catch (error) {
      throw error;
    }
  }

  async put<T = any>(url: string, body: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseurl}${url}`, {
        method: 'PUT',
        headers: this.getHeaders('PUT'),
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
}
