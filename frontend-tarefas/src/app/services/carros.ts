import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Carro {
  id?: number;
  marca: string;
  modelo: string;
  ano: number;
  cor: string;
  placa: string;
  motivo: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarrosService {

  private apiUrl = 'http://localhost:3000/carros';

  constructor(private http: HttpClient) {}

  listarCarros(): Observable<Carro[]> {
    return this.http.get<Carro[]>(this.apiUrl);
  }

  cadastrarCarro(carro: Carro): Observable<any> {
    return this.http.post(this.apiUrl, carro);
  }

  buscarCarro(id: number): Observable<Carro> {
    return this.http.get<Carro>(`${this.apiUrl}/${id}`);
  }

  atualizarCarro(id: number, carro: Carro): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, carro);
  }

  excluirCarro(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
