import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Home() {
	return (
		<div className={cn("w-screen flex items-center flex-col gap-10 p-10")}>
			<h1 className={cn("mx-auto text-9xl font-extrabold text-center mt-80 cursor-text text")}>
        Lorem{" "}
        <span 
          className={cn(
            "bg-gradient-to-r from-primary to-cyan-500 text-transparent bg-clip-text cursor-text"
          )}
        >
          ipusum
        </span>
      </h1>
      <div className="">
        <p className={cn("inline")}>
          Hello{" "}
          <span className={cn("text-4xl")}>World</span>
        </p>
      </div>
      <div className={cn("flex gap-4 justify-center w-screen")}>
        <Button className={cn("")}>Click Me!</Button>
        <ModeToggle />
      </div>
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
