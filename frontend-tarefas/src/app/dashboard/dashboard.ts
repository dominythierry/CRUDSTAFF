import { Component, AfterViewInit } from '@angular/core';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,      // habilita *ngFor e *ngIf
    DecimalPipe,       // habilita | number
    DatePipe           // habilita | date
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements AfterViewInit {

  totalVeiculos = 325;
  aguardandoLiberacao = 48;

  arrecadacaoSemanal = 18250.50;
  arrecadacaoMensal = 73920.00;

  ultimosVeiculos = [
    { placa: "ABC-1234", tipo: "Carro", status: "Aguardando Liberação", data: new Date() },
    { placa: "XYZ-9900", tipo: "Moto", status: "Apreendido", data: new Date() },
    { placa: "JKL-6754", tipo: "Caminhão", status: "Liberado", data: new Date() },
    { placa: "RTS-8890", tipo: "Carro", status: "Apreendido", data: new Date() }
  ];

  ngAfterViewInit(): void {
    this.renderTipoChart();
    this.renderStatusChart();
  }

  renderTipoChart() {
    new Chart("tipoChart", {
      type: 'doughnut',
      data: {
        labels: ['Carros', 'Motos', 'Caminhões', 'Ônibus'],
        datasets: [{
          data: [210, 70, 35, 10],
          backgroundColor: ['#003893', '#F28C28', '#FFCC00', '#1E5AA8']
        }]
      }
    });
  }

  renderStatusChart() {
    new Chart("statusChart", {
      type: 'bar',
      data: {
        labels: ['Apreendidos', 'Liberados', 'Aguardando'],
        datasets: [{
          label: 'Quantidade',
          data: [180, 97, 48],
          backgroundColor: ['#003893', '#1E5AA8', '#F28C28']
        }]
      }
    });
  }
}
