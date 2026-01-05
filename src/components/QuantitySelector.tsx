import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { remove, add } from 'ionicons/icons';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  max?: number;
  min?: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  max,
  min = 1,
}) => {
  const canDecrease = quantity > min;
  const canIncrease = !max || quantity < max;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <IonButton
        size="small"
        fill="outline"
        onClick={onDecrease}
        disabled={!canDecrease}
        style={{ minWidth: '40px', height: '40px' }}
      >
        <IonIcon icon={remove} />
      </IonButton>
      
      <span style={{ 
        minWidth: '40px', 
        textAlign: 'center', 
        fontSize: '18px', 
        fontWeight: 'bold' 
      }}>
        {quantity}
      </span>
      
      <IonButton
        size="small"
        fill="outline"
        onClick={onIncrease}
        disabled={!canIncrease}
        style={{ minWidth: '40px', height: '40px' }}
      >
        <IonIcon icon={add} />
      </IonButton>
    </div>
  );
};

export default QuantitySelector;
