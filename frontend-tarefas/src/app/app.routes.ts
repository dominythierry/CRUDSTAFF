import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { RegistrarComponent } from './registrar/registrar';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' }, // rota inicial
    { path: 'login', component: Login },
    { path: 'dashboard', component: Dashboard },
    {path: 'registrar', component: RegistrarComponent},
    { path: '**', redirectTo: 'login' },// rota coringa
];
