// src/components/Layout.tsx
import React from "react"
import { Outlet } from "react-router-dom"
import { SidebarDemo } from "../components/SidebarDemo"

interface LayoutProps {
  children?: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-white ">
      {/* Sidebar siempre visible */}
      <aside className="bg-white "><SidebarDemo /></aside>

      {/* Contenido dinámico */}
      <main className="flex-1 overflow-auto">
        {children ?? <Outlet />}
      </main>
    </div>
  )
}
