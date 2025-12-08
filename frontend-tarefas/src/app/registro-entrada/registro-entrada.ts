import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CarrosService } from '../services/carros';

@Component({
  selector: 'app-registro-entrada',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './registro-entrada.html',
  styleUrls: ['./registro-entrada.css']
})
export class RegistroVeiculoComponent {
  
  formRegistro!: FormGroup;
  enviado = false;
  loading = false;
  showSuccessModal = false;
  showErrorModal = false;
  showValidationModal = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private carrosService: CarrosService ) {
  this.formRegistro = this.fb.group({
      placa: ['', [
        Validators.required,
        Validators.pattern(/^[A-Z]{3}-?\d{4}$/i)  // aceita ABC1234 ou ABC-1234
      ]],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      cor: ['', [
        Validators.required,
        Validators.pattern(/^[\p{L}\s]+$/u)  // só letras e espaços (inclui acentos)
      ]],
      ano: ['', [
        Validators.required,
        Validators.pattern(/^\d{4}$/),
        Validators.min(1900),
        Validators.max(new Date().getFullYear() + 1)
      ]],
      motivoRecolhimento: ['', Validators.required]
    });
  }

  registrar() {
    console.log('registrar() called');
    this.enviado = true;

    // touch all controls so errors become visible
    Object.keys(this.formRegistro.controls).forEach(key => {
      this.formRegistro.controls[key].markAsTouched();
    });

    if (this.formRegistro.invalid) {
      console.log('form invalid', this.formRegistro.errors);
      // also log each invalid control
      Object.keys(this.formRegistro.controls).forEach(key => {
        const control = this.formRegistro.controls[key];
        if (control.invalid) console.log('invalid control:', key, control.errors);
      });
      
      // Mostrar modal de validação
      this.showValidationModal = true;
      return;
    }


    


    this.loading = true;

    // Map form value to backend field names (backend expects `motivo`)
    const v = this.formRegistro.value;
    const payload = {
      placa: v.placa,
      marca: v.marca,
      modelo: v.modelo,
      cor: v.cor,
      ano: v.ano,
      motivo: v.motivoRecolhimento
    };

    console.log('sending payload', payload);

    this.carrosService.cadastrarCarro(payload).subscribe({
      next: (res) => {
        console.log('saved to backend', res);
        this.formRegistro.reset();
        this.enviado = false;
        this.loading = false;
        this.showSuccessModal = true;
      },
      error: (err) => {
        console.error('error saving', err);
        this.loading = false;
        this.errorMessage = err.error?.erro || err.error?.message || 'Erro ao registrar veículo. Tente novamente.';
        this.showErrorModal = true;
      }
    });
  }

formatarPlaca(event: any) {
    let valor = event.target.value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    if (valor.length > 3) {
      valor = valor.substring(0, 3) + '-' + valor.substring(3, 7);
    }
    this.formRegistro.get('placa')?.setValue(valor, { emitEvent: false });
  }

  // Permite apenas letras (e espaços) na cor
  apenasLetras(event: any) {
    const valor = event.target.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, '');
    this.formRegistro.get('cor')?.setValue(valor, { emitEvent: false });
  }

  // Permite apenas números no ano (máximo 4 dígitos)
  apenasNumeros(event: any) {
    const valor = event.target.value.replace(/\D/g, '').substring(0, 4);
    this.formRegistro.get('ano')?.setValue(valor, { emitEvent: false });
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }

  closeErrorModal() {
    this.showErrorModal = false;
  }

  closeValidationModal() {
    this.showValidationModal = false;
  }


}