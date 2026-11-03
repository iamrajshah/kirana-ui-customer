import { useState, useEffect } from 'react';
import { toast } from '../services/toast';

interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
  position?: 'top' | 'bottom' | 'middle';
}

export const ToastContainer = () => {
  const [toastData, setToastData] = useState<ToastMessage | null>(null);
  useEffect(() => {
    const unsubscribe = toast.subscribe((options) => {
      setToastData({
        message: options.message,
        type: options.type || 'info',
        duration: options.duration || 3000,
        position: options.position || 'bottom',
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!toastData) return;
    const handle = window.setTimeout(() => setToastData(null), toastData.duration);
    return () => window.clearTimeout(handle);
  }, [toastData]);

  if (!toastData) return null;

  return <div
    className={`storefront-toast storefront-toast--${toastData.type} storefront-toast--${toastData.position}`}
    role={toastData.type === 'error' ? 'alert' : 'status'}
    aria-live={toastData.type === 'error' ? 'assertive' : 'polite'}
  >{toastData.message}</div>;
};
