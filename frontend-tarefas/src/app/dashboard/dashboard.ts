import { Component, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { CarrosService } from '../services/carros';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    DatePipe,
    HttpClientModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements AfterViewInit, OnInit {

  totalVeiculos = 0;
  aguardandoLiberacao = 0;
  arrecadacaoSemanal = 0;
  arrecadacaoMensal = 0;
  ultimosVeiculos: any[] = [];
  loading = true;

  constructor(private carrosService: CarrosService) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.carrosService.listarCarros().subscribe({
      next: (veiculos: any[]) => {
        // Total de veículos
        this.totalVeiculos = veiculos.length;

        // Aguardando liberação
        this.aguardandoLiberacao = veiculos.filter(v => 
          v.status === 'Aguardando' || 
          v.motivo?.toLowerCase().includes('aguardando') ||
          v.motivoRecolhimento?.toLowerCase().includes('aguardando')
        ).length;

        // Últimos 5 veículos adicionados
        this.ultimosVeiculos = veiculos
          .sort((a, b) => {
            const dateA = new Date(a.criado_em || a.createdAt || a.created_at || 0);
            const dateB = new Date(b.criado_em || b.createdAt || b.created_at || 0);
            return dateB.getTime() - dateA.getTime();
          })
          .slice(0, 5)
          .map(v => ({
            placa: v.placa || '—',
            tipo: v.modelo || v.marca || v.tipo || '—',
            status: v.motivo || v.motivoRecolhimento || v.status || '—',
            data: new Date(v.criado_em || v.createdAt || v.created_at)
          }));

        // Calcular arrecadação (exemplo: R$ 50 por veículo/dia)
        const valorPorDia = 50;
        const hoje = new Date();
        const umaSemanaAtras = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000);
        const umMesAtras = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000);

        this.arrecadacaoSemanal = veiculos.filter(v => {
          const dataEntrada = new Date(v.criado_em || v.createdAt || v.created_at);
          return dataEntrada >= umaSemanaAtras;
        }).length * valorPorDia * 7;

        this.arrecadacaoMensal = veiculos.filter(v => {
          const dataEntrada = new Date(v.criado_em || v.createdAt || v.created_at);
          return dataEntrada >= umMesAtras;
        }).length * valorPorDia * 30;

        this.loading = false;
        
        // Renderizar gráficos após carregar dados
        setTimeout(() => {
          this.renderCharts(veiculos);
        }, 100);
      },
      error: (err) => {
        console.error('Erro ao carregar dados:', err);
        this.loading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    // Os gráficos serão renderizados após carregar os dados
  }

  renderCharts(veiculos: any[]): void {
    this.renderTipoChart(veiculos);
    this.renderStatusChart(veiculos);
  }

  renderTipoChart(veiculos: any[]) {
    // Contar tipos de veículos
    const tipos: { [key: string]: number } = {};
    veiculos.forEach(v => {
      const tipo = v.modelo || v.marca || v.tipo || 'Outros';
      tipos[tipo] = (tipos[tipo] || 0) + 1;
    });

    const labels = Object.keys(tipos);
    const data = Object.values(tipos);
    const colors = ['#003893', '#F28C28', '#FFCC00', '#1E5AA8', '#4CAF50', '#E91E63'];

    new Chart("tipoChart", {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors.slice(0, labels.length)
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true
      }
    });
  }

  renderStatusChart(veiculos: any[]) {
    // Contar status dos veículos
    const status: { [key: string]: number } = {};
    veiculos.forEach(v => {
      const st = v.motivo || v.motivoRecolhimento || v.status || 'Outros';
      status[st] = (status[st] || 0) + 1;
    });

    const labels = Object.keys(status);
    const data = Object.values(status);

    new Chart("statusChart", {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Quantidade',
          data: data,
          backgroundColor: '#003893'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
