import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { ExaminerComponent } from './examiner/examiner.component';
import { HeaderComponent } from './examiner/header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { ProfileComponent } from './examiner/profile/profile.component';
import { ScheduleTestComponent } from './examiner/schedule-test/schedule-test.component';
import { TestsComponent } from './examiner/tests/tests.component';
import { CreateSubjectComponent } from './examiner/create-subject/create-subject.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthService } from './auth/auth.service';
import { ResultsComponent } from './examiner/results/results.component';
import { ObtainTestComponent } from './examiner/tests/obtain-test/obtain-test.component';


@NgModule({
  declarations: [
    AppComponent,
    ExaminerComponent,
    HeaderComponent,
    ProfileComponent,
    TestsComponent,
    CreateSubjectComponent,
    ScheduleTestComponent,
    LoginComponent,
    SignupComponent,
    ResultsComponent,
    ObtainTestComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpModule,
    NgbModule.forRoot()
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
