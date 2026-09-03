import React from 'react';

const CatalogPagination = ({ page, totalProducts, limit, onPageChange }) => {
  const totalPages = Math.max(1, Math.ceil((totalProducts || 0) / limit));

  if (totalPages <= 1) return null;

  return (
    <nav className="shop-page__pagination" aria-label="Product pagination">
      <button
        type="button"
        className="shop-page__page-btn"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>
      <span className="shop-page__page-status">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        className="shop-page__page-btn"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </nav>
  );
};

export default CatalogPagination;
