'use client'
import React, { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, LogOut, Shield, Pencil, Plus, Search, Download, Trash2, Lock } from 'lucide-react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const ADMIN_PIN_DEFAULT = '2626'

function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) as T : initialValue
    } catch {
      return initialValue
    }
  })
  useEffect(() => { try { window.localStorage.setItem(key, JSON.stringify(value)) } catch {} }, [key, value])
  return [value, setValue] as const
}

const currencyARS = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })
const monthLabelEsAR = (date = new Date()) => new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' }).format(date)
const cx = (...c: string[]) => c.filter(Boolean).join(' ')

const seedClients = [
  { numCliente: '1001', nombre: 'Verdulería San Martín', gastoMensual: 8450000 },
  { numCliente: '1002', nombre: 'Carnicería Don José', gastoMensual: 12750000 },
  { numCliente: '1003', nombre: 'Kiosco 24 Horas', gastoMensual: 21300000 },
  { numCliente: '1004', nombre: 'Panadería La Nueva', gastoMensual: 4100000 },
]
const seedBenefits = [
  { threshold: 10_000_000, benefit: '2% OFF' },
  { threshold: 20_000_000, benefit: '$200 de descuento en 40×50 al retirar' },
  { threshold: 30_000_000, benefit: 'Envío gratis' },
]

function Header() {
  return (
    <header className='w-full py-6'>
      <div className='mx-auto max-w-6xl px-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='h-9 w-9 rounded-2xl bg-emerald-500/15 flex items-center justify-center'>
              <Shield className='h-5 w-5 text-emerald-500'/>
            </div>
            <h1 className='text-xl font-semibold tracking-tight'>Portal de Clientes – El Shopping de los Comerciantes</h1>
          </div>
          <div className='text-xs text-slate-500 dark:text-slate-400'>MVP • {monthLabelEsAR()}</div>
        </div>
      </div>
    </header>
  )
}

function EmptyState({ title, subtitle, icon: Icon = Shield as any }: any) {
  return (
    <div className='text-center py-12'>
      <div className='mx-auto mb-4 h-12 w-12 rounded-2xl bg-slate-200/40 dark:bg-slate-800/60 flex items-center justify-center'>
        <Icon className='h-6 w-6 text-slate-500'/>
      </div>
      <h3 className='text-base font-medium mb-1'>{title}</h3>
      <p className='text-sm text-slate-500 dark:text-slate-400'>{subtitle}</p>
    </div>
  )
}

function ClientLogin({ onLogin }: { onLogin: (n: string)=>void }) {
  const [num, setNum] = useState('')
  const [err, setErr] = useState('')
  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!num.trim()) return setErr('Ingresá tu número de cliente')
    setErr('')
    onLogin(num.trim())
  }
  return (
    <Card className='max-w-xl mx-auto'>
      <CardHeader>
        <h2 className='text-lg font-semibold'>Ingreso de Cliente</h2>
        <p className='text-sm text-slate-500 dark:text-slate-400'>Entrás solo con tu número de cliente. Sin contraseña.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className='flex flex-col gap-4'>
          <div>
            <Label htmlFor='numCliente'>Número de cliente</Label>
            <Input id='numCliente' placeholder='Ej: 1002' value={num} onChange={(e)=>setNum(e.target.value.replace(/[^0-9]/g,''))} inputMode='numeric'/>
            {err && <p className='text-sm text-red-500 mt-1'>{err}</p>}
          </div>
          <Button type='submit' className='h-10'>Ingresar</Button>
        </form>
      </CardContent>
    </Card>
  )
}

function ClientView({ client, onLogout, benefits }:{ client:any, onLogout:()=>void, benefits:any[] }) {
  const month = monthLabelEsAR()
  const gasto = client.gastoMensual || 0
  const ordered = [...benefits].sort((a,b)=>a.threshold-b.threshold)
  const next = ordered.find((b)=>gasto < b.threshold)
  const progress = useMemo(()=>{
    if (!next) return 100
    const prevThreshold = ordered.filter((b)=>b.threshold <= gasto).map(b=>b.threshold).pop() || 0
    const range = next.threshold - prevThreshold
    const within = Math.max(0, gasto - prevThreshold)
    return Math.min(100, Math.round((within / range) * 100))
  }, [gasto, ordered, next])

  return (
    <div className='max-w-5xl mx-auto'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-semibold tracking-tight'>Hola, {client.nombre}</h2>
          <p className='text-sm text-slate-500 dark:text-slate-400'>Número de cliente: <span className='font-mono'>{client.numCliente}</span></p>
        </div>
        <Button variant='outline' onClick={onLogout} className='gap-2'><LogOut className='h-4 w-4'/>Salir</Button>
      </div>

      <div className='grid md:grid-cols-3 gap-4 mt-6'>
        <Card className='md:col-span-2'>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <h3 className='font-medium'>Gasto del mes ({month})</h3>
              <Badge variant='secondary'>Actualizado</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className='flex items-end gap-3'>
              <div className='text-3xl font-bold'>{currencyARS.format(gasto)}</div>
            </div>
            <div className='mt-4'>
              <Progress value={progress}/>
              <div className='mt-2 text-sm text-slate-500 dark:text-slate-400'>
                {next ? (
                  <span>Te faltan <span className='font-medium'>{currencyARS.format(Math.max(0, next.threshold - gasto))}</span> para el próximo beneficio: <span className='font-medium'>{next.benefit}</span></span>
                ) : (
                  <span>¡Alcanzaste todos los beneficios del mes! 🎉</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><h3 className='font-medium'>Resumen</h3></CardHeader>
          <CardContent>
            <ul className='space-y-2 text-sm'>
              <li className='flex items-center justify-between'><span>Cliente</span><span className='font-medium'>{client.nombre}</span></li>
              <li className='flex items-center justify-between'><span>Nº</span><span className='font-mono'>{client.numCliente}</span></li>
              <li className='flex items-center justify-between'><span>Mes</span><span className='font-medium'>{month}</span></li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className='mt-6'>
        <CardHeader><h3 className='font-medium'>Beneficios del mes</h3></CardHeader>
        <CardContent>
          <div className='space-y-3'>
            {ordered.map((b, i) => {
              const achieved = gasto >= b.threshold
              return (
                <div key={i} className={cx('flex items-center justify-between rounded-xl border p-3', achieved ? 'border-emerald-500/60 bg-emerald-50 dark:bg-emerald-950/20' : '')}>
                  <div className='flex items-center gap-3'>
                    <CheckCircle2 className={cx('h-5 w-5', achieved ? 'text-emerald-500' : 'text-slate-400')}/>
                    <div>
                      <div className='text-sm font-medium'>{currencyARS.format(b.threshold)}</div>
                      <div className='text-xs text-slate-500 dark:text-slate-400'>{b.benefit}</div>
                    </div>
                  </div>
                  <Badge variant={achieved ? 'default' : 'secondary'}>{achieved ? 'Cumplido' : 'Pendiente'}</Badge>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AdminPanel({ clients, setClients, benefits, setBenefits, adminPin, setAdminPin }:{ clients:any[], setClients:Function, benefits:any[], setBenefits:Function, adminPin:string, setAdminPin:Function }) {
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<Record<string, any>>({})
  const [newClient, setNewClient] = useState({ numCliente: '', nombre: '', gastoMensual: '' })

  const filtered = useMemo(()=>{
    const q = query.trim().toLowerCase()
    if (!q) return clients
    return clients.filter(c => c.nombre.toLowerCase().includes(q) || c.numCliente.includes(q))
  }, [clients, query])

  function upsertClient(updated:any) {
    setClients((prev:any[]) => {
      const idx = prev.findIndex(c => c.numCliente === updated.numCliente)
      if (idx === -1) return [...prev, updated]
      const cp = [...prev]; cp[idx] = updated; return cp
    })
  }
  function bump(numCliente:string, delta:number) {
    const c = clients.find(x => x.numCliente === numCliente); if (!c) return
    upsertClient({ ...c, gastoMensual: Math.max(0, (c.gastoMensual || 0) + delta) })
  }
  function removeClient(numCliente:string) {
    setClients((prev:any[]) => prev.filter(c => c.numCliente !== numCliente))
  }
  function addClient() {
    if (!newClient.numCliente || !newClient.nombre) return
    const exists = clients.some(c => c.numCliente === newClient.numCliente)
    if (exists) return alert('Ese número de cliente ya existe.')
    const parsed = parseInt(String(newClient.gastoMensual || 0), 10) || 0
    setClients((prev:any[]) => [...prev, { numCliente: newClient.numCliente, nombre: newClient.nombre, gastoMensual: parsed }])
    setNewClient({ numCliente: '', nombre: '', gastoMensual: '' })
  }
  function exportCSV() {
    const header = ['numCliente','nombre','gastoMensual']
    const rows = clients.map(c => [c.numCliente, c.nombre.replaceAll('\"','\"\"'), c.gastoMensual])
    const csv = [header.join(','), ...rows.map(r => r.join(','))].join('\\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `clientes_${new Date().toISOString().slice(0,10)}.csv`; a.click()
    URL.revokeObjectURL(url)
  }
  function resetDemo() {
    if (!confirm('¿Restablecer datos de demo?')) return
    setClients([
      { numCliente: '1001', nombre: 'Verdulería San Martín', gastoMensual: 8450000 },
      { numCliente: '1002', nombre: 'Carnicería Don José', gastoMensual: 12750000 },
      { numCliente: '1003', nombre: 'Kiosco 24 Horas', gastoMensual: 21300000 },
      { numCliente: '1004', nombre: 'Panadería La Nueva', gastoMensual: 4100000 },
    ])
    setBenefits([
      { threshold: 10_000_000, benefit: '2% OFF' },
      { threshold: 20_000_000, benefit: '$200 de descuento en 40×50 al retirar' },
      { threshold: 30_000_000, benefit: 'Envío gratis' },
    ])
  }
  function updateBenefit(i:number, patch:any) {
    setBenefits((prev:any[]) => {
      const cp = [...prev]; cp[i] = { ...cp[i], ...patch }
      return cp.sort((a,b)=>a.threshold-b.threshold)
    })
  }
  function addBenefit() { setBenefits((prev:any[]) => [...prev, { threshold: 0, benefit: 'Nuevo beneficio' }].sort((a,b)=>a.threshold-b.threshold)) }
  function removeBenefit(i:number) { setBenefits((prev:any[]) => prev.filter((_,idx)=>idx!==i)) }

  return (
    <div className='max-w-6xl mx-auto'>
      <div className='grid lg:grid-cols-3 gap-6'>
        <Card className='lg:col-span-2'>
          <CardHeader>
            <div className='flex items-center justify-between gap-4'>
              <div>
                <h3 className='font-semibold'>Clientes</h3>
                <p className='text-sm text-slate-500 dark:text-slate-400'>Editá montos rápido, buscá por nombre o número.</p>
              </div>
              <div className='flex items-center gap-2'>
                <Button variant='outline' onClick={exportCSV} className='gap-2'><Download className='h-4 w-4'/>Exportar CSV</Button>
                <Button variant='outline' onClick={resetDemo} className='gap-2'><Trash2 className='h-4 w-4'/>Reset demo</Button>
              </div>
            </div>
            <div className='relative mt-3'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400'/>
              <Input placeholder='Buscar cliente…' className='pl-9' value={query} onChange={(e)=>setQuery(e.target.value)} />
            </div>
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto'>
              <table className='min-w-full text-sm'>
                <thead>
                  <tr className='text-left text-slate-500 dark:text-slate-400 border-b'>
                    <th className='py-2 pr-3'>Nº</th>
                    <th className='py-2 pr-3'>Nombre</th>
                    <th className='py-2 pr-3'>Gasto mensual</th>
                    <th className='py-2 pr-3'>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c:any) => {
                    const edit = editing[c.numCliente] || { nombre: c.nombre, gastoMensual: c.gastoMensual }
                    return (
                      <tr key={c.numCliente} className='border-b last:border-0'>
                        <td className='py-2 pr-3 font-mono'>{c.numCliente}</td>
                        <td className='py-2 pr-3'>
                          <Input value={edit.nombre} onChange={(e)=>setEditing((prev)=>({ ...prev, [c.numCliente]: { ...edit, nombre: e.target.value } }))} />
                        </td>
                        <td className='py-2 pr-3'>
                          <div className='flex items-center gap-2'>
                            <Input inputMode='numeric' value={String(edit.gastoMensual)} onChange={(e)=>{
                              const v = e.target.value.replace(/[^0-9]/g,'')
                              setEditing((prev)=>({ ...prev, [c.numCliente]: { ...edit, gastoMensual: v } }))
                            }}/>
                            <div className='hidden md:block text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap'>{currencyARS.format(Number(edit.gastoMensual||0))}</div>
                          </div>
                        </td>
                        <td className='py-2 pr-3'>
                          <div className='flex flex-wrap gap-2'>
                            <Button size='sm' className='h-8 gap-1' onClick={()=>{
                              const parsed = parseInt(String(edit.gastoMensual||0), 10) || 0
                              upsertClient({ numCliente: c.numCliente, nombre: edit.nombre.trim(), gastoMensual: parsed })
                              setEditing((prev)=>{ const cp:any = { ...prev }; delete cp[c.numCliente]; return cp })
                            }}><Pencil className='h-4 w-4'/>Guardar</Button>
                            <Button size='sm' variant='secondary' className='h-8' onClick={()=>bump(c.numCliente, 100_000)}>+100k</Button>
                            <Button size='sm' variant='secondary' className='h-8' onClick={()=>bump(c.numCliente, 1_000_000)}>+1M</Button>
                            <Button size='sm' variant='secondary' className='h-8' onClick={()=>bump(c.numCliente, -100_000)}>-100k</Button>
                            <Button size='sm' variant='destructive' className='h-8' onClick={()=>removeClient(c.numCliente)}><Trash2 className='h-4 w-4'/></Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  {filtered.length === 0 && (
                    <tr><td colSpan={4}><EmptyState title='Sin resultados' subtitle='No hay clientes que coincidan con la búsqueda' /></td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className='mt-6 border-t pt-4'>
              <h4 className='font-medium mb-3'>Agregar cliente</h4>
              <div className='grid md:grid-cols-4 gap-3 items-end'>
                <div><Label>Número</Label><Input value={newClient.numCliente} inputMode='numeric' onChange={(e)=>setNewClient((p)=>({ ...p, numCliente: e.target.value.replace(/[^0-9]/g,'') }))} placeholder='Ej: 1050'/></div>
                <div className='md:col-span-2'><Label>Nombre</Label><Input value={newClient.nombre} onChange={(e)=>setNewClient((p)=>({ ...p, nombre: e.target.value }))} placeholder='Ej: Supermercado El Centro'/></div>
                <div><Label>Gasto mensual</Label><Input value={newClient.gastoMensual} inputMode='numeric' onChange={(e)=>setNewClient((p)=>({ ...p, gastoMensual: e.target.value.replace(/[^0-9]/g,'') }))} placeholder='0'/></div>
                <div className='md:col-span-4'><Button className='gap-2' onClick={addClient}><Plus className='h-4 w-4'/>Agregar</Button></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className='font-semibold'>Beneficios por consumo</h3>
            <p className='text-sm text-slate-500 dark:text-slate-400'>Definí umbrales y recompensas.</p>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {benefits.sort((a:any,b:any)=>a.threshold-b.threshold).map((b:any, i:number) => (
                <div key={i} className='grid grid-cols-5 gap-2 items-center'>
                  <div className='col-span-2'>
                    <Label>Umbral (ARS)</Label>
                    <Input inputMode='numeric' value={String(b.threshold)} onChange={(e)=>{
                      const v = parseInt(e.target.value.replace(/[^0-9]/g,''), 10) || 0
                      updateBenefit(i, { threshold: v })
                    }}/>
                  </div>
                  <div className='col-span-3'>
                    <Label>Beneficio</Label>
                    <Input value={b.benefit} onChange={(e)=>updateBenefit(i, { benefit: e.target.value })}/>
                  </div>
                  <div className='col-span-5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400'>
                    <span>Vista previa: {currencyARS.format(b.threshold)} → {b.benefit}</span>
                    <Button size='sm' variant='ghost' className='h-8 text-red-500' onClick={()=>removeBenefit(i)}><Trash2 className='h-4 w-4'/></Button>
                  </div>
                  <div className='col-span-5 h-px border'/>
                </div>
              ))}
              <Button className='w-full gap-2' variant='secondary' onClick={()=>addBenefit()}><Plus className='h-4 w-4'/>Agregar beneficio</Button>
            </div>

            <div className='mt-6 border-t pt-4'>
              <h4 className='font-medium mb-2'>Seguridad de administración</h4>
              <p className='text-xs text-slate-500 dark:text-slate-400 mb-2'>PIN actual: <span className='font-mono'>{adminPin}</span> (solo en este prototipo local)</p>
              <div className='flex items-end gap-2'>
                <div className='flex-1'>
                  <Label>Nuevo PIN</Label>
                  <Input id='pin' placeholder='••••' inputMode='numeric' onChange={(e)=>setAdminPin(e.target.value.replace(/[^0-9]/g,''))} />
                </div>
                <Button disabled className='gap-2' title='En producción debe guardarse en servidor'><Lock className='h-4 w-4'/>Guardar</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function AdminGate({ pin, onAuth }:{ pin:string, onAuth:(ok:boolean)=>void }) {
  const [input, setInput] = useState(''); const [err, setErr] = useState('')
  function submit(e: React.FormEvent) {
    e.preventDefault(); if (input === pin) onAuth(true); else setErr('PIN incorrecto')
  }
  return (
    <Card className='max-w-md mx-auto'>
      <CardHeader><h3 className='text-lg font-semibold'>Acceso CEO</h3><p className='text-sm text-slate-500 dark:text-slate-400'>Protegido con PIN (prototipo).</p></CardHeader>
      <CardContent>
        <form onSubmit={submit} className='space-y-3'>
          <div>
            <Label htmlFor='pin-admin'>PIN</Label>
            <Input id='pin-admin' value={input} inputMode='numeric' onChange={(e)=>setInput(e.target.value.replace(/[^0-9]/g,''))} placeholder='••••'/>
            {err && <p className='text-xs text-red-500 mt-1'>{err}</p>}
          </div>
          <Button type='submit' className='w-full'>Entrar</Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default function PortalClientesMVP() {
  const [clients, setClients] = useLocalStorage<any[]>('clientPortal.clients', seedClients)
  const [benefits, setBenefits] = useLocalStorage<any[]>('clientPortal.benefits', seedBenefits)
  const [session, setSession] = useState<{ mode: 'cliente'|'admin', clientNum: string|null }>({ mode: 'cliente', clientNum: null })
  const [loggedClient, setLoggedClient] = useState<any|null>(null)
  const [adminAuthed, setAdminAuthed] = useState(false)
  const [adminPin, setAdminPin] = useLocalStorage<string>('clientPortal.adminPin', ADMIN_PIN_DEFAULT)

  useEffect(() => {
    if (session.mode === 'cliente' && session.clientNum) {
      const c = clients.find(x => x.numCliente === session.clientNum)
      setLoggedClient(c || null)
    } else setLoggedClient(null)
  }, [session, clients])

  function handleClientLogin(num: string) {
    const c = clients.find(x => x.numCliente === num)
    if (!c) { alert('Número de cliente inválido'); return }
    setSession({ mode: 'cliente', clientNum: num })
  }
  function logoutClient() { setSession({ mode: 'cliente', clientNum: null }) }

  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-50'>
      <Header />
      <main className='mx-auto max-w-6xl px-4 pb-16'>
        <Tabs defaultValue='cliente' value={session.mode} onValueChange={(v:any)=>setSession({ mode: v, clientNum: v === 'cliente' ? session.clientNum : null })}>
          <TabsList className='mb-6'>
            <TabsTrigger value='cliente'>Cliente</TabsTrigger>
            <TabsTrigger value='admin'>Admin</TabsTrigger>
          </TabsList>

          <TabsContent value='cliente'>
            <AnimatePresence mode='wait'>
              {!loggedClient ? (
                <motion.div key='login' initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <ClientLogin onLogin={handleClientLogin} />
                </motion.div>
              ) : (
                <motion.div key='dash' initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <ClientView client={loggedClient} onLogout={logoutClient} benefits={benefits} />
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value='admin'>
            {!adminAuthed ? (
              <AdminGate pin={adminPin} onAuth={setAdminAuthed} />
            ) : (
              <AnimatePresence>
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <AdminPanel clients={clients} setClients={setClients} benefits={benefits} setBenefits={setBenefits} adminPin={adminPin} setAdminPin={setAdminPin} />
                </motion.div>
              </AnimatePresence>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <footer className='py-8 border-t'>
        <div className='mx-auto max-w-6xl px-4 text-xs text-slate-500 dark:text-slate-400'>Prototipo local – Para producción: login seguro, API y base de datos real.</div>
      </footer>
    </div>
  )
}
