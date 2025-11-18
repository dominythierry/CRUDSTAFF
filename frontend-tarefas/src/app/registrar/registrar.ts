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

// ⭐️ NOVA FUNÇÃO: Chamada no evento 'input' do campo CPF
onCpfChange() {
  // Remove tudo que não for dígito e limita a 11 caracteres
  this.cpf = this.cpf.replace(/\D/g, '').substring(0, 11);
}

  redefinirsenha() {
    window.location.href = '/redefinirsenha';
  }
  goToLogin() {
    window.location.href = '/login';
  }
  goToReset() {
    window.location.href = '/passwordreset';
  }
  registrar() {

      this.mensagem = '';

    if (!this.nome || !this.cpf || !this.email || !this.senha || !this.confirmSenha) {
            this.mensagem = 'Erro: Por favor, preencha todos os campos obrigatórios.';
            console.log('Tentativa de registro falhou: campos incompletos');
            return; // Interrompe a função se faltar algum campo
        }

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