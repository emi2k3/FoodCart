import { Component } from '@angular/core';
import { SearchComponent } from '../../componentes/search/search.component';
import { NavbarComponent } from '../../componentes/navbar/navbar.component';

@Component({
  selector: 'inicio',
  standalone: true,
  imports: [SearchComponent, NavbarComponent],
  templateUrl: './inicio.page.html',
  styleUrl: './inicio.page.css',
})
export class InicioPage {
  onSearchValue(value: string) {
    console.log('print del serach value');
  }
}
