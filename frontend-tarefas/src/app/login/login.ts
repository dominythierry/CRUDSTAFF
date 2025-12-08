import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, HttpClientModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],  // Corrigido
})
export class LoginComponent implements OnInit {
  showRejectedModal = false;
  rejectedMessage = '';
  showSuccessModal = false;
  showErrorModal = false;
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) { }
  
  goToRegistrar() {
    this.router.navigate(['/registrar']);
  }

  closeRejectedModal() {
    this.showRejectedModal = false;
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
    this.router.navigate(['/dashboard']);
  }

  closeErrorModal() {
    this.showErrorModal = false;
  }
  
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]), // Adicionado Validators.email
    senha: new FormControl('', Validators.required),
  });



  ngOnInit() {}

login() {
    console.log('🔐 login() chamado');

    if (this.loginForm.invalid) {
      console.log('❌ Form inválido');
      return;
    }

    const { email, senha } = this.loginForm.value;
    console.log('📤 Enviando payload:', { email, senha });

    this.http.post('http://localhost:3000/tarefas/login', { email, senha })
      .subscribe({
        next: (response: any) => {
          console.log('✅ Login bem-sucedido:', response);
          console.log('🎫 Token recebido:', response.token);
          
          // Salvar token
          localStorage.setItem('token', response.token);
          console.log('💾 Token salvo no localStorage');
          
          // Mostrar modal de sucesso
          this.showSuccessModal = true;
        },
        error: (err) => {
          console.error('❌ Erro no login:', err);
          
          // Verifica se foi rejeitado
          if (err.error?.status === 'rejeitado') {
            this.rejectedMessage = err.error.message || 'Seu registro foi rejeitado. Entre em contato com o administrador.';
            this.showRejectedModal = true;
          } else if (err.error?.status === 'pendente') {
            this.errorMessage = 'Seu registro está aguardando aprovação do administrador.';
            this.showErrorModal = true;
          } else {
            this.errorMessage = err.error?.message || 'Email ou senha incorretos. Tente novamente.';
            this.showErrorModal = true;
          }
        }
      });
/*
login() {
    console.log('login() chamado');

    if (this.loginForm.invalid) {
      console.log('Form inválido');
      return;
    }

    const { email, senha } = this.loginForm.value;
    console.log('Enviando payload ->', { email, senha }); // <-- log do payload

    this.http.post('http://localhost:3000/tarefas/login', { email, senha })
      .subscribe({
        next: (response: any) => {
          console.log('Login bem-sucedido:', response);
          const token = response.token;
          localStorage.setItem('token', token);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Erro no login (frontend):', err);
          // mostrar mensagem clara pro usuário
          alert(err.error?.message || `Erro ${err.status}: ${err.statusText}`);
        }
      });
  }
}
*/
}}