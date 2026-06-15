"use client";
import React, { useRef } from 'react';
import SideBar from '../../ui/components/side-bar/side-bar';
import dynamic from 'next/dynamic';

const ChatComponent = dynamic(() => import('../../ui/components/chat/chat.jsx'), { ssr: false });

export default function ChatPage({ params }) {
  const { chatId } = params;
  const sideRef = useRef(null);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <SideBar ref={sideRef} currentChatId={chatId} />
      <main style={{ flex: 1 }}>
        <ChatComponent chatId={chatId} />
      </main>
    </div>
  );
}
