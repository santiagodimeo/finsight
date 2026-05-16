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

  function handleSend(text: string) {
    setMessages((prev) => [
      ...prev,
      { role: 'user', text },
      {
        role: 'assistant',
        text: 'Mock: processing your query against uploaded documents…',
      },
    ]);
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
