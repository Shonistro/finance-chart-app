import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Providers } from '../../../shared/interface/providers.interface';
import { KindsResponse } from '../../../shared/interface/kind.interface';
import { Exchanges } from '../../../shared/interface/exchanges.interface';
import { InstrumentsResponse } from '../../../shared/interface/instrument.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReferenceDataService {
  private http = inject(HttpClient);

  getProviders(): Observable<Providers> {
    const url = '/api/proxy/providers';
    return this.http.get<Providers>(url);
  }

  getKinds(): Observable<KindsResponse> {
    const url = '/api/proxy/kinds';
    return this.http.get<KindsResponse>(url);
  }

  getExchanges(): Observable<Exchanges> {
    const url = '/api/proxy/exchanges';
    return this.http.get<Exchanges>(url);
  }

  getInstruments(provider: string, kind: string): Observable<InstrumentsResponse> {
    const url = '/api/proxy/instruments';
    const params = new HttpParams().set('provider', provider).set('kind', kind);
    return this.http.get<InstrumentsResponse>(url, { params });
  }
} 