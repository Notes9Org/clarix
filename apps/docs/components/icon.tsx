'use client';

import { icons } from 'lucide-react';

export function Icon({
  name,
  size = 16,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const LucideIcon = icons[name as keyof typeof icons];

  if (!LucideIcon) return null;

  return (
    <LucideIcon
      size={size}
      className={`inline-block align-text-bottom ${className ?? ''}`}
    />
  );
}
