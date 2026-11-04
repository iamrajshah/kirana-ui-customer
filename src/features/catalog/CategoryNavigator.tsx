import React, { useMemo, useRef, useState } from "react";
import { IonIcon } from "@ionic/react";
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
  const browserRef = useRef<HTMLDivElement>(null);
  const shortcuts = useMemo(
    () => getCategoryShortcuts(categories, selectedCategory),
    [categories, selectedCategory],
  );

  const selectCategory = (categoryId: string) => {
    onSelect(categoryId);
    setIsOpen(false);
  };

  const openCategoryBrowser = () => {
    setIsOpen(true);
    window.requestAnimationFrame(() => {
      browserRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    });
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
          aria-controls="bazaar-category-browser"
          aria-expanded={isOpen}
          onClick={openCategoryBrowser}
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
          aria-controls="bazaar-category-browser"
          aria-expanded={isOpen}
          onClick={openCategoryBrowser}
        >
          <IonIcon icon={gridOutline} aria-hidden="true" />
          <strong>{t("all_categories")}</strong>
        </button>
      </div>

      {isOpen && (
        <div
          ref={browserRef}
          id="bazaar-category-browser"
          className="bazaar-category-browser"
          data-category-browser="open"
          role="region"
          aria-label={t("all_categories")}
        >
          <div className="bazaar-category-browser__header">
            <div>
              <small>{t("browse_categories")}</small>
              <h3>{t("all_categories")}</h3>
            </div>
            <button
              type="button"
              className="bazaar-category-browser__close"
              aria-label={t("close")}
              onClick={() => setIsOpen(false)}
            >
              <IonIcon icon={close} />
            </button>
          </div>
          <div className="bazaar-category-browser__grid">
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
        </div>
      )}
    </section>
  );
};

export default CategoryNavigator;
