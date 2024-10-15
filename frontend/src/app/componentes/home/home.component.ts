import { Component } from '@angular/core';
import { SearchComponent } from '../search/search.component';
import { TaskComponent } from '../task/task.component';
import { Task } from '../../interfaces/task';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SearchComponent, TaskComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  selectedTask: Task = {
    id: 1,
    title: 'Tarea1',
    description: 'Esta es la Tarea 1',
    status: 'Activo',
    createdAt: '09/10',
    updatedAt: '10/10',
    usuarios: ['Emilio Rodriguez', 'Francisco Lima'],
    id_usuario: 1,
  };

  public onSearchValue(value: string) {
    console.log({ value });
  }
}
