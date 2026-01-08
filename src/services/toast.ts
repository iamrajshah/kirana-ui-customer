type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
  position?: 'top' | 'bottom' | 'middle';
}

class ToastService {
  private listeners: Set<(options: ToastOptions) => void> = new Set();

  subscribe(listener: (options: ToastOptions) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(options: ToastOptions) {
    this.listeners.forEach(listener => listener(options));
  }

  success(message: string, duration = 3000) {
    this.notify({ message, type: 'success', duration });
  }

  error(message: string, duration = 4000) {
    this.notify({ message, type: 'error', duration });
  }

  warning(message: string, duration = 3500) {
    this.notify({ message, type: 'warning', duration });
  }

  info(message: string, duration = 3000) {
    this.notify({ message, type: 'info', duration });
  }

  show(options: ToastOptions) {
    this.notify({
      type: 'info',
      duration: 3000,
      position: 'bottom',
      ...options,
    });
  }
}

export const toast = new ToastService();
