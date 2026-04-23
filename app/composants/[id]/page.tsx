'use client';

import Link from 'next/link';
import { components } from '../../data/components';
import { useLanguage } from '../../hooks/useLanguage';

type Props = {
  params: { id: string };
};

export default function ComponentDetailPage({ params }: Props) {
  const { t } = useLanguage();
  const item = components.find((component) => component.id === params.id);
  if (!item) {
    return (
      <main className="container">
        <div className="section-heading">
          <h2>{t.component_not_found}</h2>
          <p>{t.not_found_message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <div className="section-heading">
        <div>
          <h2>{item.name}</h2>
          <p>{item.description}</p>
        </div>
        <Link href="/composants" className="button-secondary">
          {t.back_to_list}
        </Link>
      </div>

      <section className="grid-2">
        <div className="card">
          <h3>{t.details_title}</h3>
          <p><strong>{t.reference_label} :</strong> {item.reference}</p>
          <p><strong>{t.category_label} :</strong> {item.category}</p>
          <p><strong>{t.status_label} :</strong> <span className="status-pill">{item.status}</span></p>
          <p><strong>{t.stock_label} :</strong> {item.stock}</p>
          <p><strong>{t.result_location}</strong> {item.location}</p>
          <p><strong>{t.result_supplier}</strong> {item.supplier}</p>
          <p><strong>{t.result_lead_time}</strong> {item.leadTime}</p>
        </div>

        <div className="card">
          <h3>{t.features_title}</h3>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {item.features.map((feature) => (
              <li key={feature} style={{ margin: '10px 0' }}>{feature}</li>
            ))}
          </ul>
          <div style={{ marginTop: '18px' }}>
            <h3>{t.alternatives_title}</h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
              {item.alternatives.length > 0 ? (
                item.alternatives.map((alt) => (
                  <span key={alt} className="label-chip">{alt}</span>
                ))
              ) : (
                <span>{t.none_label}</span>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}