"use client";
import React, { useRef } from 'react';
import dynamic from 'next/dynamic';
import SideBar from '../ui/components/side-bar/side-bar';

const Dashboard = dynamic(() => import('../ui/components/dashboard/dashboard'), { ssr: false });

export default function ChatIndexPage() {
  const sideRef = useRef(null);

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f9fafb' }}>
      <SideBar ref={sideRef} currentChatId={null} />
      <main style={{ flex: 1, overflow: 'hidden' }}>
        <Dashboard />
      </main>
    </div>
  );
}