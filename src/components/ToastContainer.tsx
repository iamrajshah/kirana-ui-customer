import { IonToast } from '@ionic/react';
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
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = toast.subscribe((options) => {
      setToastData({
        message: options.message,
        type: options.type || 'info',
        duration: options.duration || 3000,
        position: options.position || 'bottom',
      });
      setIsOpen(true);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const getColor = () => {
    switch (toastData?.type) {
      case 'success':
        return 'success';
      case 'error':
        return 'danger';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'primary';
    }
  };

  return (
    <IonToast
      isOpen={isOpen}
      onDidDismiss={() => setIsOpen(false)}
      message={toastData?.message}
      duration={toastData?.duration}
      position={toastData?.position}
      color={getColor()}
    />
  );
};
