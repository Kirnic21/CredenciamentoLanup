// confirmation.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CredenciamentoService } from '../service/credenciamento-service';

interface CadastroData {
  nome: string;
  cpf: string;
  foto: string;
}

interface CredenciamentoRequest {
  nome: string;
  cpf: string;
  foto: string;
  empresa: string;
}

@Component({
  selector: 'app-conclusao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./confirmation.html",  
  styleUrl: './confirmation.css',
})
export class ConfirmationComponent implements OnInit {
  dados: CadastroData = { nome: '', cpf: '', foto: '' };
  
  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private credenciamentoService: CredenciamentoService
  ) {}
  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['nome'] && params['cpf']) {
        const foto = localStorage.getItem('cadastroFoto');
        
        if (foto) {
          this.dados = {
            nome: params['nome'],
            cpf: params['cpf'],
            foto: foto
          };
        } else {
          this.router.navigate(['/']);
        }
      } else {
        this.router.navigate(['/']);
      }
    });
  }
  
  goBack(): void {
    this.location.back();
  }
  
  onConfirm(): void {
    const request: CredenciamentoRequest = {
      nome: this.dados.nome,
      cpf: this.dados.cpf,
      foto: this.dados.foto,
      empresa: '360aeb'
    };
    
    this.credenciamentoService.processar(request).subscribe({
      next: (response) => {
        console.log('API response', response);
        localStorage.removeItem('cadastroFoto');

        this.router.navigate(['/result'], { 
          queryParams: { 
            success: true,
            message: 'Credenciamento enviado com sucesso'
          } 
        });
      },
      error: (error) => {
        console.error('API Error:', error);
        localStorage.removeItem('cadastroFoto');

        this.router.navigate(['/result'], { 
          queryParams: { 
            success: false,
            message: 'Credenciamento com erro, tente novamente'
          } 
        });
      }
    });
  }
}