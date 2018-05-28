import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { ExaminerComponent } from './examiner/examiner.component';
import { HeaderComponent } from './shared/header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { ProfileComponent } from './examiner/profile/profile.component';
import { ScheduleTestComponent } from './examiner/schedule-test/schedule-test.component';
import { TestsComponent } from './student/tests/tests.component';
import { CreateSubjectComponent } from './examiner/create-subject/create-subject.component';
import { LoginComponent } from './shared/auth/login/login.component';
import { SignupComponent } from './shared/auth/signup/signup.component';
import { AuthService } from './shared/auth/auth.service';
import { ResultsComponent } from './shared/results/results.component';
import { ObtainTestComponent } from './student/tests/obtain-test/obtain-test.component';
import { HomeComponent } from './home/home.component';
import { StudentComponent } from './student/student.component';
import { SharedService } from './shared/shared.service';


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
    ObtainTestComponent,
    HomeComponent,
    StudentComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpModule,
    NgbModule.forRoot()
  ],
  providers: [AuthService, SharedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
