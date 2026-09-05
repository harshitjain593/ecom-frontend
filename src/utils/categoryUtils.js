const EMPTY_CATEGORIES = [];

export const getCategoriesList = (categoriesState) => {
  const list = categoriesState?.categories?.category;
  // Stable empty reference — a fresh [] here re-triggers useSelector/useEffect loops.
  return Array.isArray(list) ? list : EMPTY_CATEGORIES;
};

export const isActiveCatalogItem = (item) => {
  if (!item?.status) return true;
  return String(item.status).toLowerCase() === 'active';
};

export const getSubcategories = (category) => {
  if (!category) return [];

  const nested =
    category.subcategories ||
    category.subCategories ||
    category.sub_category ||
    category.subCategory;

  if (Array.isArray(nested)) return nested;
  if (typeof nested === 'string' && nested.trim()) {
    return [{ subcategory: nested }];
  }
  return [];
};

export const getActiveSubcategories = (category) => {
  return getSubcategories(category).filter(isActiveCatalogItem);
};

const normalizeName = (value) => decodeURIComponent(value || '').trim().toLowerCase();

export const extractCategoryList = (result) => {
  if (!result) return [];
  if (Array.isArray(result)) return result;
  if (Array.isArray(result.category)) return result.category;
  if (Array.isArray(result.categories)) return result.categories;
  return [];
};

export const getSubcategoryName = (subcategory) => {
  if (!subcategory) return '';
  if (typeof subcategory === 'string') return subcategory;
  return (
    subcategory.subcategory ||
    subcategory.name ||
    subcategory.subcategory_name ||
    subcategory.title ||
    ''
  );
};

export const findCategoryBySlug = (slug, categories = []) => {
  if (!slug) return null;
  const normalizedSlug = normalizeName(slug);
  return categories.find((cat) => normalizeName(cat.name) === normalizedSlug);
};

export const resolveCatalogFilter = (slug, categories = []) => {
  if (!slug) return {};

  const normalizedSlug = normalizeName(slug);
  const topLevel = categories.find(
    (cat) => normalizeName(cat.name) === normalizedSlug
  );

  if (topLevel) {
    return { category: topLevel.name };
  }

  for (const category of categories) {
    const subs = getActiveSubcategories(category);
    const match = subs.find(
      (sub) => normalizeName(getSubcategoryName(sub)) === normalizedSlug
    );

    if (match) {
      return {
        category: category.name,
        sub_category: getSubcategoryName(match),
      };
    }
  }

  return { category: decodeURIComponent(slug).trim() };
};

export const buildCatalogFilter = ({ category, subCategory, categories = [] }) => {
  const filter = {};

  if (subCategory) {
    filter.sub_category = subCategory;

    if (category) {
      filter.category = category;
    } else {
      for (const cat of categories) {
        const subs = getActiveSubcategories(cat);
        const match = subs.find(
          (sub) => normalizeName(getSubcategoryName(sub)) === normalizeName(subCategory)
        );
        if (match) {
          filter.category = cat.name;
          break;
        }
      }
    }

    return filter;
  }

  if (category) {
    return resolveCatalogFilter(category, categories);
  }

  return {};
};
