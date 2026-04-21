'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, TrendingUp, ArrowLeftRight, LineChart, Settings, Home } from 'lucide-react'

const links = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/cartera-actual', label: 'Cartera Actual', icon: BarChart3 },
  { href: '/cartera-objetivo', label: 'Cartera Objetivo', icon: TrendingUp },
  { href: '/migracion', label: 'Migración', icon: ArrowLeftRight },
  { href: '/proyeccion', label: 'Proyección', icon: LineChart },
  { href: '/admin', label: 'Actualizar', icon: Settings },
]

export default function Nav() {
  const pathname = usePathname()
  return (
    <nav className="bg-[#0f2c4f] text-white min-h-screen w-56 flex-shrink-0 flex flex-col">
      <div className="p-5 border-b border-[#1e4a7a]">
        <h1 className="text-lg font-bold leading-tight">Fondos</h1>
        <p className="text-xs text-blue-300 mt-1">Maria Nieves · Sabadell</p>
      </div>
      <ul className="flex-1 py-3">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
                  active
                    ? 'bg-[#1e4a7a] text-white font-medium border-r-2 border-[#3b82f6]'
                    : 'text-blue-200 hover:bg-[#1a3f6f] hover:text-white'
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
      <div className="p-4 border-t border-[#1e4a7a] text-xs text-blue-400">
        <p>Migración: May–Oct 2026</p>
        <p className="mt-1">Ahorro anual: +828 €</p>
      </div>
    </nav>
  )
}
