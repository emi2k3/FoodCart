import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-producto',
  templateUrl: './post-producto.page.html',
  styleUrls: ['./post-producto.page.scss'],
  imports: [FormsModule, NgIf, NgClass],
  standalone: true,
})
export class PostProductoPage {
  nombre: string = '';
  descripcion: string = '';
  precio_unidad: number = 0;
  categoria: string = '';
  foto: object = {};
  onSubmit() {
    console.log({
      nombre: this.nombre,
      descripcion: this.descripcion,
      precio_unidad: this.precio_unidad,
      categoria: this.categoria,
      foto: this.foto,
    });
  }
  constructor() {}
}
