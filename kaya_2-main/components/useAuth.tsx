// hooks/useAuth.js
/*
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const response = await fetch('https://jbuit.org/api/check-session.php'); // Call to the backend to validate the session
      const data = await response.json();

      if (data.status === 'authenticated') {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.push('/login'); // Redirect to login if not authenticated
      }
    };

    checkSession();
  }, [router]);

  return isAuthenticated;
};

export default useAuth;
*/
