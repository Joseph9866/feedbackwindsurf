type Props = {
  label: string;
  value: string | number;
  helper?: string;
  accent?: string;
};

export default function SummaryCard({ label, value, helper, accent = '#41e0ff' }: Props) {
  return (
    <div className="card" style={{ borderTop: `4px solid ${accent}`, boxShadow: 'var(--shadow-soft)' }}>
      <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.7rem', color: 'var(--windsurf-muted)' }}>{label}</p>
      <h3 style={{ fontSize: '2rem', margin: '8px 0' }}>{value}</h3>
      {helper && <p style={{ margin: 0, color: 'var(--windsurf-muted)', fontSize: '0.9rem' }}>{helper}</p>}
    </div>
  );
}
