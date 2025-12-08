import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-passwordreset',
  imports: [ReactiveFormsModule, FormsModule, CommonModule, HttpClientModule],
  standalone: true,
  templateUrl: './passwordreset.html',
  styleUrls: ['./passwordreset.css'],  // Corrigido
})
export class Passwordreset implements OnInit {
  constructor(private http: HttpClient, private router: Router) { }
  
  mensagemSucesso: string = '';

  goToRegistrar() {
    this.router.navigate(['/registrar']);
  }

  goToLogin() {
  this.router.navigate(['/login']);
}
  
  ResetForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]), // Adicionado Validators.email
  });

  ngOnInit() {}

  passwordReset() {
    console.log('Enviando Senha'); // Teste no console

    this.mensagemSucesso = '';

    if (this.ResetForm.invalid) {
      console.log('Form inválido');
      return;
    }

    const {email} = this.ResetForm.value;

    this.http.post('http://localhost:3000/tarefas/passwordreset', {email})
      .subscribe({
        next: (response: any) => {
          console.log('Email enviado', response);
          const token = response.token;
          localStorage.setItem('token', token);

          this.mensagemSucesso = 'Sucesso! Verifique seu e-mail para as instruções de recuperação de senha.';

        },
        error: (err) => {
          console.error('Erro no login:', err);
          this.mensagemSucesso = 'Erro ao processar sua solicitação. Tente novamente.';
        }
      });
  }
}
