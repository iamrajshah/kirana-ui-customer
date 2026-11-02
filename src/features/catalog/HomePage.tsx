import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
} from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { apiService } from '@services/api';
import ProductCard from '@components/ProductCard';
import EmptyState from '@components/EmptyState';
import AppHeader from '@components/AppHeader';
import { debounce } from '@utils/debounce';
import { toast } from '@services/toast';
import { storageService } from '@services/storage';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [offersOnly, setOffersOnly] = useState(false);
  const storefront = storageService.getStorefront();

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const response = await apiService.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedCategory !== 'all') {
        params.category_id = selectedCategory;
      }
      
      const response = await apiService.getProducts(params);
      if (response.success && response.data.products) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = debounce(async (query: string) => {
    if (!query.trim()) {
      loadProducts();
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.searchProducts(query);
      if (response.success && response.data.products) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  }, 500);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await loadCategories();
    await loadProducts();
    event.detail.complete();
  };

  const handleProductClick = (productId: string) => {
    history.push(`/product/${productId}`);
  };

  const discountedProducts = products.filter((product) =>
    product.variants?.some(
      (variant: { mrp_price?: number; selling_price?: number }) =>
        Number(variant.mrp_price) > Number(variant.selling_price)
    )
  );
  const visibleProducts = offersOnly ? discountedProducts : products;

  return (
    <IonPage>
      <AppHeader />
      <IonHeader>
        <IonToolbar>
          <IonSearchbar
            value={searchQuery}
            onIonChange={(e) => {
              const value = e.detail.value || '';
              setSearchQuery(value);
              handleSearch(value);
            }}
            placeholder={t('search_products')}
          />
        </IonToolbar>
        {categories.length > 0 && (
          <IonToolbar>
            <IonSegment
              key={selectedCategory}
              value={selectedCategory}
              onIonChange={(e) => setSelectedCategory(e.detail.value as string)}
              scrollable
            >
              <IonSegmentButton value="all">
                <IonLabel>{t('all_categories')}</IonLabel>
              </IonSegmentButton>
              {categories.map((cat) => (
                <IonSegmentButton key={cat.id} value={cat.id.toString()}>
                  <IonLabel>{cat.name}</IonLabel>
                </IonSegmentButton>
              ))}
            </IonSegment>
          </IonToolbar>
        )}
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <section
          style={{
            margin: '12px 12px 4px',
            padding: 18,
            borderRadius: 20,
            color: '#fff',
            background: `linear-gradient(135deg, ${storefront?.brandColor || '#087F5B'}, #164e3f)`,
          }}
        >
          <p style={{ margin: 0, opacity: 0.85 }}>Shop online from</p>
          <h1 style={{ margin: '4px 0 12px' }}>{storefront?.name || t('app_name')}</h1>
          <button
            type="button"
            onClick={() => setOffersOnly((value) => !value)}
            style={{ border: 0, borderRadius: 999, padding: '8px 14px', fontWeight: 700 }}
          >
            {offersOnly ? 'Show all products' : `View today's offers (${discountedProducts.length})`}
          </button>
        </section>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <IonSpinner />
          </div>
        ) : visibleProducts.length === 0 ? (
          <EmptyState
            icon="📦"
            message={searchQuery ? t('no_results') : 'No products available'}
          />
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
            gap: '8px',
            padding: '8px' 
          }}>
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onProductClick={handleProductClick}
              />
            ))}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
