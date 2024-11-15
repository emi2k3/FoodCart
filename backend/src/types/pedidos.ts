import { Static, Type } from "@sinclair/typebox";

export const IdPedidoSchema = Type.Object({
  id: Type.Integer({
    description: "Identificador único del pedido",
  }),
});
export type IdPedidoType = Static<typeof IdPedidoSchema>;

export const PedidoPostSchema = Type.Object(
  {
    estado: Type.String({
      enum: [
        "PENDIENTE",
        "CONFIRMADO",
        "EN_PREPARACION",
        "LISTO",
        "EN_CAMINO",
        "ENTREGADO",
        "CANCELADO",
      ],
      description: "Estado del pedido",
    }),
    importe_total: Type.Number({
      minimum: 0,
      description: "Importe total del pedido",
    }),
    id_local: Type.Integer({
      description: "Identificador del local",
    }),
    id_usuario: Type.Integer({
      description: "Identificador del usuario",
    }),
  },
  { additionalProperties: false }
);

export type PedidoPostType = Static<typeof PedidoPostSchema>;

export const PedidoSchema = Type.Object(
  {
    id_pedido: Type.Integer({
      description: "Identificador del pedido",
    }),
    fecha_hora: Type.String({
      format: "date-time",
      description: "Fecha y hora del pedido",
    }),
    estado: Type.String({
      enum: [
        "PENDIENTE",
        "CONFIRMADO",
        "EN_PREPARACION",
        "LISTO",
        "EN_CAMINO",
        "ENTREGADO",
        "CANCELADO",
      ],
      description: "Estado del pedido",
    }),
    importe_total: Type.Number({
      minimum: 0,
      description: "Importe total del pedido",
    }),
    id_local: Type.Integer({
      description: "Identificador del local",
    }),
    id_usuario: Type.Integer({
      description: "Identificador del usuario",
    }),
  },
  { additionalProperties: false }
);

export type PedidoSchema = Static<typeof PedidoSchema>;
