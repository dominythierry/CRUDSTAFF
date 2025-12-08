import { Component, OnInit } from '@angular/core';
import { CarrosService, Carro } from '../../services/carros';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  imports: [FormsModule, HttpClientModule, CommonModule],
  selector: 'app-listar-carros',
  templateUrl: './listar-carros.html',
})
export class ListarCarrosComponent implements OnInit {

  carros: Carro[] = [];

  constructor(private carrosService: CarrosService) {}

  ngOnInit() {
    this.carrosService.listarCarros().subscribe(data => {
      this.carros = data;
    });
  }

  excluir(id: number) {
    this.carrosService.excluirCarro(id).subscribe(() => {
      this.carros = this.carros.filter(c => c.id !== id);
    });
  }
}
