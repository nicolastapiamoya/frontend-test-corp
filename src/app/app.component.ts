import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="layout">
      <nav class="sidebar">
        <div class="brand">
          <strong>BFCL POC</strong>
          <small>Banca Empresas</small>
        </div>
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/transfers" routerLinkActive="active">Transfers</a>
        <a routerLink="/loans" routerLinkActive="active">Loans</a>
        <div class="footer">
          <small>POC standalone</small>
        </div>
      </nav>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>

    <style>
      .layout { display: flex; min-height: 100vh; }
      .sidebar {
        width: 220px;
        background: #1f2937;
        color: white;
        padding: 24px 0;
        display: flex;
        flex-direction: column;
      }
      .brand {
        padding: 0 24px 24px;
        border-bottom: 1px solid #374151;
        display: flex;
        flex-direction: column;
      }
      .brand strong { font-size: 18px; }
      .brand small { color: #9ca3af; font-size: 11px; margin-top: 4px; }
      .sidebar a {
        color: #d1d5db;
        text-decoration: none;
        padding: 10px 24px;
        font-size: 14px;
        transition: background 0.15s;
      }
      .sidebar a:hover { background: #374151; }
      .sidebar a.active { background: #1f6feb; color: white; }
      .footer {
        margin-top: auto;
        padding: 16px 24px;
        border-top: 1px solid #374151;
        color: #6b7280;
      }
      .content { flex: 1; padding: 32px; overflow-y: auto; }
    </style>
  `
})
export class AppComponent {}