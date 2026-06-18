import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';

export interface Loan {
  id: string;
  companyKey: string;
  creditType: string;
  currency: string;
  amount: number;
  installments: number;
  status: string;
  createdAt: string;
}

export interface CreateLoanPayload {
  companyKey: string;
  creditType: string;
  currency: string;
  amount: number;
  installments?: number;
  requesterRut?: string;
}

export interface Installment {
  id: string;
  loanId: string;
  number: number;
  dueDate: string;
  amount: number;
  status: string;
  paidAt?: string;
  createdAt: string;
}

export interface InstallmentsPage {
  pagination: { limit: number; offset: number; total: number };
  data: Installment[];
}

@Injectable({ providedIn: 'root' })
export class LoansApi extends ApiService {
  list(companyKey?: string): Observable<{ pagination: any; data: Loan[] }> {
    return this.get(environment.apiLoansUrl, '/v1/loans', companyKey ? { companyKey } : {});
  }

  getById(id: string): Observable<Loan> {
    return this.get(environment.apiLoansUrl, `/v1/loans/${id}`);
  }

  create(payload: CreateLoanPayload): Observable<Loan> {
    return this.post(environment.apiLoansUrl, '/v1/loans', payload);
  }

  /**
   * Lista las cuotas de un préstamo, paginadas de a 5 por defecto.
   * @param loanId  UUID del préstamo
   * @param status  filtro opcional: PENDING | PAID | OVERDUE
   * @param limit   default 5, max 100
   * @param offset  default 0
   */
  getInstallments(
    loanId: string,
    status?: string,
    limit: number = 5,
    offset: number = 0
  ): Observable<InstallmentsPage> {
    const queryParams: any = { limit, offset };
    if (status) queryParams.status = status;
    return this.get(environment.apiLoansUrl, `/v1/loans/${loanId}/installments`, queryParams);
  }
}
