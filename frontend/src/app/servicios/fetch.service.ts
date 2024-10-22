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

  async post<T = any>(url: string, body: string): Promise<T | undefined> {
    console.log(body);
    try {
      const response = await fetch(`${this.baseurl}${url}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: body,
      });
      const data = await response.json();
      if (response.ok) {
        return data;
      } else if (response.status == 401) {
        return undefined;
      } else {
        throw new Error(data);
      }
    } catch (error) {
      throw error;
    }
  }

  async get<T = any>(url: string): Promise<T | undefined> {
    try {
      const response = await fetch(`${this.baseurl}${url}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      const data = await response.json();
      if (response.ok) {
        return data;
      } else if (response.status == 401) {
        return undefined;
      } else {
        throw new Error(data);
      }
    } catch (error) {
      throw error;
    }
  }

  constructor() {}
}
