// LogoBlock.tsx
import { motion } from "motion/react";
import { useSidebar } from "../components/ui/sidebar";
import logo from "../img/logo/b2c0709b7e3fd5b4d48dcdfecac9a5e1-removebg-preview.png";

export function LogoBlock() {
  const { open } = useSidebar();
  return (
    <div className="flex items-center h-9 w-full">
      <img
        src={logo}
        alt="PetSalud"
        className="h-7 w-7 shrink-0 object-contain object-left"
      />
      <motion.span
        // no cambiamos el DOM, solo su visibilidad/espacio
        initial={false}
        animate={{
          opacity: open ? 1 : 0,
          marginLeft: open ? 8 : 0,   // 8px ~ ml-2
        }}
        transition={{ duration: 0.18 }}
        className="overflow-hidden whitespace-pre text-white"
      >
        PetSalud
      </motion.span>
    </div>
  );
}
