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
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product && product.variants[0]) {
      const variant = product.variants[0];
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
              src={product.image_url}
              alt={product.name}
              style={{ width: '100%', height: '300px', objectFit: 'cover' }}
            />
            <div style={{ padding: '16px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                {product.name}
              </h1>
              {product.brand && (
                <p style={{ fontSize: '14px', color: '#666', margin: '0 0 16px 0' }}>
                  {product.brand}
                </p>
              )}
              {product.variants[0] && (
                <>
                  <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#000', margin: '0 0 16px 0' }}>
                    {formatCurrency(product.variants[0].selling_price)}
                  </p>
                  <p style={{ fontSize: '14px', color: '#666' }}>
                    {product.variants[0].unit}
                  </p>
                  <div style={{ marginTop: '24px' }}>
                    <IonButton
                      expand="block"
                      size="large"
                      onClick={handleAddToCart}
                      disabled={product.variants[0].quantity <= 0}
                    >
                      {product.variants[0].quantity > 0 ? t('add_to_cart') : t('out_of_stock')}
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
