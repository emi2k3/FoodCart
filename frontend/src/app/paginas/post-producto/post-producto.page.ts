import { NgClass, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImageCroppedEvent, ImageCropperComponent, LoadedImage } from 'ngx-image-cropper';
import { PostProductoService } from '../../servicios/post-producto.service';

@Component({
  selector: 'app-post-producto',
  templateUrl: './post-producto.page.html',
  styleUrls: ['./post-producto.page.scss'],
  imports: [FormsModule, NgIf, NgClass, ImageCropperComponent],
  standalone: true,
})
export class PostProductoPage {
  private postProducto: PostProductoService = inject(PostProductoService);
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


  constructor(
    private sanitizer: DomSanitizer
  ) {
  }

  fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
    this.mostrarCropper = true

  }
  imageCropped(event: ImageCroppedEvent) {
    if (event.objectUrl) {
      this.temporaryCroppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
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
    alert("No se pudo cargar la imágen, intente otra vez.")
  }
  onSubmit() {
    const formData = new FormData(document.getElementById("formPost") as HTMLFormElement);
    if (this.foto) {
      formData.append("foto", this.foto, "imagen.webp");
    }
    this.postProducto.post(formData);
  }
  cropImage() {
    this.croppedImage = this.temporaryCroppedImage;
    this.foto = this.temporaryBlob;
    this.mostrarCropper = false;
    this.temporaryCroppedImage = '';
  }
}

