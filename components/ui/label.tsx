import React from 'react'
export function Label({ children, htmlFor, className='' }: { children?: React.ReactNode; htmlFor?: string; className?: string }) {
  return <label htmlFor={htmlFor} className={`block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1 ${className}`}>{children}</label>
}
