// src/components/Layout.tsx
import React from "react"
import { Outlet } from "react-router-dom"
import { SidebarDemo } from "../components/SidebarDemo"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-[#101010] ">
      {/* Sidebar siempre visible */}
      <aside className="bg-[#101010]  "><SidebarDemo /></aside>

      {/* Contenido dinámico */}
      <main className="flex-1 overflow-auto p-6 bg-[#090909] rounded-4xl mt-2 border border-[#1f1f1f]">
        {children ?? <Outlet />}
      </main>
    </div>
  )
}
