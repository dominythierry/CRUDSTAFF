import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Usuario {
  id: number;
  nome?: string;
  email?: string;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private api = 'http://localhost:3000/tarefas';

  constructor(private http: HttpClient) {}

  // fetch all users and return the one with id
  getById(id: number): Observable<Usuario> {
    return this.http.get<Usuario[]>(`${this.api}/usuarios`).pipe(
      map(list => list.find(u => u.id === id) as Usuario)
    );
  }

  // update user data (backend route implemented server-side)
  atualizar(id: number, dados: any): Observable<any> {
    return this.http.put(`${this.api}/usuarios/${id}`, dados);
  }
}
