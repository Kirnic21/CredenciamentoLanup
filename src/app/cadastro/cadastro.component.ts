import { Component, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

interface CadastroData {
  nome: string;
  cpf: string;
  foto: string;
}

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnDestroy {
  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  companyName: string = '360A&B';
  companyTitle: string = 'Sistema de Cadastro Facial';
  companySubtitle: string = 'Preencha os dados para registrar seu acesso ao controle de ponto';

  cadastroForm: FormGroup;
  capturedPhoto: string | null = null;
  isCameraOpen = false;
  stream: MediaStream | null = null;
  isLoadingCamera = false;
  formSubmitted = false;
  showInstructionModal = false;
  hasSeenInstructions = false;

  private traduzErroCamera(err: DOMException): string {
    switch (err.name) {
      case 'NotAllowedError':
        return 'Permissão negada. Permita o uso da câmera.';
      case 'NotFoundError':
        return 'Nenhuma câmera encontrada.';
      case 'NotReadableError':
        return 'A câmera está ocupada por outro aplicativo.';
      case 'OverconstrainedError':
        return 'A câmera não atende aos requisitos.';
      case 'SecurityError':
        return 'Acesso à câmera bloqueado.';
      default:
        return 'Erro ao acessar a câmera.';
    }
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.cadastroForm = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', [
        Validators.required,
        Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
      ]]
    });

    this.route.data.subscribe(data => {
      if (data['companyName']) this.companyName = data['companyName'];
      if (data['companyTitle']) this.companyTitle = data['companyTitle'];
      if (data['companySubtitle']) this.companySubtitle = data['companySubtitle'];
    });
  }

  ngOnDestroy(): void {
    this.closeCamera();
  }

  onCpfInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

      this.cadastroForm.patchValue({ cpf: value }, { emitEvent: false });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        this.capturedPhoto = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  openCameraModal(): void {
    if (!this.hasSeenInstructions) {
      this.showInstructionModal = true;
    } else {
      this.isCameraOpen = true;
      setTimeout(() => this.initializeCamera(), 100);
    }
  }

  closeInstructionModal(): void {
    this.showInstructionModal = false;
  }

  startCamera(): void {
    this.hasSeenInstructions = true;
    this.showInstructionModal = false;
    this.isCameraOpen = true;
    setTimeout(() => this.initializeCamera(), 100);
  }

  private async initializeCamera(): Promise<void> {
    this.isLoadingCamera = true;
    
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      const video = this.videoElement?.nativeElement;
      
      if (video) {
        video.srcObject = this.stream;
        await video.play();
      }
    } catch (err) {
      console.error('Erro ao acessar câmera:', err);
      this.closeCamera();
    } finally {
      this.isLoadingCamera = false;
    }
  }

  closeCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.isCameraOpen = false;
    this.isLoadingCamera = false;
  }

  capturePhoto(): void {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      this.capturedPhoto = canvas.toDataURL('image/jpeg', 0.9);
      this.closeCamera();
    }
  }

  get hasPhoto(): boolean {
    return !!this.capturedPhoto;
  }

  onSubmit(): void {
  this.formSubmitted = true;
  this.cadastroForm.markAllAsTouched();

  if (this.cadastroForm.invalid || !this.capturedPhoto) {
    return;  
  }

  const dados: CadastroData = {
    nome: this.cadastroForm.value.nome,
    cpf: this.cadastroForm.value.cpf,
    foto: this.capturedPhoto
  };

  
  localStorage.setItem('cadastroFoto', this.capturedPhoto);


  this.router.navigate(['/confirmation'], { 
    queryParams: { 
      nome: dados.nome,
      cpf: dados.cpf
    }
  });
}

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.isCameraOpen) {
      this.closeCamera();
    }
  }
}