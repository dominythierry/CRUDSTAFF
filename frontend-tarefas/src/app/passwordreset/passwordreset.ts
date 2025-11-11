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
  
  goToRegistrar() {
    this.router.navigate(['/registrar']);
  }
  
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]), // Adicionado Validators.email
    senha: new FormControl('', Validators.required),
  });



  ngOnInit() {}

  login() {
    console.log('login() chamado'); // Teste no console

    if (this.loginForm.invalid) {
      console.log('Form inválido');
      return;
    }

    const { email, senha } = this.loginForm.value;

    this.http.post('http://localhost:3000/tarefas/login', { email, senha })
      .subscribe({
        next: (response: any) => {
          console.log('Login bem-sucedido:', response);
          const token = response.token;
          localStorage.setItem('token', token);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Erro no login:', err);
        }
      });
  }
}
