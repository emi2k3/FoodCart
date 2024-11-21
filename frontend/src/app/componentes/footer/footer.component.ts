import { Component, OnInit } from '@angular/core'; // Importa las funciones necesarias de Angular

@Component({
  selector: 'app-footer', // Define el selector del componente, que se utiliza en el HTML
  standalone: true, // Indica que el componente es autónomo
  imports: [], // Lista de módulos importados (vacía en este caso)
  templateUrl: './footer.component.html', // Especifica la ubicación del archivo de plantilla HTML del componente
})
export class FooterComponent implements OnInit {
  constructor() {}

  ngOnInit() {} // Método que se ejecuta al inicializar el componente
}
