import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Usuario {
  id: number;
  nome?: string;
  email?: string;
  cpf?: string;
  telefone?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
}

export interface AlterarSenhaRequest {
  senhaAtual: string;
  novaSenha: string;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private api = 'http://localhost:3000/tarefas';

  constructor(private http: HttpClient) {}

  // Método para obter headers com token de autenticação
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Buscar perfil do usuário logado (usando token JWT)
  // Backend: GET /tarefas/usuarios (retorna o usuário baseado no token)
  getPerfil(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.api}/usuarios`, { 
      headers: this.getHeaders() 
    });
  }

  // Atualizar perfil do usuário logado
  // Backend: PUT /tarefas/usuarios
  atualizarPerfil(dados: Partial<Usuario>): Observable<any> {
    return this.http.put(`${this.api}/usuarios`, dados, { 
      headers: this.getHeaders() 
    });
  }

  // Alterar senha do usuário logado
  // Backend: PUT /tarefas/alterar-senha
  alterarSenha(senhaAtual: string, novaSenha: string): Observable<any> {
    const body: AlterarSenhaRequest = { senhaAtual, novaSenha };
    return this.http.put(`${this.api}/alterar-senha`, body, { 
      headers: this.getHeaders() 
    });
  }

  // Deletar conta do usuário
  // Backend: DELETE /tarefas/deletar
  deletarConta(email: string, senha: string): Observable<any> {
    return this.http.delete(`${this.api}/deletar`, {
      body: { email, senha },
      headers: this.getHeaders()
    });
  }

  // ========== MÉTODOS ANTIGOS (mantidos para compatibilidade) ==========
  
  // Buscar usuário por ID (método antigo)
  getById(id: number): Observable<Usuario> {
    return this.http.get<Usuario[]>(`${this.api}/usuarios`).pipe(
      map(list => list.find(u => u.id === id) as Usuario)
    );
  }

  // Atualizar usuário por ID (método antigo)
  atualizar(id: number, dados: any): Observable<any> {
    return this.http.put(`${this.api}/usuarios/${id}`, dados);
  }
}