import { Component } from '@angular/core';
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { FooterComponent } from '../../componentes/footer/footer.component';

@Component({
  selector: 'about-us',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './about-us.page.html',
  styleUrl: './about-us.page.css',
})
export class AboutUsPage {}
