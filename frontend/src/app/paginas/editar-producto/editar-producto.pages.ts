import { NgClass, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {
  ImageCroppedEvent,
  ImageCropperComponent,
  LoadedImage,
} from 'ngx-image-cropper';
import { PostProductoService } from '../../servicios/post-producto.service';
import { Router } from '@angular/router';
import { Producto } from '../../interfaces/producto';
import { GetProductosService } from '../../servicios/get-productos.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'editar-producto',
  standalone: true,
  templateUrl: './editar-producto.pages.html',
  styleUrls: ['./editar-producto.pages.scss'],
  imports: [FormsModule, NgIf, NgClass, ImageCropperComponent],
})
export class EditarProductoPages implements OnInit {
  productId: string | null = null;
  producto: Producto | undefined;
  nombre: string = '';
  descripcion: string = '';
  precio_unidad: number = 0;
  categoria: string = '';
  foto: Blob | undefined | null;

  imageChangedEvent: Event | null = null;
  croppedImage: SafeUrl = '';
  temporaryCroppedImage: SafeUrl = '';
  temporaryBlob: Blob | undefined | null = null;
  mostrarCropper: boolean = true;

  mapearCategoria: { [key: number]: string } = {
    1: 'comida',
    2: 'bebida',
    3: 'acompañamiento',
  };

  private postProducto: PostProductoService = inject(PostProductoService);
  private cargarTabla: GetProductosService = inject(GetProductosService);
  private router: Router = inject(Router);
  private sanitizer: DomSanitizer = inject(DomSanitizer);
  private route: ActivatedRoute = inject(ActivatedRoute);

  async ngOnInit(): Promise<void> {
    this.productId = this.route.snapshot.paramMap.get('id');
    console.log(this.productId);
    if (this.productId) {
      this.producto = await this.cargarTabla.getProductoById(this.productId);
      console.log('Producto:', this.producto);
      if (this.producto) {
        console.log(this.producto.nombre);
        this.nombre = this.producto.nombre;
        this.descripcion = this.producto.descripcion;
        this.precio_unidad = this.producto.precio_unidad;
        this.categoria = this.producto.categoria;
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

  async onSubmit() {
    const formData = new FormData();
    formData.append('nombre', this.nombre);
    formData.append('descripcion', this.descripcion);
    formData.append('precio_unidad', this.precio_unidad.toString());
    //const categoriaNombre =
    //this.mapearCategoria[this.categoria] || 'desconocido';
    // formData.append('categoria', categoriaNombre);
    if (this.foto) {
      formData.append('foto', this.foto, 'imagen.png');
    }

    try {
      await this.postProducto.postProducto(formData);
      this.router.navigate(['']);
    } catch (error) {
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
