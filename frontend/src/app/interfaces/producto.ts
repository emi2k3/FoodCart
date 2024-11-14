export interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio_unidad: number;
  categoria: string;
  foto: Blob | undefined | null | boolean;
}

export interface ProductoPost {
  nombre: string;
  descripcion: string;
  precio_unidad: number;
  categoria: string;
  foto: Blob | undefined | null;
}
