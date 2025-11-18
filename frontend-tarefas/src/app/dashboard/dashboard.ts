// src/app/dashboard/dashboard.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables, ChartConfiguration, ChartOptions } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})

export class Dashboard {
  // Dados simulados
  totalVeiculos: number = 1250;
  entradasSemana: number = 45;
  saidasSemana: number = 32;
  entradasMes: number = 180;
  saidasMes: number = 150;

  // Estatísticas do ano (totais por mês)
  estatisticasAno = [
    { mes: 'Jan', entradas: 200, saidas: 180 },
    { mes: 'Fev', entradas: 220, saidas: 190 },
    { mes: 'Mar', entradas: 250, saidas: 210 },
    { mes: 'Abr', entradas: 230, saidas: 200 },
    { mes: 'Mai', entradas: 240, saidas: 220 },
    { mes: 'Jun', entradas: 260, saidas: 240 },
    { mes: 'Jul', entradas: 270, saidas: 250 },
    { mes: 'Ago', entradas: 280, saidas: 260 },
    { mes: 'Set', entradas: 290, saidas: 270 },
    { mes: 'Out', entradas: 300, saidas: 280 },
    { mes: 'Nov', entradas: 310, saidas: 290 },
    { mes: 'Dez', entradas: 320, saidas: 300 }
  ];

  // Método para calcular o saldo (entradas - saídas) do ano
  getSaldoAno(): number {
    return this.estatisticasAno.reduce((acc, stat) => acc + (stat.entradas - stat.saidas), 0);
  }

  // ---------- GRÁFICO ----------
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: this.estatisticasAno.map(e => e.mes),
    datasets: [
      { data: this.estatisticasAno.map(e => e.entradas), label: 'Entradas', backgroundColor: '#69ae52' },
      { data: this.estatisticasAno.map(e => e.saidas), label: 'Saídas', backgroundColor: '#184267' }
    ]
  };

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {},
      y: { beginAtZero: true }
    },
    plugins: {
      legend: { position: 'bottom' }
    }
  };
}
