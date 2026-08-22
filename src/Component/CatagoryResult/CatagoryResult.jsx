import React, { useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { filterProducts } from '../../action/filterAction';
import { getCategory } from '../../action/categoryAction';
import {
  buildCatalogFilter,
  getCategoriesList,
} from '../../utils/categoryUtils';
import ProductCard from '../Home/ProductCard';
import ComparePOPup from '../comparePOPup/ComparePOPup';
import FilterSidebar from '../sidebar/FilterSidebar';
import '../Shop/shop.css';
import '../SearchResult/searchResult.css';

const CategoryResult = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const categoriesState = useSelector((state) => state.categories);
  const categories = useMemo(
    () => getCategoriesList(categoriesState),
    [categoriesState]
  );
  const products = useSelector((state) => state.filteredProducts?.products?.products);
  const compareProducts = useSelector((state) => state.compare.data);
  const loading = useSelector((state) => state.filteredProducts?.loading);
  const opensidebar = useSelector((state) => state.filterData.sidebarOpen);

  const subCategoryParam = searchParams.get('sub_category');
  const pageTitle = subCategoryParam || id;

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

  return (
    <section className="shop-page">
      <div className="shop-page__container shop-page__container--category">
        {opensidebar && <FilterSidebar />}

        <div className="shop-page__main shop-page__main--full">
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
