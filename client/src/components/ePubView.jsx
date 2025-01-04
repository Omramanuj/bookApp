import React, { useState ,useEffect} from 'react';
import { ReactReader } from 'react-reader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTTS } from './TTS/UseTTS';
import { TTSControls } from './TTS/TTSControls';


const EpubViewer = () => {
  // State management for the reader
  const [location, setLocation] = useState(0);
  const [rendition, setRendition] = useState(null);
  const [currentText, setCurrentText] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [lastPage, setLastPage] = useState(0);
  const [bookId] = useState(localStorage.getItem('bookId'));
  const navigate = useNavigate();

 

  const saveProgress = async () => {
    if (!bookId || !rendition) return;
    console.log(bookId)
    try {
      const response = await fetch(`http://localhost:8080/books/${bookId}/progress`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({
          total_page: totalPages,
          current_page: lastPage,
          progress_cfi: location
        })
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Progress saved:", data);
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  };
  



  const { 
    speak, 
    pause, 
    stop, 
    isPlaying,
    voices,
    selectedVoice,
    setSelectedVoice,
    speed,
    setSpeed 
  } = useTTS();
  
  useEffect(() => {
    if (rendition) {
      const contents = rendition.getContents();
      if (contents && contents[0]) {
        setCurrentText(contents[0].content.textContent);
      }
    }
  }, [rendition, location]);

  useEffect(() => {
    if (rendition) {
      // Get total pages
      rendition.book.locations.generate().then(() => {
        const total = rendition.book.locations.length();
        setTotalPages(total);
      });
    }
  }, [rendition]);

  useEffect(() => {
    if (rendition) {
      rendition.on('relocated', (location) => {
        const currentPage = location.start.displayed.page;
        setLastPage(currentPage);

      });
    }
  }, [rendition]);

  useEffect(() => {
    if (rendition && location) {
      const currentPage = rendition.book.locations.locationFromCfi(location);
      setLastPage(currentPage);
    }
  }, [location]);
useEffect(() => {
  return () => {
    saveProgress(); // Save progress when component unmounts
  };
}, [lastPage, totalPages, location]);

  // Get the book URL from localStorage or use the default
  const bookUrl = localStorage.getItem('bookUrl') 
  // || "https://react-reader.metabits.no/files/alice.epub";

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
                          {/* Text-to-Speech controls */}

      <TTSControls
          isPlaying={isPlaying}
          onPlay={() => speak(currentText)}
          onPause={pause}
          onStop={stop}
          disabled={!currentText}
        />
        </div>

        {/* EPUB Reader component */}
        <ReactReader
          url={bookUrl}
          location={location}
          locationChanged={(epubcfi) => {
            setLocation(epubcfi);
            // Update text when page changes
            if (rendition) {
              const contents = rendition.getContents();
              if (contents && contents[0]) {
                setCurrentText(contents[0].content.textContent);
              }
            }
          }}
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