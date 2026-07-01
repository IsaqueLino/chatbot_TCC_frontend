"use client";
import React, { useRef } from 'react';
import dynamic from 'next/dynamic';
import SideBar from '../ui/components/side-bar/side-bar';

const Dashboard = dynamic(() => import('../ui/components/dashboard/dashboard'), { ssr: false });

export default function ChatIndexPage() {
  const sideRef = useRef(null);

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        background:
          'radial-gradient(circle at 90% 10%, rgba(50,160,65,0.12), transparent 30%), linear-gradient(170deg, #f4faf5 0%, #f7fbf8 45%, #edf4ef 100%)',
      }}
    >
      <SideBar ref={sideRef} currentChatId={null} />
      <main style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}>
        <Dashboard />
      </main>
    </div>
  );
}