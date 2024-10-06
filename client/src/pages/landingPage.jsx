import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="h-screen w-full flex flex-col bg-gray-100 items-center justify-center">
      <h1 className="text-7xl text-gray-800 font-serif mb-4">
        Book App
      </h1>
      <p className="text-lg text-gray-600 font-sans">
        The one you don't deserve but you need
      </p>

      <div className="mt-8 space-x-4">
        <button className="px-6 py-2 bg-txts text-white font-sans font-medium rounded hover:bg-txtp-100 transition-colors">
          Try for Free
        </button>
        <Link to="/login" className="px-6 py-2 bg-bgs text-gray-800 font-sans font-medium rounded hover:bg-txtp-100 transition-colors">
          Login
        </Link>
      </div>
    </div>
  );
}