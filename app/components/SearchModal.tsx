'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { components } from '../data/components';
import { useLanguage } from '../hooks/useLanguage';

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { t } = useLanguage();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;

    const found = components.find(
      (comp) =>
        comp.name.toLowerCase().includes(query.toLowerCase()) ||
        comp.reference.toLowerCase().includes(query.toLowerCase()) ||
        comp.id.toLowerCase().includes(query.toLowerCase())
    );

    if (found) {
      router.push(`/composants/${found.id}`);
      setQuery('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{t.search}</h2>
        <p>{t.search_placeholder}</p>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search_placeholder}
            autoFocus
          />
          <button type="submit" className="button-primary">
            {t.search_button}
          </button>
        </form>
        <button className="modal-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
}
