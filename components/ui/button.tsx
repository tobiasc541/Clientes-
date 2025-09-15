import React from 'react'
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default'|'outline'|'secondary'|'destructive'|'ghost', size?: 'sm'|'md'|'lg' }
export function Button({ className = '', variant = 'default', size = 'md', ...props }: Props) {
  const base = 'inline-flex items-center justify-center rounded-xl font-medium transition active:scale-[.98] disabled:opacity-60 disabled:cursor-not-allowed'
  const sizes: Record<string,string> = { sm: 'h-8 px-3 text-sm', md: 'h-10 px-4', lg: 'h-12 px-6 text-lg' }
  const variants: Record<string,string> = {
    default: 'bg-emerald-600 text-white hover:bg-emerald-700',
    outline: 'border bg-transparent hover:bg-slate-50/60 dark:hover:bg-slate-800/30',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-50',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'bg-transparent hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
  }
  return <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props} />
}
