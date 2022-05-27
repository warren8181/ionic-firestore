import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {ActivatedRoute, Router} from "@angular/router";
import {LoadingController, ToastController} from "@ionic/angular";
import {TodoService} from "../service/todo.service";

@Component({
  selector: 'app-todo-edit',
  templateUrl: './todo-edit.page.html',
  styleUrls: ['./todo-edit.page.scss'],
})
export class TodoEditPage implements OnInit {

  todoId: string;
  title: string;
  desc: string;
  duedate: string;
  status: string;

  constructor(
    private afs: AngularFirestore,
    private route: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastr: ToastController,
    private todoService: TodoService
  ) { }

  ngOnInit() {
    this.todoId = this.route.snapshot.params['todoId'];
    this.loadTodo();
  }

  async loadTodo(){
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      spinner: 'crescent',
      showBackdrop: true
    });

    loading.present();

    this.todoService.getTodo(this.todoId).subscribe(
      (todo) => {
        this.title = todo.title;
        this.desc = todo.desc;
        this.duedate = todo.duedate;
        this.status = todo.status;
        loading.dismiss();
      }
    );
  }

  async updateTodo(){
    const loading = await this.loadingCtrl.create({
      message: 'Updating data...',
      spinner: 'crescent',
      showBackdrop: true
    });

    loading.present();

    this.afs.collection('todo').doc(this.todoId).set({
      'title': this.title,
      'desc': this.desc,
      'duedate': this.duedate,
      'status': this.status
    },{merge : true})
      .then(
        () => {
          loading.dismiss();
          this.toast('Task Updated!', 'success');
          this.router.navigate(['/list']);
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
