import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  searchValue: string = '';
  @Output() searchTask = new EventEmitter<string>();
  number = 0;

  onSearch() {
    console.log('Valor actual ' + this.searchValue);
    console.log('Click ' + this.number);
    this.number += 1;
    this.searchTask.emit(this.searchValue);
  }
}
