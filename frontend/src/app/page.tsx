import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
<div className="flex justify-center gap-10 items-center min-h-screen flex-col my-5 md:flex-row">
  <div className="md:w-1/2 flex items-center justify-center">
  <div className="relative w-80 h-80 md:w-96 md:h-96 bg-blend-screen rounded-full overflow-hidden border-green-600 border-2 bg-white lg:w-[28rem] lg:h-[28rem]">
      <Image src={"/hero.gif"} alt="hero image" className="object-cover translate-x-5" fill/>
  </div>
  </div>

  <div className="w-full text-center md:text-left md:w-1/2">
  <header>
    <h1 className="text-3xl font-bold text-green-500 my-4">
      My TODO
    </h1>
    <h2 className="text-xl font-bold my-3">
    Organize Your Day with My Todo
    </h2>
    <h2 className="text-xl font-bold my-3">
    Effortless Task Management for a Productive Tomorrow
    </h2>
    </header>

    <p className="my-4">
    Welcome to My Todo, where simplicity meets productivity. Stay in control of your tasks, prioritize your goals, and make every day a success. Experience the ease of managing your to-dos with our intuitive interface, designed to enhance your efficiency and bring order to your life. Start achieving more with My Todo – your reliable companion in the journey to a more organized and accomplished you
    </p>
    <Link href={"/dashboard"}><Button className="my-4 w-full font-bold">Get Started</Button></Link>
  </div>

</div>
  );
}
