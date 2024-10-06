import React from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div className="h-screen w-full flex flex-col bg-gray-100 items-center justify-center">
      <h1 className="text-5xl text-gray-800 font-serif mb-6">Login</h1>
      <form className="w-full max-w-sm">
        <input 
          className="w-full mb-4 px-3 py-2 border rounded" 
          type="text" 
          placeholder="Username" 
        />
        <input 
          className="w-full mb-6 px-3 py-2 border rounded" 
          type="password" 
          placeholder="Password" 
        />
        <div className='w-full flex justify-center'>
          <button 
            className="w-3/4 px-6 py-2 bg-txtp-100 text-white font-sans font-medium rounded hover:bg-txtp-200 transition-colors"
            type="button"
          >
            Login
          </button>
        </div>
      </form>
      
      <div className="w-full max-w-sm mt-6 flex items-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-600">or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      
      <div className=" w-full max-w-m mt-6 flex justify-center space-x-4">
        <button className="flex items-center justify-center px-6 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
          <svg className=" h-5 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          Continue with Google
        </button>
        <button className="  px-6 py-2 bg-black text-white font-sans font-medium rounded hover:bg-gray-800 transition-colors">
          X
        </button>
      </div>
    
    </div>
  );
}