import { Component, inject } from '@angular/core';
import { GetProductosService } from '../../servicios/productos/get-productos.service';
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'bebidas',
  standalone: true,
  imports: [NavbarComponent, NgFor, NgIf],
  templateUrl: './bebidas.page.html',
  styleUrl: './bebidas.page.css',
})
export class BebidasPage {
  bebidas: any[] = [];
  productosFiltrados: any[] = [];
  isAdmin: boolean = false;
  private cargarTabla: GetProductosService = inject(GetProductosService);
  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);

  ngOnInit(): void {
    this.cargarTabla.getProductosByCategoria('2').then((data) => {
      console.log(data);
      this.bebidas = data;
      this.productosFiltrados = data;
      this.isAdmin = this.authService.isAdmin();
    });
  }

  actualizarFiltroDeProductos(searchValue: string) {
    this.productosFiltrados = this.bebidas.filter((bebida) =>
      bebida.nombre.toLowerCase().includes(searchValue.toLowerCase()),
    );
  }
  onDetalles(idProducto: string) {
    this.router.navigate(['producto/detalles/'], {
      queryParams: { id: idProducto },
    });
  }
}
