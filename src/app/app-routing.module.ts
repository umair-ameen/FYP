import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router' ;

import { ExaminerComponent } from './examiner/examiner.component';
import { ProfileComponent } from './examiner/profile/profile.component';
import { ScheduleTestComponent } from './examiner/schedule-test/schedule-test.component';
import { TestsComponent } from './examiner/tests/tests.component';
import { ObtainTestComponent } from './examiner/tests/obtain-test/obtain-test.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ResultsComponent } from './examiner/results/results.component';

const appRoutes:Routes = [
    { path:'', component: ExaminerComponent},
    { path: 'examiner', component: ExaminerComponent, children:[
        { path: 'profile', component: ProfileComponent },
        { path: 'schedule-test', component: ScheduleTestComponent },
        { path: 'tests', component: TestsComponent },
        { path: 'obtain-test', component: ObtainTestComponent},
        { path: 'results', component: ResultsComponent }
    ]},
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
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