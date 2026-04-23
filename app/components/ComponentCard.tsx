import { ComponentItem } from '../data/components';
import Link from 'next/link';
import { useLanguage } from '../hooks/useLanguage';

export function ComponentCard({ item }: { item: ComponentItem }) {
  const { t } = useLanguage();

  return (
    <div className="card">
      <h3>{item.name}</h3>
      <p className="hero-subtitle">{item.description}</p>
      <div className="label-chip">{t.result_ref} {item.reference}</div>
      <div className="summary-row" style={{ marginTop: '18px' }}>
        <div className="summary-box">
          <strong>{item.status}</strong>
          <span>{t.available_label}</span>
        </div>
        <div className="summary-box">
          <strong>{item.stock}</strong>
          <span>{t.stock_label}</span>
        </div>
      </div>
      <div className="footer-card" style={{ marginTop: '18px' }}>
        <div>
          <strong>{t.alternatives_title}</strong>
          <p>{item.alternatives.join(', ') || t.none_label}</p>
        </div>
        <div>
          <strong>{t.result_location}</strong>
          <p>{item.location}</p>
        </div>
      </div>
      <Link href={`/composants/${item.id}`} className="button-secondary" style={{ marginTop: '16px', display: 'inline-flex' }}>
        {t.view_component}
      </Link>
    </div>
  );
}
