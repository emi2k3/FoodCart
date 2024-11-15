import { Routes } from '@angular/router';
import { LoginPage } from './paginas/login/login.page';
import { RegistroUsuarioPage } from './paginas/registro-usuario/registro-usuario.page';
import { InicioPage } from './paginas/inicio/inicio.page';
import { BebidasPage } from './paginas/bebidas/bebidas.page';
import { ComidasPage } from './paginas/comidas/comidas.page';
import { PostProductoPage } from './paginas/post-producto/post-producto.page';
import { CarritoPage } from './paginas/carrito/carrito.page'; // Importamos la pagina del carrito.
import { checkTokenGuard } from './guardia/check-token.guard';
import { checkAdminGuard } from './guardia/check-admin.guard';
import { VerDetallesPage } from './paginas/ver-detalles/ver-detalles.page';
import { EditarProductoPages } from './paginas/editar-producto/editar-producto.pages';
import { VerPedidosPage } from './paginas/ver-pedidos/ver-pedidos.page';
import { RestablecerContrasenaPage } from './paginas/reestablecer-contrasena/reestablecer-contrasena.page';

export const routes: Routes = [
  {
    path: 'auth/login',
    component: LoginPage,
    title: 'Login',
  },
  {
    path: 'registro',
    component: RegistroUsuarioPage,
    title: 'Registro',
  },
  {
    path: '',
    component: InicioPage,
    title: 'Inicio',
    canActivate: [checkTokenGuard],
  },
  {
    path: 'bebidas',
    component: BebidasPage,
    title: 'Bebidas',
    canActivate: [checkTokenGuard],
  },
  {
    path: 'comidas',
    component: ComidasPage,
    title: 'Comidas',
    canActivate: [checkTokenGuard],
  },
  {
    path: 'productos/ingresar',
    component: PostProductoPage,
    title: 'Ingresar Producto',
    canActivate: [checkAdminGuard],
  },
  {
    path: 'carrito',
    component: CarritoPage,
    title: 'Carrito de Compras',
    canActivate: [checkTokenGuard],
  },
  {
    path: 'producto/detalles',
    component: VerDetallesPage,
    title: 'Detalles Producto',
    canActivate: [checkTokenGuard],
  },
  {
    path: 'productos/editar/:id',
    component: EditarProductoPages,
    title: 'Editar Producto',
    canActivate: [checkAdminGuard],
  },
  {
    path: 'pedidos/ver',
    component: VerPedidosPage,
    title: 'Ver pedidos',
    canActivate: [checkTokenGuard],
  },
  {
    path: 'restablecer-contrasena',
    component: RestablecerContrasenaPage,
    title: 'Restablecer Contraseña',
  },
];
