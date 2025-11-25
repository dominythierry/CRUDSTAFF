import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-veiculos-info',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule      // necessário para ngModel
  ],
  templateUrl: './veiculos-info.html',
  styleUrls: ['./veiculos-info.css']
})
export class VeiculosInfo {

  searchTerm = '';

  veiculos = [
    { placa: 'ABC-1234', tipo: 'Carro', status: 'Liberado', dataEntrada: new Date('2024-10-20'), dataSaida: new Date('2024-10-25') },
    { placa: 'XYZ-9900', tipo: 'Moto', status: 'Apreendido', dataEntrada: new Date('2024-11-02'), dataSaida: null },
    { placa: 'JKL-6754', tipo: 'Caminhão', status: 'Aguardando Liberação', dataEntrada: new Date('2024-11-10'), dataSaida: null },
    { placa: 'RTS-8890', tipo: 'Carro', status: 'Apreendido', dataEntrada: new Date('2024-11-03'), dataSaida: null },
    { placa: 'DGH-2210', tipo: 'Ônibus', status: 'Liberado', dataEntrada: new Date('2024-10-18'), dataSaida: new Date('2024-10-19') }
  ];

  get veiculosFiltrados() {
    const term = this.searchTerm.toLowerCase();
    return this.veiculos.filter(v =>
      v.placa.toLowerCase().includes(term) ||
      v.tipo.toLowerCase().includes(term) ||
      v.status.toLowerCase().includes(term)
    );
  }
}
