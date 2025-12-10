import clsx from 'clsx';
import { IssueStatus } from '@/lib/constants';

const STATUS_CONFIG: Record<IssueStatus, { label: string; indicator: string; tone: 'info' | 'warning' | 'success' | 'danger' }> = {
  open: { label: 'Open', indicator: '#38bdf8', tone: 'info' },
  in_progress: { label: 'In Progress', indicator: '#f97316', tone: 'warning' },
  resolved: { label: 'Resolved', indicator: '#34d399', tone: 'success' },
  blocked: { label: 'Blocked', indicator: '#f43f5e', tone: 'danger' },
};

type Props = {
  status: IssueStatus;
};

const toneClass: Record<'info' | 'warning' | 'success' | 'danger', string> = {
  info: 'info',
  warning: 'warning',
  success: 'success',
  danger: 'danger',
};

export default function StatusBadge({ status }: Props) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={clsx('badge', toneClass[config.tone])}>
      <span className="status-indicator" style={{ background: config.indicator }} />
      {config.label}
    </span>
  );
}
