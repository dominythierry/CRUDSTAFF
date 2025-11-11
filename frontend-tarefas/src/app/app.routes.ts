import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { RegistrarComponent } from './registrar/registrar';
import { VeiculosInfo } from './veiculos-info/veiculos-info';
import { RegistroSaidaVeiculos } from './registro-saida-veiculos/registro-saida-veiculos';
import { Config } from './config/config';
import { Passwordreset } from './passwordreset/passwordreset';
/*import { Redefinirsenha } from './redefinirsenha/redefinirsenha';*/
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' }, // rota inicial
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: Dashboard },
    { path: 'passwordreset', component: Passwordreset},
    { path: 'registrar', component: RegistrarComponent},
    { path: 'veiculos-info', component: VeiculosInfo},
    { path: 'registro-saida-veiculos', component: RegistroSaidaVeiculos},
    { path: 'config', component: Config},
    { path: '**', redirectTo: 'login' },// rota coringa
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
