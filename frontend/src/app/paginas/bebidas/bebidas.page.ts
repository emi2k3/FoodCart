import { Component, inject } from '@angular/core';
import { GetProductosService } from '../../servicios/get-productos.service';
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'bebidas',
  standalone: true,
  imports: [NavbarComponent, NgFor],
  templateUrl: './bebidas.page.html',
  styleUrl: './bebidas.page.css',
})
export class BebidasPage {
  bebidas: any[] = [];
  private cargarTabla: GetProductosService = inject(GetProductosService);
  ngOnInit(): void {
    this.cargarTabla.getProductosByCategoria('2').then((data) => {
      console.log(data);
      this.bebidas = data;
    });
  }
}
