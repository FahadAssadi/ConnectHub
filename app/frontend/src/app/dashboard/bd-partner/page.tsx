"use client";

import { useEffect, useState } from 'react';

export default function Dashboard() {
    let userData = null;

    useEffect(() => {
        const fetchUserData = async () => {
            userData = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/protected/user`, 
              { credentials: 'include' } 
            );

            userData = await userData.json();

            console.log('User Data Response:', userData);
        };

        fetchUserData();
    }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">Welcome to your Dashboard</h1>
        {userData && (
            <pre className="mt-4 text-left">{JSON.stringify(userData, null, 2)}</pre>
        )}
    </div>
  );
}