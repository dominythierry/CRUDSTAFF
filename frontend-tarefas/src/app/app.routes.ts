import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { RegistrarComponent } from './registrar/registrar';
import { Redefinirsenha } from './redefinirsenha/redefinirsenha';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';



export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' }, // rota inicial
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: Dashboard },
    { path: 'redefinirsenha', component: Redefinirsenha},
    { path: 'registrar', component: RegistrarComponent},
    { path: '**', redirectTo: 'login' },// rota coringa
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
