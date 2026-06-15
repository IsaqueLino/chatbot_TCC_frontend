'use client';
import React, { useEffect, useState, useRef } from 'react';
import styles from './chat.module.css';
import { fetchMessages, postMessage } from './chat.action';
import { SendRegular } from '@fluentui/react-icons';
import { Button, Textarea, Spinner } from '@fluentui/react-components';

export default function ChatComponent({ chatId, user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;
    const load = async () => {
      try {
        const data = await fetchMessages(chatId);
        setMessages(data || []);
        scrollToBottom();
      } catch (err) {
        console.error('Failed to load messages', err);
      }
    };
    load();
  }, [chatId]);

  const scrollToBottom = () => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || !chatId) return;
    setLoading(true);
    try {
      const [userMsg, assistantMsg] = await postMessage(chatId, { role: 'user', content: input });
      setMessages(prev => [...prev, userMsg, assistantMsg]);
      setInput('');
      scrollToBottom();
    } catch (err) {
      alert('Failed to send message: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!chatId) {
    return (
      <div className={styles.emptyContainer}>
        <img src="/images/IFSP-LOGO.png" alt="IFSP Logo" className={styles.emptyLogo} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.messages}>
        {messages.map((m, idx) => (
          <div key={idx} className={`${styles.messageWrapper} ${m.role === 'assistant' ? styles.assistant : styles.user}`}>
            <div className={styles.messageContent}>{m.content}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className={styles.composerWrapper}>
        <div className={styles.composer}>
          <Textarea
            className={styles.fluentInput}
            value={input}
            onChange={(e, data) => setInput(data.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte sobre os dados dos sensores ou relatórios das plantações..."
            resize="vertical"
          />
          <Button 
            className={styles.fluentSendButton} 
            onClick={handleSend} 
            disabled={loading || !input.trim()}
            shape="circular"
            icon={loading ? <Spinner size="tiny" /> : <SendRegular className={styles.sendIcon} />}
          />
        </div>
      </div>
    </div>
  );
}