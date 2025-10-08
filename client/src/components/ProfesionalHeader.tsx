import { Plus, Smile, Users } from "lucide-react";
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
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  // ---  validator functions ---

  // ✅ 1. Validador para permitir solo letras (nombre y apellido)
  const handleAlphaInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/^[a-zA-Z\s]*$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab' && !e.ctrlKey) {
        e.preventDefault();
    }
  };

  // ✅ 2. Validador para permitir solo números (DNI)
  const handleNumericInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/^[0-9]*$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab' && !e.ctrlKey) {
        e.preventDefault();
    }
  };

  // ✅ 3. Formateador y validador de hora (HH:MM)
   const handleTimeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Solo números
    let formattedValue = value;

    if (value.length > 2) {
      formattedValue = `${value.slice(0, 2)}:${value.slice(2, 4)}`;
    }
    
    e.target.value = formattedValue;
  };

  // ✅ 4. Validador general que se ejecuta al salir de un campo (onBlur)
  const validateField = (name: string, value: string) => {
    let specificError = "";
    switch (name) {
      case 'email':
        if (value && !/\S+@\S+\.\S+/.test(value)) {
            specificError = "El formato del email no es válido.";
        }
        break;
      case 'horaI':
      case 'horaF':
        if (value) {
            const [hours, minutes] = value.split(':').map(Number);
            if (value.length !== 5 || isNaN(hours) || isNaN(minutes) || hours < 9 || hours > 21 || minutes < 0 || minutes > 59) {
                specificError = "La hora debe estar entre 09:00 y 21:59.";
            }
        }
        break;
      default:
        break;
    }
    setFieldErrors(prev => ({ ...prev, [name]: specificError }));
  };
  // 🧩 Refs para cada input
  const nombreRef = useRef<HTMLInputElement>(null);
  const apellidoRef = useRef<HTMLInputElement>(null);
  const telefonoRef = useRef<HTMLInputElement>(null);
  const contraseñaRef = useRef<HTMLInputElement>(null);
  const idObraSocialRef = useRef(0);
  const dniRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const generoRef = useRef<HTMLInputElement>(null)
  const servicioRef = useRef<HTMLSelectElement>(null);
  const horaIRef= useRef<HTMLInputElement>(null)
  const horaFRef = useRef<HTMLInputElement>(null);
  const [error,setError] = useState("")
  const [exitoso,setExitoso] = useState(false)
  

  // 🚀 Crear profesional
  const handleCreateProfesional = async () => {
    // ⚠️ Validación final antes de enviar
    const formValues = [
      {
        item:nombreRef.current?.value.trim()!
      },
      {
        item: apellidoRef.current?.value.trim()!
      },
      {
        item: telefonoRef.current?.value.trim()!
      },
      {
      item: contraseñaRef.current?.value.trim()!
      },
      {
      item: dniRef.current?.value.trim()!
      },
      {
      item: emailRef.current?.value.trim()!
      },
      {
        item: servicioRef.current?.value!
      },
      {
        item:generoRef.current?.value!
        // ... agrega otros campos si necesitas validarlos antes de enviar
    }];
    switch (formValues.findIndex((item)=>item.item==="")){
      case 0:
        setError("El nombre es obligatorio")
        return
        break
      case 1:
        setError("El apellido es obligatorio")
        return
        break
      case 2:
        setError("El telefono es obligatorio")
        return
      case 3:
        setError("El contraseña es obligatorio")
        return
      case 4:
        setError("El dni es obligatorio")
        return
      case 5:
        setError("El email es obligatorio")
        return
      case 6:
        setError("El servicio es obligatorio")
        return
      case 7:
        setError("El genero es obligatorio")
        return
    }
    
    
    
    // Si hay errores en los campos, no continuar
    if (Object.values(fieldErrors).some(err => err)) {
        setError("Por favor, corrige los errores en el formulario.");
        setTimeout(() => setError(""), 5000);
        return;
    }
    const nuevoProfesional:BodyProfesional = {
      nombre: nombreRef.current?.value.trim()!,
      apellido: apellidoRef.current?.value.trim()!,
      telefono: telefonoRef.current?.value.trim()!,
      contraseña: contraseñaRef.current?.value.trim()!,
      dni: dniRef.current?.value.trim()!,
      email: emailRef.current?.value.trim()!,
      servicio: servicioRef.current?.value!,
      genero:generoRef.current?.value!,
      hora_inicio_laboral:horaIRef.current?.value!,
      hora_fin_laboral:horaFRef.current?.value!,
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
        setExitoso(true)
        setTimeout(()=>{
          setExitoso(false)
        },3000)
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
        {exitoso?( 
              <div role="alert" className="alert alert-success fixed top-5 right-0 z-100">
                <Smile></Smile>
                <span>Accion realizada correctamente</span>
            </div>):""} 
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
                  <div className="flex flex-col w-full">
                    <Label className="after:ml-0.5 after:text-red-500 after:content-['*']">Nombre</Label>
                    <Input ref={nombreRef} type="text" placeholder="Joel..." onKeyDown={handleAlphaInput} />
                  </div>
                  <div className="flex flex-col w-full">
                    <Label className="after:ml-0.5 after:text-red-500 after:content-['*']">Apellido</Label>
                    <Input ref={apellidoRef} type="text" placeholder="Serrudo..." onKeyDown={handleAlphaInput} />
                  </div>
                </LabelInputContainer>

                {/* Contraseña / Teléfono */}
                 {/* ... no se pidieron validaciones aquí, se mantienen igual ... */}
                 <LabelInputContainer className="flex-row items-center gap-2">
                  <div className="flex flex-col w-full">
                    <Label className="after:ml-0.5 after:text-red-500 after:content-['*']">Contraseña</Label>
                    <Input ref={contraseñaRef} type="password" placeholder="******" />
                  </div>
                  <div className="flex flex-col w-full">
                    <Label className="after:ml-0.5 after:text-red-500 after:content-['*']">Teléfono</Label>
                    <Input ref={telefonoRef} type="text" placeholder="3875352838" />
                  </div>
                </LabelInputContainer>

                {/* DNI / Email */}
                <LabelInputContainer className="flex-row items-center gap-2">
                  <div className="flex flex-col w-full">
                    <Label className="after:ml-0.5 after:text-red-500 after:content-['*']">DNI</Label>
                    <Input ref={dniRef} type="text" placeholder="Sin puntos" onKeyDown={handleNumericInput} maxLength={8} />
                    {fieldErrors.dni && <p className="text-red-500 text-xs mt-1">{fieldErrors.dni}</p>}
                  </div>
                  <div className="flex flex-col w-full">
                    <Label>Correo electrónico</Label>
                    <Input 
                        ref={emailRef} 
                        type="email" 
                        placeholder="example@gmail.com"
                        onBlur={(e) => validateField('email', e.target.value)}
                    />
                    {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
                  </div>
                </LabelInputContainer>

                {/* Horas */}
                <LabelInputContainer className="flex-row items-center gap-2">
                  <div className="flex flex-col w-full">
                    <Label className="after:ml-0.5 after:text-red-500 after:content-['*']">Hora inicio laboral</Label>
                    <Input 
                        ref={horaIRef} 
                        type="text" 
                        placeholder="09:00" 
                        maxLength={5} 
                        onChange={handleTimeInput} 
                        onBlur={(e) => validateField('horaI', e.target.value)} 
                    />
                    {fieldErrors.horaI && <p className="text-red-500 text-xs mt-1">{fieldErrors.horaI}</p>}
                  </div>
                  <div className="flex flex-col w-full">
                    <Label>Hora fin laboral</Label>
                    <Input 
                        ref={horaFRef} 
                        type="text" 
                        placeholder="16:00" 
                        maxLength={5} 
                        onChange={handleTimeInput} 
                        onBlur={(e) => validateField('horaF', e.target.value)}
                    />
                     {fieldErrors.horaF && <p className="text-red-500 text-xs mt-1">{fieldErrors.horaF}</p>}
                  </div>
                </LabelInputContainer>


                {/* Servicio / Obras sociales */}
                <LabelInputContainer className="flex-col flex-wrap gap-2 items-center ">
                  <Label>Servicio</Label>
                  <select ref={servicioRef} defaultValue="" className=" select select-success bg-white border border-emerald-500">
                    <option value="" disabled>
                      Selecciona un servicio
                    </option>
                    <option value="Psicologia">Psicologia</option>
                    <option value="Psiquiatria">Psiquiatria</option>
                    <option value="Psicopedagogia">Psicopedagogia</option>
                    <option value="Fonoaudiologia">Fonoaudiologia</option>
                  </select>
                  <Label>Genero</Label>
                  <select ref={generoRef} defaultValue="" className="select select-success bg-white border border-emerald-500">
                    <option value="" disabled>
                      Selecciona un genero
                    </option>
                    <option value="M">M</option>
                    <option value="F">F</option>
                    <option value="X">X</option>
                    
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
