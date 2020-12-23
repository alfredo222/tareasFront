import { Component, OnInit, Input } from '@angular/core';
import { NgModule } from '@angular/core';
import { Task } from '../servicios/tasks/model/task';
// import { Task } from '../task';
import { Observable } from 'rxjs';
import { TaskControllerService } from '../servicios/tasks';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  public descripcion: string;
  public tasks: Task[];
  public taskAux: Task;
  public idAux: number;
  public primeraTareaFlag = 0; // utilizo esta flag para saber si es la primera tarea que se crea
  task: Task = {
    id: 1,
    descripcion: 'Descripcin tarea 1',
    estado: 'Completada'
  }
  constructor(private taskService: TaskControllerService) {

    this.tasks = [];
    // this.tasks.push({id: 1, descripcion: 'descr', estado: 'estado'});
   }

  ngOnInit() {
    this.listarTodasTareas();
  }

  onSubmit(form) {

  }

  listarTodasTareas() {
    // Llamar a listar todas la tareas y almacenar el retrun en tasks
    console.log('Cargando la lista de tareas');
    this.taskService.getAllTask().subscribe((data: Task[]) => {
      this.tasks = data;
    });
  }

  // Para crear una tarea
  nuevaTarea(descripcion,estado){
    console.log('Creando una nueva tarea ' + descripcion );

    // Esta flag me sirve para identificar si el id debe ser 1 o el valor del ultimo+1
    this.primeraTareaFlag = this.primeraTareaFlag + 1;

    // Cojo de la lista de tareas la ultima, miro su id y lo incremento en una unidad this.tasks.length !== 0
    if (this.tasks.length !== 0) {
      this.idAux = this.tasks[this.tasks.length - 1].id + 1;
    } else {
      this.idAux = 1;
    }

    // Creo tarea con los parametros y el id generado para que sea el último de la lista
    this.taskAux = {id: this.idAux , descripcion, estado};

    // Llamo a saveTask
    this.taskService.saveTask(this.taskAux).subscribe((data: number) => {
      console.log('id de la tarea guardada: ' + data);
      this.listarTodasTareas();
    });

    // Refrescar lista
    this.listarTodasTareas();
  }

  // Recibe como parametro el estado por el que se quiere filtrar
  filtrarTareas(estado){
    console.log('Filtra la lista de tareas: ');
    // Llamar a getFilterTasks
    this.taskService.getFilterTask(estado).subscribe((data: Task[]) => {
      this.tasks = data;
    });
  }

  cambiarEstadoTarea(id, descripcion, estado){
    // copia de la tarea con el nuevo estado
    this.taskAux = {id, descripcion, estado};
    // Recoger id tarea

    // Llamar a update pasandole la taskAux
    this.taskService.updateTask(this.taskAux, id).subscribe(() => {
      // Refrescar lista
      this.listarTodasTareas();
    });
  }

  // Recibira por parametros el id de la tarea task.id
  borrarTarea(id) {
    console.log('Borrando tarea con id: ' + id);
    // Llamar a deleteTask
    this.taskService.deleteTask(id).subscribe(() => {
      this.listarTodasTareas();
    });

    // Refrescar lista
    this.listarTodasTareas();
  }



}
