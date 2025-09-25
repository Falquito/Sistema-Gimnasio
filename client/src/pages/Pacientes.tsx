import React, { useState, useEffect, useMemo } from 'react';

// === TIPOS, DATOS DE EJEMPLO Y UTILIDADES ===
interface Paciente {
  id_paciente: number;
  nombre_paciente: string;
  apellido_paciente: string;
  dni: string;
  email: string;
  telefono_paciente: string;
  fecha_nacimiento: string;
  genero: string;
  id_obra_social?: number;
  nro_obra_social?: string;
  observaciones?: string;
  fecha_alta: string;
  fecha_ult_upd: string;
}

const obrasSocialesCatalogo = [
    { id: 1, nombre: 'OSDE' },
    { id: 2, nombre: 'Swiss Medical' },
    { id: 3, nombre: 'Galeno' },
    { id: 4, nombre: 'PAMI' },
    { id: 5, nombre: 'IAPOS' },
];

const pacientesDeEjemplo: Paciente[] = [
  { id_paciente: 1, nombre_paciente: 'Juan', apellido_paciente: 'Pérez', dni: '30123456', email: 'juan.perez@example.com', telefono_paciente: '1122334455', fecha_nacimiento: '1985-05-20', genero: 'Masculino', id_obra_social: 1, nro_obra_social: '12345-01', observaciones: 'Historial de ansiedad.', fecha_alta: '2023-01-15', fecha_ult_upd: '2023-10-28' },
  { id_paciente: 2, nombre_paciente: 'Ana', apellido_paciente: 'García', dni: '35987654', email: 'ana.garcia@example.com', telefono_paciente: '9988776655', fecha_nacimiento: '1992-11-30', genero: 'Femenino', id_obra_social: 2, nro_obra_social: '67890-02', observaciones: 'Primera consulta.', fecha_alta: '2023-03-22', fecha_ult_upd: '2023-11-05' },
];

// === COMPONENTE PRINCIPAL ===
const PacientesPage = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estado para manejar las notificaciones (mensaje y tipo)
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    setPacientes(pacientesDeEjemplo);
  }, []);

  const mostrarNotificacion = (message: string, type: 'success' | 'error' = 'success') => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 3000);
  };

  const pacientesFiltrados = useMemo(() => {
    if (!terminoBusqueda) return pacientes;
    const busquedaLower = terminoBusqueda.toLowerCase();
    return pacientes.filter(p => 
        p.nombre_paciente.toLowerCase().includes(busquedaLower) ||
        p.apellido_paciente.toLowerCase().includes(busquedaLower) ||
        p.dni.toLowerCase().includes(busquedaLower)
    );
  }, [pacientes, terminoBusqueda]);
  
  const handleOpenModalParaCrear = () => {
    setPacienteSeleccionado(null);
    setIsModalOpen(true);
  };

  const handleOpenModalParaEditar = (paciente: Paciente) => {
    setPacienteSeleccionado(paciente);
    setIsModalOpen(true);
  };
  
  const handleCerrarModal = () => {
    setIsModalOpen(false);
    setPacienteSeleccionado(null);
  };

  const handleGuardarPaciente = (paciente: Paciente) => {
    const isEditing = !!paciente.id_paciente;
    if (isEditing) {
      setPacientes(pacientes.map(p => p.id_paciente === paciente.id_paciente ? paciente : p));
      mostrarNotificacion('Paciente Modificado Exitosamente');
    } else {
      const nuevoPaciente = { ...paciente, id_paciente: Date.now() };
      setPacientes([...pacientes, nuevoPaciente]);
      mostrarNotificacion('Paciente Creado Exitosamente');
    }
    handleCerrarModal();
  };

  const handleEliminarPaciente = (id: number) => {
    if (window.confirm('¿Está seguro de eliminar el paciente?')) {
        setPacientes(pacientes.filter(p => p.id_paciente !== id));
        mostrarNotificacion('Paciente Eliminado Exitosamente', 'error');
    }
  };

  return (
    <div style={styles.container}>
      {notification && (
        <div style={{...styles.notification, backgroundColor: notification.type === 'success' ? '#28a745' : '#dc3545'}}>
          {notification.message}
        </div>
      )}

      <h1 style={styles.header}>Gestión de Pacientes</h1>
      <div style={styles.toolbar}>
        <input
            type="text"
            placeholder="Buscar por nombre, apellido o DNI..."
            value={terminoBusqueda}
            onChange={(e) => setTerminoBusqueda(e.target.value)}
            style={styles.searchInput}
        />
        <button onClick={handleOpenModalParaCrear} style={styles.addButton}>
          + Nuevo Paciente
        </button>
      </div>

      <TablaPacientes 
        pacientes={pacientesFiltrados}
        onEditar={handleOpenModalParaEditar}
        onEliminar={handleEliminarPaciente}
      />

      {isModalOpen && (
        <ModalFormulario
            paciente={pacienteSeleccionado}
            pacientesExistentes={pacientes}
            onGuardar={handleGuardarPaciente}
            onCerrar={handleCerrarModal}
        />
      )}
    </div>
  );
};

// === SUB-COMPONENTES ===

const TablaPacientes = ({ pacientes, onEditar, onEliminar }: { pacientes: Paciente[], onEditar: (paciente: Paciente) => void, onEliminar: (id: number) => void }) => (
  <table style={styles.table}>
    <thead>
      <tr>
        <th style={styles.th}>Nombre Completo</th>
        <th style={styles.th}>DNI</th>
        <th style={styles.th}>Email</th>
        <th style={styles.th}>Teléfono</th>
        <th style={styles.th}>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {pacientes.map(p => (
        <tr key={p.id_paciente}>
          <td style={styles.td}>{p.nombre_paciente} {p.apellido_paciente}</td>
          <td style={styles.td}>{p.dni}</td>
          <td style={styles.td}>{p.email}</td>
          <td style={styles.td}>{p.telefono_paciente}</td>
          <td style={styles.td}>
            <button onClick={() => onEditar(p)} style={{...styles.actionButton, ...styles.editButton}}>Editar</button>
            <button onClick={() => onEliminar(p.id_paciente)} style={{...styles.actionButton, ...styles.deleteButton}}>Eliminar</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const ModalFormulario = ({ paciente, pacientesExistentes, onGuardar, onCerrar }: { paciente: Paciente | null, pacientesExistentes: Paciente[], onGuardar: (paciente: Paciente) => void, onCerrar: () => void }) => {
    const [formData, setFormData] = useState<Omit<Paciente, 'id_paciente' | 'id_obra_social'> & { id_paciente?: number, id_obra_social: string }>({
        id_paciente: paciente?.id_paciente,
        nombre_paciente: paciente?.nombre_paciente || '',
        apellido_paciente: paciente?.apellido_paciente || '',
        dni: paciente?.dni || '',
        email: paciente?.email || '',
        telefono_paciente: paciente?.telefono_paciente || '',
        fecha_nacimiento: paciente?.fecha_nacimiento || '',
        genero: paciente?.genero || 'Otro',
        id_obra_social: paciente?.id_obra_social ? String(paciente.id_obra_social) : '',
        nro_obra_social: paciente?.nro_obra_social || '',
        observaciones: paciente?.observaciones || '',
        fecha_alta: paciente?.fecha_alta || new Date().toISOString().split('T')[0],
        fecha_ult_upd: new Date().toISOString().split('T')[0]
    });
    
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    
    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        // DNI: No repetido y longitud correcta
        if (formData.dni.length < 7 || formData.dni.length > 10) newErrors.dni = 'El DNI debe tener entre 7 y 10 dígitos.';
        const dniExistente = pacientesExistentes.find(p => p.dni === formData.dni && p.id_paciente !== formData.id_paciente);
        if (dniExistente) newErrors.dni = 'Este DNI ya está registrado.';

        // Email: Formato válido
        if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'El formato del email es inválido.';
        
        // Teléfono: Formato y longitud
        if (!/^[0-9+\-() ]{8,15}$/.test(formData.telefono_paciente)) newErrors.telefono_paciente = 'Teléfono inválido (8-15 dígitos).';
        
        // Fecha de Nacimiento: Obligatoria y no futura
        if (!formData.fecha_nacimiento) newErrors.fecha_nacimiento = 'La fecha de nacimiento es obligatoria.';
        else if (new Date(formData.fecha_nacimiento) > new Date()) newErrors.fecha_nacimiento = 'La fecha de nacimiento no puede ser futura.';

        // Obra Social: Lógica condicional
        if (formData.id_obra_social && !formData.nro_obra_social) newErrors.nro_obra_social = 'Número de afiliado obligatorio.';
        if (!formData.id_obra_social && formData.nro_obra_social) newErrors.id_obra_social = 'Seleccione una obra social.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        let processedValue = value;
        if (name === 'dni') processedValue = value.replace(/[^0-9]/g, '');
        else if (name === 'telefono_paciente') processedValue = value.replace(/[^0-9+\-() ]/g, '');
        
        setFormData(prev => ({ ...prev, [name]: processedValue }));
        if (errors[name]) setErrors(prev => ({...prev, [name]: ''}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            const dataToSave = { ...formData, id_obra_social: formData.id_obra_social ? Number(formData.id_obra_social) : undefined };
            onGuardar(dataToSave as Paciente);
        }
    };

    return (
        <div style={styles.modalBackdrop}>
            <div style={styles.modalContent}>
                <h2 style={{color: '#333'}}>{paciente ? 'Editar Paciente' : 'Nuevo Paciente'}</h2>
                <form onSubmit={handleSubmit} noValidate>
                    {/* ... (resto del formulario sin cambios) ... */}
                    <div style={styles.formRow}>
                        <div style={styles.formGroup}><label style={styles.label}>Nombre (*)</label><input type="text" name="nombre_paciente" value={formData.nombre_paciente} onChange={handleChange} required style={styles.input}/></div>
                        <div style={styles.formGroup}><label style={styles.label}>Apellido (*)</label><input type="text" name="apellido_paciente" value={formData.apellido_paciente} onChange={handleChange} required style={styles.input}/></div>
                    </div>
                     <div style={styles.formRow}>
                        <div style={styles.formGroup}><label style={styles.label}>DNI (*)</label><input type="text" name="dni" value={formData.dni} onChange={handleChange} required maxLength={10} style={styles.input}/>{errors.dni && <small style={styles.errorText}>{errors.dni}</small>}</div>
                        <div style={styles.formGroup}><label style={styles.label}>Email (*)</label><input type="email" name="email" value={formData.email} onChange={handleChange} required style={styles.input}/>{errors.email && <small style={styles.errorText}>{errors.email}</small>}</div>
                    </div>
                     <div style={styles.formRow}>
                         <div style={styles.formGroup}><label style={styles.label}>Teléfono (*)</label><input type="tel" name="telefono_paciente" value={formData.telefono_paciente} onChange={handleChange} required maxLength={15} style={styles.input}/>{errors.telefono_paciente && <small style={styles.errorText}>{errors.telefono_paciente}</small>}</div>
                        <div style={styles.formGroup}><label style={styles.label}>Fecha de Nacimiento (*)</label><input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} required max={new Date().toISOString().split("T")[0]} style={styles.input}/>{errors.fecha_nacimiento && <small style={styles.errorText}>{errors.fecha_nacimiento}</small>}</div>
                    </div>
                    <div style={styles.formRow}>
                        <div style={styles.formGroup}><label style={styles.label}>Género (*)</label><select name="genero" value={formData.genero} onChange={handleChange} required style={styles.input}><option value="Femenino">Femenino</option><option value="Masculino">Masculino</option><option value="Otro">Otro</option></select></div>
                        <div style={styles.formGroup}><label style={styles.label}>Obra Social</label><select name="id_obra_social" value={formData.id_obra_social} onChange={handleChange} style={styles.input}><option value="">Ninguna</option>{obrasSocialesCatalogo.map(os => (<option key={os.id} value={os.id}>{os.nombre}</option>))}</select>{errors.id_obra_social && <small style={styles.errorText}>{errors.id_obra_social}</small>}</div>
                    </div>
                     <div style={styles.formGroup}><label style={styles.label}>Número de Afiliado</label><input type="text" name="nro_obra_social" value={formData.nro_obra_social} onChange={handleChange} style={styles.input}/>{errors.nro_obra_social && <small style={styles.errorText}>{errors.nro_obra_social}</small>}</div>
                    <div style={styles.formGroup}><label style={styles.label}>Observaciones</label><textarea name="observaciones" value={formData.observaciones} onChange={handleChange} rows={3} style={styles.textarea}></textarea></div>
                    <div style={styles.formActions}><button type="button" onClick={onCerrar} style={{...styles.actionButton, ...styles.cancelButton}}>Cancelar</button><button type="submit" style={{...styles.actionButton, ...styles.saveButton}}>Guardar</button></div>
                </form>
            </div>
        </div>
    );
};

// === ESTILOS ===
const styles: { [key: string]: React.CSSProperties } = {
    container: { fontFamily: 'Arial, sans-serif', padding: '20px', color: '#FFFFFF', position: 'relative' },
    notification: { position: 'fixed', top: '20px', right: '20px', color: 'white', padding: '15px 20px', borderRadius: '5px', zIndex: 1050, boxShadow: '0 4px 8px rgba(0,0,0,0.2)' },
    header: { borderBottom: '2px solid #444', paddingBottom: '10px' },
    toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0' },
    searchInput: { flex: 1, padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: '#FFFFFF', marginRight: '20px' },
    addButton: { backgroundColor: '#007bff', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
    th: { backgroundColor: '#333', padding: '12px', border: '1px solid #555', textAlign: 'left' },
    td: { padding: '12px', border: '1px solid #555' },
    actionButton: { border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px', color: 'white' },
    editButton: { backgroundColor: '#ffc107', color: 'black' },
    deleteButton: { backgroundColor: '#dc3545' },
    modalBackdrop: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '90%', maxWidth: '650px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' },
    formRow: { display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '20px', marginBottom: '15px' },
    formGroup: { display: 'flex', flexDirection: 'column', flex: '1 1 45%', minWidth: '200px', marginBottom: '10px' },
    label: { color: '#333', marginBottom: '5px', fontWeight: 'bold' },
    input: { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', marginTop: '5px', backgroundColor: '#FFF', color: '#000' },
    textarea: { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', marginTop: '5px', resize: 'vertical', backgroundColor: '#FFF', color: '#000' },
    errorText: { color: '#dc3545', fontSize: '12px', marginTop: '4px' },
    formActions: { display: 'flex', justifyContent: 'flex-end', marginTop: '20px', gap: '10px' },
    cancelButton: { backgroundColor: '#6c757d' },
    saveButton: { backgroundColor: '#28a745' }
};

export default PacientesPage;