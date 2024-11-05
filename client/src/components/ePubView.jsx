import React, { useState, useEffect, useRef } from 'react';
import { Book } from 'epubjs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const EpubViewer = () => {

  const bookUrl=localStorage.getItem('bookUrl');
  const viewerRef = useRef(null);
  const [book, setBook] = useState(null);
  const [rendition, setRendition] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  useEffect(() => {
   
    if(!bookUrl){
      return;
    }

    // Initialize EPUB
    const initializeEpub = async () => {
      try {
        const newBook = new Book(bookUrl);
        await newBook.ready;
        
        const newRendition = newBook.renderTo(viewerRef.current, {
          width: '100%',
          height: '600px',
          spread: 'none',
        });

        await newRendition.display();

        newRendition.on('rendered', () => {
          setCurrentPage(newBook.locations.percentageFromCfi(newRendition.currentLocation().start.cfi) * totalPages);
        });

        setTotalPages(newBook.spine.length);

        setBook(newBook);
        setRendition(newRendition);
      } catch (error) {
        console.error('Error loading EPUB:', error);
      }
    };

    initializeEpub();

    return () => {
      if (book) {
        book.destroy();
      }
    };
  }, [bookUrl]);

  const goToNextPage = () => {
    if (rendition && currentPage < totalPages - 1) {
      rendition.next();
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (rendition && currentPage > 0) {
      rendition.prev();
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <div 
          ref={viewerRef} 
          className="w-full border rounded-lg bg-white"
        />
        
        <div className="flex items-center justify-between mt-4">
          <Button
            onClick={goToPrevPage}
            disabled={currentPage === 0}
            variant="outline"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <span className="text-sm">
            Page {currentPage + 1} of {totalPages}
          </span>
          
          <Button
            onClick={goToNextPage}
            disabled={currentPage === totalPages - 1}
            variant="outline"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EpubViewer;
