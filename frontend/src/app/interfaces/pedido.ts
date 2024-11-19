export interface PedidoItem {
  id_producto: number;
  producto: string;
  cantidad: number;
  indicaciones: string;
}

export interface Pedido {
  id_usuario: number;
  estado:
    | 'PENDIENTE'
    | 'CONFIRMADO'
    | 'EN_PREPARACION'
    | 'LISTO'
    | 'EN_CAMINO'
    | 'ENTREGADO'
    | 'COMPLETADO'
    | 'CANCELADO';
  fecha: string;
  items: PedidoItem[];
}
