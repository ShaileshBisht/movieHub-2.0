import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalResults?: number;
  maxPages?: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, totalResults, maxPages = 100, onPageChange }: PaginationProps) {
  // Limit total pages to maxPages
  const limitedTotalPages = Math.min(totalPages, maxPages);

  // Calculate page range to show
  const getPageRange = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(limitedTotalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < limitedTotalPages - 1) {
      rangeWithDots.push("...", limitedTotalPages);
    } else if (limitedTotalPages > 1) {
      rangeWithDots.push(limitedTotalPages);
    }

    return rangeWithDots;
  };

  const pageRange = getPageRange();

  const handlePageChange = (newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, limitedTotalPages));
    onPageChange(validPage);
  };

  if (limitedTotalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center space-y-4 py-8">
      {/* Page info */}
      <div className="text-sm text-gray-400 text-center">
        <div>
          Page {currentPage} of {limitedTotalPages.toLocaleString()}
          {totalResults && ` • ${totalResults.toLocaleString()} total results`}
        </div>
        {totalPages > maxPages && <div className="text-xs text-gray-500 mt-1">Showing first {maxPages} pages only</div>}
      </div>

      {/* Pagination controls */}
      <div className="flex items-center space-x-1">
        {/* Previous button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-l-lg hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-800 disabled:hover:text-gray-300 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </button>

        {/* Page numbers */}
        <div className="flex">
          {pageRange.map((pageNum, index) => (
            <button
              key={index}
              onClick={() => (typeof pageNum === "number" ? handlePageChange(pageNum) : null)}
              disabled={typeof pageNum !== "number"}
              className={`px-3 py-2 text-sm font-medium border-t border-b border-gray-700 transition-colors ${
                pageNum === currentPage
                  ? "text-white bg-purple-600 border-purple-600"
                  : typeof pageNum === "number"
                  ? "text-gray-300 bg-gray-800 hover:bg-gray-700 hover:text-white"
                  : "text-gray-500 bg-gray-800 cursor-default"
              }`}
            >
              {pageNum}
            </button>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= limitedTotalPages}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-r-lg hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-800 disabled:hover:text-gray-300 transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* Quick jump to page */}
      <div className="flex items-center space-x-2 text-sm">
        <span className="text-gray-400">Go to page:</span>
        <input
          type="number"
          min="1"
          max={limitedTotalPages}
          value={currentPage}
          onChange={(e) => {
            const newPage = parseInt(e.target.value);
            if (newPage >= 1 && newPage <= limitedTotalPages) {
              handlePageChange(newPage);
            }
          }}
          className="w-16 px-2 py-1 text-center text-white bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
        />
        <span className="text-gray-400">of {limitedTotalPages}</span>
      </div>
    </div>
  );
}
