import { Component, inject, OnInit } from '@angular/core';
import { SearchComponent } from '../../componentes/search/search.component';
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { GetProductosService } from '../../servicios/get-productos.service';
import { NgFor, NgIf } from '@angular/common';
import { AuthService } from '../../servicios/auth.service';
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
  ngOnInit(): void {
    this.cargarTabla.getProductos().then((data) => {
      console.log(data);
      this.productos = data;
      this.isAdmin = this.authService.isAdmin();
      console.log(this.isAdmin);
    });
  }
}
