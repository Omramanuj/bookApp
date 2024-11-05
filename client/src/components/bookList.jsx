// BookListItem.jsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Book as BookIcon, ChevronRight } from 'lucide-react';

const BookListItem = ({ book, onDelete, onClick }) => (
  <Card 
    className="bg-[#FAF7F0] border-[#D8D2C2] hover:bg-[#D8D2C2] transition-colors cursor-pointer"
    onClick={onClick}
  >
    <CardContent className="p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <BookIcon className="h-8 w-8 text-[#C15E3C]" />
        <div>
          <h3 className="font-semibold text-[#4A4947]">{book.title}</h3>
          <p className="text-sm text-[#4A4947]">by {book.author}</p>
          <div className="flex items-center space-x-2 mt-1">
            <div className="h-2 w-24 bg-[#D8D2C2] rounded-full">
              <div 
                className="h-full bg-[#C15E3C] rounded-full" 
                style={{ width: `${book.progress}%` }}
              />
            </div>
            <span className="text-xs text-[#4A4947]">{book.progress}%</span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon"
          className="text-[#C15E3C] hover:text-[#C85E37]"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(book.id);
          }}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
        <ChevronRight className="h-5 w-5 text-[#4A4947]" />
      </div>
    </CardContent>
  </Card>
);

export default BookListItem;
