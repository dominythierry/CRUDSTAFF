import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,FormsModule, CommonModule, HttpClientModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    senha: new FormControl('', Validators.required),
  });

  constructor(
    private http: HttpClient,
    private router: Router) { }

ngOnInit() {}
  login() {
    if (this.loginForm.invalid) {
      console.log('Form inválido');
      return;
    }
    const { email, senha } = this.loginForm.value;

    this.http.post('https://localhost:3000/tarefas/login', { email, senha })
      .subscribe({
        next: (response: any) => {
        const token = response.token;
        localStorage.setItem('token', token);
        this.router.navigate(['/']);
      },
        error: (err) => {
          console.error('Erro no login:', err);
     }
    });
  }
}