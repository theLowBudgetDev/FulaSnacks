
"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationComponentProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function PaginationComponent({ totalPages, currentPage, onPageChange }: PaginationComponentProps) {
  const pageNumbers = [];
  const maxPagesToShow = 5;

  if (totalPages <= maxPagesToShow) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      startPage = 1;
      endPage = maxPagesToShow;
    } else if (currentPage > totalPages - 3) {
      startPage = totalPages - maxPagesToShow + 1;
      endPage = totalPages;
    }
    
    if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
            pageNumbers.push(-1); // Ellipsis
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pageNumbers.push(-1); // Ellipsis
        }
        pageNumbers.push(totalPages);
    }
  }
  
  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
        {pageNumbers.map((num, index) => (
          <PaginationItem key={index}>
            {num === -1 ? (
                <PaginationEllipsis />
            ) : (
                <PaginationLink 
                    href="#"
                    isActive={currentPage === num}
                    onClick={(e) => {
                        e.preventDefault();
                        onPageChange(num);
                    }}
                >
                  {num}
                </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext 
             href="#"
             onClick={(e) => {
               e.preventDefault();
               if (currentPage < totalPages) onPageChange(currentPage + 1);
             }}
             className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
