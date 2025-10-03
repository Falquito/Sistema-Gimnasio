"use client";

import { motion } from "motion/react";
import ColourfulText from "./ui/colourful-text";

export default function HeaderBienvenida({usuario}) {

  const words = ["Hola", <ColourfulText key="usuario" text={usuario.toUpperCase()} />, "|", "Bienvenido", "a", "NeuroSalud", ";)"];

  return (
    <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
      
      
      <div className="px-4 py-10 md:py-20">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-slate-700 md:text-4xl lg:text-4xl dark:text-slate-300">
          {words
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className={`mr-2 inline-block ${
                  word === "NeuroSalud" ||word === "Bienvenido" || word === "a" ||word === ";)" ? "text-emerald-500 dark:text-blue-400" : ""
                }`}
              >
                {word}
              </motion.span>
            ))}
        </h1>
        
        
      </div>
    </div>
  );
}