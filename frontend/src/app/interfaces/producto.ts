export interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string;
  precio_unidad: number;
  id_categoria: number;
  foto: Blob | undefined | null;
}

export interface ProductoPost {
  nombre: string;
  descripcion: string;
  precio_unidad: number;
  id_categoria: number;
  foto: Blob | undefined | null;
}
