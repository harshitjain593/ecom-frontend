import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProduct } from '../../action/index';
import { filterProducts } from '../../action/filterAction';
import { getCategory } from '../../action/categoryAction';
import { buildCatalogFilter, getCategoriesList } from '../../utils/categoryUtils';
import ProductCard from '../Home/ProductCard';
import ShopFilters from './ShopFilters';
import CatalogPagination from './CatalogPagination';
import './shop.css';

const PAGE_LIMIT = 12;

function Shop() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [page, setPage] = useState(1);

  const productResult = useSelector((state) => state.productData?.data?.result);
  const allProducts = productResult?.products || [];
  const allTotal = productResult?.totalProducts || 0;

  const filteredPayload = useSelector((state) => state.filteredProducts?.products);
  const filteredProducts = filteredPayload?.products || [];
  const filteredTotal = filteredPayload?.totalProducts || 0;
  const isLoading = useSelector((state) => state.filteredProducts?.loading);
  const categories = useSelector((state) => getCategoriesList(state.categories));

  const categoryFromUrl = searchParams.get('category');
  const subCategoryFromUrl = searchParams.get('sub_category');

  useEffect(() => {
    dispatch(getCategory());
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
      setPage(1);
      dispatch(filterProducts({ ...filter, page: 1, limit: PAGE_LIMIT }));
      return;
    }

    setIsFiltering(false);
    setSelectedCategories([]);
    setPage(1);
    dispatch(fetchProduct(1, PAGE_LIMIT));
  }, [categoryFromUrl, subCategoryFromUrl, categories, dispatch]);

  const handleCategoryChange = useCallback(
    (categories) => {
      setSelectedCategories(categories);
      setPage(1);

      if (categories.length > 0) {
        setIsFiltering(true);
        dispatch(filterProducts({ category: categories, page: 1, limit: PAGE_LIMIT }));
        setSearchParams({ category: categories.join(',') });
      } else {
        setIsFiltering(false);
        setSearchParams({});
      }
    },
    [dispatch, setSearchParams]
  );

  const handlePageChange = useCallback(
    (nextPage) => {
      setPage(nextPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (isFiltering || selectedCategories.length > 0) {
        const filter = buildCatalogFilter({
          category: selectedCategories.length ? selectedCategories : categoryFromUrl,
          subCategory: subCategoryFromUrl,
          categories,
        });

        if (selectedCategories.length && !filter.category) {
          filter.category = selectedCategories;
        }

        dispatch(filterProducts({ ...filter, page: nextPage, limit: PAGE_LIMIT }));
        return;
      }

      dispatch(fetchProduct(nextPage, PAGE_LIMIT));
    },
    [
      isFiltering,
      selectedCategories,
      categoryFromUrl,
      subCategoryFromUrl,
      categories,
      dispatch,
    ]
  );

  const displayProducts = useMemo(() => {
    if (isFiltering || selectedCategories.length > 0) {
      return filteredProducts;
    }
    return allProducts;
  }, [allProducts, filteredProducts, isFiltering, selectedCategories.length]);

  const totalProducts =
    isFiltering || selectedCategories.length > 0 ? filteredTotal : allTotal;

  const loading = isFiltering ? isLoading : !allProducts.length && page === 1;

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
              {totalProducts} product{totalProducts !== 1 ? 's' : ''}
            </p>
          </div>

          {loading ? (
            <div className="shop-page__loader">
              <div className="loader" />
            </div>
          ) : displayProducts.length > 0 ? (
            <>
              <div className="shop-page__grid">
                {displayProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
              <CatalogPagination
                page={page}
                totalProducts={totalProducts}
                limit={PAGE_LIMIT}
                onPageChange={handlePageChange}
              />
            </>
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
