// aprovar-registro.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // ← Adicione isso


@Component({
  selector: 'app-rejeitar-registro',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="approval-container">
      <div class="approval-card" *ngIf="!loading">
        <div class="icon" [ngClass]="{'success': success, 'error': error}">
          <span *ngIf="loading">⏳</span>
          <span *ngIf="success">✓</span>
          <span *ngIf="error">✗</span>
        </div>
        
        <h1>{{ title }}</h1>
        <p class="message">{{ message }}</p>
        
        <div class="user-info" *ngIf="usuario">
          <p><strong>Usuário:</strong> {{ usuario.nome }}</p>
          <p><strong>Email:</strong> {{ usuario.email }}</p>
        </div>
        
        <button class="btn-primary" (click)="voltarInicio()">
          Voltar para o Início
        </button>
      </div>
      
      <div class="loading" *ngIf="loading">
        <div class="spinner"></div>
        <p>Processando...</p>
      </div>
    </div>
  `,
  styles: [`
    /* Mesmos estilos do componente de aprovação */
    .approval-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    
    .approval-card {
      background: white;
      border-radius: 16px;
      padding: 40px;
      max-width: 500px;
      width: 100%;
      text-align: center;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      animation: slideUp 0.5s ease-out;
    }
    
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      font-size: 48px;
    }
    
    .icon.success {
      background: #d4edda;
      color: #28a745;
    }
    
    .icon.error {
      background: #f8d7da;
      color: #dc3545;
    }
    
    h1 {
      color: #333;
      margin-bottom: 15px;
      font-size: 28px;
    }
    
    .message {
      color: #666;
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 25px;
    }
    
    .user-info {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      text-align: left;
    }
    
    .user-info p {
      margin: 8px 0;
      color: #555;
    }
    
    .user-info strong {
      color: #003d7a;
    }
    
    .btn-primary {
      background: #003d7a;
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-top: 10px;
    }
    
    .btn-primary:hover {
      background: #002855;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 61, 122, 0.3);
    }
    
    .loading {
      text-align: center;
      color: white;
    }
    
    .spinner {
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top: 4px solid white;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class RejeitarRegistroComponent implements OnInit {
  loading = true;
  success = false;
  error = false;
  title = '';
  message = '';
  usuario: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.paramMap.get('token');
    if (token) {
      this.rejeitarRegistro(token);
    } else {
      this.showError('Token inválido');
    }
  }

  rejeitarRegistro(token: string) {
    this.http.get(`http://localhost:3000/tarefas/rejeitar/${token}`)
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          this.success = true;
          this.title = '⚠️ Registro Rejeitado';
          this.message = response.mensagem;
          this.usuario = response.usuario;
        },
        error: (error) => {
          this.loading = false;
          this.showError(error.error?.erro || 'Erro ao processar rejeição');
        }
      });
  }

  showError(msg: string) {
    this.error = true;
    this.title = '❌ Erro';
    this.message = msg;
  }

  voltarInicio() {
    this.router.navigate(['/login']);
  }
}