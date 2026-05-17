'use client';

import { useRef, useState } from 'react';

interface Props {
  uploadedFiles: File[];
  onFilesChange: (files: File[]) => void;
}

const ACCEPT = '.pdf,.csv';

type UploadState = 'uploading' | 'ok' | 'error';

function fileKey(file: File): string {
  return `${file.name}-${file.size}`;
}

function fileBadge(file: File): string {
  if (file.type === 'application/pdf') return 'PDF';
  if (file.type === 'text/csv' || file.name.endsWith('.csv')) return 'CSV';
  return 'FILE';
}

function isAllowed(file: File): boolean {
  return (
    file.type === 'application/pdf' ||
    file.type === 'text/csv' ||
    file.name.endsWith('.csv')
  );
}

export default function FileUpload({ uploadedFiles, onFilesChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<Record<string, UploadState>>({});

  async function appendFiles(incoming: FileList | null) {
    if (!incoming || incoming.length === 0) return;
    const newFiles = Array.from(incoming).filter(isAllowed);
    if (newFiles.length === 0) return;

    onFilesChange([...uploadedFiles, ...newFiles]);

    const initialStatus: Record<string, UploadState> = {};
    for (const file of newFiles) initialStatus[fileKey(file)] = 'uploading';
    setUploadStatus((prev) => ({ ...prev, ...initialStatus }));

    for (const file of newFiles) {
      const key = fileKey(file);
      const form = new FormData();
      form.append('file', file);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
          method: 'POST',
          body: form,
        });
        setUploadStatus((prev) => ({ ...prev, [key]: res.ok ? 'ok' : 'error' }));
      } catch {
        setUploadStatus((prev) => ({ ...prev, [key]: 'error' }));
      }
    }
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
          Drag &amp; drop PDF or CSV files here
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
        <div className="flex flex-col gap-2">
          {uploadedFiles.map((file, i) => {
            const badge = fileBadge(file);
            const status = uploadStatus[fileKey(file)];
            return (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3"
                style={{
                  background: 'var(--theme-background-input)',
                  border: '1px solid var(--theme-border)',
                }}
              >
                <span
                  className="text-xs font-semibold"
                  style={{
                    border: '1px solid var(--theme-border)',
                    color: 'var(--theme-text)',
                    paddingTop: '0.125rem',
                    paddingBottom: '0.125rem',
                    paddingLeft: '0.5rem',
                    paddingRight: '0.5rem',
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
                {status === 'uploading' && (
                  <span
                    className="text-xs whitespace-nowrap"
                    style={{ color: 'var(--theme-text)', opacity: 0.45 }}
                  >
                    Uploading…
                  </span>
                )}
                {status === 'ok' && (
                  <span
                    className="text-xs whitespace-nowrap"
                    style={{ color: 'var(--theme-text)', opacity: 0.45 }}
                  >
                    ✓
                  </span>
                )}
                {status === 'error' && (
                  <span
                    className="text-xs whitespace-nowrap font-medium"
                    style={{ color: 'var(--theme-text)', opacity: 0.75 }}
                  >
                    Upload failed
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
