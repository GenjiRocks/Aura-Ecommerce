import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="pointer-events-auto flex items-start gap-3.5 p-4 rounded-2xl shadow-2xl border transition-all duration-300 transform animate-slide-up backdrop-blur-xl"
          [ngClass]="{
            'bg-slate-900/98 text-white border-slate-700 shadow-slate-950/50': toast.type === 'success',
            'bg-rose-950/98 text-white border-rose-800 shadow-rose-950/50': toast.type === 'error',
            'bg-sky-950/98 text-white border-sky-800 shadow-sky-950/50': toast.type === 'info'
          }"
        >
          <!-- Icon -->
          <div class="shrink-0 mt-0.5">
            @if (toast.type === 'success') {
              <div class="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center ring-1 ring-emerald-500/30">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            } @else if (toast.type === 'error') {
              <div class="w-7 h-7 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center ring-1 ring-rose-500/30">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </div>
            } @else {
              <div class="w-7 h-7 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center ring-1 ring-sky-500/30">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            }
          </div>

          <!-- Content with guaranteed high-contrast white text -->
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-bold text-white tracking-wide leading-tight">
              {{ toast.title }}
            </h4>
            <p class="text-xs text-slate-200 font-medium mt-1 leading-relaxed">
              {{ toast.message }}
            </p>
          </div>

          <!-- Close button -->
          <button
            (click)="toastService.remove(toast.id)"
            class="shrink-0 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors p-1"
            aria-label="Dismiss toast"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}
