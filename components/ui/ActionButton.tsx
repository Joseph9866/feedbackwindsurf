'use client';

import Link from 'next/link';
import { AlertTriangle, MessageSquare } from 'lucide-react';

const iconMap = {
  alert: AlertTriangle,
  message: MessageSquare,
} as const;

interface ActionButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  icon?: keyof typeof iconMap;
}

export default function ActionButton({ href, children, variant = 'primary', icon }: ActionButtonProps) {
  const Icon = icon ? iconMap[icon] : null;
  const isPrimary = variant === 'primary';
  
  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '16px 24px',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '16px',
    transition: 'all 0.2s ease',
  };

  const primaryStyle = {
    ...baseStyle,
    background: 'linear-gradient(135deg, #1a73e8, #0b1f3a)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(26, 115, 232, 0.3)',
  };

  const secondaryStyle = {
    ...baseStyle,
    background: 'white',
    color: '#0b1f3a',
    border: '2px solid #e2e8f0',
  };

  return (
    <Link 
      href={href}
      style={isPrimary ? primaryStyle : secondaryStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        if (isPrimary) {
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(26, 115, 232, 0.4)';
        } else {
          e.currentTarget.style.borderColor = '#1a73e8';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.1)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        if (isPrimary) {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(26, 115, 232, 0.3)';
        } else {
          e.currentTarget.style.borderColor = '#e2e8f0';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      {Icon && <Icon size={20} />}
      {children}
    </Link>
  );
}