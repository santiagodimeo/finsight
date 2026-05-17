'use client';

import { useState } from 'react';

export interface Message {
  role: 'user' | 'assistant';
  text: string;
}

interface Props {
  messages: Message[];
  onSend: (text: string) => void;
}

export default function Chat({ messages, onSend }: Props) {
  const [input, setInput] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput('');
  }

  return (
    <section className="flex flex-col gap-3">
      <h2
        className="text-lg font-semibold"
        style={{ color: 'var(--theme-text)' }}
      >
        Chat
      </h2>
      <div
        className="flex flex-col h-80 overflow-hidden"
        style={{ border: '1px solid var(--theme-border)', background: 'var(--theme-background)' }}
      >
        <div
          className="flex-1 overflow-y-auto flex flex-col gap-3"
          style={{ padding: '1rem' }}
        >
          {messages.length === 0 && (
            <div
              className="text-sm text-center mt-8"
              style={{ color: 'var(--theme-text)', opacity: 0.45 }}
            >
              Ask a question about your uploaded documents.
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <span
                className="text-sm break-words"
                style={{
                  display: 'inline-block',
                  boxSizing: 'border-box',
                  maxWidth: '80%',
                  paddingTop: '0.5rem',
                  paddingBottom: '0.5rem',
                  paddingLeft: '1rem',
                  paddingRight: '1rem',
                  ...(msg.role === 'user'
                    ? { background: 'var(--theme-button)', color: 'var(--theme-button-text)' }
                    : { background: 'var(--theme-background-input)', color: 'var(--theme-text)' }),
                }}
              >
                {msg.text}
              </span>
            </div>
          ))}
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-3 flex gap-2"
          style={{ borderTop: '1px solid var(--theme-border)' }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message…"
            className="flex-1 px-3 py-2 text-sm focus:outline-none"
            style={{
              background: 'var(--theme-background-input)',
              color: 'var(--theme-text)',
              border: '1px solid var(--theme-border)',
            }}
          />
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium disabled:opacity-40"
            disabled={!input.trim()}
            style={{ background: 'var(--theme-button)', color: 'var(--theme-button-text)' }}
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
}
