import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentAdmissionFormComponent } from './studentAdmissionForm/studentAdmissionForm.component';
import { StudentFormListComponent } from './studentFormList/studentFormList.component';

const routes: Routes = [
  {path:'studentFormList',component:StudentFormListComponent },
  {path:'create',component:StudentAdmissionFormComponent },
  {path:'view/:id',component:StudentAdmissionFormComponent },
  {path:'edit/:id',component:StudentAdmissionFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
