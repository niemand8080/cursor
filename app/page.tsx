"use client"
import { useCursor } from "@/components/nexui/cursor";
import { Button } from "@/components/nexui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Trash2, Check, Ghost, Link2, Square, X } from 'lucide-react'

export default function Home() {
  const { cursorPos, resolvedVariant } = useCursor();
	return (
		<div className={cn("w-screen flex items-center flex-col gap-10 p-10")}>
      <p className={cn("fixed top-5 right-5")}>
        x: <span className={cn("text-primary font-bold")}>{cursorPos.x}</span><br />
        y: <span className={cn("text-primary font-bold")}>{cursorPos.y}</span><br />
        v: <span className={cn("text-primary font-bold")}>{resolvedVariant}</span><br />
      </p>
			<h1 className={cn("mx-auto text-9xl font-extrabold text-center mt-44 cursor-text text")}>
        Lorem{" "}
        <span 
          className={cn(
            "bg-gradient-to-r from-primary to-cyan-500 text-transparent bg-clip-text cursor-text"
          )}
        >
          ipsum
        </span>
      </h1>
      <div className={cn("inline-grid grid-cols-6 max-w-5xl gap-4 justify-center w-screen")}>
        <div className="inline-flex items-center justify-center"><Button size={"icon"} variant={"default"}><Check /></Button></div>
        <div className="inline-flex items-center justify-center"><Button size={"icon"} variant={"destructive"}><Trash2 /></Button></div>
        <div className="inline-flex items-center justify-center"><Button size={"icon"} variant={"ghost"}><Ghost /></Button></div>
        <div className="inline-flex items-center justify-center"><Button size={"icon"} variant={"link"}><Link2 /></Button></div>
        <div className="inline-flex items-center justify-center"><Button size={"icon"} variant={"outline"}><Square /></Button></div>
        <div className="inline-flex items-center justify-center"><Button size={"icon"} variant={"secondary"}><X /></Button></div>
                
        <div className="inline-flex items-center justify-center"><Button size={"sm"} variant={"default"}>Default</Button></div>
        <div className="inline-flex items-center justify-center"><Button size={"sm"} variant={"destructive"}>Destructive</Button></div>
        <div className="inline-flex items-center justify-center"><Button size={"sm"} variant={"ghost"}>Ghost</Button></div>
        <div className="inline-flex items-center justify-center"><Button size={"sm"} variant={"link"}>Link</Button></div>
        <div className="inline-flex items-center justify-center"><Button size={"sm"} variant={"outline"}>Outline</Button></div>
        <div className="inline-flex items-center justify-center"><Button size={"sm"} variant={"secondary"}>Secondary</Button></div>

        <div className="inline-flex items-center justify-center"><Button size={"lg"} variant={"default"}>Default</Button></div>
        <div className="inline-flex items-center justify-center"><Button size={"lg"} variant={"destructive"}>Destructive</Button></div>
        <div className="inline-flex items-center justify-center"><Button size={"lg"} variant={"ghost"}>Ghost</Button></div>
        <div className="inline-flex items-center justify-center"><Button size={"lg"} variant={"link"}>Link</Button></div>
        <div className="inline-flex items-center justify-center"><Button size={"lg"} variant={"outline"}>Outline</Button></div>
        <div className="inline-flex items-center justify-center"><Button size={"lg"} variant={"secondary"}>Secondary</Button></div>
        
        <div className="inline-flex items-center justify-center"><Button size={"default"} variant={"default"}>Default</Button></div>
        <div className="inline-flex items-center justify-center"><Button size={"default"} variant={"destructive"}>Destructive</Button></div>
        <div className="inline-flex items-center justify-center"><Button size={"default"} variant={"ghost"}>Ghost</Button></div>
        <div className="inline-flex items-center justify-center"><Button size={"default"} variant={"link"}>Link</Button></div>
        <div className="inline-flex items-center justify-center"><Button size={"default"} variant={"outline"}>Outline</Button></div>
        <div className="inline-flex items-center justify-center"><Button size={"default"} variant={"secondary"}>Secondary</Button></div>

        <div className="inline-flex items-center justify-center"><Button disabled variant={"default"}>Default</Button></div>
        <div className="inline-flex items-center justify-center"><Button disabled variant={"destructive"}>Destructive</Button></div>
        <div className="inline-flex items-center justify-center"><Button disabled variant={"ghost"}>Ghost</Button></div>
        <div className="inline-flex items-center justify-center"><Button disabled variant={"link"}>Link</Button></div>
        <div className="inline-flex items-center justify-center"><Button disabled variant={"outline"}>Outline</Button></div>
        <div className="inline-flex items-center justify-center"><Button disabled variant={"secondary"}>Secondary</Button></div>
      </div>
      {/* <div className={cn("inline-grid grid-cols-5 max-w-5xl gap-4 justify-center w-screen")}>
        <div className="inline-flex items-center justify-center"><Toggle size={"icon"} variant={"default"}><ToggleItem><Check /></ToggleItem><ToggleItem><X /></ToggleItem></Toggle></div>
        <div className="inline-flex items-center justify-center"><Toggle size={"icon"} variant={"destructive"}><ToggleItem><Check /></ToggleItem><ToggleItem><X /></ToggleItem></Toggle></div>
        <div className="inline-flex items-center justify-center"><Toggle size={"icon"} variant={"ghost"}><ToggleItem><Check /></ToggleItem><ToggleItem><X /></ToggleItem></Toggle></div>
        <div className="inline-flex items-center justify-center"><Toggle size={"icon"} variant={"outline"}><ToggleItem><Check /></ToggleItem><ToggleItem><X /></ToggleItem></Toggle></div>
        <div className="inline-flex items-center justify-center"><Toggle size={"icon"} variant={"secondary"}><ToggleItem><Check /></ToggleItem><ToggleItem><X /></ToggleItem></Toggle></div>
                
        <div className="inline-flex items-center justify-center"><Toggle size={"sm"} variant={"default"}>Default</Toggle></div>
        <div className="inline-flex items-center justify-center"><Toggle size={"sm"} variant={"destructive"}>Destructive</Toggle></div>
        <div className="inline-flex items-center justify-center"><Toggle size={"sm"} variant={"ghost"}>Ghost</Toggle></div>
        <div className="inline-flex items-center justify-center"><Toggle size={"sm"} variant={"outline"}>Outline</Toggle></div>
        <div className="inline-flex items-center justify-center"><Toggle size={"sm"} variant={"secondary"}>Secondary</Toggle></div>

        <div className="inline-flex items-center justify-center"><Toggle size={"lg"} variant={"default"}>Default</Toggle></div>
        <div className="inline-flex items-center justify-center"><Toggle size={"lg"} variant={"destructive"}>Destructive</Toggle></div>
        <div className="inline-flex items-center justify-center"><Toggle size={"lg"} variant={"ghost"}>Ghost</Toggle></div>
        <div className="inline-flex items-center justify-center"><Toggle size={"lg"} variant={"outline"}>Outline</Toggle></div>
        <div className="inline-flex items-center justify-center"><Toggle size={"lg"} variant={"secondary"}>Secondary</Toggle></div>
        
        <div className="inline-flex items-center justify-center"><Toggle size={"default"} variant={"default"}>Default</Toggle></div>
        <div className="inline-flex items-center justify-center"><Toggle size={"default"} variant={"destructive"}>Destructive</Toggle></div>
        <div className="inline-flex items-center justify-center"><Toggle size={"default"} variant={"ghost"}>Ghost</Toggle></div>
        <div className="inline-flex items-center justify-center"><Toggle size={"default"} variant={"outline"}>Outline</Toggle></div>
        <div className="inline-flex items-center justify-center"><Toggle size={"default"} variant={"secondary"}>Secondary</Toggle></div>

        <div className="inline-flex items-center justify-center"><Toggle disabled variant={"default"}>Default</Toggle></div>
        <div className="inline-flex items-center justify-center"><Toggle disabled variant={"destructive"}>Destructive</Toggle></div>
        <div className="inline-flex items-center justify-center"><Toggle disabled variant={"ghost"}>Ghost</Toggle></div>
        <div className="inline-flex items-center justify-center"><Toggle disabled variant={"outline"}>Outline</Toggle></div>
        <div className="inline-flex items-center justify-center"><Toggle disabled variant={"secondary"}>Secondary</Toggle></div>
      </div> */}
      <Image 
        priority
        src={"/cat.jpg"}
        className={cn("rounded-md shadow-sm")}
        width={890}
        height={1300}
        alt="cat"
      />
		</div>
	);
}
