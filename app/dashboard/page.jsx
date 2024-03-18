'use client';
import { useSession } from 'next-auth/react';
import React from 'react';

export default function Dashboard() {
  const { data: session } = useSession();
  return (
    <div>
      <h1>Client Side</h1>
      {JSON.stringify(session)}
    </div>
  );
}
