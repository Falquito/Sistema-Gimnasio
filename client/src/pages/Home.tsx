import { Card3D } from "@/components/card-3d-home";
import ExpandableCardDemo from "@/components/expandable-card-demo-standard";
import HeaderBienvenida from "@/components/hero-section-demo-1"
import { RapidAction } from "@/components/ui/rapid-action";
import { apiFetch } from "@/lib/api";
import { isTokenExpired } from "@/lib/auth";
import { buscarPacientes, type PacienteListItem } from "@/services/pacientes.services";
import { TurnosApiService } from "@/services/turnos.services";
import type { Turno } from "@/types/turnos";
import React, { useEffect, useState } from "react";

export const Home = ()=>{
    const [pacientes,setPacientes] = useState<PacienteListItem[]>([])
    const [turnos, setTurnos] = React.useState<Turno[]>([]);
    const turnosApi = React.useMemo(() => new TurnosApiService(), []);
    const token = localStorage.getItem("token");

    const getPacientes =async ()=>{
        const res = await buscarPacientes("")
        console.log(JSON.parse(atob(token!.split(".")[1])))
        setPacientes(res)
    }
    useEffect(()=>{
        async function fetchTurnos() {
          try {
            // ejemplo: traer la agenda del día para un profesional (id=1, fecha de hoy)
            const hoy = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
            const data = await turnosApi.getAgendaDia({ profesionalId: 1, fecha: hoy });
            setTurnos(data);
          } catch (err) {
            console.error("Error cargando turnos", err);
          }
        }
        fetchTurnos()
        getPacientes()
    },[turnosApi])
    
    if (token && isTokenExpired(token)) {
        localStorage.removeItem("token");
        window.location.href = "/login";
    }

    return (
        <div className="relative z-50 flex flex-col items-center justify-center gap-10 py-10 w-full">
            {/* Header animado */}
            <HeaderBienvenida usuario={JSON.parse(atob(token!.split(".")[1])).nombre} />

            {/* Card con animación 3D */}
            <div className="flex flex-col justify-center w-full">
                <div className="flex justify-center gap-10">
                    <Card3D titulo={"Pacientes Activos"} textBody={pacientes.filter((item)=>item.estado).length.toString()} />
                    <Card3D titulo={"Citas del dia"} textBody={turnos.length.toString()} />
                </div>
                {JSON.parse(atob(token!.split(".")[1])).rol==="medico"?
                <ExpandableCardDemo  ></ExpandableCardDemo>
                :JSON.parse(atob(token!.split(".")[1])).rol==="gerente"?
                <>
                <div className="flex justify-center gap-10">
                    <Card3D titulo={"N° Medicos"} textBody={"100"} />
                    <Card3D titulo={"N° Recepcionistas"} textBody={"100"} />    

                </div>
                </>
                :""
                
                }
            </div>
            <RapidAction></RapidAction>
        </div>
    )
}
