import { Component, inject, OnInit } from '@angular/core';
import { SearchComponent } from '../../componentes/search/search.component';
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { GetProductosService } from '../../servicios/get-productos.service';
import { NgFor, NgIf } from '@angular/common';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'inicio',
  standalone: true,
  imports: [SearchComponent, NavbarComponent, NgFor, NgIf],
  templateUrl: './inicio.page.html',
  styleUrl: './inicio.page.css',
})
export class InicioPage implements OnInit {
  productos: any[] = [];
  private cargarTabla: GetProductosService = inject(GetProductosService);
  private authService: AuthService = inject(AuthService);
  isAdmin: boolean = false;
  productosFiltrados: any[] = [];
  private router: Router = inject(Router);

  ngOnInit(): void {
    this.cargarTabla.getProductos().then((data) => {
      this.productos = data;
      this.productosFiltrados = data;
      this.isAdmin = this.authService.isAdmin();
    });
  }
  actualizarFiltroDeProductos(searchValue: string) {
    this.productosFiltrados = this.productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }
  onDetalles(idProducto: string) {
    this.router.navigate(['producto/detalles/'], { queryParams: { id: idProducto } })
  }
}
