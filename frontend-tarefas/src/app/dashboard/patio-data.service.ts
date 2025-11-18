// src/app/patio-data.service.ts

// Serviço Angular para simular dados do pátio de veículos em tempo real
//Este arquivo será útil para conectar o dashboard a dados dinâmicos -> segundo o chatGPT


import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';

export interface PatioStat {
  timestamp: string;          // ISO string
  totalVeiculos: number;
  ocupacaoPercent: number;    // 0-100
  porTipo: { [tipo: string]: number }; // { carro, moto, caminhao }
}

@Injectable({
  providedIn: 'root'
})
export class PatioDataService {
  private _data$ = new BehaviorSubject<PatioStat[]>([]);
  public readonly data$ = this._data$.asObservable();

  constructor() {
    // Inicializa com 12 pontos e depois atualiza a cada 3s
    const initial = this.generateInitial(12);
    this._data$.next(initial);

    interval(3000).subscribe(() => {
      const cur = this._data$.getValue();
      const next = [...cur, this.generatePoint()];
      this._data$.next(next.slice(-30)); // mantenha últimos 30 pontos
    });
  }

  private nowIso() { return new Date().toISOString(); }

  private generateInitial(n: number): PatioStat[] {
    const arr: PatioStat[] = [];
    for (let i = n; i > 0; i--) {
      arr.push(this.generatePoint(new Date(Date.now() - i * 3000)));
    }
    return arr;
  }

  private generatePoint(date?: Date): PatioStat {
    const ts = date ? date.toISOString() : this.nowIso();
    const total = Math.round(15 + Math.random() * 40); // 15..55
    const ocupacao = Math.min(100, Math.round((total / 60) * 100));
    // simples distribuição
    const carro = Math.round(total * (0.6 + (Math.random() - 0.5) * 0.15));
    const moto = Math.round(total * (0.25 + (Math.random() - 0.5) * 0.12));
    const caminhao = Math.max(0, total - carro - moto);
    return {
      timestamp: ts,
      totalVeiculos: total,
      ocupacaoPercent: ocupacao,
      porTipo: { carro, moto, caminhao }
    };
  }

  // FUTURO: método para substituir a simulação por API
  public setDataFromApi(data: PatioStat[]) {
    this._data$.next(data.slice(-30));
  }
}
