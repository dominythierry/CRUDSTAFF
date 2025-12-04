import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../usuario.service';
@Component({
  selector: 'app-usuario-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './config.html',
  styleUrls: ['./config.css']
})
export class UsuarioConfigComponent implements OnInit {

  form!: FormGroup;

  userId = 1; // depois você pega do login

  constructor(
    private fb: FormBuilder,
    @Inject(UsuarioService) private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    // initialize form here (avoid using fb at property initialization time)
    this.form = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['']
    });

    this.usuarioService.getById(this.userId).subscribe((user: any) => {
      if (user) {
        this.form.patchValue({
          nome: user.nome,
          email: user.email
        });
      }
    });
  }

  salvar() {
    if (this.form.invalid) return;

    const dados = this.form.value;

    this.usuarioService.atualizar(this.userId, dados)
      .subscribe(() => {
        alert("Configurações atualizadas!");
      });
  }
}
