import { Component, inject } from '@angular/core';
import { GetProductosService } from '../../servicios/get-productos.service';
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-comidas',
  standalone: true,
  imports: [NavbarComponent, NgFor],
  templateUrl: './comidas.page.html',
  styleUrl: './comidas.page.css',
})
export class ComidasPage {
  productos: any[] = [];
  private cargarTabla: GetProductosService = inject(GetProductosService);
  ngOnInit(): void {
    this.cargarTabla.getProductosByCategoria('1').then((data) => {
      console.log(data);
      this.productos = data;
    });
  }
}
