"use client"
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type CursorVariant = "default" | "glass";

interface CursorContextProps {
  color: string;
  setColor: (value: string) => void;
  activeColor: string;
  setActiveColor: (value: string) => void;
  variant: CursorVariant;
  setVariant: (value: CursorVariant) => void;
  invert: boolean;
  setInvert: (value: boolean) => void;
}

const CursorContext = createContext<CursorContextProps | undefined>(undefined);

export const CursorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [color, setColor] = useState<string>('hsl(var(--foreground))');
  const [activeColor, setActiveColor] = useState<string>('hsl(var(--primary))');
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [invert, setInvert] = useState<boolean>(true);

  return (
    <CursorContext.Provider
      value={{
        color,
        setColor,

        activeColor,
        setActiveColor,

        variant,
        setVariant,

        invert,
        setInvert,
      }}
    >
      {children}
      <Cursor />
    </CursorContext.Provider>
  )
}

export const useCursor = () => {
  const context = useContext(CursorContext);
  if (!context) throw new Error("The useCursor function can only be used inside an CurserProvider");
  return context
}

type CursorState = 'default' | 'text' | 'pointer';

export const Cursor = () => {
  const { variant, invert, color, activeColor } = useCursor();
  const cursorRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>('default');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<string>("16px");

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cursor = cursorRef.current;
      if (!cursor) return;
      const { clientX, clientY } = e;
      // Position
      cursor.style.top = `${clientY - 12}px`
      cursor.style.left = `${clientX - 12}px`
      
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
    <>
      <div
        ref={cursorRef}
        aria-hidden="true"
        className={cn(
          "size-6 rounded-full fixed pointer-events-none backdrop-invert-0",
          isActive && "size-5",
          state == 'text' && `w-1 h-8 mx-[0.7rem] -translate-y-[40%]`,
          state == 'pointer' && "border",
          variant == 'glass' && "opacity-20 backdrop-blur-sm",
          invert && "backdrop-invert"
        )}
        style={{
          height: `${state == 'text' ? fontSize : ''}`,
          transition: 'all 0.15s, top 0s, left 0s', 
          top: "-100px",
          left: "-100px",
          background: `${state == 'pointer' || state == 'text' ? activeColor : color}`,
        }}
      ></div>
    </>
  )
}