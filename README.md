# Portal de Clientes – MVP

MVP listo para desplegar en **Vercel**. Incluye:
- Ingreso por **número de cliente** (sin contraseña)
- Vista Cliente: **gasto del mes** + **beneficios por umbral**
- **Panel Admin** con PIN (2626) para editar clientes y beneficios
- Persistencia **localStorage** (solo demo). Para producción: usar DB + API.

## Requisitos
- Node.js 18+ (o 20 LTS)
- NPM 9+

## Correr local
```bash
npm install
npm run dev
```
Abrí http://localhost:3000

## Deploy a Vercel (rápido)
```bash
npm install -g vercel
vercel
vercel --prod
```
o importá el repo en https://vercel.com/new

## Nota importante (estado compartido)
Este MVP guarda los datos en **localStorage** del navegador. Eso sirve para probar,
pero **no comparte cambios** con otros usuarios. Para producción conectá una
base de datos (Vercel KV / Postgres / Supabase) y reemplazá las lecturas/escrituras
por llamadas a API en `/app/api/*`.
