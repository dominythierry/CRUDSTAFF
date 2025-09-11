import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registrar',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './registrar.html',
  styleUrl: './registrar.css'
})
export class RegistrarComponent {
  nome = '';
  cpf = '';
  email = '';
  senha = '';
  confirmSenha = '';
  mensagem = '';

  constructor(private http: HttpClient) {}

  registrar() {
    if (this.senha !== this.confirmSenha) {
      this.mensagem = 'As senhas não coincidem!';
      return;
    }

    this.http.post('http://localhost:3000/tarefas/registrar', {
      nome: this.nome,
      cpf: this.cpf,
      email: this.email,
      senha: this.senha
    }).subscribe({
      next: (res: any) => {
        this.mensagem = 'Usuário registrado com sucesso!';
        // Redirecionar para login ou logar automaticamente, se desejar
      },
      error: (err) => {
        this.mensagem = err.error?.erro || 'Erro ao registrar usuário';
      }
    });
  }
}