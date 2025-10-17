import { Routes } from '@angular/router';
import { EmployeeTableComponent } from './employee-table/employee-table.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
export const routes: Routes = [
  {
    path: 'employee',
    loadComponent: () =>
      import('./employee-table/employee-table.component').then(
        (m) => m.EmployeeTableComponent
      ),
  },
  { path: '', redirectTo: 'employee', pathMatch: 'full' },
  { path: 'create', component: EmployeeFormComponent },
  { path: 'edit/:id', component: EmployeeFormComponent },

  { path: '**', redirectTo: 'employee' },
];
