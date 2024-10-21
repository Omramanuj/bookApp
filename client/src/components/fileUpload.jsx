import React, { useState } from 'react';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');

    const handleFileChange = (e) => {
      setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(file){
            setUploadStatus('Uploading...');
            const fileType = file.name.endsWith('.epub') ? 'application/epub+zip' : 'application/pdf';
            try {
                const response = await fetch('http://localhost:8080/book_url', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ filename: file.name })
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message);
                }
                
                console.log(data);
                const uploadResponse = await fetch(data.preSignedUrl, {
                    method: 'PUT',
                    body: file,
                    headers: {
                        'Content-Type': fileType
                    },
                });

                if (!uploadResponse.ok) {
                    throw new Error(uploadResponse.statusText);
                }
                console.log(uploadResponse);
                const url = uploadResponse.url;

                const saveBookResponse = await fetch('http://localhost:8080/save_book', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  credentials: 'include', 
                  body: JSON.stringify({ url: url ,
                    filename: file.name,
                    url:url
                  })
                });
               
                const saveBookResult = await saveBookResponse.json();
                if (!saveBookResponse.ok) {
                  throw new Error(saveBookResult.message);
                }

                setUploadStatus('File uploaded successfully!');
                alert('File uploaded successfully!');
            } catch (error) {
                console.log(`Error uploading file: ${error.message}`);
                setUploadStatus(`Error: ${error.message}`);
            }
        } else {
            setUploadStatus('Please select a file to upload.');
        }
    };

    return (
      <div className="mb-5">
        <h2 className="text-xl mb-2">Upload a Book (EPUB):</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept=".pdf,.epub"
            onChange={handleFileChange}
            className="mb-2"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Upload Book
          </button>
          {uploadStatus && <p className="mt-2">{uploadStatus}</p>}
        </form>
      </div>
    );
  };
  
  export default FileUpload;
