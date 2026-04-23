'use client';

import { useEffect, useState } from 'react';
import type { Contact } from '../../lib/db';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/contacts').then(r => r.json()).then(d => { setContacts(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <main className="container">
      <div className="section-heading">
        <div>
          <h2>Contacts PC&L</h2>
          <p>Responsables logistique et expédition par projet</p>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Chargement...</div>
      ) : (
        <div className="contacts-grid">
          {contacts.map(c => (
            <div key={c.id} className="contact-card">
              <div className="contact-project">{c.project}</div>
              <div className="contact-rows">
                <div className="contact-row">
                  <span className="contact-label">Contact PC&L</span>
                  <span className="contact-value">{c.contact_pcl || '—'}</span>
                </div>
                <div className="contact-row">
                  <span className="contact-label">Ship Mode</span>
                  <span className={`ship-badge ship-${c.ship_mode?.toLowerCase()}`}>{c.ship_mode || '—'}</span>
                </div>
                <div className="contact-row">
                  <span className="contact-label">Plant Responsability</span>
                  <span className="contact-value">{c.plant_responsibility || '—'}</span>
                </div>
                <div className="contact-row">
                  <span className="contact-label">Sold to / Ship to</span>
                  <span className="contact-value">{c.sold_to} / {c.ship_to}</span>
                </div>
                <div className="contact-row">
                  <span className="contact-label">Destination</span>
                  <span className="contact-value" style={{ color: '#f5c86b' }}>{c.destination || '—'}</span>
                </div>
                {c.dhl_account && (
                  <div className="contact-row">
                    <span className="contact-label">DHL Account</span>
                    <span className="contact-value mono-sm">{c.dhl_account}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
