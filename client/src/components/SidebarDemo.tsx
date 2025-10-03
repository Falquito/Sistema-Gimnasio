"use client";
import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../components/ui/sidebar";
import {
  IconArrowLeft,
  IconUser,
  IconCalendar ,
  IconHeadset,
  IconHome,
 
} from "@tabler/icons-react"
import { motion } from "motion/react";
import { cn } from "../lib/utils";
import logo from "../img/logo/Logo_Muestra Sin fondo.png"
import { useNavigate } from "react-router-dom";
import { getUserRole } from "../lib/auth";



export function SidebarDemo() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // borra token
    navigate("/login"); // redirige al login
  };

  const token = localStorage.getItem("token");
  const userRole = token ? getUserRole(token) : null;

  const links = [
   {
      label: "Inicio",
      href: "/",
      icon: (
        <IconHome className="h-5 w-5 shrink-0 text-black  dark:text-black" />
      ),
      roles: ["gerente", "recepcionista","medico"],

    },
    {
      label: "Recepcionista",
      href: "/recepcionista",
      icon: (
        <IconHeadset className="h-5 w-5 shrink-0 text-black  dark:text-black" />
      ),
      roles: ["gerente", "recepcionista"],

    },
      {
      label: "Turnos",
      href: "/turnos",
      icon: (
        <IconCalendar className="h-5 w-5 shrink-0 text-neutral-700 dark:text-black" />
      ),
      roles: ["gerente", "medico","recepcionista"],
    },
     {
      label: "Pacientes",
      href: "/pacientes",
      icon: (
        <IconUser className="h-5 w-5 shrink-0 text-black dark:text-black" />
      ),
      roles: ["gerente", "medico","recepcionista"],
    },
    
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-black" />
      ),
      roles: ["gerente", "medico","recepcionista"],
      onClick: handleLogout,
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-full flex-1 flex-col overflow-hidden rounded-md bg-black md:flex-row dark:bg-gray-100",
        "h-dvh", // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-2">
          <div className="flex flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-4 flex flex-col gap-2">
              {links
                .filter((link) => !link.roles || link.roles.includes(userRole ?? ""))
                .map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Usuario",
                href: "/usuario1",
                icon: (
                  <img
                   
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="hidden" />
    </div>
  );
}
export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center gap-2 py-1 text-sm font-normal text-black"
    >
      <img
        src={logo}
        alt="PetSalud"
        className="h-7 w-7 shrink-0 object-contain object-center block"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black"
      >
      NeuroSalud
      </motion.span>
    </a>
  );
};


export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 items-center justify-center py-1 text-sm font-normal text-black w-full h-9"
    >
      <img
        src={logo}
        alt="PetSalud"
        className="h-7 w-7 shrink-0 object-contain object-center"
      />
    </a>
  );

};
