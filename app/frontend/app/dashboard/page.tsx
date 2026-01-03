"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      try {
        const userDataasda = await fetch('http://localhost:3000/user-profile', {
          credentials: 'include',
        });

        const userData = await userDataasda.json();
        
        if (userData.type === "BD_PARTNER_INDIVIDUAL" || userData.type === "BD_PARTNER_ORGANIZATION"){
            router.push('/dashboard/bd-partner');
        } else if (userData.type === "COMPANY"){
            router.push('/dashboard/company');
        } else {
            throw new Error("Unknown user type");
        }
        
        } catch (error) {
          console.error('Error fetching user profile:', error);
          router.push('/login');
          return;
        }
    };

    checkUserAndRedirect();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        <p className="ml-4 text-lg">Redirecting to your dashboard...</p>
      </div>
    );
  }

  return null; 
}