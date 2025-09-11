import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { RegistrarComponent } from './registrar/registrar';
import { RouterModule } from '@angular/router';


export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' }, // rota inicial
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: Dashboard },
    {path: 'registrar', component: RegistrarComponent},
    { path: '**', redirectTo: 'login' },// rota coringa
];
