// import { Component } from '@angular/core';
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatListModule } from '@angular/material/list';
// import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
// import { MatToolbar } from '@angular/material/toolbar';

// @Component({
//   selector: 'app-main-layout',
//   imports: [
//     MatSidenavModule,
//     MatListModule,
//     RouterLink,
//     RouterOutlet,
//     MatToolbar,
//   ],
//   templateUrl: './main-layout.component.html',
//   styleUrl: './main-layout.component.css',
// })
// export class MainLayoutComponent {}
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent implements OnInit {
  private router = inject(Router);

  username: string = 'Admin User';
  ngOnInit(): void {
    // Optional: Fetch the logged-in user profile details here to update this.username
    const savedUserSession = localStorage.getItem('user_session');
    if (savedUserSession) {
      this.username = JSON.parse(savedUserSession).username;
    }
  }

  onLogout(): void {
    // 1. Clear session data (Localstorage, cookies, token variables, etc.)
    localStorage.removeItem('authToken');
    sessionStorage.clear();

    // 2. Escape the layout wrapper and jump straight to full-screen login
    this.router.navigate(['/login']);
  }
}
