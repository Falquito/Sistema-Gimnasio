import { Plus, Users } from "lucide-react";
import { LabelInputContainer } from "./signup-form-demo";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import type { ObraSocial } from "@/pages/Pacientes";
import { useRef, useState } from "react";
import { createProfesional, type BodyProfesional } from "@/services/profesionales.services";
import { FullScreenLoader } from "./ui/loader";

interface ProfesionalHeaderProps {
  totalProfesionales: number;
  onOpenModalNuevoProfesional?: () => void;
  obrasSociales?: ObraSocial[];
  getProfesionales:()=> void
  profesionales:any
  setProfesionales:any
}

export const ProfesionalHeader: React.FC<ProfesionalHeaderProps> = ({
  totalProfesionales,
  onOpenModalNuevoProfesional,
  obrasSociales = [],
  getProfesionales,
  profesionales,
  setProfesionales
}) => {
  const [loading, setLoading] = useState(false);

  // 🧩 Refs para cada input
  const nombreRef = useRef<HTMLInputElement>(null);
  const apellidoRef = useRef<HTMLInputElement>(null);
  const telefonoRef = useRef<HTMLInputElement>(null);
  const contraseñaRef = useRef<HTMLInputElement>(null);
  const idObraSocialRef = useRef(0);
  const dniRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const servicioRef = useRef<HTMLSelectElement>(null);
  const [error,setError] = useState("")

  // 🚀 Crear profesional
  const handleCreateProfesional = async () => {
    const nuevoProfesional:BodyProfesional = {
      nombre: nombreRef.current?.value.trim()!,
      apellido: apellidoRef.current?.value.trim()!,
      telefono: telefonoRef.current?.value.trim()!,
      contraseña: contraseñaRef.current?.value.trim()!,
      dni: dniRef.current?.value.trim()!,
      email: emailRef.current?.value.trim()!,
      servicio: servicioRef.current?.value!,
      ObrasSociales: [
        {
            idObraSocial:parseInt(idObraSocialRef.current.value)
        }
    ]
    };

    console.log("🧠 Profesional creado:", nuevoProfesional);
    // Acá podrías hacer tu request:
    // await crearProfesional(nuevoProfesional);

    try {
        setLoading(true)
        const response = await createProfesional(nuevoProfesional)
        if(response.error){
            throw new Error(response.message)
        }
        setLoading(false)

        const modal = document.getElementById("nuevoProfesional") as HTMLDialogElement;
        modal.close();
        await getProfesionales()
    } catch (error) {

        console.error(error)

        setError(error.message);
        
        // ⚠️ Aquí hacemos desaparecer el alert después de 3s
        setTimeout(() => {
            setError("");
        }, 5000);
        
    }finally{
        setLoading(false)

    }
    // Luego podrías cerrar el modal o limpiar los campos:
    nombreRef.current!.value = "";
    apellidoRef.current!.value = "";
    telefonoRef.current!.value = "";
    contraseñaRef.current!.value = "";
    dniRef.current!.value = "";
    emailRef.current!.value = "";
    servicioRef.current!.value = "";
    idObraSocialRef.current!.value = "";
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm rounded-3xl">
        
      <div className="max-w-7xl mx-auto px-6 py-6 rounded-3xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-xl border border-green-500/30">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent">
                NeuroSalud
              </h1>
              <p className="text-gray-600 text-sm">Gestión de profesionales</p>
            </div>
          </div>

          {/* Botón nuevo profesional */}
          <button
            onClick={onOpenModalNuevoProfesional}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-small shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nuevo Profesional
          </button>

          {/* Modal */}
          <dialog id="nuevoProfesional" className="modal">
            <div className="modal-box bg-white text-gray-600">
              <div className="flex flex-col gap-5">
                <h3 className="font-bold text-lg">Nuevo Profesional</h3>
                <hr />

                {/* Nombre / Apellido */}
                <LabelInputContainer className="flex-row items-center gap-2">
                  <Label>Nombre</Label>
                  <Input ref={nombreRef} type="text" placeholder="Joel..." />
                  <Label>Apellido</Label>
                  <Input ref={apellidoRef} type="text" placeholder="Serrudo..." />
                </LabelInputContainer>

                {/* Contraseña / Teléfono */}
                <LabelInputContainer className="flex-row items-center gap-2">
                  <Label>Contraseña</Label>
                  <Input ref={contraseñaRef} type="password" placeholder="******" />
                  <Label>Teléfono</Label>
                  <Input ref={telefonoRef} type="text" placeholder="3875352838" />
                </LabelInputContainer>

                {/* DNI / Email */}
                <LabelInputContainer className="flex-row items-center gap-2">
                  <Label>DNI</Label>
                  <Input ref={dniRef} type="text" placeholder="Sin puntos ni comillas" />
                  <Label>Correo electrónico</Label>
                  <Input ref={emailRef} type="email" placeholder="example@gmail.com" />
                </LabelInputContainer>

                {/* Servicio / Obras sociales */}
                <LabelInputContainer className="flex-col gap-2">
                  <Label>Servicio</Label>
                  <select ref={servicioRef} defaultValue="" className="select select-success bg-white border border-emerald-500">
                    <option value="" disabled>
                      Selecciona un servicio
                    </option>
                    <option value="Psicologia">Psicologia</option>
                    <option value="Psiquiatria">Psiquiatria</option>
                    <option value="Psicopedagogia">Psicopedagogia</option>
                    <option value="Fonoaudiologia">Fonoaudiologia</option>
                  </select>

                  <Label>Obra Social</Label>
                  <select ref={idObraSocialRef} defaultValue="" className="select select-success bg-white border border-emerald-500">
                    <option value="" disabled>
                      Selecciona una obra social
                    </option>
                    {obrasSociales.map((obraSocial) => (
                      <option value={obraSocial.id_os} key={obraSocial.id_os}>
                        {obraSocial.nombre}
                      </option>
                    ))}
                  </select>
                </LabelInputContainer>
              </div>

              {/* Botones */}
              <div className="modal-action flex justify-center items-center flex-wrap">
                <form method="dialog" className="flex justify-center items-center">
                  <button className="btn btn-error text-white">Cancelar</button>
                </form>
                <button
                  className="btn border-none bg-emerald-500 text-white"
                  onClick={handleCreateProfesional}
                  disabled={loading}
                >
                  {loading ? (<FullScreenLoader></FullScreenLoader>):"Crear"}
                  
                </button>
                {error.length>1 ?(
            <div role="alert" className="alert alert-error  z-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
            </div>
        ):""}
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  );
};
