import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { RegistrarComponent } from './registrar/registrar';
import { VeiculosInfo } from './veiculos-info/veiculos-info';
import { RegistroVeiculoComponent } from './registro-entrada/registro-entrada';
import { UsuarioConfigComponent } from './config/config';
import { Passwordreset } from './passwordreset/passwordreset';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CadastrarCarroComponent } from './pages/cadastrar-carro/cadastrar-carro';
import { ListarCarrosComponent } from './pages/listar-carros/listar-carros';
import { AprovarRegistroComponent } from './components/aprovar-registro/aprovar-registro';
import { RejeitarRegistroComponent } from './components/rejeitar-registro/rejeitar-registro';
import { authGuard } from './guards/auth.guard';



export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    
    // Rotas públicas - usuário não logado pode acessar, logado é redirecionado
    { 
      path: 'login', 
      component: LoginComponent,
    },
    {
     path: 'aprovar-registro/:token',
     component: AprovarRegistroComponent,
    },

     {
      path: 'rejeitar-registro/:token',
      component: RejeitarRegistroComponent,
    },
  

    { 
      path: 'registrar', 
      component: RegistrarComponent,

    },
    { 
      path: 'passwordreset', 
      component: Passwordreset,

    },
    
    // Rotas protegidas - só usuário logado pode acessar
    { 
      path: 'dashboard', 
      component: Dashboard,
      canActivate: [authGuard]
    },
    { 
      path: 'listar-carros', 
      component: ListarCarrosComponent,
      canActivate: [authGuard]
    },
    { 
      path: 'cadastrar-carro', 
      component: CadastrarCarroComponent,
      canActivate: [authGuard]
    },
    { 
      path: 'registro-entrada', 
      component: RegistroVeiculoComponent,
      canActivate: [authGuard]
    },
    { 
      path: 'veiculos-info', 
      component: VeiculosInfo,
      canActivate: [authGuard]
    },
    { 
      path: 'config', 
      component: UsuarioConfigComponent,
      canActivate: [authGuard]
    },
    
    { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }