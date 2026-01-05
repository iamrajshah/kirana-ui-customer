import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
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
import { debounce } from '@utils/debounce';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
    loadProducts();
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
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
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
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Search failed:', error);
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{t('app_name')}</IonTitle>
        </IonToolbar>
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

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <IonSpinner />
          </div>
        ) : products.length === 0 ? (
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
            {products.map((product) => (
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
