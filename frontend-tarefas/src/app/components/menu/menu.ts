import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './menu.html',
  styleUrls: ['./menu.css'] // Corrigido: styleUrls (array) ao invés de styleUrl
})
export class Menu {}