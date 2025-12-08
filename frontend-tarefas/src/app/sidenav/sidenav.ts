import { Component, EventEmitter, Output, Inject, PLATFORM_ID, OnInit, Host, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { navbarData } from './nav-data';

interface SidenavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidenav.html',
  styleUrls: ['./sidenav.scss'],
})


export class Sidenav implements OnInit {

  @Output() onToggleSideNav = new EventEmitter<SidenavToggle>();

  collapsed = false;
  screenWidth = 0;
  navData = navbarData;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router  // ← INJETOU O Router AQUI
  ) {
    // só acessa o window se estiver no navegador
    if (isPlatformBrowser(this.platformId)) {
      this.screenWidth = window.innerWidth;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.emitToggle();
    }
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.emitToggle();
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.emitToggle();
  }

  // ← MÉTODO NOVO DE LOGOUT (só isso!)
  logout(): void {
    localStorage.removeItem('token');
    // localStorage.clear(); // opcional: limpa tudo
    this.router.navigate(['/login']);
  }


  private emitToggle(): void {
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth
    });
  }
}
