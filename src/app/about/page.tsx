import Nav from "@/components/landing/NavBar";
import Reac from "react";
import About from "@/components/landing/About";



export default function Home() {
    return (
      <main className='min-h-screen w-full flex flex-col gap-10 justify-center items-center'>
       
       <Nav />
      <About />
  
   
      </main>
    )
  }
  