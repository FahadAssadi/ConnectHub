"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth-client';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      try {
        const { profileData, error } = await getSession();
        
        if (error || !profileData) {
          throw new Error('No active session');
        }

        const userType = profileData.userType;

        if (userType === 'bd-partner') {
          router.push('/dashboard/bd-partner');
        } else if (userType === 'company') {
          router.push('/dashboard/company');
        } else {
          throw new Error('Unknown user type');
        }
      } catch (error) {
        console.error('Error checking session:', error);
        router.push('/login');
      } finally {
        setLoading(false);
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