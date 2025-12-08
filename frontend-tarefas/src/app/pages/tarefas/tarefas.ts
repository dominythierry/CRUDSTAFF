import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Interface para definir a estrutura de uma tarefa
interface Tarefa {
  id?: number;
  titulo: string;
  descricao: string;
  status: string;
}

@Component({
  selector: 'app-tarefas',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './tarefas.html',
  styleUrls: ['./tarefas.css'],
})
export class Tarefas implements OnInit {
  tarefas: Tarefa[] = [];
  novaTarefa: Tarefa = { titulo: '', descricao: '', status: 'pendente' };
  mensagem: string = '';
  tipoMensagem: 'success' | 'danger' | 'warning' | 'info' = 'success';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.buscarTarefas();
  }

  buscarTarefas() {
    this.http
      .get<Tarefa[]>('http://localhost:3000/tarefas')
      .subscribe((res) => (this.tarefas = res));
  }

  adicionarTarefa() {
    this.http
      .post<Tarefa>('http://localhost:3000/tarefas', this.novaTarefa)
      .subscribe(() => {
        this.novaTarefa = { titulo: '', descricao: '', status: 'pendente' };
        this.buscarTarefas();
        this.exibirMensagem('Tarefa cadastrada com sucesso!', 'success');
      });
  }

  concluirTarefa(tarefa: Tarefa) {
    this.http
      .patch(`http://localhost:3000/tarefas/${tarefa.id}`, {
        status: 'concluida',
      })
      .subscribe(() => {
        this.exibirMensagem(`Tarefa "${tarefa.titulo}" concluída!`, 'info');
        this.buscarTarefas();
      });
  }

  excluirTarefa(id: number) {
    this.http.delete(`http://localhost:3000/tarefas/${id}`).subscribe(() => {
      this.exibirMensagem('Tarefa excluída com sucesso.', 'danger');
      this.buscarTarefas();
    });
  }

  exibirMensagem(
    texto: string,
    tipo: 'success' | 'danger' | 'warning' | 'info' = 'success'
  ) {
    this.mensagem = texto;
    this.tipoMensagem = tipo;
    setTimeout(() => {
      this.mensagem = '';
    }, 3000);
  }
}