import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { filterProducts } from '../../action/filterAction';
import { getCategory } from '../../action/categoryAction';
import {
  buildCatalogFilter,
  findCategoryBySlug,
  getActiveSubcategories,
  getCategoriesList,
  getSubcategoryName,
} from '../../utils/categoryUtils';
import ProductCard from '../Home/ProductCard';
import ShopFilters from '../Shop/ShopFilters';
import CatalogPagination from '../Shop/CatalogPagination';
import ComparePOPup from '../comparePOPup/ComparePOPup';
import '../Shop/shop.css';

const PAGE_LIMIT = 12;

const CategoryResult = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);

  const categoriesState = useSelector((state) => state.categories);
  const categories = useMemo(
    () => getCategoriesList(categoriesState),
    [categoriesState]
  );
  const filteredPayload = useSelector((state) => state.filteredProducts?.products);
  const products = filteredPayload?.products;
  const totalProducts = filteredPayload?.totalProducts || 0;
  const compareProducts = useSelector((state) => state.compare.data);
  const loading = useSelector((state) => state.filteredProducts?.loading);

  const subCategoryParam = searchParams.get('sub_category');
  const pageTitle = subCategoryParam || id;

  const currentCategory = useMemo(
    () => findCategoryBySlug(id, categories),
    [id, categories]
  );

  const subcategories = useMemo(
    () => getActiveSubcategories(currentCategory),
    [currentCategory]
  );

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
    dispatch(getCategory());
  }, [dispatch]);

  useEffect(() => {
    if (!id) return;

    const filter = buildCatalogFilter({
      category: id,
      subCategory: subCategoryParam,
      categories,
    });

    setPage(1);

    if (Object.keys(filter).length > 0) {
      dispatch(filterProducts({ ...filter, page: 1, limit: PAGE_LIMIT }));
    }
  }, [id, subCategoryParam, categories, dispatch]);

  const handlePageChange = useCallback(
    (nextPage) => {
      if (!id) return;

      const filter = buildCatalogFilter({
        category: id,
        subCategory: subCategoryParam,
        categories,
      });

      setPage(nextPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      dispatch(filterProducts({ ...filter, page: nextPage, limit: PAGE_LIMIT }));
    },
    [id, subCategoryParam, categories, dispatch]
  );

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
            activeSubCategory={subCategoryParam}
            currentCategorySlug={id}
          />
        </aside>

        <div className="shop-page__main">
          <div className="shop-page__header">
            <h1 className="shop-page__title">{pageTitle}</h1>
            {!loading && (
              <p className="shop-page__count">
                {totalProducts} product{totalProducts !== 1 ? 's' : ''}
              </p>
            )}
            {subcategories.length > 0 && currentCategory && (
              <div className="shop-page__subcategories">
                <Link
                  to={`/category/${encodeURIComponent(currentCategory.name)}`}
                  className={`shop-page__subcategory-link${
                    !subCategoryParam ? ' is-active' : ''
                  }`}
                >
                  All {currentCategory.name}
                </Link>
                {subcategories.map((sub) => {
                  const subName = getSubcategoryName(sub);
                  if (!subName) return null;

                  const isActive =
                    subCategoryParam &&
                    decodeURIComponent(subCategoryParam).toLowerCase() ===
                      subName.toLowerCase();

                  return (
                    <Link
                      key={sub._id || subName}
                      to={`/category/${encodeURIComponent(currentCategory.name)}?sub_category=${encodeURIComponent(subName)}`}
                      className={`shop-page__subcategory-link${isActive ? ' is-active' : ''}`}
                    >
                      {subName}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {loading ? (
            <div className="shop-page__loader">
              <div className="loader" />
            </div>
          ) : products && products.length > 0 ? (
            <>
              <div className="shop-page__grid">
                {products.map((product) => (
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
