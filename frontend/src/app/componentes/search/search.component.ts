import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  searchOutput = output <string> ();

  searchValue: string = 'no es vacío';
  number = 0;
  public searchClick() {
    console.log('Valor actual: ' + this.searchValue);
    console.log('Click ' + this.number);
    this.number++;
    this.searchOutput.emit(this.searchValue);
  }
}
