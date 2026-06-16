'use client';
import React, { useEffect, useState, useRef } from 'react';
import styles from './chat.module.css';
import { fetchMessages, postMessage } from './chat.action';
import { SendRegular } from '@fluentui/react-icons';
import { Button, Spinner } from '@fluentui/react-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

function ChatChart({ data }) {
  const { type = 'line', title, data: chartData = [], xKey = 'time', series = [] } = data;
  const height = 220;

  const renderChart = () => {
    const common = {
      data: chartData,
      margin: { top: 5, right: 10, left: 0, bottom: 5 },
    };
    const axes = (
      <>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey={xKey} tick={{ fontSize: 11 }} interval="preserveStartEnd" />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend />
      </>
    );
    const seriesEls = series.map((s, i) => {
      const color = s.color || ['#32A041', '#1d6fa4', '#e67e22', '#9b59b6'][i % 4];
      if (type === 'bar') return <Bar key={s.key} dataKey={s.key} name={s.name} fill={color} />;
      if (type === 'area') return <Area key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={color} fill={color + '33'} strokeWidth={2} dot={false} />;
      return <Line key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={color} strokeWidth={2} dot={false} />;
    });

    if (type === 'bar') return <BarChart {...common}>{axes}{seriesEls}</BarChart>;
    if (type === 'area') return <AreaChart {...common}>{axes}{seriesEls}</AreaChart>;
    return <LineChart {...common}>{axes}{seriesEls}</LineChart>;
  };

  return (
    <div className={styles.chartBlock}>
      {title && <p className={styles.chartTitle}>{title}</p>}
      <ResponsiveContainer width="100%" height={height}>{renderChart()}</ResponsiveContainer>
    </div>
  );
}

const markdownComponents = {
  code({ children, className }) {
    const match = /language-(\w+)/.exec(className || '');
    if (match && match[1] === 'chart') {
      try {
        const parsed = JSON.parse(String(children).replace(/\n$/, ''));
        return <ChatChart data={parsed} />;
      } catch {
        return <code className={className}>{children}</code>;
      }
    }
    return <code className={className}>{children}</code>;
  },
};

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
            <div className={styles.messageContent}>
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{m.content ?? ''}</ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className={styles.composerWrapper}>
        <div className={styles.composer}>
          <textarea
            className={styles.nativeTextarea}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte sobre os dados dos sensores ou relatórios das plantações..."
            rows={2}
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