// result.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result.html',
  styleUrl: './result.css',
})
export class ResultComponent implements OnInit {
  success: boolean = false;
  message: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.success = params['success'] === 'true';
      this.message = params['message'] || 'Operação concluída';
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}