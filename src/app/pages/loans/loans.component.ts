import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoansApi, Loan, CreateLoanPayload } from '../../services/loans.api';

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h1>Loans</h1>
    <p class="hint">CRUD básico contra api-test-corp-loans:8082.</p>

    <details class="form-panel">
      <summary>＋ Crear solicitud de crédito</summary>
      <form (submit)="onCreate($event)" class="form">
        <div class="row">
          <label>Company Key <input [(ngModel)]="form.companyKey" name="companyKey" required></label>
          <label>Tipo de crédito <input [(ngModel)]="form.creditType" name="creditType" required></label>
        </div>
        <div class="row">
          <label>Moneda <input [(ngModel)]="form.currency" name="currency" required></label>
          <label>Monto <input type="number" [(ngModel)]="form.amount" name="amount" required></label>
        </div>
        <div class="row">
          <label>Cuotas <input type="number" [(ngModel)]="form.installments" name="installments"></label>
          <label>RUT solicitante <input [(ngModel)]="form.requesterRut" name="requesterRut"></label>
        </div>
        <button type="submit" [disabled]="creating">{{ creating ? 'Creando...' : 'Crear' }}</button>
        <span *ngIf="createError" class="error">{{ createError }}</span>
      </form>
    </details>

    <div class="table-section">
      <h3>Listado ({{ loans.length }})</h3>
      <button class="secondary" (click)="loadList()">Refrescar</button>
      <table *ngIf="loans.length > 0">
        <thead>
          <tr>
            <th>ID</th><th>Company</th><th>Tipo</th><th>Moneda</th><th>Monto</th><th>Cuotas</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let l of loans">
            <td><code>{{ l.id.slice(0, 8) }}…</code></td>
            <td>{{ l.companyKey }}</td>
            <td>{{ l.creditType }}</td>
            <td>{{ l.currency }}</td>
            <td>{{ l.amount | number:'1.2-2' }}</td>
            <td>{{ l.installments }}</td>
            <td><span class="status-{{ l.status }}">{{ l.status }}</span></td>
          </tr>
        </tbody>
      </table>
      <p *ngIf="loans.length === 0 && !loading" class="empty">Sin loans. Creá uno con el form de arriba.</p>
      <p *ngIf="loading" class="loading">Cargando...</p>
    </div>

    <style>
      h1 { margin: 0 0 8px; font-size: 24px; }
      .hint { color: #6b7280; margin: 0 0 24px; font-size: 14px; }
      .form-panel { background: white; padding: 16px 20px; border-radius: 8px; margin-bottom: 24px; }
      .form-panel summary { cursor: pointer; font-weight: 600; }
      .form { margin-top: 16px; display: flex; flex-direction: column; gap: 12px; }
      .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .row label { display: flex; flex-direction: column; font-size: 12px; color: #6b7280; gap: 4px; }
      .error { color: #dc2626; font-size: 13px; margin-left: 12px; }
      .table-section h3 { display: inline-block; margin-right: 12px; }
      .empty { color: #9ca3af; }
      .loading { color: #6b7280; }
      code { font-size: 12px; color: #6b7280; }
    </style>
  `
})
export class LoansComponent implements OnInit {
  private api = inject(LoansApi);

  loans: Loan[] = [];
  loading = false;
  creating = false;
  createError: string | null = null;

  form: CreateLoanPayload = {
    companyKey: '',
    creditType: 'COMMERCIAL_LOAN',
    currency: 'CLP',
    amount: 0,
    installments: 1
  };

  ngOnInit() {
    this.loadList();
  }

  loadList() {
    this.loading = true;
    this.api.list().subscribe({
      next: (res) => { this.loans = res.data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onCreate(e: Event) {
    e.preventDefault();
    this.creating = true;
    this.createError = null;
    this.api.create(this.form).subscribe({
      next: () => {
        this.creating = false;
        this.form = { companyKey: '', creditType: 'COMMERCIAL_LOAN', currency: 'CLP', amount: 0, installments: 1 };
        this.loadList();
      },
      error: (err) => {
        this.creating = false;
        this.createError = err?.error?.message || 'Error al crear loan';
      }
    });
  }
}