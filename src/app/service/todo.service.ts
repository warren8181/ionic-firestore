import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from '@angular/fire/compat/firestore';
import {Observable} from 'rxjs';
import {Todo} from '../models/todo';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  todoCol: AngularFirestoreCollection;
  todoDoc: AngularFirestoreDocument;
  todos: Observable<Todo[]>;
  todo$: any;

  constructor(private afs: AngularFirestore)
  {
    this.todoCol = this.afs.collection('todo', ref => ref.orderBy('createdAt', 'desc'));

    this.todos = this.todoCol.snapshotChanges().pipe(
      map(action => {
        return action.map(
          a => {
            const data = a.payload.doc.data() as Todo;
            data.todoId = a.payload.doc.id;
            return data;
          }
        );
      })
    );
  }

  getTodos(){
    return this.todos;
  }

  getTodo(todoId){
    this.todoDoc = this.afs.doc<Todo>(`todo/${todoId}`);
    return this.todo$ = this.todoDoc.valueChanges();
  }
}
