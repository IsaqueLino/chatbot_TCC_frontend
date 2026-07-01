"use client";
import React, { useRef } from 'react';
import SideBar from '../../ui/components/side-bar/side-bar';
import dynamic from 'next/dynamic';

const ChatComponent = dynamic(() => import('../../ui/components/chat/chat.jsx'), { ssr: false });

export default function ChatPage({ params }) {
  const { chatId } = params;
  const sideRef = useRef(null);

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        background:
          'radial-gradient(circle at 8% 0%, rgba(50,160,65,0.09), transparent 28%), linear-gradient(180deg, #f7fbf8 0%, #ffffff 42%, #ffffff 100%)',
      }}
    >
      <SideBar ref={sideRef} currentChatId={chatId} />
      <main style={{ flex: 1, minWidth: 0 }}>
        <ChatComponent chatId={chatId} />
      </main>
    </div>
  );
}
