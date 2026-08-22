import React, { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { filterProducts } from '../../action/filterAction';
import { getCategory } from '../../action/categoryAction';
import {
  buildCatalogFilter,
  getCategoriesList,
} from '../../utils/categoryUtils';
import ProductCard from '../Home/ProductCard';
import ShopFilters from '../Shop/ShopFilters';
import ComparePOPup from '../comparePOPup/ComparePOPup';
import '../Shop/shop.css';

const CategoryResult = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const categoriesState = useSelector((state) => state.categories);
  const categories = useMemo(
    () => getCategoriesList(categoriesState),
    [categoriesState]
  );
  const products = useSelector((state) => state.filteredProducts?.products?.products);
  const compareProducts = useSelector((state) => state.compare.data);
  const loading = useSelector((state) => state.filteredProducts?.loading);

  const subCategoryParam = searchParams.get('sub_category');
  const pageTitle = subCategoryParam || id;

  const selectedCategories = useMemo(() => {
    if (!id) return [];

    const filter = buildCatalogFilter({
      category: id,
      subCategory: subCategoryParam,
      categories,
    });

    if (filter.category) {
      return Array.isArray(filter.category) ? filter.category : [filter.category];
    }

    return [decodeURIComponent(id)];
  }, [id, subCategoryParam, categories]);

  useEffect(() => {
    if (!categories.length) {
      dispatch(getCategory());
    }
  }, [dispatch, categories.length]);

  useEffect(() => {
    if (!id) return;

    const filter = buildCatalogFilter({
      category: id,
      subCategory: subCategoryParam,
      categories,
    });

    if (Object.keys(filter).length > 0) {
      dispatch(filterProducts(filter));
    }
  }, [id, subCategoryParam, categories, dispatch]);

  const handleCategoryChange = useCallback(
    (nextCategories) => {
      if (nextCategories.length === 1) {
        navigate(`/category/${encodeURIComponent(nextCategories[0])}`);
        return;
      }

      if (nextCategories.length > 1) {
        navigate(`/shop?category=${nextCategories.map(encodeURIComponent).join(',')}`);
        return;
      }

      navigate('/shop');
    },
    [navigate]
  );

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
            <h1 className="shop-page__title">{pageTitle}</h1>
            {!loading && (
              <p className="shop-page__count">
                {products?.length || 0} product{(products?.length || 0) !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {loading ? (
            <div className="shop-page__loader">
              <div className="loader" />
            </div>
          ) : products && products.length > 0 ? (
            <div className="shop-page__grid">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="shop-page__empty">
              <p>No products found in this category.</p>
            </div>
          )}

          {compareProducts?.products?.length > 0 && (
            <ComparePOPup products={compareProducts.products} />
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoryResult;
