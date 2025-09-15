import React from 'react'
export function Progress({ value=0 }: { value?: number }) {
  const v = Math.max(0, Math.min(100, value))
  return <div className='h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden'><div className='h-full bg-emerald-600' style={{ width: `${v}%` }} /></div>
}
