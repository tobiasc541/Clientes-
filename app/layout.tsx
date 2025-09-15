import './globals.css'
import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Portal de Clientes – El Shopping de los Comerciantes',
  description: 'MVP: clientes ingresan con número y ven gasto mensual + beneficios.',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang='es'><body>{children}</body></html>)
}
