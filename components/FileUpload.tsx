'use client';

import { useRef, useState } from 'react';

interface Props {
  uploadedFiles: File[];
  onFilesChange: (files: File[]) => void;
}

const ACCEPT = '.pdf,.csv,.png,.jpg,.jpeg';

function fileBadge(file: File): string {
  if (file.type === 'application/pdf') return 'PDF';
  if (file.type === 'text/csv' || file.name.endsWith('.csv')) return 'CSV';
  return 'Image';
}

export default function FileUpload({ uploadedFiles, onFilesChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function appendFiles(incoming: FileList | null) {
    if (!incoming || incoming.length === 0) return;
    onFilesChange([...uploadedFiles, ...Array.from(incoming)]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    appendFiles(e.dataTransfer.files);
  }

  return (
    <section className="flex flex-col gap-3">
      <h2
        className="text-lg font-semibold"
        style={{ color: 'var(--theme-text)' }}
      >
        Upload Documents
      </h2>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className="border-2 border-dashed p-8 text-center transition-colors"
        style={{
          borderColor: dragging ? 'var(--theme-text)' : 'var(--theme-border)',
          background: dragging ? 'var(--theme-background-input)' : 'var(--theme-background)',
        }}
      >
        <p
          className="text-sm mb-3"
          style={{ color: 'var(--theme-text)', opacity: 0.55 }}
        >
          Drag &amp; drop PDF, CSV, or image files here
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="px-4 py-2 text-sm font-medium"
          style={{ background: 'var(--theme-button)', color: 'var(--theme-button-text)' }}
        >
          Browse files
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple
          className="hidden"
          onChange={(e) => appendFiles(e.target.files)}
        />
      </div>

      {uploadedFiles.length > 0 && (
        <ul className="flex flex-col gap-2">
          {uploadedFiles.map((file, i) => {
            const badge = fileBadge(file);
            return (
              <li
                key={i}
                className="flex items-center gap-3 px-4 py-3"
                style={{
                  background: 'var(--theme-background-input)',
                  border: '1px solid var(--theme-border)',
                }}
              >
                <span
                  className="text-xs font-semibold px-2 py-0.5"
                  style={{
                    border: '1px solid var(--theme-border)',
                    color: 'var(--theme-text)',
                  }}
                >
                  [{badge}]
                </span>
                <span
                  className="flex-1 text-sm truncate"
                  style={{ color: 'var(--theme-text)' }}
                >
                  {file.name}
                </span>
                <span
                  className="text-xs whitespace-nowrap"
                  style={{ color: 'var(--theme-text)', opacity: 0.55 }}
                >
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
