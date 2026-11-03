import React, { useMemo, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { chevronForward, close, gridOutline } from "ionicons/icons";
import { useTranslation } from "react-i18next";
import {
  getCategoryIcon,
  getCategoryShortcuts,
  type StorefrontCategory,
} from "./categoryNavigation";

interface CategoryNavigatorProps {
  categories: StorefrontCategory[];
  selectedCategory: string;
  onSelect: (categoryId: string) => void;
}

const CategoryNavigator: React.FC<CategoryNavigatorProps> = ({
  categories,
  selectedCategory,
  onSelect,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const shortcuts = useMemo(
    () => getCategoryShortcuts(categories, selectedCategory),
    [categories, selectedCategory],
  );

  const selectCategory = (categoryId: string) => {
    onSelect(categoryId);
    setIsOpen(false);
  };

  if (categories.length === 0) return null;

  return (
    <section
      className="bazaar-categories"
      aria-labelledby="bazaar-category-heading"
    >
      <div className="bazaar-section-title">
        <div>
          <small>{t("browse_categories")}</small>
          <h2 id="bazaar-category-heading">{t("shop_by_category")}</h2>
        </div>
        <button
          type="button"
          className="bazaar-text-action"
          onClick={() => setIsOpen(true)}
        >
          {t("see_all")} <IonIcon icon={chevronForward} />
        </button>
      </div>

      <div
        className="bazaar-category-shortcuts"
        role="group"
        aria-label={t("shop_by_category")}
      >
        <button
          type="button"
          aria-pressed={selectedCategory === "all"}
          className="bazaar-category-shortcut"
          data-selected={selectedCategory === "all"}
          onClick={() => onSelect("all")}
        >
          <span aria-hidden="true">✨</span>
          <strong>{t("for_you")}</strong>
        </button>
        {shortcuts.map((category) => {
          const id = String(category.id);
          return (
            <button
              type="button"
              aria-pressed={selectedCategory === id}
              className="bazaar-category-shortcut"
              data-selected={selectedCategory === id}
              key={id}
              onClick={() => onSelect(id)}
            >
              <span aria-hidden="true">{getCategoryIcon(category.name)}</span>
              <strong>{category.name}</strong>
            </button>
          );
        })}
        <button
          type="button"
          className="bazaar-category-shortcut bazaar-category-shortcut--all"
          onClick={() => setIsOpen(true)}
        >
          <IonIcon icon={gridOutline} aria-hidden="true" />
          <strong>{t("all_categories")}</strong>
        </button>
      </div>

      <IonModal
        className="bazaar-category-sheet"
        isOpen={isOpen}
        onDidDismiss={() => setIsOpen(false)}
        initialBreakpoint={0.72}
        breakpoints={[0, 0.72, 0.94]}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>{t("all_categories")}</IonTitle>
            <IonButtons slot="end">
              <IonButton
                aria-label={t("close")}
                onClick={() => setIsOpen(false)}
              >
                <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="bazaar-category-sheet__grid">
            <button
              type="button"
              aria-pressed={selectedCategory === "all"}
              data-selected={selectedCategory === "all"}
              onClick={() => selectCategory("all")}
            >
              <span aria-hidden="true">✨</span>
              <strong>{t("for_you")}</strong>
            </button>
            {categories.map((category) => {
              const id = String(category.id);
              return (
                <button
                  type="button"
                  aria-pressed={selectedCategory === id}
                  data-selected={selectedCategory === id}
                  key={id}
                  onClick={() => selectCategory(id)}
                >
                  <span aria-hidden="true">
                    {getCategoryIcon(category.name)}
                  </span>
                  <strong>{category.name}</strong>
                </button>
              );
            })}
          </div>
        </IonContent>
      </IonModal>
    </section>
  );
};

export default CategoryNavigator;
