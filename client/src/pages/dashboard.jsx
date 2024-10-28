import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import  FileUpload  from '../components/fileUpload';
import UserInfo  from '../components/userInfo';
import MyComponent from '../components/cnTester';


export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:8080/user', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      setError('Error fetching user data. Please try logging in again.');
      console.error('Error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8080/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      setError('Error during logout. Please try again.');
      console.error('Logout error:', error);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <h1 className="text-2xl font-semibold mb-5">Dashboard</h1>
          <FileUpload  />
          <UserInfo userData={userData} />

      <MyComponent />
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}