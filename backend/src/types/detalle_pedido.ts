import { Static, Type } from "@sinclair/typebox";
import _static from "../plugins/static.js";

export const IdPedidoSchema = Type.Object({
  id_pedido: Type.Integer({
    description: "Identificador único de la Pedido",
  }),
});
export type IdPedidoType = Static<typeof IdPedidoSchema>;

export const detalle_pedido = Type.Object({
  id_pedido: Type.Integer({
    description: "Identificador único de la pedido",
  }),
  id_producto: Type.Integer({
    description: "Identificado único del producto",
  }),
  cantidad: Type.Integer({}),
  indicaciones: Type.String({
    minLength: 10,
    maxLength: 400,
    examples: ["Sin huevo y la carne a punto"],
  }),
});

export type detalle_pedido = Static<typeof detalle_pedido>;
