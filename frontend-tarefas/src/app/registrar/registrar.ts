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
  showSuccessModal = false;
  showRejectedModal = false;
  rejectedMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(private http: HttpClient) {}

// ⭐️ NOVA FUNÇÃO: Chamada no evento 'input' do campo CPF
onCpfChange() {
  // Remove tudo que não for dígito
  let cpf = this.cpf.replace(/\D/g, '');
  
  // Limita a 11 dígitos
  cpf = cpf.substring(0, 11);
  
  // Aplica a formatação XXX.XXX.XXX-XX
  if (cpf.length > 9) {
    cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  } else if (cpf.length > 6) {
    cpf = cpf.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
  } else if (cpf.length > 3) {
    cpf = cpf.replace(/(\d{3})(\d{1,3})/, '$1.$2');
  }
  
  this.cpf = cpf;
}

// Bloqueia entrada de caracteres não numéricos
onCpfKeyPress(event: KeyboardEvent) {
  const charCode = event.which ? event.which : event.keyCode;
  // Permite apenas números (0-9)
  if (charCode < 48 || charCode > 57) {
    event.preventDefault();
  }
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

  closeModalAndGoToLogin() {
    this.showSuccessModal = false;
    this.goToLogin();
  }

  closeRejectedModal() {
    this.showRejectedModal = false;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  get senhasCoinciden() {
    return this.senha && this.confirmSenha && this.senha === this.confirmSenha;
  }

  get senhasNaoCoinciden() {
    return this.confirmSenha && this.senha !== this.confirmSenha;
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

    // Remove formatação do CPF antes de enviar (envia apenas números)
    const cpfSemFormatacao = this.cpf.replace(/\D/g, '');

    this.http.post('http://localhost:3000/tarefas/registrar', {
      nome: this.nome,
      cpf: cpfSemFormatacao,
      email: this.email,
      senha: this.senha
    }).subscribe({
      next: (res: any) => {
        this.showSuccessModal = true;
        this.mensagem = '';
        // Limpar formulário
        this.nome = '';
        this.cpf = '';
        this.email = '';
        this.senha = '';
        this.confirmSenha = '';
      },
      error: (err) => {
        // Detecta se é um email já cadastrado e rejeitado
        if (err.status === 409 && err.error?.status === 'rejeitado') {
          this.rejectedMessage = err.error.erro || 'Este email já foi rejeitado anteriormente. Entre em contato com o administrador.';
          this.showRejectedModal = true;
        } else {
          this.mensagem = err.error?.erro || 'Erro ao registrar usuário';
        }
      }
    });
  }
}