import { Injectable, signal } from '@angular/core';
import { ToastMessage } from '../models/ecommerce.models';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<ToastMessage[]>([]);

  show(title: string, message: string, type: 'success' | 'error' | 'info' = 'success', duration = 3500): void {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, title, message, type };

    this.toasts.update(current => [...current, newToast]);

    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  remove(id: string): void {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }
}
