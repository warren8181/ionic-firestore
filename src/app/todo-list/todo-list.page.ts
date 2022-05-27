import { Component, OnInit } from '@angular/core';
import {Todo} from '../models/todo';
import {TodoService} from '../service/todo.service';
import {LoadingController, ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.page.html',
  styleUrls: ['./todo-list.page.scss'],
  providers: [ TodoService ]
})
export class TodoListPage implements OnInit {

  todos: Todo[];

  constructor(
    private todoService: TodoService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private toastr: ToastController,
    private afs: AngularFirestore
  ) { }

  ngOnInit() {
    this.todoService.getTodos().subscribe(
      (todos) => {
        this.todos = todos;
      }
    );
  }

  addNewTask(){ this.router.navigate(['/add']); }

  edit(todoId: any){
    this.router.navigate(['/edit/', todoId]);
  }

  async done(todoId: any){
    const loading = await this.loadingCtrl.create({
      message: 'Updating Status...',
      spinner: 'crescent',
      showBackdrop: true
    });

    loading.present();

    this.afs.collection('todo').doc(todoId).update({
      'status' : 'Done'
    })
      .then(
        () => {
          loading.dismiss();
          this.toast('Task Updated!', 'success');
        }
      ).catch(
      (error) => {
        loading.dismiss();
        this.toast(error.message, 'danger');
      });
  }

  async delete(todoId: any)
  {
    const loading = await this.loadingCtrl.create({
      message: 'Deleting...',
      spinner: 'crescent',
      showBackdrop: true
    });

    loading.present();

    this.afs.collection('todo').doc(todoId).delete()
      .then(
        () => {
          loading.dismiss();
          this.toast('Task Deleted', 'success');
        }
      ).catch(
      (error) => {
        loading.dismiss();
        this.toast(error.message, 'danger');
      }
    );
  }

  async toast(msg, status)
  {
    const toast = await this.toastr.create({
      message: msg,
      position: 'top',
      color: status,
      duration: 2000
    });

    toast.present();
  }

}
