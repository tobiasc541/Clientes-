import React from 'react'
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`h-10 w-full rounded-xl border px-3 outline-none focus:ring-2 focus:ring-emerald-500/50 bg-white/70 dark:bg-slate-900/40 ${props.className||''}`} />
}
