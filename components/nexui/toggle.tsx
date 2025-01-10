"use client"

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const toggleVariants = cva(
  "px-2 py-1 w-auto inline-flex items-center justify-center rounded-md bg-primary text-foreground hover:bg-primary/80 transition-all disabled:bg-foreground/10 disabled:text-foreground/40",
  {
    variants: {
      variant: {
        default:
          "text-primary-foreground",
        destructive:
          "cursor-destructive text-destructive-foreground bg-destructive hover:bg-destructive/80 disabled:bg-destructive/10 disabled:text-destructive/80 dark:disabled:text-destructive",
        outline:
          "bg-background hover:bg-foreground/20 border disabled:bg-foreground/0",
        secondary:
          "bg-secondary hover:bg-secondary/80 text-secondary-foreground border",
        ghost: 
          "bg-transparent hover:bg-foreground/20 disabled:bg-foreground/0",
      },
      size: {
        auto: "",
        default: "h-9",
        sm: "h-7 text-sm px-1 rounded-sm",
        lg: "h-10 text-lg",
        icon: "h-9 w-9",
      },
      activeLink: {
        true: "text-primary",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      activeLink: false,
    },
  }
)

interface ToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, 
    VariantProps<typeof toggleVariants>{
  onClick?: (e: React.MouseEvent) => void;
}

interface ToggleItemProps {
  children: React.ReactNode;
  defaultOption?: boolean;
}

interface ToggleContextProps {
  currentIndex: number;
} 

export const ToggleContext = React.createContext<ToggleContextProps | undefined>(undefined);

// eslint-disable-next-line react/display-name
export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({className, variant, size, onClick, children, ...props}, ref) => {
    const [index, setIndex] = React.useState<number>(0);

    React.useEffect(() => {
      const childrenArr = React.Children.toArray(children);
      const defaultIndex = childrenArr.findIndex(child => {
        if (React.isValidElement(child)) {
          return child.props.defaultOption;
        }
        return false
      })

      if (defaultIndex !== -1) {
        setIndex(defaultIndex);
      }
    }, [children]);

    const toggle = React.useCallback((e: React.MouseEvent) => {
      if (onClick) onClick(e);
      const childrenCount = React.Children.count(children);
      console.log(childrenCount, index, children);
      if (childrenCount > 0) setIndex(prev => (prev >= childrenCount - 1 ? 0 : prev + 1));
    }, [children, onClick, index]);

    return (
      <button
        ref={ref}
        onClick={toggle}
        className={cn(toggleVariants({ variant, size, className }))}
        {...props} 
      >
        <ToggleContext.Provider value={{ currentIndex: index }}>
          {children}
        </ToggleContext.Provider>
      </button>
    )
  }
)

// eslint-disable-next-line react/display-name
export const ToggleItem = React.forwardRef<HTMLDivElement, ToggleItemProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({defaultOption = false, children, ...props}, ref) => {
    const context = React.useContext(ToggleContext);
    if (!context) throw new Error('The Toggle Item can only be used inside an Toggle Element');
    const { currentIndex } = context;
    const itemRef = React.useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = React.useState<boolean>(false);

    React.useEffect(() => {
      if (itemRef.current) setIsMounted(true);
    }, [])

    React.useEffect(() => {
      if (!ref) return;

      if (typeof ref === 'function') {
        ref(itemRef.current);
      } else {
        ref.current = itemRef.current
      }
    }, [ref])

    const position = React.useMemo(() => {
      if (!ref) return -1;
      console.log(ref.current);
      const parent = ref.current?.parentElement;
      if (!parent) return -1;
      return Array.from(parent.children).indexOf(ref.current);
    }, [ref])

    if (position !== currentIndex) return null;

    return (
      <div ref={itemRef} {...props}>
        {children}
      </div>
    )
  }
)