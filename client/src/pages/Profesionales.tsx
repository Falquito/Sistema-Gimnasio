import { PatientsTable } from "@/components/patients/PatientsTable"
import { ProfesionalesTable } from "@/components/ProfesionalesTable"
import { ProfesionalHeader } from "@/components/ProfesionalHeader"
import { LoadingSpinner3 } from "@/components/turno/LoadingSpinner"
import { FullScreenLoader } from "@/components/ui/loader"
import { Tabs, type Tab } from "@/components/ui/tabs"
import { listarObrasSociales } from "@/services/pacientes.services"
import { buscarProfesionales, type ProfesionalListItem } from "@/services/profesionales.services"
import { title } from "process"
import { useEffect, useState } from "react"
import type { ObraSocial } from "./Pacientes"

export const Profesionales = ()=>{

    const [profesionales,setProfesionales]=useState<ProfesionalListItem[]>([])

    const [obrasSociales,setObrasSociales] = useState<ObraSocial[]>([])

    const getObrasSociales =async()=>{
        const listObrasSociales = await listarObrasSociales()
        console.log(listObrasSociales)
        setObrasSociales(listObrasSociales)
    }
    const getProfesionales =async()=>{
        const listProfesionales = await buscarProfesionales("")
        console.log(listProfesionales)
        setProfesionales(listProfesionales)
    }

    const onOpenModalNuevoProfesional = ()=>{
        document.getElementById('nuevoProfesional').showModal()
    }
    const onEditar=()=>{

    }

    const onEliminar=()=>{

    }
    useEffect(()=>{
        getProfesionales()
        getObrasSociales()
    },[])

    const tabs:Tab[] = [
        {
            title:"Profesionales",
            value:"Profesionales",
            content:(
                <div className="mx-auto w-[95%] h-full relative overflow-y-auto  rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-emerald-100 to-emerald-500">
                    <div className="flex flex-col gap-10">
                        <p className="text-gray-600 ">Gestion de profesionales</p>
                        <ProfesionalHeader getProfesionales={getProfesionales} obrasSociales={obrasSociales} setProfesionales={setProfesionales} profesionales={profesionales} onOpenModalNuevoProfesional={onOpenModalNuevoProfesional} totalProfesionales={profesionales.length}></ProfesionalHeader>
                        <ProfesionalesTable onEliminar={onEliminar} onEditar={onEditar} profesionales={profesionales} />
                    </div>
                </div>
            )
        },
        {
            title:"Dashboard",
            value:"Dashboard",
            content:(
                <div className="mx-auto w-[95%] h-full overflow-hidden relative  rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-emerald-100 to-emerald-500">
                    <p>DashBoard</p>
                    <DummyContent />
                </div>
            )
        }
    ]

    if(profesionales.length===0) return <LoadingSpinner3></LoadingSpinner3>
    return (
        <div className=" [perspective:1000px] relative b flex flex-col  mx-auto  h-full  items-start justify-start my-10">
                <Tabs key={profesionales.length} tabs={tabs} />
        </div>
    )
}

const DummyContent = () => {
  return (
    <img
      src="/linear.webp"
      alt="dummy image"
      width="500"
      height="500"
      className="object-cover object-left-top h-[60%]  md:h-[90%] absolute -bottom-10 inset-x-0 w-[90%] rounded-xl mx-auto"
    />
  );
};