import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router' ;

import { ExaminerComponent } from './examiner/examiner.component';
import { ProfileComponent } from './examiner/profile/profile.component';
import { ScheduleTestComponent } from './examiner/schedule-test/schedule-test.component';
import { TestsComponent } from './student/tests/tests.component';
import { ObtainTestComponent } from './student/tests/obtain-test/obtain-test.component';
import { LoginComponent } from './shared/auth/login/login.component';
import { SignupComponent } from './shared/auth/signup/signup.component';
import { ResultsComponent } from './shared/results/results.component';
import { HomeComponent } from './home/home.component'
import { StudentComponent } from './student/student.component';
import { CreateSubjectComponent } from './examiner/create-subject/create-subject.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'examiner', component: ExaminerComponent, children:[
        { path: 'subjects', component: CreateSubjectComponent },
        { path: 'schedule-test', component: ScheduleTestComponent },
        { path: 'results', component: ResultsComponent }
    ]},
    { path: 'student', component: StudentComponent , children:[
        { path: 'tests', component: TestsComponent },
        { path: 'obtain-test', component: ObtainTestComponent},
        { path: 'results', component: ResultsComponent }
    ]},
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports:[
        RouterModule.forRoot(appRoutes)
    ],
    exports:[
        RouterModule
    ]
})
export class AppRoutingModule{

}