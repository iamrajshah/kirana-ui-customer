import React, { useState, useEffect } from 'react';
import { IonCard, IonCardContent, IonButton, IonBadge, IonIcon } from '@ionic/react';
import { add, remove } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '@store/cart.store';
import { toast } from '@services/toast';
import ImageWithFallback from './ImageWithFallback';
import { formatCurrency } from '@utils/currency';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    brand?: string;
    image_url?: string;
    variants: Array<{
      id: string;
      brand?: string;
      selling_price: number;
      unit?: string;
      quantity: number;
      image_url?: string;
    }>;
  };
  onProductClick?: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
  const { t } = useTranslation();
  const { addItem, updateQuantity, items } = useCartStore();
  const [cartQuantity, setCartQuantity] = useState(0);

  // Use first variant for display
  const variant = product.variants?.[0];
  
  // Don't render if no variants
  if (!variant) {
    return null;
  }
  
  const isOutOfStock = variant.quantity === 0;
  const isLowStock = variant.quantity > 0 && variant.quantity <= 10;

  // Check cart for current quantity
  useEffect(() => {
    const cartItem = items.find(item => item.variant_id === variant.id);
    setCartQuantity(cartItem?.quantity || 0);
  }, [items, variant.id]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      addItem({
        variant_id: variant.id,
        product_id: product.id,
        product_name: product.name,
        brand: variant.brand || '',
        unit: variant.unit,
        price: variant.selling_price,
        image_url: variant.image_url,
        max_quantity: variant.quantity,
      });
      toast.success(t('added_to_cart') || 'Added to cart');
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartQuantity < variant.quantity) {
      updateQuantity(variant.id, cartQuantity + 1);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartQuantity > 0) {
      updateQuantity(variant.id, cartQuantity - 1);
    }
  };

  return (
    <IonCard
      onClick={() => onProductClick?.(product.id)}
      style={{ margin: '0', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ position: 'relative' }}>
        <ImageWithFallback
          src={product.image_url}
          alt={product.name}
          style={{
            width: '100%',
            height: '140px',
            objectFit: 'cover',
          }}
        />
        {isOutOfStock && (
          <IonBadge
            color="danger"
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              fontSize: '10px',
            }}
          >
            {t('out_of_stock')}
          </IonBadge>
        )}
        {isLowStock && !isOutOfStock && (
          <IonBadge
            color="warning"
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              fontSize: '10px',
            }}
          >
            {t('low_stock') || 'Low Stock'}
          </IonBadge>
        )}
      </div>

      <IonCardContent style={{ padding: '8px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '8px', flex: 1 }}>
          <h3 
            style={{ 
              margin: '0 0 4px 0', 
              fontSize: '14px', 
              fontWeight: '600',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: '1.3',
              minHeight: '36px'
            }}
          >
            {product.name}
          </h3>
          {(variant.brand || variant.unit) && (
            <p style={{ 
              margin: '0', 
              fontSize: '11px', 
              color: 'var(--ion-color-medium, #666)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {[variant.brand, variant.unit].filter(Boolean).join(' • ')}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <div>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--ion-text-color, #000)' }}>
              {formatCurrency(variant.selling_price)}
            </span>
          </div>
          
          {cartQuantity > 0 ? (
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                border: '1px solid var(--ion-color-primary)',
                borderRadius: '8px',
                padding: '2px'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <IonButton
                fill="clear"
                size="small"
                onClick={handleDecrement}
                style={{ 
                  margin: 0,
                  width: '28px',
                  height: '28px',
                  '--padding-start': '0',
                  '--padding-end': '0'
                }}
              >
                <IonIcon icon={remove} style={{ fontSize: '16px' }} />
              </IonButton>
              <span style={{ 
                minWidth: '24px', 
                textAlign: 'center', 
                fontSize: '14px',
                fontWeight: '600',
                color: 'var(--ion-color-primary)'
              }}>
                {cartQuantity}
              </span>
              <IonButton
                fill="clear"
                size="small"
                onClick={handleIncrement}
                disabled={cartQuantity >= variant.quantity}
                style={{ 
                  margin: 0,
                  width: '28px',
                  height: '28px',
                  '--padding-start': '0',
                  '--padding-end': '0'
                }}
              >
                <IonIcon icon={add} style={{ fontSize: '16px' }} />
              </IonButton>
            </div>
          ) : (
            <IonButton
              fill="solid"
              size="small"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              style={{ 
                margin: 0,
                height: '32px',
                fontSize: '20px',
                fontWeight: 'bold',
                '--padding-start': '12px',
                '--padding-end': '12px'
              }}
            >
              +
            </IonButton>
          )}
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default ProductCard;
