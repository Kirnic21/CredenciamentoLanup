import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';


interface CredenciamentoRequest {
  nome: string;
  cpf: string;
  foto: string;
  empresa:string;
}

interface CredenciamentoResponse {
  message: string;
  response: any;
}

interface Credenciamento {
  id: string;
  empresa: string;
  nome: string;
  cpf: string;
  foto: string;
 
}

@Injectable({
  providedIn: 'root',
})
export class CredenciamentoService {
    private apiUrl = `${environment.API_URL}/Credenciamentos`;

  constructor(private http: HttpClient) {}

  processar(request: CredenciamentoRequest): Observable<CredenciamentoResponse> {
    return this.http.post<CredenciamentoResponse>(this.apiUrl, request);
  }

 
  getAll(): Observable<Credenciamento[]> {
    return this.http.get<Credenciamento[]>(this.apiUrl);
  }

  getById(id: string): Observable<Credenciamento[]> {
    const params = new HttpParams().set('id', id);
    return this.http.get<Credenciamento[]>(this.apiUrl, { params });
  }

  getByEmpresa(empresa: string): Observable<Credenciamento[]> {
    const params = new HttpParams().set('empresa', empresa);
    return this.http.get<Credenciamento[]>(this.apiUrl, { params });
  }

  getByIdAndEmpresa(id: string, empresa: string): Observable<Credenciamento[]> {
    const params = new HttpParams()
      .set('id', id)
      .set('empresa', empresa);
    return this.http.get<Credenciamento[]>(this.apiUrl, { params });
  }
}