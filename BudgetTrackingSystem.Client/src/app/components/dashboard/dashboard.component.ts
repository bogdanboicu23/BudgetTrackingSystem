import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, map, shareReplay } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatGridListModule,
    MatTooltipModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private breakpointObserver = inject(BreakpointObserver);
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser$ = this.authService.currentUser$;
  isCollapsed = true; // Always collapsed

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  menuItems = [
    { title: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { title: 'Budgets', icon: 'account_balance_wallet', route: '/budgets' },
    { title: 'Transactions', icon: 'receipt_long', route: '/transactions' },
    { title: 'Categories', icon: 'category', route: '/categories' },
    { title: 'Reports', icon: 'bar_chart', route: '/reports' },
    { title: 'Settings', icon: 'settings', route: '/settings' }
  ];

  dashboardCards = [
    {
      title: 'Total Budget',
      value: '$5,000',
      icon: 'account_balance_wallet',
      color: 'primary',
      subtitle: 'Monthly budget'
    },
    {
      title: 'Spent This Month',
      value: '$2,345',
      icon: 'shopping_cart',
      color: 'accent',
      subtitle: '47% of budget'
    },
    {
      title: 'Remaining',
      value: '$2,655',
      icon: 'savings',
      color: 'warn',
      subtitle: '53% left'
    },
    {
      title: 'Transactions',
      value: '127',
      icon: 'receipt',
      color: 'primary',
      subtitle: 'This month'
    }
  ];

  ngOnInit(): void {
    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }

    // Always keep sidebar collapsed - no need to check localStorage

    // Debug: Log the handset state (remove this after testing)
    // this.isHandset$.subscribe(isHandset => {
    //   console.log('Is handset device:', isHandset);
    // });
  }

  logout(): void {
    this.authService.logout();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  // Toggle functionality removed - sidebar always collapsed
}
