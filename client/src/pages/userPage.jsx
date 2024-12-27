// UserPage.jsx
import React, { useState ,useEffect} from 'react';
import UserInfo from '@/components/userInfo';
import BookListItem from '@/components/bookList';
import FileUpload from '@/components/fileUpload';
import { useNavigate } from 'react-router-dom';


const UserPage = () => {

  const [books, setBooks] = useState([]); 

useEffect(() => {
    fetchBooks();
}, []);

const fetchBooks =async() =>{
    try{
        const response = await fetch("http://localhost:8080/books",{
            method: "GET",
            credentials: "include",
        })

        if(response.ok){
            const data=await response.json();
            console.log(data)
            setBooks(data)
        }
        else {
            throw new Error (response.statusText)
        }

    }catch(error){
        console.log(error)
    }
}

  const userData = {
    name: "John Doe",
    email: "john@example.com",
  };


  const handleDeleteBook = async (bookId) => {
    console.log('Deleting book:', bookId);
  };

  const navigate = useNavigate();

  const handleBookClick = (bookUrl) => {
    console.log('Opening book:', bookUrl);
    localStorage.setItem('bookUrl', bookUrl);
    navigate(`/epub-viewer`);

  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <UserInfo user={userData} />
        
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-[#4A4947]">My Library</h2>
    <FileUpload />
        </div>

        <div className="space-y-4">
          {books.map((book) => (
            <a               
            
            onClick={() => handleBookClick(book.presigned_url)} target="_blank">
            <BookListItem
              key={book.id}
              book={book}
              onDelete={handleDeleteBook}
              onClick={() => handleBookClick(book.presigned_url)}
            />
            </a>

          ))}
        </div>

        <footer className="text-center text-[#4A4947] text-sm mt-8">
          Created by <a 
            href="https://x.com/Om_RRamanuj" 
            className="text-[#C15E3C] hover:text-[#C85E37]"
            target="_blank" 
            rel="noopener noreferrer"
          >
            @Om_RRamanuj
          </a>
        </footer>
      </div>
    </div>
  );
};

export default UserPage;
