// import type { ProfesionalListItem } from "@/services/profesionales.services";
// import { BriefcaseMedical, Calendar, Edit3, Mail, Phone, Trash2, User, Users } from "lucide-react";

// interface ProfesionalesTableProps {
//   profesionales: ProfesionalListItem[];
//   onEditar: (profesional: any) => void;
//   onEliminar: (id: number) => void;
//   onVerDetalles?: (profesional: any) => void;
//   filtroEstado?: string;
//   setFiltroEstado?: (estado: string) => void;
// }

// export const ProfesionalesTable: React.FC<ProfesionalesTableProps> = ({
//   profesionales,
//   onEditar,
//   onEliminar,
//   onVerDetalles,
//   filtroEstado,
//   setFiltroEstado
// }) => {
//   const calcularTiempoActivo = (fechaInicio: string) => {
//   // Espera formato "dd-mm-yy"
//   const [dia, mes, año] = fechaInicio.split('-').map(Number);
//   const añoCompleto = año < 100 ? 2000 + año : año; // Para convertir 24 → 2024, etc.
//   const inicio = new Date(añoCompleto, mes - 1, dia);
//   const hoy = new Date();

//   // Calcular diferencias
//   let años = hoy.getFullYear() - inicio.getFullYear();
//   let meses = hoy.getMonth() - inicio.getMonth();
//   let dias = hoy.getDate() - inicio.getDate();

//   // Ajustes si el día o mes aún no se cumplió
//   if (dias < 0) {
//     meses--;
//     const ultimoDiaMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0).getDate();
//     dias += ultimoDiaMesAnterior;
//   }

//   if (meses < 0) {
//     años--;
//     meses += 12;
//   }

//   return `${años} años, ${meses} meses y ${dias} días activo.`;
// };

// // Ejemplo:
// console.log(calcularTiempoActivo("25-09-24"));

//   return (
//     <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
//       {/* Header de tabla */}
//       <div className="px-6 py-4 border-b border-gray-200 ">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//               <User className="w-6 h-6 text-emerald-600" />
//               Registro de Profesionales
//             </h2>
//             <p className="text-gray-600 text-sm mt-1">
//               {profesionales.length} {profesionales.length === 1 ? 'profesional encontrado' : 'profesionales encontrados'}
//             </p>
//           </div>
          
          
//         </div>
//       </div>

//       {/* Contenido de tabla */}
//       {profesionales.length === 0 ? (
//         <div className="text-center py-16">
//           <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//           <p className="text-gray-900 text-lg font-medium mb-2">No se encontraron profesionales</p>
//           <p className="text-gray-500 text-sm max-w-md mx-auto">
//             No hay profesionales que coincidan con los filtros actuales.
//           </p>
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full ">
//             <thead>
//               <tr className="bg-gray-50 border-b border-gray-200">
//                 <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Profesional</th>
//                 <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Información Personal</th>
//                 <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Contacto</th>
//                 <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Servicio</th>
//                 {/* <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Estado</th> */}
//                 <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Acciones</th>
//               </tr>
//             </thead>
//             <tbody>
//               {profesionales.map((profesional) => {
//                 const edad = calcularTiempoActivo(profesional.fechaAlta);
//                 console.log(profesional.fechaAlta)
//                 // const obraSocial = obrasSociales.find(os => os.id_os === paciente.obraSocial?.id_os);
                
//                 return (
//                   <tr key={profesional.idProfesionales} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  

//                     {/* Profesionales */}
//                     <td className="py-4 px-6">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
//                           {profesional.nombreProfesional[0]}{profesional.apellidoProfesional[0]}
//                         </div>
//                         <div>
//                           <p className="font-semibold text-gray-900">
//                             {profesional.apellidoProfesional}, {profesional.nombreProfesional}
//                           </p>
//                           <p className="text-gray-500 text-xs">DNI: {profesional.dni}</p>
//                         </div>
//                       </div>
//                     </td>

//                     {/* Información Personal */}
//                     <td className="py-4 px-6">
//                       <div className="space-y-1">
//                         <div className="flex items-center gap-2 text-sm">
//                           <Calendar className="w-4 h-4 text-gray-400" />
//                           <span className="text-gray-700">{edad}</span>
//                         </div>
//                         <div className="flex items-center gap-2 text-sm">
//                           <User className="w-4 h-4 text-gray-400" />
//                           <span className="text-gray-600">{profesional.genero}</span>
//                         </div>
//                       </div>
//                     </td>

//                     {/* Contacto */}
//                     <td className="py-4 px-6">
//                       <div className="space-y-1">
//                         <div className="flex items-center gap-2 text-sm">
//                           <Phone className="w-4 h-4 text-gray-400" />
//                           <span className="text-gray-700">{profesional.telefono}</span>
//                         </div>
//                         <div className="flex items-center gap-2 text-sm">
//                           <Mail className="w-4 h-4 text-gray-400" />
//                           <span className="text-gray-600 truncate max-w-40">{profesional.email}</span>
//                         </div>
//                       </div>
//                     </td>

//                     {/* Servicio */}
//                     <td className="py-4 px-6">
//                       <div className="space-y-1">
//                         <div className="flex items-center gap-2 text-sm">
//                           <BriefcaseMedical className="w-4 h-4 text-gray-400" />
//                           <span className="text-gray-700">{profesional.servicio}</span>
//                         </div>
//                       </div>
//                     </td>
                    

//                     {/* Acciones */}
//                     <td className="py-4 px-6">
                     
                         
                        
//                         <button
//                           onClick={() => onEditar(profesional)}
//                           className="p-2 hover:bg-emerald-100 rounded-lg transition-colors group"
//                           title="Editar paciente"
//                         >
//                           <Edit3 className="w-4 h-4 text-gray-500 group-hover:text-emerald-600" />
//                         </button>
                        
//                         <button
//                           onClick={() => onEliminar(profesional.idProfesionales)}
//                           className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
//                           title="Eliminar paciente"
//                         >
//                           <Trash2 className="w-4 h-4 text-gray-500 group-hover:text-red-600" />
//                         </button>
                      
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Footer */}
//       {profesionales.length > 0 && (
//         <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
//           <div className="flex items-center justify-between text-sm text-gray-600">
//             <span>Mostrando {profesionales.length} profesionales</span>
            
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };


import type { ProfesionalListItem } from "@/services/profesionales.services";
import { BriefcaseMedical, Calendar, Edit3, Mail, Phone, Trash2, User, Users, Search } from "lucide-react";
import { useState, useMemo } from "react";

interface ProfesionalesTableProps {
  profesionales: ProfesionalListItem[];
  onEditar: (profesional:any) => void;
  onEliminar: (id: number) => void;
  onVerDetalles?: (profesional: any) => void;
  filtroEstado?: string;
  setFiltroEstado?: (estado: string) => void;
}

export const ProfesionalesTable: React.FC<ProfesionalesTableProps> = ({
  profesionales,
  onEditar,
  onEliminar,
  onVerDetalles,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // --- 🔍 Filtro dinámico ---
  const filteredProfesionales = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return profesionales.filter((p) =>
      p.nombreProfesional.toLowerCase().includes(term) ||
      p.apellidoProfesional.toLowerCase().includes(term) ||
      p.servicio.toLowerCase().includes(term) ||
      p.dni.toString().includes(term)
    );
  }, [searchTerm, profesionales]);

  // --- 🧮 Función para calcular tiempo activo ---
  const calcularTiempoActivo = (fechaInicio: string) => {
  const [año, mes, dia] = fechaInicio.split('-').map(Number); // 👈 invertido
  const añoCompleto = año < 100 ? 2000 + año : año;
  const inicio = new Date(añoCompleto, mes - 1, dia);
  const hoy = new Date();

  let años = hoy.getFullYear() - inicio.getFullYear();
  let meses = hoy.getMonth() - inicio.getMonth();
  let dias = hoy.getDate() - inicio.getDate();

  if (dias < 0) {
    meses--;
    const ultimoDiaMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0).getDate();
    dias += ultimoDiaMesAnterior;
  }

  if (meses < 0) {
    años--;
    meses += 12;
  }

  return `${años} años, ${meses} meses y ${dias} días activo.`;
};


  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <User className="w-6 h-6 text-emerald-600" />
            Registro de Profesionales
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {filteredProfesionales.length} {filteredProfesionales.length === 1 ? 'profesional encontrado' : 'profesionales encontrados'}
          </p>
        </div>

        {/* 🔍 Buscador */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nombre, apellido, servicio o DNI"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm text-gray-700"
          />
        </div>
      </div>

      {/* Contenido */}
      {filteredProfesionales.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-900 text-lg font-medium mb-2">No se encontraron profesionales</p>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            No hay profesionales que coincidan con tu búsqueda.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Profesional</th>
                <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Información Personal</th>
                <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Contacto</th>
                <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Servicio</th>
                <th className="text-left py-4 px-6 text-gray-700 font-semibold text-sm">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProfesionales.map((profesional) => {
                const tiempoActivo = calcularTiempoActivo(profesional.fechaAlta);

                return (
                  <tr key={profesional.idProfesionales} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {profesional.nombreProfesional[0]}{profesional.apellidoProfesional[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {profesional.apellidoProfesional}, {profesional.nombreProfesional}
                          </p>
                          <p className="text-gray-500 text-xs">DNI: {profesional.dni}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{tiempoActivo}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">{profesional.genero}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{profesional.telefono}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 truncate max-w-40">{profesional.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-sm text-gray-700">
                      <div className="flex items-center gap-2">
                        <BriefcaseMedical className="w-4 h-4 text-gray-400" />
                        {profesional.servicio}
                      </div>
                    </td>

                    <td className="py-4 px-6 flex gap-2">
                      <button
                        onClick={() => onEditar(profesional)}
                        className="p-2 hover:bg-emerald-100 rounded-lg transition-colors group"
                        title="Editar profesional"
                      >
                        <Edit3 className="w-4 h-4 text-gray-500 group-hover:text-emerald-600" />
                      </button>

                      <button
                        onClick={() => onEliminar(profesional.idProfesionales)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                        title="Eliminar profesional"
                      >
                        <Trash2 className="w-4 h-4 text-gray-500 group-hover:text-red-600" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      {filteredProfesionales.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
          Mostrando {filteredProfesionales.length} profesionales
        </div>
      )}
    </div>
  );
};
