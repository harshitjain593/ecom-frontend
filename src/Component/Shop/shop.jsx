import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProduct } from '../../action/index';
import { filterProducts } from '../../action/filterAction';
import { getCategory } from '../../action/categoryAction';
import { buildCatalogFilter, getCategoriesList } from '../../utils/categoryUtils';
import ProductCard from '../Home/ProductCard';
import ShopFilters from './ShopFilters';
import './shop.css';

function Shop() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);

  const allProducts = useSelector(
    (state) => state.productData?.data?.result?.products || []
  );
  const filteredPayload = useSelector((state) => state.filteredProducts?.products);
  const filteredProducts = filteredPayload?.products || [];
  const isLoading = useSelector((state) => state.filteredProducts?.loading);
  const categories = useSelector((state) => getCategoriesList(state.categories));

  const categoryFromUrl = searchParams.get('category');
  const subCategoryFromUrl = searchParams.get('sub_category');

  useEffect(() => {
    dispatch(getCategory());
    dispatch(fetchProduct());
  }, [dispatch]);

  useEffect(() => {
    if (categoryFromUrl || subCategoryFromUrl) {
      const filter = buildCatalogFilter({
        category: categoryFromUrl,
        subCategory: subCategoryFromUrl,
        categories,
      });

      if (categoryFromUrl && !filter.category) {
        filter.category = categoryFromUrl.split(',').filter(Boolean);
      }

      setSelectedCategories(
        Array.isArray(filter.category)
          ? filter.category
          : filter.category
            ? [filter.category]
            : []
      );
      setIsFiltering(true);
      dispatch(filterProducts(filter));
      return;
    }

    setIsFiltering(false);
    setSelectedCategories([]);
  }, [categoryFromUrl, subCategoryFromUrl, categories, dispatch]);

  const handleCategoryChange = useCallback(
    (categories) => {
      setSelectedCategories(categories);

      if (categories.length > 0) {
        setIsFiltering(true);
        dispatch(filterProducts({ category: categories }));
        setSearchParams({ category: categories.join(',') });
      } else {
        setIsFiltering(false);
        setSearchParams({});
        dispatch(fetchProduct());
      }
    },
    [dispatch, setSearchParams]
  );

  const displayProducts = useMemo(() => {
    if (isFiltering || selectedCategories.length > 0) {
      return filteredProducts;
    }
    return allProducts;
  }, [allProducts, filteredProducts, isFiltering, selectedCategories.length]);

  const loading = isFiltering ? isLoading : !allProducts.length;

  return (
    <section className="shop-page">
      <div className="shop-page__container">
        <aside className="shop-page__sidebar">
          <ShopFilters
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
          />
        </aside>

        <div className="shop-page__main">
          <div className="shop-page__header">
            <h1 className="shop-page__title">Shop All Rugs</h1>
            <p className="shop-page__count">
              {displayProducts.length} product{displayProducts.length !== 1 ? 's' : ''}
            </p>
          </div>

          {loading ? (
            <div className="shop-page__loader">
              <div className="loader" />
            </div>
          ) : displayProducts.length > 0 ? (
            <div className="shop-page__grid">
              {displayProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="shop-page__empty">
              <p>No products found for the selected filters.</p>
              <button
                type="button"
                className="shop-filters__clear"
                onClick={() => handleCategoryChange([])}
              >
                View all products
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Shop;
