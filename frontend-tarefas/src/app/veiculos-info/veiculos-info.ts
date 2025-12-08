import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarrosService } from '../services/carros';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCommonModule } from '@angular/material/core';


@Component({
  selector: 'app-veiculos-info',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCommonModule,
    MatSnackBarModule
  ],
  templateUrl: './veiculos-info.html',
  styleUrls: ['./veiculos-info.css']
})
export class VeiculosInfo implements OnInit {
  searchTerm = '';

  veiculos: Array<{
    id: number;
    placa: string;
    tipo: string;
    status: string;
    dataEntrada: Date | null;
    dataSaida: Date | null;
  }> = [];

  loading = false;
  error = '';
  editingId: number | null = null;
  editModel: any = {};
  saving = false;
  
  // Modais de feedback
  showSuccessModal = false;
  showErrorModal = false;
  showDeleteModal = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private carrosService: CarrosService,
    private snackBar: MatSnackBar // <-- injetado para feedback
  ) {}

  ngOnInit(): void {
    this.loadVeiculos();
  }

  private loadVeiculos() {
    this.loading = true;
    this.error = '';
    this.carrosService.listarCarros().subscribe({
      next: (data) => {
        this.veiculos = (data || []).map((d: any) => ({
          id: d.id,
          placa: d.placa || '—',
          tipo: d.modelo || d.marca || '—',
          status: d.motivo || d.motivoRecolhimento || '—',
          dataEntrada: d.dataEntrada
            ? new Date(d.dataEntrada)
            : d.criado_em
            ? new Date(d.criado_em)
            : d.createdAt
            ? new Date(d.createdAt)
            : d.created_at
            ? new Date(d.created_at)
            : null,
          dataSaida: d.dataSaida
            ? new Date(d.dataSaida)
            : d.saida_em
            ? new Date(d.saida_em)
            : null
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar veículos', err);
        this.error = 'Erro ao carregar veículos';
        this.loading = false;
      }
    });
  }

  get veiculosFiltrados() {
    const term = (this.searchTerm || '').toLowerCase();
    if (!term) return this.veiculos;
    return this.veiculos.filter(v =>
      (v.placa || '').toLowerCase().includes(term) ||
      (v.tipo || '').toLowerCase().includes(term) ||
      (v.status || '').toLowerCase().includes(term)
    );
  }

startEdit(v: any) {
  this.editingId = v.id;
  this.editModel = {
    placa: v.placa,
    tipo: v.tipo,
    status: v.status,
    dataEntrada: v.dataEntrada ? this.toInputDate(v.dataEntrada) : '',
    dataSaida: v.dataSaida ? this.toInputDate(v.dataSaida) : ''
  };
}


  cancelEdit() {
    this.editingId = null;
    this.editModel = {};
  }
saveEdit(v: any) {
  if (!v.id) return;
  this.saving = true;

  const payload: any = {
    placa: this.editModel.placa,
    modelo: this.editModel.tipo,
    motivo: this.editModel.status
  };

  // DATA DE ENTRADA → nome que o backend entende: entrada_em
  if (this.editModel.dataEntrada) {
    const entrada = new Date(this.editModel.dataEntrada);
    payload.dataEntrada = entrada.toISOString().slice(0, 10);
  }

  // DATA DE SAÍDA → nome que o backend entende: saida_em
  if (this.editModel.dataSaida) {
    const saida = new Date(this.editModel.dataSaida);
    payload.saida_em = saida.toISOString().slice(0, 19).replace('T', ' ');
  }

  console.log('Payload enviado:', payload); // agora vai aparecer entrada_em

  this.carrosService.atualizarCarro(v.id, payload).subscribe({
    next: (res: any) => {
      // Atualiza o objeto na tabela
      v.placa = this.editModel.placa;
      v.tipo = this.editModel.tipo;
      v.status = this.editModel.status;
      v.dataEntrada = this.editModel.dataEntrada ? new Date(this.editModel.dataEntrada) : v.dataEntrada;
      v.dataSaida = this.editModel.dataSaida ? new Date(this.editModel.dataSaida) : v.dataSaida;

      this.saving = false;
      this.cancelEdit();
      
      // Mostrar modal de sucesso
      this.successMessage = 'Alterações salvas com sucesso!';
      this.showSuccessModal = true;
    },
    error: (err) => {
      console.error('Erro ao salvar:', err);
      this.saving = false;
      
      // Mostrar modal de erro
      this.errorMessage = err.error?.erro || err.error?.message || 'Erro ao salvar alterações. Tente novamente.';
      this.showErrorModal = true;
    }
  });
}
  // NOVO: Confirmação e exclusão
  confirmarExclusao(veiculo: any) {
    const placa = veiculo.placa || 'este veículo';
    if (confirm(`Tem certeza que deseja EXCLUIR o veículo placa ${placa}?\n\nEsta ação NÃO pode ser desfeita!`)) {
      this.excluirVeiculo(veiculo.id);
    }
  }

  excluirVeiculo(id: number) {
    this.carrosService.excluirCarro(id).subscribe({
      next: (res: any) => {
        // Remove da lista imediatamente
        this.veiculos = this.veiculos.filter(v => v.id !== id);
        
        // Mostrar modal de sucesso
        this.successMessage = 'Veículo excluído com sucesso!';
        this.showDeleteModal = true;
      },
      error: (err) => {
        console.error('Erro ao excluir veículo', err);
        
        // Mostrar modal de erro
        this.errorMessage = err.error?.erro || err.error?.message || 'Erro ao excluir veículo. Tente novamente.';
        this.showErrorModal = true;
      }
    });
  }

  private toInputDate(d: Date) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  // Formata placa no formato ABC-1234
  onPlacaChange() {
    if (!this.editModel.placa) return;
    
    // Remove caracteres especiais, exceto letras e números
    let placa = this.editModel.placa.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    // Limita a 7 caracteres (3 letras + 4 números)
    placa = placa.substring(0, 7);
    
    // Aplica formatação ABC-1234
    if (placa.length > 3) {
      placa = placa.replace(/(\w{3})(\w{1,4})/, '$1-$2');
    }
    
    this.editModel.placa = placa;
  }

  // Bloqueia entrada de caracteres inválidos na placa
  onPlacaKeyPress(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    const char = String.fromCharCode(charCode);
    
    // Permite apenas letras (A-Z) e números (0-9)
    if (!/[a-zA-Z0-9]/.test(char)) {
      event.preventDefault();
    }
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }

  closeErrorModal() {
    this.showErrorModal = false;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
  }
}