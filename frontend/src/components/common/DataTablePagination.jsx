import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SearchFilterSelect from './SearchFilterSelect';

const pageSizeOptions = [5, 10, 25, 50];

const DataTablePagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemLabel
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const visiblePageCount = Math.min(5, totalPages);
  const firstVisiblePage = Math.min(
    Math.max(1, currentPage - 2),
    Math.max(1, totalPages - visiblePageCount + 1)
  );
  const visiblePages = Array.from(
    { length: visiblePageCount },
    (_, index) => firstVisiblePage + index
  );
  const firstItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const lastItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="data-table-pagination">
      <p className="data-table-pagination-label">
        Showing {firstItem} to {lastItem} of {totalItems} {itemLabel}
      </p>
      <div className="data-table-pagination-controls">
        <div className="data-table-page-size">
          <SearchFilterSelect
            label={`Items per page for ${itemLabel}`}
            value={itemsPerPage}
            onValueChange={(value) => {
              const nextPageSize = Number(value);
              if (Number.isInteger(nextPageSize) && nextPageSize > 0) {
                onItemsPerPageChange(nextPageSize);
              }
            }}
            options={pageSizeOptions.map((size) => ({ value: size, label: `${size} per page` }))}
            formField
            allowClear={false}
            menuClassName="data-table-page-size-menu"
          />
        </div>
        <button
          type="button"
          className="data-table-pagination-control"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {visiblePages.map((page) => (
          <button
            key={page}
            type="button"
            className={`data-table-pagination-control${page === currentPage ? ' is-current' : ''}`}
            aria-current={page === currentPage ? 'page' : undefined}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          className="data-table-pagination-control"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default DataTablePagination;
