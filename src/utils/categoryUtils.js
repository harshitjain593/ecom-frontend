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
