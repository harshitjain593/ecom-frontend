export const getCategoriesList = (categoriesState) => {
  const list = categoriesState?.categories?.category;
  return Array.isArray(list) ? list : [];
};

export const getSubcategories = (category) => {
  if (!category) return [];

  const nested =
    category.subcategories ||
    category.subCategories ||
    category.sub_category ||
    category.subCategory;

  if (Array.isArray(nested)) return nested;
  if (typeof nested === 'string' && nested.trim()) return [{ name: nested }];
  return [];
};

export const getSubcategoryName = (subcategory) => {
  if (!subcategory) return '';
  if (typeof subcategory === 'string') return subcategory;
  return subcategory.name || subcategory.subcategory_name || subcategory.title || '';
};

const normalizeName = (value) => decodeURIComponent(value || '').trim().toLowerCase();

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
    const subs = getSubcategories(category);
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
        const subs = getSubcategories(cat);
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
