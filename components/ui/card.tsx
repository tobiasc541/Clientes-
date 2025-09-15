import React from 'react'
export function Card({ className = '', children }: { className?: string; children?: React.ReactNode }) {
  return <div className={`rounded-2xl border shadow-sm bg-white/70 dark:bg-slate-950/30 backdrop-blur ${className}`}>{children}</div>
}
export function CardHeader({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return <div className={`p-4 border-b ${className}`}>{children}</div>
}
export function CardContent({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return <div className={`p-4 ${className}`}>{children}</div>
}
