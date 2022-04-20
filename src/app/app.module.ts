import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StudentAdmissionFormComponent } from './studentAdmissionForm/studentAdmissionForm.component';
import { FileUploadModule } from 'ng2-file-upload';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { GenericService } from './generic.services';
import { HttpClientModule } from '@angular/common/http';
import { BaseService } from './base.services';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTableModule } from '@angular/material/table';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio';
import { NgxMaskModule } from 'ngx-mask';
import { TextMaskModule } from 'angular2-text-mask';
import { StudentFormListComponent } from './studentFormList/studentFormList.component';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { SearchPipe } from './search.pipe';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [
    AppComponent,
    StudentAdmissionFormComponent,
    StudentFormListComponent,
    SearchPipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatButtonModule,
    FileUploadModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    MatTableModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
     MatRippleModule,
     MatRadioModule,
     NgxMaskModule,
     TextMaskModule,
     MomentDateModule,
     MatPaginatorModule,
     MatSortModule,
  ],
  providers: [
    BaseService,
    GenericService,

  ],
  bootstrap: [AppComponent]

})
export class AppModule { }
