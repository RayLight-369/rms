import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { OrderStatus } from '@/data/mockData';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const statusConfig = {
    Pending: {
      bg: 'bg-warning/15',
      text: 'text-warning',
      border: 'border-warning/30',
      dot: 'bg-warning',
    },
    'In Progress': {
      bg: 'bg-info/15',
      text: 'text-info',
      border: 'border-info/30',
      dot: 'bg-info',
    },
    Ready: {
      bg: 'bg-success/15',
      text: 'text-success',
      border: 'border-success/30',
      dot: 'bg-success',
    },
    Served: {
      bg: 'bg-muted',
      text: 'text-muted-foreground',
      border: 'border-border',
      dot: 'bg-muted-foreground',
    },
  };

  const config = statusConfig[status];
  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        config.bg,
        config.text,
        config.border,
        sizeStyles
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
      {status}
    </motion.span>
  );
}
