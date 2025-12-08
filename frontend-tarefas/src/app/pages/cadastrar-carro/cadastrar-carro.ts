import { Component } from '@angular/core';
import { CarrosService, Carro } from '../../services/carros';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-cadastrar-carro',
  templateUrl: './cadastrar-carro.html',
  imports: [FormsModule, HttpClientModule, CommonModule],
  styleUrl: './cadastrar-carro.css',
  standalone: true
})
export class CadastrarCarroComponent {

  carro: Carro = {
    marca: '',
    modelo: '',
    ano: 0,
    cor: '',
    placa: '',
    motivo: ''
  };

  constructor(private carrosService: CarrosService) {}

  salvar() {
    this.carrosService.cadastrarCarro(this.carro).subscribe(() => {
      alert('Carro cadastrado!');
      this.limpar();
    });
  }

  limpar() {
    this.carro = { marca: '', modelo: '', ano: 0, cor: '', placa: '', motivo: '' };
  }
}
