'use client';
import React, { ReactNode } from 'react';

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function AdminPageHeader({
  title,
  subtitle,
  action,
}: AdminPageHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: 16,
      }}
    >
      <div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 900,
            color: 'var(--text-main)',
            marginBottom: 8,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: 14,
              margin: 0,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
