'use client';

import Link from 'next/link';
import { Home, AlertTriangle, MessageSquare, Shield } from 'lucide-react';

const iconMap = {
  dashboard: Home,
  alert: AlertTriangle,
  message: MessageSquare,
  shield: Shield,
} as const;

interface NavLinkProps {
  href: string;
  label: string;
  icon: keyof typeof iconMap;
  isAdmin?: boolean;
}

export default function NavLink({ href, label, icon, isAdmin = false }: NavLinkProps) {
  const IconComponent = iconMap[icon];
  const baseStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: isAdmin ? 600 : 500,
    transition: 'all 0.2s ease',
  };

  const regularStyle = {
    ...baseStyle,
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)',
  };

  const adminStyle = {
    ...baseStyle,
    background: 'white',
    color: '#0b1f3a',
    border: '1px solid rgba(255,255,255,0.4)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  };

  return (
    <Link 
      href={href}
      style={isAdmin ? adminStyle : regularStyle}
      onMouseEnter={(e) => {
        if (isAdmin) {
          e.currentTarget.style.background = '#f8fafc';
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        } else {
          e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={(e) => {
        if (isAdmin) {
          e.currentTarget.style.background = 'white';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        } else {
          e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      <IconComponent size={18} />
      {label}
    </Link>
  );
}