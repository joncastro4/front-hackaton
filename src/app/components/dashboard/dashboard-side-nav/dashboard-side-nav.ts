import { CommonModule } from '@angular/common'
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, HostListener } from '@angular/core'
import { Router, RouterModule } from '@angular/router'
import { AuthService } from '../../../services/auth-service'

@Component({
  selector: 'app-dashboard-side-nav',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-side-nav.html',
  styleUrl: './dashboard-side-nav.css',
})
export class DashboardSideNav implements OnInit, OnChanges {
  @Input() isLeftSidebarCollapsed!: boolean;
  @Output() changeIsLeftSidebarCollapsed = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  rol: string = '';

  showText: boolean = false;
  isMobile: boolean = false;

  items = [
    {
      routeLink: '/dashboard/inicio',
      icon: '/img/dashboard.png',
      label: 'Dashboard',
    },
    {
      routeLink: '/dashboard/compras',
      icon: '/img/compras.png',
      label: 'Compras',
    }
  ];

  ngOnInit(): void {
    this.checkScreenSize();
    this.showText = !this.isLeftSidebarCollapsed;
  }

  @HostListener('window:resize', [])
  onResize(): void {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile) {
      this.isLeftSidebarCollapsed = true;
      this.showText = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isLeftSidebarCollapsed']) {
      if (!this.isLeftSidebarCollapsed) {
        setTimeout(() => {
          this.showText = true;
        }, 500);
      } else {
        this.showText = false;
      }
    }
  }

  toggleCollapse(): void {
    if (this.isMobile) return;

    this.isLeftSidebarCollapsed = !this.isLeftSidebarCollapsed;
    this.changeIsLeftSidebarCollapsed.emit(this.isLeftSidebarCollapsed);
  }

  trackByFn(index: number, item: any): number {
    return index;
  }

  logout() {
    
  }
}
