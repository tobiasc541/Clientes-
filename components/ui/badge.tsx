import React from 'react'
export function Badge({ children, variant='default' }: { children?: React.ReactNode; variant?: 'default'|'secondary' }) {
  const styles = variant==='secondary'
    ? 'bg-slate-200/70 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
    : 'bg-emerald-600 text-white'
  return <span className={`inline-flex items-center h-6 px-2 rounded-lg text-xs ${styles}`}>{children}</span>
}
