import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule], // Necessário para usar routerLink no HTML
  templateUrl: './home.html',
  styleUrls: ['./home.css'] // Corrigido: styleUrls (array) ao invés de styleUrl
})
export class Home {}