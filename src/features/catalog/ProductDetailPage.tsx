import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonButton,
  IonSpinner,
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiService } from '@services/api';
import { useCartStore } from '@store/cart.store';
import ImageWithFallback from '@components/ImageWithFallback';
import { formatCurrency } from '@utils/currency';
import { toast } from '@services/toast';

const ProductDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const response = await apiService.getProductById(id);
      if (response.success) {
        setProduct(response.data);
      }
    } catch (error) {
      console.error('Failed to load product:', error);
      toast.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product && product.product_variants && product.product_variants.length > 0) {
      const variant = product.product_variants[0];
      const imageUrl = variant.image_url || product.image_url;
      addItem({
        variant_id: variant.id,
        product_id: product.id,
        product_name: product.name,
        brand: variant.brand,
        unit: variant.size,
        price: variant.selling_price,
        image_url: imageUrl,
        max_quantity: variant.inventory?.quantity || 0,
      });
    }
  };

  const variant = product?.product_variants?.[0];
  const imageUrl = variant?.image_url || product?.image_url;
  const displayName = product?.name?.replace(/_/g, ' ');
  const stockQty = variant?.inventory?.quantity || 0;
  const isLowStock = variant?.inventory && stockQty <= variant.inventory.low_stock_threshold;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>{t('product')}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <IonSpinner />
          </div>
        ) : product ? (
          <div>
            <ImageWithFallback
              src={imageUrl}
              alt={product.name}
              style={{ width: '100%', height: '300px', objectFit: 'cover' }}
            />
            <div style={{ padding: '16px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                {displayName}
              </h1>
              {variant && (
                <>
                  {variant.brand && (
                    <p style={{ fontSize: '16px', color: 'var(--ion-color-medium)', margin: '0 0 4px 0' }}>
                      Brand: {variant.brand}
                    </p>
                  )}
                  <p style={{ fontSize: '14px', color: 'var(--ion-color-medium)', margin: '0 0 16px 0' }}>
                    {variant.size} {variant.packaging && `• ${variant.packaging}`}
                  </p>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--ion-color-primary)', margin: '0 0 4px 0' }}>
                      {formatCurrency(variant.selling_price)}
                    </p>
                    {variant.mrp_price && variant.mrp_price > variant.selling_price && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <p style={{ fontSize: '16px', color: 'var(--ion-color-medium)', textDecoration: 'line-through', margin: 0 }}>
                          MRP: {formatCurrency(variant.mrp_price)}
                        </p>
                        <p style={{ fontSize: '14px', color: 'var(--ion-color-success)', fontWeight: 'bold', margin: 0 }}>
                          {Math.round(((variant.mrp_price - variant.selling_price) / variant.mrp_price) * 100)}% OFF
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div style={{ 
                    background: 'var(--ion-color-light)', 
                    borderRadius: '8px', 
                    padding: '12px',
                    marginBottom: '16px'
                  }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Product Details</h3>
                    {variant.sku && (
                      <p style={{ fontSize: '14px', margin: '4px 0', color: 'var(--ion-color-medium)' }}>
                        SKU: {variant.sku}
                      </p>
                    )}
                    {variant.gst_percent && (
                      <p style={{ fontSize: '14px', margin: '4px 0', color: 'var(--ion-color-medium)' }}>
                        GST: {variant.gst_percent}%
                      </p>
                    )}
                    <p style={{ fontSize: '14px', margin: '4px 0', color: stockQty > 0 ? 'var(--ion-color-success)' : 'var(--ion-color-danger)' }}>
                      Stock: {stockQty} units {isLowStock && stockQty > 0 && '(Low Stock)'}
                    </p>
                  </div>

                  <div style={{ marginTop: '24px' }}>
                    <IonButton
                      expand="block"
                      size="large"
                      onClick={handleAddToCart}
                      disabled={stockQty <= 0}
                    >
                      {stockQty > 0 ? t('add_to_cart') : t('out_of_stock')}
                    </IonButton>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p>{t('error_occurred')}</p>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ProductDetailPage;
