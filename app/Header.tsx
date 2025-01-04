"use client"
import React from 'react'
import { cn } from '@/lib/utils';
import { ModeToggle } from '@/components/ui/mode-toggle';

export const Header = () => {
  return (
    <div
			className={cn(
				"h-12 w-screen max-w-7xl border rounded-full fixed top-3 left-1/2 -translate-x-1/2",
				"backdrop-blur-md z-40 flex items-center justify-between px-4"
			)}
    >
			<div className={cn("font-bold")}>Nexus/UI</div>
			<ModeToggle />
    </div>
  )
}
