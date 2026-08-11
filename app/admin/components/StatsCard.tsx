export default function StatsCard({
  icon, label, value, sub, color = '#6c63ff',
}: {
  icon: string; label: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: '24px 20px',
      border: '1px solid #ebebf5', boxShadow: '0 1px 4px rgba(80,70,200,.07)',
      display: 'flex', alignItems: 'center', gap: 16,
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 14, background: `${color}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 13, color: '#7c7a9a', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: '#16133a', lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: '#10b981', marginTop: 4 }}>{sub}</div>}
      </div>
    </div>
  );
}
