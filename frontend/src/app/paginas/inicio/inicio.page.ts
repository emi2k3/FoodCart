import { Component, inject, OnInit } from '@angular/core';
import { SearchComponent } from '../../componentes/search/search.component';
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { GetProductosService } from '../../servicios/get-productos.service';
import { NgFor } from '@angular/common';
@Component({
  selector: 'inicio',
  standalone: true,
  imports: [SearchComponent, NavbarComponent, NgFor],
  templateUrl: './inicio.page.html',
  styleUrl: './inicio.page.css',
})
export class InicioPage implements OnInit {
  productos: any[] = [];
  private cargarTabla: GetProductosService = inject(GetProductosService);

  ngOnInit(): void {
    this.cargarTabla.getProductos().then((data) => {
      console.log(data);
      this.productos = data;
    });
  }
}
