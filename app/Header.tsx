"use client"
import React from 'react'
import { cn } from '@/lib/utils';
import { ModeToggle } from '@/components/nexui/mode-toggle';
import { CursorToggle } from '@/components/nexui/cursor';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { LayoutTemplate } from 'lucide-react';
import { IoLogoGithub } from "react-icons/io5";

export const Header = () => {
  return (
    <div
			className={cn(
				"h-12 w-screen max-w-7xl border rounded-full fixed top-3 left-1/2 -translate-x-1/2",
				"backdrop-blur-md z-40 flex items-center justify-between py-2 pl-4 pr-3"
			)}
    >
      <Link href='/' className={cn("inline-flex gap-2 items-center font-bold")}>
        <LayoutTemplate className={cn("text-primary")} size={16} />
        Cursor
      </Link>
			<div className={cn("inline-flex h-full gap-1")}>
        <Link className={cn("items-center inline-flex p-2")} target='_blank' href={"https://github.com/niemand8080/cursor"}>
          <IoLogoGithub size={20} />
        </Link>
        <Separator orientation="vertical" />
        <CursorToggle />
        <Separator orientation="vertical" />
        <ModeToggle />
      </div>
    </div>
  )
}
