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
          class="pointer-events-auto flex items-start gap-3.5 p-4 rounded-2xl shadow-xl border border-slate-200/90 bg-white backdrop-blur-xl transition-all duration-300 transform animate-slide-up ring-1 ring-slate-900/5"
        >
          <!-- Icon -->
          <div class="shrink-0 mt-0.5">
            @if (toast.type === 'success') {
              <div class="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center ring-1 ring-emerald-500/30">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            } @else if (toast.type === 'error') {
              <div class="w-7 h-7 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center ring-1 ring-rose-500/30">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </div>
            } @else {
              <div class="w-7 h-7 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center ring-1 ring-sky-500/30">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            }
          </div>

          <!-- Content with high-contrast text -->
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-bold text-slate-900 tracking-wide leading-tight">
              {{ toast.title }}
            </h4>
            <p class="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
              {{ toast.message }}
            </p>
          </div>

          <!-- Close button -->
          <button
            (click)="toastService.remove(toast.id)"
            class="shrink-0 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors p-1"
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
