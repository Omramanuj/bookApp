import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');

    const handleFileChange = (e) => {
      setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (file) {
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
                if (!response.ok) throw new Error(data.message);
                
                const uploadResponse = await fetch(data.preSignedUrl, {
                    method: 'PUT',
                    body: file,
                    headers: {
                        'Content-Type': fileType
                    },
                });

                if (!uploadResponse.ok) throw new Error(uploadResponse.statusText);
                
                const URLofUploaded = uploadResponse.url;
                const saveBookResponse = await fetch('http://localhost:8080/save_book', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  credentials: 'include', 
                  body: JSON.stringify({
                    url: URLofUploaded,
                    filename: file.name,
                  })
                });

                const saveBookResult = await saveBookResponse.json();
                if (!saveBookResponse.ok) throw new Error(saveBookResult.message);

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
        <div className="relative mb-5">
            <input
                type="file"
                accept=".pdf,.epub"
                onChange={handleFileChange}
                className="hidden"
                id="epub-upload"
            />
            <Button
                variant="outline"
                className="bg-[#C15E3C] text-[#FAF7F0] hover:bg-[#C85E37]"
                onClick={() => document.getElementById('epub-upload').click()}
            >
                <Upload className="h-5 w-5 mr-2" />
                Upload EPUB
            </Button>
            <form onSubmit={handleSubmit}>
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors mt-2"
                >
                    Submit Upload
                </button>
            </form>
            {uploadStatus && <p className="mt-2 text-gray-600">{uploadStatus}</p>}
        </div>
    );
};

export default FileUpload;
