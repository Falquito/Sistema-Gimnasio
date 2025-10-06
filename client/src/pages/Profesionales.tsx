import { PatientsTable } from "@/components/patients/PatientsTable"
import { ProfesionalesTable } from "@/components/ProfesionalesTable"
import { ProfesionalHeader } from "@/components/ProfesionalHeader"
import { LoadingSpinner3 } from "@/components/turno/LoadingSpinner"
import { FullScreenLoader } from "@/components/ui/loader"
import { Tabs, type Tab } from "@/components/ui/tabs"
import { listarObrasSociales } from "@/services/pacientes.services"
import { buscarProfesionales, softDeleteProfesional, updateProfesional, type BodyProfesional, type ProfesionalListItem } from "@/services/profesionales.services"
import { title } from "process"
import { useEffect, useRef, useState } from "react"
import type { ObraSocial } from "./Pacientes"
import { LabelInputContainer } from "@/components/signup-form-demo"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export const Profesionales = ()=>{

    const [profesionales,setProfesionales]=useState<ProfesionalListItem[]>([])

    const [obrasSociales,setObrasSociales] = useState<ObraSocial[]>([])

    const [selectedProfesional,setSelectedProfesional] = useState<ProfesionalListItem>()

    const [loading, setLoading] = useState(false);
    // 🧩 Refs para cada input
      const nombreEditadoRef = useRef<HTMLInputElement>(null);
      const apellidoEditadoRef = useRef<HTMLInputElement>(null);
      const telefonoEditadoRef = useRef<HTMLInputElement>(null);
      const contraseñaEditadoRef = useRef<HTMLInputElement>(null);
      const idObraSocialEditadoRef = useRef(null);
      const dniEditadoRef = useRef<HTMLInputElement>(null);
      const emailEditadoRef = useRef<HTMLInputElement>(null);
      const servicioEditadoRef = useRef<HTMLSelectElement>(null);
      const generoEditadoRef = useRef<HTMLInputElement>(null) 
      const [error,setError] = useState("")
    
    const handleEditarProfesional = async ()=>{
        const editadoProfesional:BodyProfesional = {
              nombre: nombreEditadoRef.current?.value.trim()===""?selectedProfesional?.nombreProfesional!:nombreEditadoRef.current?.value.trim()!,
              apellido: apellidoEditadoRef.current?.value.trim()===""?selectedProfesional?.apellidoProfesional!:apellidoEditadoRef.current?.value.trim()!,
              telefono: telefonoEditadoRef.current?.value.trim()===""?selectedProfesional?.telefono!:telefonoEditadoRef.current?.value.trim()!,
              contraseña: contraseñaEditadoRef.current?.value.trim()!,
              dni: dniEditadoRef.current?.value.trim()!,
              email: emailEditadoRef.current?.value.trim()===""?selectedProfesional?.email!:emailEditadoRef.current?.value.trim()!,
              servicio: servicioEditadoRef.current?.value===""?selectedProfesional?.servicio!:servicioEditadoRef.current?.value!,
              genero:generoEditadoRef.current?.value===""?selectedProfesional?.genero!:generoEditadoRef.current?.value!,
              ObrasSociales: [
                {
                    idObraSocial:parseInt(idObraSocialEditadoRef.current!.value)
                }
            ]
            };
            console.log(editadoProfesional)

        try {
                setLoading(true)
                const response = await updateProfesional(selectedProfesional?.idProfesionales!,editadoProfesional)
                if(response.error){
                    throw new Error(response.message)
                }
                setLoading(false)
        
                const modal = document.getElementById("editarProfesional") as HTMLDialogElement;
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
        nombreEditadoRef.current!.value = "";
        apellidoEditadoRef.current!.value = "";
        telefonoEditadoRef.current!.value = "";
        contraseñaEditadoRef.current!.value = "";
        dniEditadoRef.current!.value = "";
        emailEditadoRef.current!.value = "";
        servicioEditadoRef.current!.value = "";
        idObraSocialEditadoRef.current!.value = "";
        generoEditadoRef.current!.value=""
    }
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
    const onEditar=(profesional:ProfesionalListItem)=>{
        document.getElementById('editarProfesional').showModal()
       setSelectedProfesional(profesional)
       console.log(selectedProfesional)
        

    }

    const onEliminar=async (idProfesional:number)=>{
        try {
            
            setLoading(true)
            const response = await softDeleteProfesional(idProfesional)
            if(response.error){
                    throw new Error(response.message)
                }
            setLoading(false)
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

                        {/* Modal */}
          <dialog id="editarProfesional" className="modal">
            <div className="modal-box bg-white text-gray-600">
              <div className="flex flex-col gap-5">
                <h3 className="font-bold text-lg">Editar Profesional</h3>
                <hr />

                {/* Nombre / Apellido */}
                <LabelInputContainer className="flex-row items-center gap-2">
                  <Label>Nombre</Label>
                  <Input ref={nombreEditadoRef} type="text"  placeholder={selectedProfesional?.nombreProfesional} />
                  <Label>Apellido</Label>
                  <Input ref={apellidoEditadoRef} type="text" placeholder={selectedProfesional?.apellidoProfesional}  />
                </LabelInputContainer>

                {/* Contraseña / Teléfono */}
                <LabelInputContainer className="flex-row items-center gap-2">
                  <Label>Contraseña</Label>
                  <Input ref={contraseñaEditadoRef} type="password" placeholder="******" />
                  <Label>Teléfono</Label>
                  <Input ref={telefonoEditadoRef} type="text" placeholder={selectedProfesional?.telefono}   />
                </LabelInputContainer>

                {/* DNI / Email */}
                <LabelInputContainer className="flex-row items-center gap-2">
                  <Label>DNI</Label>
                  <Input ref={dniEditadoRef} type="text" value={selectedProfesional?.dni} placeholder="Sin puntos ni comillas" />
                  <Label>Correo electrónico</Label>
                  <Input ref={emailEditadoRef} type="email" placeholder={selectedProfesional?.email}  />
                </LabelInputContainer>

                {/* Servicio / Obras sociales */}
                <LabelInputContainer className="flex-col gap-2">
                  <Label>Servicio</Label>
                  <select  ref={servicioEditadoRef} defaultValue="" className="select select-success bg-white border border-emerald-500">
                    <option value="" disabled>
                      Selecciona un servicio
                    </option>
                    <option value="Psicologia">Psicologia</option>
                    <option value="Psiquiatria">Psiquiatria</option>
                    <option value="Psicopedagogia">Psicopedagogia</option>
                    <option value="Fonoaudiologia">Fonoaudiologia</option>
                  </select>
                  <Label>Genero</Label>
                  <select ref={generoEditadoRef} defaultValue="" className="select select-success bg-white border border-emerald-500">
                    <option value="" disabled>
                      Selecciona un genero
                    </option>
                    <option value="M">M</option>
                    <option value="F">F</option>
                    <option value="X">X</option>
                    
                  </select>

                  <Label>Obra Social</Label>
                  <select ref={idObraSocialEditadoRef} defaultValue="" className="select select-success bg-white border border-emerald-500">
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
                  onClick={handleEditarProfesional}
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

                        {loading?(<FullScreenLoader></FullScreenLoader>):""}

                        <ProfesionalHeader getProfesionales={getProfesionales} obrasSociales={obrasSociales} setProfesionales={setProfesionales} profesionales={profesionales} onOpenModalNuevoProfesional={onOpenModalNuevoProfesional} totalProfesionales={profesionales.length}></ProfesionalHeader>
                        <ProfesionalesTable onEliminar={onEliminar} onEditar={onEditar} profesionales={profesionales} />
                    </div>
                </div>
            )
        }
    ]

    if(profesionales.length===0) return <LoadingSpinner3></LoadingSpinner3>
    return (
        // <div className=" [perspective:1000px] relative b flex flex-col  mx-auto  h-full  items-start justify-start my-10">
        //         <Tabs key={profesionales.length} tabs={tabs} />
        // </div>
        <div className="mx-auto px-2 h-full relative overflow-y-auto  rounded-2xl  text-xl md:text-4xl font-bold text-white bg-gradient-to-br bg-white">
                    <div className="flex flex-col gap-10">
                       
                       

                        {/* Modal */}
          <dialog id="editarProfesional" className="modal">
            <div className="modal-box bg-white text-gray-600">
              <div className="flex flex-col gap-5">
                <h3 className="font-bold text-lg">Editar Profesional</h3>
                <hr />

                {/* Nombre / Apellido */}
                <LabelInputContainer className="flex-row items-center gap-2">
                  <Label>Nombre</Label>
                  <Input ref={nombreEditadoRef} type="text"  placeholder={selectedProfesional?.nombreProfesional} />
                  <Label>Apellido</Label>
                  <Input ref={apellidoEditadoRef} type="text" placeholder={selectedProfesional?.apellidoProfesional}  />
                </LabelInputContainer>

                {/* Contraseña / Teléfono */}
                <LabelInputContainer className="flex-row items-center gap-2">
                  <Label>Contraseña</Label>
                  <Input ref={contraseñaEditadoRef} type="password" placeholder="******" />
                  <Label>Teléfono</Label>
                  <Input ref={telefonoEditadoRef} type="text" placeholder={selectedProfesional?.telefono}   />
                </LabelInputContainer>

                {/* DNI / Email */}
                <LabelInputContainer className="flex-row items-center gap-2">
                  <Label>DNI</Label>
                  <Input ref={dniEditadoRef} type="text" value={selectedProfesional?.dni} placeholder="Sin puntos ni comillas" />
                  <Label>Correo electrónico</Label>
                  <Input ref={emailEditadoRef} type="email" placeholder={selectedProfesional?.email}  />
                </LabelInputContainer>

                {/* Servicio / Obras sociales */}
                <LabelInputContainer className="flex-col gap-2">
                  <Label>Servicio</Label>
                  <select  ref={servicioEditadoRef} defaultValue="" className="select select-success bg-white border border-emerald-500">
                    <option value="" disabled>
                      Selecciona un servicio
                    </option>
                    <option value="Psicologia">Psicologia</option>
                    <option value="Psiquiatria">Psiquiatria</option>
                    <option value="Psicopedagogia">Psicopedagogia</option>
                    <option value="Fonoaudiologia">Fonoaudiologia</option>
                  </select>
                  <Label>Genero</Label>
                  <select ref={generoEditadoRef} defaultValue="" className="select select-success bg-white border border-emerald-500">
                    <option value="" disabled>
                      Selecciona un genero
                    </option>
                    <option value="M">M</option>
                    <option value="F">F</option>
                    <option value="X">X</option>
                    
                  </select>

                  <Label>Obra Social</Label>
                  <select ref={idObraSocialEditadoRef} defaultValue="" className="select select-success bg-white border border-emerald-500">
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
                  onClick={handleEditarProfesional}
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

                        {loading?(<FullScreenLoader></FullScreenLoader>):""}

                        <ProfesionalHeader getProfesionales={getProfesionales} obrasSociales={obrasSociales} setProfesionales={setProfesionales} profesionales={profesionales} onOpenModalNuevoProfesional={onOpenModalNuevoProfesional} totalProfesionales={profesionales.length}></ProfesionalHeader>
                        <ProfesionalesTable onEliminar={onEliminar} onEditar={onEditar} profesionales={profesionales} />
                    </div>
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