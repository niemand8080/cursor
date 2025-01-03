"use client"
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type SetStateAction<T> = T | ((prev: T) => T);
type SetState<T> = (value: SetStateAction<T>) => void;

export const AllCursorVariants = ['default', 'glass'] as const;
export type CursorVariantType = typeof AllCursorVariants[number];

// They will be the fallback values if no setting for the variant with the name of ___ was found
export const CursorVariantDefaults = {
  invert: 0,
  grayscale: 0,
  hueRotate: 0,
  blur: false,
  blurStrength: 0,
  glow: false,
  glowColor: 'hsl(var(--foreground))',
  glowStrength: 10,
  borderColor: 'hsl(var(--border) / 0.4)',
  activeColor: 'hsl(var(--primary))',
  color: 'hsl(var(--foreground))',
};

type SettingNamesType = keyof typeof CursorVariantDefaults;
type CursorVariantSettingValuesType = Partial<typeof CursorVariantDefaults | undefined>;
type CursorVariantSettingsType = { [key in CursorVariantType]?: CursorVariantSettingValuesType };

// if a settings fallback is not defined here the default value above `CursorVariantDefaults` will be used
export const CursorVariantSettingsFallback: CursorVariantSettingsType = {
  glass: {
    invert: 0,
    grayscale: 0,
    hueRotate: 0,
    glow: true,
    blur: true,
    blurStrength: 2,
    glowColor: 'hsl(var(--foreground))',
    glowStrength: 10,
  },
}

export type CursorPos = { x: number, y: number };
type MakeFN<T> = T | ((prev: any) => T)

export interface CursorContextProps {  
  variant: CursorVariantType;
  setVariant: SetState<CursorVariantType>;
  cursorPos: CursorPos;
  setCursorPos: SetState<CursorPos>;
  customSettings: CursorVariantSettingsType;
  changeCursorSetting: <K extends keyof typeof CursorVariantDefaults>(
    variant: CursorVariantType, 
    setting: K, 
    value: typeof CursorVariantDefaults[K] | MakeFN<typeof CursorVariantDefaults[K]>
  ) => void;
  getCursorSetting: (setting: SettingNamesType) => string | number | boolean;
}

const CursorContext = createContext<CursorContextProps | undefined>(undefined);

export const CursorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customSettings, setCustomSettings] = useState<CursorVariantSettingsType>({});
  const [variant, setVariant] = useState<CursorVariantType>("default");
  const [cursorPos, setCursorPos] = useState<CursorPos>({ x: 0, y: 0 });
  
  const changeCursorSetting = <K extends keyof typeof CursorVariantDefaults>(
    variant: CursorVariantType, 
    setting: K, 
    value: typeof CursorVariantDefaults[K] | MakeFN<typeof CursorVariantDefaults[K]>
  ) => {
    const current = getCursorSetting(setting);
    const newValue = typeof value == 'function' ? value(current) : value;
    const rightType = typeof newValue === typeof CursorVariantDefaults[setting];
    if (!rightType) throw new Error("invalid type: make sure the given value is/returns the right type. (changeCursorSetting)");
    const settings = customSettings;
    if (!settings[variant]) settings[variant] = {};
    settings[variant][setting] = newValue;
    setCustomSettings(settings);
  };

  const getCursorSetting = (setting: SettingNamesType) => {
    const variantSettings: CursorVariantSettingValuesType = customSettings[variant];
    if (variantSettings && variantSettings[setting]) return variantSettings[setting];
    const fallbackSettings: CursorVariantSettingValuesType = CursorVariantSettingsFallback[variant];
    if (!fallbackSettings || !fallbackSettings[setting]) return CursorVariantDefaults[setting];
    return fallbackSettings[setting]
  }

  return (
    <CursorContext.Provider
      value={{
        variant,
        setVariant,
        cursorPos,
        setCursorPos,
        customSettings,
        changeCursorSetting,
        getCursorSetting,
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
  const { 
    variant, 
    setCursorPos,
    getCursorSetting,
  } = useCursor();
  const cursorRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>('default');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(16);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cursor = cursorRef.current;
      if (!cursor) return;
      const { clientX, clientY } = e;
      setCursorPos({ x: clientX, y: clientY });
      // Position
      cursor.style.top = `${clientY - 12}px`
      cursor.style.left = `${clientX - 12}px`
      
      // State
      const element = document.elementFromPoint(clientX, clientY) as HTMLElement;
      if (element == null) return;
      const classList = element.classList.value.split(' ');
      const style = window.getComputedStyle(element);
      const name = element.tagName;
      const fontSize = Number(style.fontSize.replace('px', ''));
      setFontSize(fontSize);

      const button = 
        classList.includes('cursor-pointer') || 
        name == "BUTTON" || 
        element.parentElement?.tagName == 'BUTTON' || 
        element.parentElement?.tagName == "svg" && element.parentElement?.parentElement?.tagName == "BUTTON";
      const text = classList.includes('cursor-text') || name == "SPAN" || name == "P";
      
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
  }, [isActive, setCursorPos]);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className={cn(
        "size-5 rounded-full fixed pointer-events-none border",
        isActive && "size-4 mt-0.5 ml-0.5",
        state == 'text' && `w-1 h-8 mx-[0.7rem] -translate-y-[40%] border-0`,
        state == 'pointer' && "size-7 -mt-1 -ml-1",
        state == 'pointer' && isActive && "size-6 -mt-0.5 -ml-0.5",
        getCursorSetting('invert') && "bg-foreground/0",
      )}
      style={{
        height: `${state == 'text' ? (isActive ? fontSize - ((fontSize / 100) * 10) : fontSize) + "px" : ''}`,
        transition: 'all 0.15s, top 0s, left 0s', 
        top: "-100px",
        left: "-100px",
        background: getCursorSetting('invert') || variant == 'glass' ? '' : `${state == 'pointer' || state == 'text' ? getCursorSetting('activeColor') : getCursorSetting('color')}`,
        borderColor: `${getCursorSetting('borderColor')}`,
        boxShadow: getCursorSetting('glow') ? `0 0 ${getCursorSetting('glowStrength')}px ${getCursorSetting('glowColor')}` : '',
        backdropFilter: `
          hue-rotate(${getCursorSetting('hueRotate')}deg) 
          blur(${getCursorSetting('glow') ? getCursorSetting('blurStrength') : '0'}px) 
          grayscale(${getCursorSetting('grayscale')}%) 
          invert(${getCursorSetting('invert')}%)`.trim().replaceAll('  ', '').replaceAll('\n', ' ')
      }}
    ></div>
  )
}