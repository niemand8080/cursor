"use client"
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type CursorState = 'default' | 'text' | 'pointer';

export const Cursor = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>('default');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<string>("16px");

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;
      const { clientX, clientY } = e;
      // Position
      const add = 24;
      container.style.transform = container.style.transform.replace(/translate\(.*?\)/g, `translate(${clientX + add}px, ${clientY + add}px)`);
      
      // State
      const element = document.elementFromPoint(clientX, clientY) as HTMLElement;
      const classList = element.classList.value.split(' ');
      const style = window.getComputedStyle(element);
      const name = element.tagName;
      setFontSize(style.fontSize);

      let button = classList.includes('cursor-pointer') || name == "BUTTON" || element.parentElement?.tagName == 'BUTTON' || element.parentElement?.tagName == "svg" && element.parentElement?.parentElement?.tagName == "BUTTON";
      let text = classList.includes('cursor-text') || name == "SPAN" || name == "P";
      
      if (button) setState('pointer');
      else if (text) setState('text');
      else setState('default');
    }

    const handleMouseDown = () => {
      setIsActive(true);
    }
    
    const handleMouseUp = () => {
      setIsActive(false);
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    }
  }, [isActive]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "size-8 z-50 fixed -top-10 -left-10 will-change-transform pointer-events-none",
        "flex items-center justify-center"
      )}
      style={{ 
        transition: 'all 0.15s, transform 0s', 
        transform: `translate(0px, 0px) scale(1) scaleY(1)` 
      }}
    >
      <div
        ref={cursorRef}
        aria-hidden="true"
        className={cn(
          "bg-foreground size-6 rounded-full",
          isActive && "size-5 bg-primary",
          state == 'text' && `w-1 h-8 bg-primary mx-[0.7rem]`,
          state == 'text' && isActive && "",
          state == 'pointer' && "bg-primary border",
        )}
        style={{
          height: `${state == 'text' ? fontSize : ''}`,
          transition: 'all 0.15s, transform 0s', 
          transform: `translate(0px, 0px) scale(1) scaleY(1)` 
        }}
      ></div>
    </div>
  )
}