const labels = ['', 'Low', 'Medium', 'High'];
const colors = ['', '#10B981', '#F59E0B', '#EF4444'];
const bgColors = ['', '#D1FAE5', '#FEF3C7', '#FEE2E2'];

export default function PriorityBadge({ priority }: { priority: number }) {
  if (priority === 0) return null;
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 4,
      fontSize: 12,
      color: colors[priority] || '#6B7280',
      background: bgColors[priority] || '#F3F4F6',
    }}>
      {labels[priority] || 'Unknown'}
    </span>
  );
}
