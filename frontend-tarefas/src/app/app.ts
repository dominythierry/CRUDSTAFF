import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Sidenav } from './sidenav/sidenav';
import { Body } from './body/body';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Body, FormsModule, HttpClientModule, Sidenav, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  title = 'sidenav';
  isSidenavCollapsed = false;
  screenWidth = 0;
  mostrarSidenav = true; // Controla se o sidenav deve aparecer

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Monitora mudanças de rota
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Lista de rotas onde o sidenav NÃO deve aparecer
      const rotasSemSidenav = ['/login', '/registrar', '/passwordreset'];
      this.mostrarSidenav = !rotasSemSidenav.includes(event.url);
    });
  }

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSidenavCollapsed = data.collapsed;
  }
}