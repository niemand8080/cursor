"use client"
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { MousePointer2 } from 'lucide-react';

type SetStateAction<T> = T | ((prev: T) => T);
type SetState<T> = (value: SetStateAction<T>) => void;

const disableableElements = ["BUTTON", "FIELDSET", "INPUT", "OPTGROUP", "OPTION", "SELECT", "TEXTAREA"]; // I know
export const AllCursorVariants = ['default', 'glow', 'glass', 'ghostly', 'custom1', 'custom2', 'custom3'] as const;
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
  borderWidth: '1px',
  borderColor: 'hsl(var(--border) / 0.4)',
  activeColor: 'hsl(var(--primary))',
  color: 'hsl(var(--foreground))',
  adjustToFontSize: true,
  textCursorSize: 24,
  destructiveGlowColor: 'hsl(var(--destructive))',
  destructiveColor: 'hsl(var(--destructive))',
  disabledGlowColor: 'hsl(var(--border))',
  disabledColor: 'hsl(var(--border))',
  successColor: 'hsl(var(--success))',
};

type SettingNamesType = keyof typeof CursorVariantDefaults;
type CursorVariantSettingValuesType = Partial<typeof CursorVariantDefaults | undefined>;
type CursorVariantSettingsType = { [key in CursorVariantType]?: CursorVariantSettingValuesType };

// if a settings fallback is not defined here the default value above `CursorVariantDefaults` will be used
export const CursorVariantSettingsFallback: CursorVariantSettingsType = {
  glass: {
    invert: 100,
    hueRotate: 180,
    blur: true,
    blurStrength: 2,
  },
  glow: {
    invert: 100,
    grayscale: 100,
    glow: true,
    blur: true,
    blurStrength: 2,
    glowColor: 'hsl(var(--foreground))',
    glowStrength: 10,
    borderWidth: '0',
  },
  ghostly: {
    invert: 20,
    grayscale: 80,
    blur: true,
    blurStrength: 1.5,
    glow: true,
    glowStrength: 5,
    glowColor: 'hsl(var(--background))',
  },
}

export type CursorPosType = { x: number, y: number };
type FN<T> = T | ((prev: any) => T)

export interface CursorContextProps {
  disabled: boolean;
  setDisabled: SetState<boolean>;
  variant: CursorVariantType;
  setVariant: SetState<CursorVariantType>;
  resolvedVariant: CursorVariantType;
  setResolvedVariant: SetState<CursorVariantType>;
  overwriteVariant: CursorVariantType | undefined;
  setOverwriteVariant: SetState<CursorVariantType | undefined>;
  cursorPos: CursorPosType;
  setCursorPos: SetState<CursorPosType>;
  customSettings: CursorVariantSettingsType;
  changeCursorSetting: <K extends keyof typeof CursorVariantDefaults>(
    variant: CursorVariantType, 
    setting: K, 
    value: FN<typeof CursorVariantDefaults[K]>
  ) => void;
  getCursorSetting: (setting: SettingNamesType) => string | number | boolean;
}

const CursorContext = createContext<CursorContextProps | undefined>(undefined);

export const CursorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customSettings, setCustomSettings] = useState<CursorVariantSettingsType>({});
  const [variant, setVariant] = useState<CursorVariantType>("glow");
  const [cursorPos, setCursorPos] = useState<CursorPosType>({ x: 0, y: 0 });
  const [disabled, setDisabled] = useState<boolean>(false);
  const [overwriteVariant, setOverwriteVariant] = useState<CursorVariantType>()
  const [resolvedVariant, setResolvedVariant] = useState<CursorVariantType>("default")
  
  const changeCursorSetting = <K extends keyof typeof CursorVariantDefaults>(
    variant: CursorVariantType, 
    setting: K, 
    value: FN<typeof CursorVariantDefaults[K]>
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
    const variantSettings: CursorVariantSettingValuesType = customSettings[resolvedVariant];
    if (variantSettings && variantSettings[setting]) return variantSettings[setting];
    const fallbackSettings: CursorVariantSettingValuesType = CursorVariantSettingsFallback[resolvedVariant];
    if (!fallbackSettings || !fallbackSettings[setting]) return CursorVariantDefaults[setting];
    return fallbackSettings[setting]
  }

  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'force-cursor-style';
    if (!disabled) {
      style.textContent = `
        * {
          cursor: none !important;
        }
        *:hover {
          cursor: none !important;
        }
      `;
    }
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    }
  }, [disabled])

  useEffect(() => {
    setResolvedVariant(overwriteVariant ? overwriteVariant : variant)
  }, [variant, overwriteVariant])

  return (
    <CursorContext.Provider
      value={{
        disabled,
        setDisabled,
        variant,
        setVariant,
        resolvedVariant,
        setResolvedVariant,
        overwriteVariant,
        setOverwriteVariant,
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

export const CursorToggle = () => {
  const { disabled, setDisabled } = useCursor();
  return (
    <button className={cn("p-2 rounded-md items-center inline-flex")}>
      <MousePointer2 
        onClick={() => setDisabled(prev => !prev)}
        className={cn(
          "h-[1.2rem] w-[1.2rem] transition-all fill-current",
          disabled && "opacity-40 fill-none"
        )}
      />
      {/* <Moon className={`absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100`} /> */}
      <span className="sr-only">Toggle custom cursor</span>
    </button>
  )
}

type CursorState = 'default' | 'text' | 'pointer' | 'destructive' | 'disabled';

export const Cursor = () => {
  const {
    disabled,
    setOverwriteVariant,
    setCursorPos,
    getCursorSetting,
  } = useCursor();

  const cursorRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>('default');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(24);

  useEffect(() => {
    if (!getCursorSetting('adjustToFontSize')) {
      const defaultFontSize = getCursorSetting('textCursorSize') as number;
      setFontSize(defaultFontSize);
    }

    const hasClass = (e: HTMLElement, classNames: string | string[], hasNot?: string[]) => {
      let valid = false;
      let element: HTMLElement | null = e;
      let classList = element.classList.value.split(' ');
      let maxCount = 50;
      do {
        for (const className of (typeof classNames == 'string' ? [classNames] : classNames)) {
          valid = classList.includes(className)
          if (!valid) break;
        }
        if (element == null || element.tagName == "BODY" || valid) break;
        element = element.parentElement;
        classList = element?.classList.value.split(' ') || [];
        maxCount--;
        if (maxCount == 0) throw new Error('If you want to check more than 50 parents of en Element. Please increment the value of maxCount in the cursor.tsx file.');
      } while (maxCount >= 0);
      
      if (valid && hasNot) {
        for (const className of hasNot) {
          if (classList.includes(className)) return false;
        }
      }

      return valid;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const cursor = cursorRef.current;
      if (!cursor) return;
      const { clientX, clientY } = e;
      const { x, y } = { x: clientX - 12, y: clientY - 12 }
      setCursorPos({ x, y });
      // Position
      cursor.style.top = `${y}px`
      cursor.style.left = `${x}px`
      
      // State
      const element = document.elementFromPoint(clientX, clientY) as HTMLElement;
      if (element == null) return;
      const style = window.getComputedStyle(element);
      const name = element.tagName;
      if (getCursorSetting('adjustToFontSize')) {
        const fontSize = Number(style.fontSize.replace('px', ''));
        setFontSize(fontSize);
      }

      let disabled = !!element.ariaDisabled || hasClass(element, 'cursor-disabled');
      if (disableableElements.includes(name)) {
        if (element.disabled) {
          disabled = true;
        }
      }

      const buttonOnTagName = ["BUTTON", "A"];
      const textOnTagName = ["SPAN", "P"];

      const destructive =
        hasClass(element, 'cursor-destructive');
      const button = 
        hasClass(element, 'cursor-pointer') || 
        buttonOnTagName.includes(name) || 
        buttonOnTagName.includes(element.parentElement?.tagName || "") || 
        element.parentElement?.tagName == "svg" && buttonOnTagName.includes(element.parentElement?.parentElement?.tagName || "");
      const text = hasClass(element, 'cursor-text') || textOnTagName.includes(name);

      let newVariant: CursorVariantType | undefined = undefined;
      for (const variant of AllCursorVariants) {
        const variantClass = `cursor-variant-${variant}`;
        if (hasClass(element, variantClass)) {
          newVariant = variant;
          break;
        }
      }
      if (newVariant) setOverwriteVariant(newVariant);
      else setOverwriteVariant(undefined);
      
      
      if (disabled) setState('disabled');
      else if (destructive) setState('destructive');
      else if (button) setState('pointer');
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
  }, [isActive, setCursorPos, getCursorSetting, setOverwriteVariant]);

  if (disabled) return null;

  return (
    <>
      <div
        ref={cursorRef}
        aria-hidden="true"
        className={cn(
          "size-5 rounded-full fixed pointer-events-none cursor font-extrabold z-50",
          isActive && state != 'text' && "size-4 mt-0.5 ml-0.5",
          state == 'text' && `w-1 h-8 mx-[0.7rem] -translate-y-[40%]`,
          state == 'pointer' && "size-7 -mt-1 -ml-1",
          state == 'pointer' && isActive && "size-6 -mt-0.5 -ml-0.5",
        )}
        style={{
          height: 
            `${getCursorSetting('adjustToFontSize') 
              ? state == 'text' 
                ? (isActive && fontSize >= 14 
                  ? fontSize - ((fontSize / 100) * 10) 
                  : fontSize) + "px" 
                : '' 
              : getCursorSetting('textCursorSize')}`,
          transition: 'all 0.15s, top 0s, left 0s', 
          top: "-100px",
          left: "-100px",
          background: 
            state == 'disabled' 
              ? `${getCursorSetting('disabledColor')}` 
              : state == 'destructive'
                ? `${getCursorSetting('destructiveColor')}`
                : getCursorSetting('invert')
                  ? 'rgba(0,0,0,0)' 
                  : `${state == 'pointer' || state == 'text' 
                    ? getCursorSetting('activeColor') 
                    : getCursorSetting('color')}`,
          border: `${state == 'text' ? '0' : getCursorSetting('borderWidth')} ${getCursorSetting('borderColor')}`,
          boxShadow: 
            getCursorSetting('glow') 
              ? `0 0 ${getCursorSetting('glowStrength')}px 
                ${state == 'disabled' 
                  ? getCursorSetting('disabledGlowColor') 
                  : state == 'destructive'
                    ? getCursorSetting('destructiveGlowColor')
                    : getCursorSetting('glowColor')}` 
              : '',
          backdropFilter: `
            hue-rotate(${getCursorSetting('hueRotate')}deg) 
            blur(${getCursorSetting('blurStrength')}px) 
            grayscale(${getCursorSetting('grayscale')}%) 
            invert(${getCursorSetting('invert')}%)`.trim().replaceAll('  ', '').replaceAll('\n', ' ')
        }}
      >
      </div>
    </>
  )
}