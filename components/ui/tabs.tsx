'use client'
import React, { createContext, useContext, useState } from 'react'
type TabsCtx = { value: string, setValue: (v:string)=>void }
const Ctx = createContext<TabsCtx | null>(null)
export function Tabs({ defaultValue, value, onValueChange, children }:{ defaultValue:string, value?:string, onValueChange?:(v:string)=>void, children:React.ReactNode }) {
  const [internal, setInternal] = useState(defaultValue)
  const v = value ?? internal
  const setVal = (nv:string) => { onValueChange ? onValueChange(nv) : setInternal(nv) }
  return <Ctx.Provider value={{ value: v, setValue: setVal }}><div>{children}</div></Ctx.Provider>
}
export function TabsList({ children, className='' }:{ children:React.ReactNode, className?:string }) {
  return <div className={`inline-flex items-center gap-2 rounded-xl border p-1 ${className}`}>{children}</div>
}
export function TabsTrigger({ value, children }:{ value:string, children:React.ReactNode }) {
  const ctx = useContext(Ctx)!
  const active = ctx.value === value
  return <button onClick={()=>ctx.setValue(value)} className={`h-9 px-4 rounded-lg text-sm ${active ? 'bg-emerald-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}>{children}</button>
}
export function TabsContent({ value, children }:{ value:string, children:React.ReactNode }) {
  const ctx = useContext(Ctx)!
  if (ctx.value !== value) return null
  return <div className='mt-4'>{children}</div>
}
