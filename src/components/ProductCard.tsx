import React from 'react';
import { IonCard, IonCardContent, IonButton, IonBadge } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '@store/cart.store';
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
      selling_price: number;
      unit?: string;
      quantity: number;
    }>;
  };
  onProductClick?: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onProductClick }) => {
  const { t } = useTranslation();
  const { addItem } = useCartStore();

  // Use first variant for display
  const variant = product.variants[0];
  const isOutOfStock = variant.quantity <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      addItem({
        variant_id: variant.id,
        product_id: product.id,
        product_name: product.name,
        brand: product.brand,
        unit: variant.unit,
        price: variant.selling_price,
        image_url: product.image_url,
        max_quantity: variant.quantity,
      });
    }
  };

  return (
    <IonCard
      onClick={() => onProductClick?.(product.id)}
      style={{ margin: '8px', cursor: 'pointer' }}
    >
      <div style={{ position: 'relative' }}>
        <ImageWithFallback
          src={product.image_url}
          alt={product.name}
          style={{
            width: '100%',
            height: '180px',
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
            }}
          >
            {t('out_of_stock')}
          </IonBadge>
        )}
      </div>

      <IonCardContent>
        <div style={{ marginBottom: '8px' }}>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 'bold' }}>
            {product.name}
          </h3>
          {product.brand && (
            <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
              {product.brand}
            </p>
          )}
          {variant.unit && (
            <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
              {variant.unit}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#000' }}>
            {formatCurrency(variant.selling_price)}
          </span>
          <IonButton
            size="small"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            {t('add_to_cart')}
          </IonButton>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default ProductCard;
