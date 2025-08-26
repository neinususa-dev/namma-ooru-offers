import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OfferCard } from '@/components/OfferCard';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface Offer {
  id: string;
  shopName: string;
  offerTitle: string;
  description: string;
  discount: string;
  expiryDate: string;
  district: string;
  city: string;
  location: string;
  category: string;
  isTrending?: boolean;
  isHot?: boolean;
  image: string;
}

interface PaginatedOffersSectionProps {
  title: string;
  icon: React.ReactNode;
  offers: Offer[];
  sectionClass?: string;
}

export const PaginatedOffersSection: React.FC<PaginatedOffersSectionProps> = ({
  title,
  icon,
  offers,
  sectionClass = "py-12 bg-background"
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const offersPerPage = 4;
  const totalPages = Math.ceil(offers.length / offersPerPage);

  // Auto-scrolling effect with smooth 10-second intervals
  useEffect(() => {
    if (!isAutoScrolling || totalPages <= 1) return;

    const interval = setInterval(() => {
      setCurrentPage(prev => (prev + 1) % totalPages);
    }, 10000);

    return () => clearInterval(interval);
  }, [isAutoScrolling, totalPages]);

  // Pause auto-scroll when user interacts
  const handleUserInteraction = () => {
    setIsAutoScrolling(false);
    // Resume auto-scroll after 5 seconds of no interaction
    setTimeout(() => setIsAutoScrolling(true), 5000);
  };

  const handlePrevious = () => {
    handleUserInteraction();
    setCurrentPage(prev => (prev - 1 + totalPages) % totalPages);
  };

  const handleNext = () => {
    handleUserInteraction();
    setCurrentPage(prev => (prev + 1) % totalPages);
  };

  const handlePageClick = (page: number) => {
    handleUserInteraction();
    setCurrentPage(page);
  };

  const getCurrentOffers = () => {
    const startIndex = currentPage * offersPerPage;
    const endIndex = startIndex + offersPerPage;
    return offers.slice(startIndex, endIndex);
  };

  if (offers.length === 0) {
    return null;
  }

  return (
    <section className={sectionClass}>
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-3xl font-bold text-foreground">{title}</h3>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-primary/50 to-transparent"></div>
        </div>
        
        {/* Offers Grid - Always show 4 columns with smooth transition */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 transition-all duration-700 ease-in-out">
          {getCurrentOffers().map(offer => (
            <OfferCard key={offer.id} {...offer} />
          ))}
          {/* Fill empty slots if less than 4 offers on current page */}
          {Array.from({ length: Math.max(0, offersPerPage - getCurrentOffers().length) }).map((_, index) => (
            <div key={`empty-${index}`} className="hidden lg:block"></div>
          ))}
        </div>

        {/* Pagination Controls - Centered */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mb-4">
            {/* Previous Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={totalPages <= 1}
              className="h-8 w-8 p-0 border-primary/30 hover:bg-primary hover:text-primary-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, index) => (
                <Button
                  key={index}
                  variant={currentPage === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageClick(index)}
                  className={`h-8 w-8 p-0 text-sm ${
                    currentPage === index 
                      ? "bg-primary text-primary-foreground" 
                      : "border-primary/30 hover:bg-primary hover:text-primary-foreground"
                  }`}
                >
                  {index + 1}
                </Button>
              ))}
            </div>

            {/* Next Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={totalPages <= 1}
              className="h-8 w-8 p-0 border-primary/30 hover:bg-primary hover:text-primary-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Auto-scroll indicator */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className={`w-2 h-2 rounded-full transition-all duration-300 ${isAutoScrolling ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`}></div>
              <span>{isAutoScrolling ? 'Auto-scrolling every 10s' : 'Auto-scroll paused'}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};