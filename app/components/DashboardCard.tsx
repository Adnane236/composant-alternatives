type DashboardCardProps = {
  title: string;
  children: React.ReactNode;
  highlight?: string;
};

export function DashboardCard({ title, children, highlight }: DashboardCardProps) {
  return (
    <section className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start' }}>
        <div>
          <h2>{title}</h2>
          {highlight ? <p className="highlight">{highlight}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}
