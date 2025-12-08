import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';


export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  // Rotas que são PÚBLICAS SÓ para quem NÃO está logado
  // Se o cara já estiver logado e tentar acessar essas rotas → manda pro dashboard
  const rotasPublicasSomenteDeslogado = ['/login', '/registrar', '/passwordreset'];
  const tentandoAcessarRotaPublica = rotasPublicasSomenteDeslogado.some(rota =>
    state.url.startsWith(rota)
  );

  // 1. Usuário logado tentando acessar rota pública → manda pro dashboard
  if (token && tentandoAcessarRotaPublica) {
    router.navigate(['/dashboard']);
    return false;
  }

  // 2. Usuário logado tentando acessar rota protegida → libera
  if (token) {
    return true;
  }

  // 3. Usuário deslogado tentando acessar rota protegida → manda pro login
  if (!tentandoAcessarRotaPublica) {
    router.navigate(['/login']);
    return false;
  }

  // 4. Usuário deslogado acessando rota pública (login, registrar, etc) → libera
  return true;
};