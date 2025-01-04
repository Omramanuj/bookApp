import {useState,useEffect} from 'react';

export const UseBookProgress = (bookId) => {
    const [progress,setProgress] = useState(0);
    const [totalPages,setTotalPages] = useState(0);
    const [currentPage,setCurrentPage] = useState(0);   

    const calculateProgress = (rendition,location) => {
        const total= rendition.book.spine.items.length;
        const current = rendition.book.spine.items.findIndex (
            item => item.href === location.start.cfi.split('!')[0]
        );

        setTotalPages(total);
        setCurrentPage(current);
        setProgress(Math.floor(current/total)*100);
        
    }
    return {
        progress,
        totalPages,
        currentPage,
        calculateProgress
    };
}