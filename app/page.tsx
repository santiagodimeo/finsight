'use client';

import { useEffect, useState } from 'react';
import Dashboard from '@/components/Dashboard';
import FileUpload from '@/components/FileUpload';
import Chat, { type Message } from '@/components/Chat';

const PHRASES = [
  'Your money, clarified.',
  'Every dollar tells a story.',
  'Make sense of your financial past.',
  'Upload. Ask. Understand.',
  'Clarity begins with a single document.',
];

export default function Home() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const [subtitle, setSubtitle] = useState('');

  useEffect(() => {
    setSubtitle(PHRASES[Math.floor(Math.random() * PHRASES.length)]);
  }, []);

  async function handleSend(text: string) {
    setMessages((prev) => [...prev, { role: 'user', text }, { role: 'assistant', text: 'Thinking…' }]);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text }),
      });
      const data = await res.json();
      const answer = res.ok ? data.answer : `Error: ${data.detail ?? 'Something went wrong'}`;
      setMessages((prev) => [...prev.slice(0, -1), { role: 'assistant', text: answer }]);
    } catch {
      setMessages((prev) => [...prev.slice(0, -1), { role: 'assistant', text: 'Failed to reach the server. Is the backend running?' }]);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1
          className="text-2xl font-bold"
          style={{ color: 'var(--theme-text)' }}
        >
          Hello, good day.
        </h1>
        <p
          className="text-sm"
          style={{ color: 'var(--theme-text)', opacity: 0.55 }}
        >
          {subtitle}
        </p>
      </header>
      <Chat messages={messages} onSend={handleSend} />
      <Dashboard documentCount={uploadedFiles.length} />
      <FileUpload uploadedFiles={uploadedFiles} onFilesChange={setUploadedFiles} />
    </main>
  );
}
