import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro-entrada',
  templateUrl: './registro-entrada.html',
  styleUrls: ['./registro-entrada.css']
})
export class RegistroVeiculoComponent {

  formRegistro!: FormGroup;
  enviado = false;
  loading = false;

  constructor(private fb: FormBuilder) {
    this.formRegistro = this.fb.group({
      placa: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(7)]],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      cor: ['', Validators.required],
      ano: ['', [Validators.required, Validators.min(1950), Validators.max(2050)]],
      motivoRecolhimento: ['', Validators.required],
    });
  }

  registrar() {
    this.enviado = true;

    if (this.formRegistro.invalid) return;

    this.loading = true;

    setTimeout(() => {
      console.log('Novo veículo registrado:', this.formRegistro.value);
      this.formRegistro.reset();
      this.enviado = false;
      this.loading = false;
    }, 1800);
  }
}
