import { Component, input, Input } from '@angular/core';
import { Task } from '../../interfaces/task';
import { JsonPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [JsonPipe, NgIf],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent {
  // @Input (

  // )
  // task: Task | undefined = undefined;
  // {
  //   id: 1,
  //   title: 'Tarea1',
  //   description: 'Esta es la Tarea 1',
  //   status: 'Activo',
  //   createdAt: '09/10',
  //   updatedAt: '10/10',
  //   usuarios: ['Emilio Rodriguez', 'Francisco Lima'],
  //   id_usuario: 1,
  // };

  task = input<Task | undefined>(undefined);
}
