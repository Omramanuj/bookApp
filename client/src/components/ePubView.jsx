import React, { useState } from 'react';
import { ReactReader } from 'react-reader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const EpubViewer = () => {
  // State management for the reader
  const [location, setLocation] = useState(0);
  const [rendition, setRendition] = useState(null);
  const navigate = useNavigate();
  
  // Get the book URL from localStorage or use the default
  const bookUrl = localStorage.getItem('bookUrl') || "https://react-reader.metabits.no/files/alice.epub";

  // Function to handle page navigation within the book
  const navigateBook = (direction) => {
    if (rendition) {
      direction === 'prev' ? rendition.prev() : rendition.next();
    }
  };

  // Function to handle navigation back to dashboard
  const returnToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <Card className="w-full h-screen">
      <CardContent className="p-0 relative h-full">
        {/* Back to Dashboard button positioned at the top */}
        <div className="absolute top-4 left-4 z-10">
          <Button 
            onClick={returnToDashboard} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>

        {/* EPUB Reader component */}
        <ReactReader
          url={bookUrl}
          location={location}
          locationChanged={setLocation}
          getRendition={setRendition}
        />

        {/* Navigation controls */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 bg-background/80 p-2">
          <Button onClick={() => navigateBook('prev')} variant="outline">
            Previous
          </Button>
          <Button onClick={() => navigateBook('next')} variant="outline">
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EpubViewer;