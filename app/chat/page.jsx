"use client";
import React, { useRef } from 'react';
import SideBar from '../ui/components/side-bar/side-bar';

export default function ChatIndexPage() {
  const sideRef = useRef(null);

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#ffffff' }}>
      <SideBar ref={sideRef} currentChatId={null} />
      <main style={{ 
        flex: 1, 
        backgroundColor: '#ffffff', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <img src="/images/IFSP-LOGO.png" alt="IFSP Logo" style={{ width: '250px'}} />
      </main>
    </div>
  );
}