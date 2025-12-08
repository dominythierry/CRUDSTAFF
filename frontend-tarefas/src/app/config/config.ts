import { Component, OnInit } from '@angular/core';
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

  formDados!: FormGroup;
  formSenha!: FormGroup;
  
  loading = false;
  mensagemSucesso = '';
  mensagemErro = '';
  
  mostrarSenha = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    // Formulário de dados pessoais
    this.formDados = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: [''],
      endereco: [''],
      cidade: [''],
      estado: ['', Validators.maxLength(2)],
      cep: ['']
    });

    // Formulário de alteração de senha
    this.formSenha = this.fb.group({
      senhaAtual: ['', Validators.required],
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required]
    }, { validators: this.validarSenhasIguais });

    // Carregar dados do usuário
    this.carregarDados();
  }

  carregarDados(): void {
    this.loading = true;
    this.usuarioService.getPerfil().subscribe({
      next: (usuario) => {
        this.formDados.patchValue({
          nome: usuario.nome || '',
          email: usuario.email || '',
          telefone: usuario.telefone || '',
          endereco: usuario.endereco || '',
          cidade: usuario.cidade || '',
          estado: usuario.estado || '',
          cep: usuario.cep || ''
        });
        this.loading = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar dados:', erro);
        this.mostrarErro('Erro ao carregar dados do usuário');
        this.loading = false;
      }
    });
  }

  salvarDados(): void {
    if (this.formDados.invalid) {
      this.mostrarErro('Preencha todos os campos obrigatórios corretamente');
      return;
    }

    this.loading = true;
    this.limparMensagens();

    const dados = this.formDados.value;

    this.usuarioService.atualizarPerfil(dados).subscribe({
      next: (response) => {
        this.mostrarSucesso('Dados atualizados com sucesso!');
        this.loading = false;
      },
      error: (erro) => {
        console.error('Erro ao atualizar dados:', erro);
        const mensagem = erro.error?.erro || 'Erro ao atualizar dados';
        this.mostrarErro(mensagem);
        this.loading = false;
      }
    });
  }

  alterarSenha(): void {
    if (this.formSenha.invalid) {
      this.mostrarErro('Preencha todos os campos de senha corretamente');
      return;
    }

    const { senhaAtual, novaSenha, confirmarSenha } = this.formSenha.value;

    if (novaSenha !== confirmarSenha) {
      this.mostrarErro('As senhas não coincidem');
      return;
    }

    this.loading = true;
    this.limparMensagens();

    this.usuarioService.alterarSenha(senhaAtual, novaSenha).subscribe({
      next: (response) => {
        this.mostrarSucesso('Senha alterada com sucesso!');
        this.formSenha.reset();
        this.loading = false;
      },
      error: (erro) => {
        console.error('Erro ao alterar senha:', erro);
        const mensagem = erro.error?.erro || 'Erro ao alterar senha';
        this.mostrarErro(mensagem);
        this.loading = false;
      }
    });
  }

  // Validador customizado para verificar se as senhas são iguais
  validarSenhasIguais(group: FormGroup): { [key: string]: boolean } | null {
    const novaSenha = group.get('novaSenha')?.value;
    const confirmarSenha = group.get('confirmarSenha')?.value;
    
    if (novaSenha && confirmarSenha && novaSenha !== confirmarSenha) {
      return { senhasNaoCoincidem: true };
    }
    return null;
  }

  // Máscara para telefone (XX) XXXXX-XXXX
  aplicarMascaraTelefone(event: any): void {
    let valor = event.target.value.replace(/\D/g, '');
    
    if (valor.length <= 11) {
      valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
      valor = valor.replace(/(\d)(\d{4})$/, '$1-$2');
    }
    
    this.formDados.patchValue({ telefone: valor }, { emitEvent: false });
  }

// Máscara para CEP XXXXX-XXX e busca automática
aplicarMascaraCep(event: any): void {
  let valor = event.target.value.replace(/\D/g, '');
  
  if (valor.length <= 8) {
    valor = valor.replace(/^(\d{5})(\d)/, '$1-$2');
  }
  
  this.formDados.patchValue({ cep: valor }, { emitEvent: false });

  // Busca endereço automaticamente quando CEP tiver 8 dígitos
  if (valor.replace(/\D/g, '').length === 8) {
    this.buscarEnderecoPorCep(valor.replace(/\D/g, ''));
  }
}

// Buscar endereço pela API ViaCEP
buscarEnderecoPorCep(cep: string): void {
  if (cep.length !== 8) {
    return;
  }

  this.loading = true;
  
  // Chama a API ViaCEP diretamente
  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(response => response.json())
    .then(dados => {
      if (dados.erro) {
        this.mostrarErro('CEP não encontrado');
        this.loading = false;
        return;
      }

      // Preenche automaticamente os campos
      this.formDados.patchValue({
        endereco: dados.logradouro || '',
        cidade: dados.localidade || '',
        estado: dados.uf || ''
      });

      this.loading = false;
    })
    .catch(erro => {
      console.error('Erro ao buscar CEP:', erro);
      this.mostrarErro('Erro ao buscar CEP');
      this.loading = false;
    });
}

  toggleMostrarSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }

  mostrarSucesso(mensagem: string): void {
    this.mensagemSucesso = mensagem;
    this.mensagemErro = '';
    setTimeout(() => this.mensagemSucesso = '', 5000);
  }

  mostrarErro(mensagem: string): void {
    this.mensagemErro = mensagem;
    this.mensagemSucesso = '';
  }

  limparMensagens(): void {
    this.mensagemSucesso = '';
    this.mensagemErro = '';
  }
}