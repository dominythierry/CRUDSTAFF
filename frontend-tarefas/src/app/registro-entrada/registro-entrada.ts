import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CarrosService } from '../services/carros';

@Component({
  selector: 'app-registro-entrada',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro-entrada.html',
  styleUrls: ['./registro-entrada.css']
})
export class RegistroVeiculoComponent {
  
  formRegistro!: FormGroup;
  enviado = false;
  loading = false;

  constructor(private fb: FormBuilder
    , private carrosService: CarrosService
  ) {
    this.formRegistro = this.fb.group({
      placa: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      cor: ['', Validators.required],
      ano: ['', [Validators.required, Validators.min(1950)]],
      motivo: ['', Validators.required],
    });
  }

  registrar() {
    this.enviado = true;

    if (this.formRegistro.invalid) return;

    this.loading = true;

    setTimeout(() => {
      console.log(this.formRegistro.value);
      this.formRegistro.reset();
      this.enviado = false;
      this.loading = false;
    }, 1200);
  }
}