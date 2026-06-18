import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoansApi, Installment, Loan } from '../../services/loans.api';

const PAGE_SIZE = 5;

@Component({
  selector: 'app-installments',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <nav class="breadcrumbs">
      <a routerLink="/loans">← Loans</a>
    </nav>

    <h1>Cuotas del préstamo</h1>

    <div *ngIf="loan" class="loan-summary">
      <div class="summary-item">
        <span class="label">ID</span>
        <code>{{ loan.id }}</code>
      </div>
      <div class="summary-item">
        <span class="label">Empresa</span>
        <strong>{{ loan.companyKey }}</strong>
      </div>
      <div class="summary-item">
        <span class="label">Monto</span>
        <strong>{{ loan.amount | number:'1.2-2' }} {{ loan.currency }}</strong>
      </div>
      <div class="summary-item">
        <span class="label">Cuotas totales</span>
        <strong>{{ loan.installments }}</strong>
      </div>
    </div>

    <div class="filter-bar">
      <label>
        Estado:
        <select [(ngModel)]="statusFilter" (change)="onFilterChange()">
          <option value="">Todas</option>
          <option value="PENDING">PENDING</option>
          <option value="PAID">PAID</option>
          <option value="OVERDUE">OVERDUE</option>
        </select>
      </label>
      <button class="secondary" (click)="refresh()">Refrescar</button>
    </div>

    <div class="table-section">
      <table *ngIf="installments.length > 0">
        <thead>
          <tr>
            <th>N°</th>
            <th>Vencimiento</th>
            <th>Monto</th>
            <th>Estado</th>
            <th>Pagada el</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let i of installments">
            <td><strong>#{{ i.number }}</strong></td>
            <td>{{ i.dueDate }}</td>
            <td>{{ i.amount | number:'1.2-2' }} {{ loan?.currency }}</td>
            <td><span class="status-{{ i.status }}">{{ i.status }}</span></td>
            <td>{{ i.paidAt ? (i.paidAt | date:'mediumDate') : '—' }}</td>
          </tr>
        </tbody>
      </table>

      <p *ngIf="installments.length === 0 && !loading" class="empty">
        Este préstamo no tiene cuotas
        <span *ngIf="statusFilter">con estado {{ statusFilter }}</span>.
      </p>
      <p *ngIf="loading" class="loading">Cargando...</p>
    </div>

    <!-- Paginación -->
    <div *ngIf="pagination && pagination.total > 0" class="pagination">
      <div class="pagination-info">
        Mostrando
        <strong>{{ from }}-{{ to }}</strong>
        de
        <strong>{{ pagination.total }}</strong>
        cuotas
      </div>
      <div class="pagination-controls">
        <button
          class="secondary"
          [disabled]="currentPage === 1"
          (click)="goToPage(currentPage - 1)">
          ← Anterior
        </button>
        <span class="page-indicator">Página {{ currentPage }} de {{ totalPages }}</span>
        <button
          class="secondary"
          [disabled]="currentPage === totalPages"
          (click)="goToPage(currentPage + 1)">
          Siguiente →
        </button>
      </div>
    </div>

    <style>
      .breadcrumbs { margin-bottom: 16px; }
      .breadcrumbs a { color: #2563eb; text-decoration: none; font-size: 14px; }
      .breadcrumbs a:hover { text-decoration: underline; }
      h1 { margin: 0 0 16px; font-size: 24px; }
      .loan-summary {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        background: white;
        padding: 16px 20px;
        border-radius: 8px;
        margin-bottom: 24px;
      }
      .summary-item { display: flex; flex-direction: column; gap: 4px; }
      .summary-item .label { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
      .summary-item code { font-size: 12px; color: #6b7280; }
      .filter-bar { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
      .filter-bar label { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #374151; }
      .filter-bar select { padding: 6px 10px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 14px; }
      .table-section { background: white; border-radius: 8px; padding: 8px; }
      table { width: 100%; border-collapse: collapse; }
      th, td { text-align: left; padding: 12px 16px; border-bottom: 1px solid #f3f4f6; }
      th { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
      .status-PENDING { padding: 4px 10px; background: #fef3c7; color: #92400e; border-radius: 12px; font-size: 12px; font-weight: 500; }
      .status-PAID { padding: 4px 10px; background: #d1fae5; color: #065f46; border-radius: 12px; font-size: 12px; font-weight: 500; }
      .status-OVERDUE { padding: 4px 10px; background: #fee2e2; color: #991b1b; border-radius: 12px; font-size: 12px; font-weight: 500; }
      .empty { color: #9ca3af; padding: 32px; text-align: center; }
      .loading { color: #6b7280; padding: 24px; text-align: center; }
      .pagination {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 24px;
        padding: 16px 0;
        border-top: 1px solid #e5e7eb;
      }
      .pagination-info { color: #6b7280; font-size: 14px; }
      .pagination-controls { display: flex; align-items: center; gap: 12px; }
      .page-indicator { color: #374151; font-size: 14px; font-weight: 500; padding: 0 8px; }
      button.secondary {
        padding: 8px 16px;
        background: white;
        color: #374151;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        font-size: 14px;
        cursor: pointer;
      }
      button.secondary:hover:not(:disabled) { background: #f9fafb; }
      button.secondary:disabled { opacity: 0.5; cursor: not-allowed; }
    </style>
  `
})
export class InstallmentsComponent implements OnInit {
  private api = inject(LoansApi);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loanId: string = '';
  loan: Loan | null = null;
  installments: Installment[] = [];
  pagination: { limit: number; offset: number; total: number } | null = null;

  statusFilter: string = '';
  currentPage = 1;
  readonly pageSize = PAGE_SIZE;

  loading = false;

  get totalPages(): number {
    if (!this.pagination) return 1;
    return Math.max(1, Math.ceil(this.pagination.total / this.pageSize));
  }

  get from(): number {
    if (!this.pagination || this.pagination.total === 0) return 0;
    return this.pagination.offset + 1;
  }

  get to(): number {
    if (!this.pagination) return 0;
    return Math.min(this.pagination.offset + this.pagination.limit, this.pagination.total);
  }

  ngOnInit() {
    this.loanId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.loanId) {
      this.router.navigate(['/loans']);
      return;
    }
    this.loadLoan();
    this.loadPage();
  }

  loadLoan() {
    this.api.getById(this.loanId).subscribe({
      next: (loan) => { this.loan = loan; },
      error: () => { this.loan = null; }
    });
  }

  loadPage() {
    this.loading = true;
    const offset = (this.currentPage - 1) * this.pageSize;
    this.api.getInstallments(
      this.loanId,
      this.statusFilter || undefined,
      this.pageSize,
      offset
    ).subscribe({
      next: (page) => {
        this.installments = page.data;
        this.pagination = page.pagination;
        this.loading = false;
      },
      error: () => {
        this.installments = [];
        this.pagination = null;
        this.loading = false;
      }
    });
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadPage();
    // scroll suave al top de la tabla
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onFilterChange() {
    this.currentPage = 1;
    this.loadPage();
  }

  refresh() {
    this.loadLoan();
    this.loadPage();
  }
}
