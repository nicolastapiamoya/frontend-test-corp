import { Injectable } from '@angular/core';
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

@Injectable({ providedIn: 'root' })
export class LoansApi extends ApiService {
  list(companyKey?: string): Observable<{ pagination: any; data: Loan[] }> {
    return this.get(environment.apiLoansUrl, '/v1/loans', companyKey ? { companyKey } : {});
  }

  create(payload: CreateLoanPayload): Observable<Loan> {
    return this.post(environment.apiLoansUrl, '/v1/loans', payload);
  }
}