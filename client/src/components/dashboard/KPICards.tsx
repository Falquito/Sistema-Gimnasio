
import User from "@/pages/User";
import type { EstadisticasResponse } from "../../services/dashboard.services";
import { Calendar,Users,Clock,Activity,FileText } from "lucide-react";
interface Props{
    data:EstadisticasResponse;
}
export function KPICards({data}:Props){
    const {kpis}=data;
    return(
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <KPICard
            icon={<Calendar className="w-5 h-5 text-blue-600"/>}
            title="Total Turnos"
            value={kpis.totalTurnos}
            subtitle="Este mas"
            />

             <KPICard
            icon={<Users className="w-5 h-5 text-yellow-600"/>}
            title="Pacientes Activos"
            value={kpis.pacientesActivos.cantidad}
            subtitle={`${kpis.pacientesActivos.incremento} este mes`}
            />

             <KPICard
            icon={<Clock className="w-5 h-5 text-purple-600"/>}
            title="Hora Pico"
            value={kpis.horaPico.hora}
            subtitle={`${kpis.horaPico.promedio} turnos promedio`}
            />

             <KPICard
            icon={<Activity className="w-5 h-5 text-green-600"/>}
            title="Especialidad top"
            value={kpis.especialidadTop.nombre}
        
            />

        </div>
    )
}


interface KPICardProps{
    icon:React.ReactNode;
    title:string;
    value:string|number
    subtitle?:string
    trend?:"up" | "down"

}

function KPICard({icon,title, value,subtitle,trend}:KPICardProps){
    return(
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium font-bold text-gray-600">{title}</span>
                {icon}
            </div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            {subtitle && (
                <div className={`text-xs  ${trend==="up"?"text-green-600":"text-gray-500"}`}>{subtitle}</div>
            )}
        </div>
    )
}