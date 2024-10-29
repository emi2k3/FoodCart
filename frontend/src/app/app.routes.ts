import { Routes } from '@angular/router';
import { LoginPage } from './paginas/login/login.page';
import { RegistroUsuarioPage } from './paginas/registro-usuario/registro-usuario.page';
import { InicioPage } from './paginas/inicio/inicio.page';
import { BebidasPage } from './paginas/bebidas/bebidas.page';
import { ComidasPage } from './paginas/comidas/comidas.page';
import { AboutUsPage } from './paginas/about-us/about-us.page';

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
    title: 'inicio',
  },
  {
    path: 'bebidas',
    component: BebidasPage,
    title: 'bebidas',
  },
  {
    path: 'comidas',
    component: ComidasPage,
    title: 'comidas',
  },
  {
    path: 'aboutUs',
    component: AboutUsPage,
    title: 'aboutUs',
  },
];
