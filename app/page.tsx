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
import { createClient } from '@supabase/supabase-js'

// 🔑 Config Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ADMIN_PIN_DEFAULT = '46892389'
const currencyARS = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 })
const monthLabelEsAR = (date = new Date()) => new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' }).format(date)
const cx = (...c: string[]) => c.filter(Boolean).join(' ')

/* ---------------- HEADER ---------------- */
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

/* ---------------- LOGIN CLIENTE ---------------- */
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

/* ---------------- VISTA CLIENTE ---------------- */
function ClientView({ client, onLogout, benefits }:{ client:any, onLogout:()=>void, benefits:any[] }) {
  const month = monthLabelEsAR()
  const gasto = client.gasto_mes || 0   // 👈 corregido aquí
  const ordered = [...benefits].sort((a,b)=>a.umbral-b.umbral)
  const next = ordered.find((b)=>gasto < b.umbral)
  const progress = useMemo(()=>{
    if (!next) return 100
    const prevThreshold = ordered.filter((b)=>b.umbral <= gasto).map(b=>b.umbral).pop() || 0
    const range = next.umbral - prevThreshold
    const within = Math.max(0, gasto - prevThreshold)
    return Math.min(100, Math.round((within / range) * 100))
  }, [gasto, ordered, next])

  return (
    <div className='max-w-5xl mx-auto'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-semibold tracking-tight'>Hola, {client.nombre}</h2>
          <p className='text-sm text-slate-500 dark:text-slate-400'>Número de cliente: <span className='font-mono'>{client.numero_cliente}</span></p>
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
                  <span>Te faltan <span className='font-medium'>{currencyARS.format(Math.max(0, next.umbral - gasto))}</span> para el próximo beneficio: <span className='font-medium'>{next.descripcion}</span></span>
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
              <li className='flex items-center justify-between'><span>Nº</span><span className='font-mono'>{client.numero_cliente}</span></li>
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
              const achieved = gasto >= b.umbral
              return (
                <div key={i} className={cx('flex items-center justify-between rounded-xl border p-3', achieved ? 'border-emerald-500/60 bg-emerald-50 dark:bg-emerald-950/20' : '')}>
                  <div className='flex items-center gap-3'>
                    <CheckCircle2 className={cx('h-5 w-5', achieved ? 'text-emerald-500' : 'text-slate-400')}/>
                    <div>
                      <div className='text-sm font-medium'>{currencyARS.format(b.umbral)}</div>
                      <div className='text-xs text-slate-500 dark:text-slate-400'>{b.descripcion}</div>
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

/* ---------------- PANEL ADMIN ---------------- */
function AdminPanel({ clients, setClients, benefits, setBenefits }:{ clients:any[], setClients:Function, benefits:any[], setBenefits:Function }) {
  const [newClient, setNewClient] = useState({ numero_cliente: '', nombre: '', gasto_mes: 0 }) // 👈 corregido aquí

  async function addClient() {
    if (!newClient.numero_cliente || !newClient.nombre) return
    const { data, error } = await supabase.from('clientes').insert([newClient]).select()
    if (!error && data) setClients([...clients, ...data])
    setNewClient({ numero_cliente: '', nombre: '', gasto_mes: 0 }) // 👈 corregido
  }

  async function updateClient(c:any) {
    const { error } = await supabase.from('clientes').update(c).eq('numero_cliente', c.numero_cliente)
    if (!error) setClients(clients.map(x => x.numero_cliente === c.numero_cliente ? c : x))
  }

  async function deleteClient(id:string) {
    const { error } = await supabase.from('clientes').delete().eq('numero_cliente', id)
    if (!error) setClients(clients.filter(x => x.numero_cliente !== id))
  }

  return (
    <div className='max-w-6xl mx-auto'>
      <h2 className='text-xl font-semibold mb-4'>Panel Admin</h2>
      <Card className='mb-6'>
        <CardHeader><h3 className='font-medium'>Clientes</h3></CardHeader>
        <CardContent>
          {clients.map(c=>(
            <div key={c.numero_cliente} className='flex items-center gap-2 mb-2'>
              <Input value={c.nombre} onChange={e=>updateClient({ ...c, nombre: e.target.value })}/>
              <Input value={c.gasto_mes} onChange={e=>updateClient({ ...c, gasto_mes: Number(e.target.value) })}/> {/* 👈 corregido */}
              <Button size='sm' variant='destructive' onClick={()=>deleteClient(c.numero_cliente)}><Trash2/></Button>
            </div>
          ))}
          <div className='mt-4 flex gap-2'>
            <Input placeholder='Nº cliente' value={newClient.numero_cliente} onChange={e=>setNewClient({...newClient, numero_cliente:e.target.value})}/>
            <Input placeholder='Nombre' value={newClient.nombre} onChange={e=>setNewClient({...newClient, nombre:e.target.value})}/>
            <Input placeholder='Gasto' value={newClient.gasto_mes} onChange={e=>setNewClient({...newClient, gasto_mes:Number(e.target.value)})}/> {/* 👈 corregido */}
            <Button onClick={addClient}><Plus/>Agregar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ---------------- APP PRINCIPAL ---------------- */
export default function PortalClientesMVP() {
  const [clients, setClients] = useState<any[]>([])
  const [benefits, setBenefits] = useState<any[]>([])
  const [session, setSession] = useState<{ mode: 'cliente'|'admin', clientNum: string|null }>({ mode: 'cliente', clientNum: null })
  const [loggedClient, setLoggedClient] = useState<any|null>(null)
  const [adminAuthed, setAdminAuthed] = useState(false)

  useEffect(() => {
    async function loadData() {
      const { data: clientes } = await supabase.from('clientes').select('*')
      if (clientes) setClients(clientes)
      const { data: beneficios } = await supabase.from('beneficios').select('*')
      if (beneficios) setBenefits(beneficios)
    }
    loadData()
  }, [])

  useEffect(() => {
    if (session.mode === 'cliente' && session.clientNum) {
      const c = clients.find(x => x.numero_cliente === session.clientNum)
      setLoggedClient(c || null)
    } else setLoggedClient(null)
  }, [session, clients])

  function handleClientLogin(num: string) {
    const c = clients.find(x => x.numero_cliente === num)
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
                <motion.div key='login'><ClientLogin onLogin={handleClientLogin} /></motion.div>
              ) : (
                <motion.div key='dash'><ClientView client={loggedClient} onLogout={logoutClient} benefits={benefits} /></motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value='admin'>
            {!adminAuthed ? (
              <div className='max-w-md mx-auto'><Input placeholder='PIN' type='password' onChange={e=>{ if(e.target.value===ADMIN_PIN_DEFAULT) setAdminAuthed(true) }}/></div>
            ) : (
              <AdminPanel clients={clients} setClients={setClients} benefits={benefits} setBenefits={setBenefits}/>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
