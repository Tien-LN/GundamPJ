import React, { useState } from "react";

function DataTable({
  columns,
  data,
  actions,
  pagination = true,
  itemsPerPage = 10,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Sorting logic
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  // Pagination logic
  const pageCount = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = pagination
    ? sortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : sortedData;

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="data-table-container">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => column.sortable && requestSort(column.key)}
                className={column.sortable ? "sortable" : ""}
              >
                {column.label}
                {sortConfig.key === column.key && (
                  <span className="sort-indicator">
                    {sortConfig.direction === "asc" ? " ↑" : " ↓"}
                  </span>
                )}
              </th>
            ))}
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => (
                <td key={column.key}>
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
              {actions && (
                <td className="actions">
                  {actions.map((action, actionIndex) => (
                    <button
                      key={actionIndex}
                      onClick={() => action.onClick(row)}
                      className={action.type}
                      title={action.label}
                    >
                      <i className={action.icon}></i>
                    </button>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {pagination && pageCount > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          <div className="pagination-pages">
            {Array.from({ length: pageCount }, (_, i) => i + 1)
              .filter((page) => {
                // Show first page, last page, current page and pages around current page
                return (
                  page === 1 ||
                  page === pageCount ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                );
              })
              .map((page, i, array) => {
                // Add ellipsis where needed
                const showEllipsis = i > 0 && array[i - 1] !== page - 1;

                return (
                  <React.Fragment key={page}>
                    {showEllipsis && (
                      <span className="pagination-ellipsis">...</span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`pagination-page ${
                        currentPage === page ? "active" : ""
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              })}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, pageCount))
            }
            disabled={currentPage === pageCount}
            className="pagination-button"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
}

export default DataTable;
