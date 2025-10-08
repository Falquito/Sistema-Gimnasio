import SignupFormDemo, { BottomGradient, LabelInputContainer } from "@/components/signup-form-demo";
import LampDemo from "@/components/ui/lamp"
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { WavyBackground } from "@/components/ui/wavy-background"
import { motion } from "motion/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";
import { WobbleCard } from "@/components/ui/wobble-card";
import { FollowerPointerCard } from "@/components/ui/following-pointer";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/stateful-button";
import { FullScreenLoader, LoaderFour } from "@/components/ui/loader";

export const NewLogin = ()=>{
    const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [error, setError] = useState("");
      const navigate = useNavigate();
      const [loading,setLoading] = useState(false)


    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
        const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
        throw new Error("Credenciales inválidas");
        }

        const data = await response.json();
        localStorage.setItem("token", data.token);
        navigate("/");
    } catch (err: any) {
        setError(err.message);

        // ⚠️ Aquí hacemos desaparecer el alert después de 3s
        setTimeout(() => {
        setError("");
        }, 2000);
    } finally {
        setLoading(false);
    }
    };
    return(
        <>
        
        
        <WavyBackground className="mx-auto w-2/6" backgroundFill="white" colors={["#022c22", "#6ee7b7", "#34d399", "#10b981", "#059669"]} >
                {loading && (
            <FullScreenLoader text="Iniciando Sesion..."></FullScreenLoader>
        )}
        
                <motion.form
                    className=""
                    
                >
                <motion.h1
                initial={{ opacity: 0.5, y: -200 }}   // empieza más arriba
                    animate={{ opacity: 1, y: 0 }} // baja un poco (posición final)
                    transition={{
                    delay: 0.5,
                    duration: 0.8,
                    ease: "easeInOut",
                    
                    }}
                    onViewportEnter={() => console.log("visible")}
                    
                    className="flex justify-center"
                >
                    {/* Bienvenido a <br /> NeuroSalud */}
                    <TypewriterEffectSmooth cursorClassName="bg-emerald-500" words={[{text:"Bienvenido"},{text:"a"},{text:"NeuroSalud"}]}></TypewriterEffectSmooth>
                </motion.h1>
                   
                   <div className="bg-white rounded-2xl p-4 border shadow-2xl shadow-emerald-500 border-emerald-800">
                    <LabelInputContainer className="mb-4">
                    <Label htmlFor="email"><TextGenerateEffect className="dark" duration={4} words="Correo electronico"></TextGenerateEffect></Label>
                    <Input onChange={(e) => setEmail(e.target.value)} id="email" placeholder="example@gmail.com" type="email" />
                    </LabelInputContainer>
                    <LabelInputContainer className="mb-4">
                    <Label htmlFor="password"><TextGenerateEffect className="dark" duration={4} words="Contraseña"></TextGenerateEffect></Label>
                    <Input onChange={(e) => setPassword(e.target.value)} id="password" placeholder="••••••••" type="password" />
                    </LabelInputContainer>
                    

                    <button type="button" onClick={handleSubmit}
                        className="flex items-start justify-center group/btn relative  w-full rounded-md bg-gradient-to-br from-emerald-100 to-emerald-950 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] group-hover:scale-105 "
                        >
                        <TextGenerateEffect  duration={4} words="Iniciar Sesion &rarr;"></TextGenerateEffect>
                        
                        <BottomGradient />
                    </button>
                    {error && (
                        <ErrorAlert error={error}></ErrorAlert>
                    )}

                    <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
                   

                   </div>
                     

               </motion.form>
            
            {/* <SignupFormDemo></SignupFormDemo> */}
            
        </WavyBackground>
        
        </>
    )
}


const ErrorAlert = ({ error }: { error: string }) => {
  if (!error) return null;

  return (
    <div role="alert" className="fixed top-0 right-0 alert alert-error text-white">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{error}</span>
    </div>
  );
};
