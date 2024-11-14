import { NgClass, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {
  ImageCroppedEvent,
  ImageCropperComponent,
  LoadedImage,
} from 'ngx-image-cropper';
import { Router } from '@angular/router';
import { Producto } from '../../interfaces/producto';
import { GetProductosService } from '../../servicios/productos/get-productos.service';
import { ActivatedRoute } from '@angular/router';
import { PutProductoService } from '../../servicios/productos/edit-producto.service';

@Component({
  selector: 'editar-producto',
  standalone: true,
  templateUrl: './editar-producto.pages.html',
  styleUrls: ['./editar-producto.pages.scss'],
  imports: [FormsModule, NgIf, NgClass, ImageCropperComponent],
})
export class EditarProductoPages implements OnInit {
  private putProducto: PutProductoService = inject(PutProductoService);
  private cargarTabla: GetProductosService = inject(GetProductosService);
  private router: Router = inject(Router);
  private sanitizer: DomSanitizer = inject(DomSanitizer);
  private route: ActivatedRoute = inject(ActivatedRoute);

  productId: string | null = null;
  producto: Producto | undefined;
  nombre: string = '';
  descripcion: string = '';
  precio_unidad: number = 0;
  categoria: number = 0;
  foto: Blob | undefined | null;

  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl = '';
  temporaryCroppedImage: SafeUrl = '';
  temporaryBlob: Blob | undefined | null = null;
  mostrarCropper: boolean = true;

  async ngOnInit(): Promise<void> {
    this.productId = this.route.snapshot.paramMap.get('id');
    console.log(this.productId);
    if (this.productId) {
      this.producto = await this.cargarTabla.getProductoById(this.productId);
      if (this.producto) {
        this.nombre = this.producto.nombre;
        this.descripcion = this.producto.descripcion;
        this.precio_unidad = this.producto.precio_unidad;
        this.categoria = this.producto.id_categoria;
      }
    }
  }

  fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
    this.mostrarCropper = true;
  }

  imageCropped(event: ImageCroppedEvent) {
    if (event.objectUrl) {
      this.temporaryCroppedImage = this.sanitizer.bypassSecurityTrustUrl(
        event.objectUrl,
      );
    }
    this.temporaryBlob = event.blob;
  }

  imageLoaded(image: LoadedImage) {
    // show cropper
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    alert('No se pudo cargar la imágen, intente otra vez.');
  }

  onSubmit() {
    const formData = new FormData(
      document.getElementById('formPost') as HTMLFormElement,
    );
    if (this.foto) {
      formData.delete('foto');
      formData.append('foto', this.foto, 'imagen.png');
    }
    if (this.putProducto.putProducto(formData, this.productId!) != null) {
      this.router.navigate(['comidas']);
    } else {
      alert('Hubo un error al crear su producto.');
    }
  }

  cropImage() {
    this.croppedImage = this.temporaryCroppedImage;
    this.foto = this.temporaryBlob;
    this.mostrarCropper = false;
    this.temporaryCroppedImage = '';
  }
}
