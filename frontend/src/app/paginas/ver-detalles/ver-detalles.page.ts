import { Component, inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { GetProductosService } from '../../servicios/productos/get-productos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-ver-detalles',
  templateUrl: './ver-detalles.page.html',
  styleUrls: ['./ver-detalles.page.scss'],
  imports: [NavbarComponent, NgIf],
  standalone: true,
})
export class VerDetallesPage implements OnInit {
  private cargarProducto: GetProductosService = inject(GetProductosService);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  producto: any;
  constructor() { }

  async ngOnInit() {
    if (this.activatedRoute.snapshot.queryParams['id']) {
      this.producto = await this.cargarProducto.getProductoById(
        this.activatedRoute.snapshot.queryParams['id'],
      );
      console.log(this.producto);
    } else {
      this.router.navigate(['']);
    }
  }
  onDetalles(idProducto: string) {
    this.router.navigate(['producto/detalles/'], {
      queryParams: { id: idProducto },
    });
  }
}
