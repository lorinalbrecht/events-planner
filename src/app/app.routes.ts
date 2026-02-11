import { Routes } from '@angular/router';
import { EventListComponent } from './components/event-list/event-list.component';
import { EventFormComponent } from './components/event-form/event-form.component';

export const routes: Routes = [
  {
    path: '',
    component: EventListComponent
  },
  {
    path: 'add',
    component: EventFormComponent
  },
  {
    path: 'edit/:id',
    component: EventFormComponent
  }
];
