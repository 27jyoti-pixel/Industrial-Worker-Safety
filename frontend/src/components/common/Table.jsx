import React from 'react';
import Loader from './Loader';
import EmptyState from './EmptyState';

const Table = ({
  columns = [],
  data = [],
  loading = false,
  emptyTitle,
  emptyDescription,
  onEmptyAction,
  emptyActionText,
  keyField = '_id',
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`industrial-card overflow-hidden ${className}`}>
        <Loader text="Loading records..." />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle || 'No items available'}
        description={
          emptyDescription ||
          'There are no records matching your current filter criteria.'
        }
        onAction={onEmptyAction}
        actionText={emptyActionText}
      />
    );
  }

  return (
    <div className={`industrial-card overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
  <tr className="bg-[#f6f4ee] border-b border-sand-200">
    {columns.map((col, idx) => (
      <th
        key={idx}
        className={`px-4 py-3 text-sm font-extrabold text-sand-500 tracking-[.12em] ${
          col.className?.includes('text-right')
            ? '!text-right'
            : '!text-left'
        }`}
      >
        {col.header}
      </th>
    ))}
  </tr>
</thead>
          <tbody className="divide-y divide-sand-100">
            {data.map((row, rowIdx) => (
              <tr
                key={row[keyField] || rowIdx}
                className="hover:bg-[#faf9f5] transition-colors"
              >
                {columns.map((col, colIdx) => (
                  <td
                    key={colIdx}
                    className={`px-4 py-3 text-sm text-sand-700 ${
                      col.cellClassName || ''
                    }`}
                  >
                    {col.render
                      ? col.render(row, rowIdx)
                      : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
