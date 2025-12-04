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

  constructor(private fb: FormBuilder, private carrosService: CarrosService ) {
    this.formRegistro = this.fb.group({
      placa: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      cor: ['', Validators.required],
      ano: ['', [Validators.required, Validators.min(1950)]],
      motivoRecolhimento: ['', Validators.required],
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
      },
      error: (err) => {
        console.error('error saving', err);
        this.loading = false;
      }
    });
  }
}