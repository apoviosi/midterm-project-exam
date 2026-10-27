import { Routes } from '@angular/router';
import { LeaderListComponent } from './components/leader-list/leader-list';
import { LeaderFormComponent } from './components/leader-form/leader-form';

export const routes: Routes = [
  { path: '', component: LeaderListComponent },
  { path: 'leaders/new', component: LeaderFormComponent },
  { path: 'leaders/edit/:id', component: LeaderFormComponent },
  { path: '**', redirectTo: '' }
];