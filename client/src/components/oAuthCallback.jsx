import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function OAuthCallback() {
    const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    if (token) {
      localStorage.setItem('jwt', token);

      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [navigate, location]);


  return (
    <>
         Processing login...
    </>
  )
}
