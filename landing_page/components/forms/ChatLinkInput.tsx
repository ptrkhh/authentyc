/**
 * Chat Link Input Component
 *
 * Specialized input for ChatGPT share links with validation.
 */

'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ChatLinkInputProps {
  onSubmit: (url: string) => void;
  loading?: boolean;
}

export function ChatLinkInput({ onSubmit, loading }: ChatLinkInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!url) {
      setError('Please enter a ChatGPT share link');
      return;
    }

    if (!url.includes('chatgpt.com/share/') && !url.includes('chat.openai.com/share/')) {
      setError('Invalid ChatGPT share link format');
      return;
    }

    onSubmit(url);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError(null);
          }}
          placeholder="https://chatgpt.com/share/..."
          disabled={loading}
          className={error ? 'border-red-500' : ''}
        />
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      </div>

      <Button type="submit" disabled={!url || loading} className="w-full">
        {loading ? 'Analyzing...' : 'Analyze My Communication Style'}
      </Button>

      <p className="text-sm text-gray-500 text-center">
        Don't have a shared link?{' '}
        <a href="#" className="text-brand-primary underline">
          Click here for instructions
        </a>
      </p>
    </form>
  );
}
