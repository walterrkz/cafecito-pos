import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  standalone: true,
})
export class ModalComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();

  ngOnInit(): void {
    const layoutContent = document.querySelector(
      '.layout-content',
    ) as HTMLElement;
    if (layoutContent) {
      layoutContent.style.overflow = 'hidden';
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.close.emit();
    }
  }

  ngOnDestroy(): void {
    const layoutContent = document.querySelector(
      '.layout-content',
    ) as HTMLElement;
    if (layoutContent) {
      layoutContent.style.overflow = 'auto';
    }
  }
}
