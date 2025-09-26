// components/patients/SimplePatientModal.tsx
import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import type { ObraSocial } from '../../pages/Pacientes';

interface SimplePatientModalProps {
  paciente: any | null;
  pacientesExistentes: any[];
  onGuardar: (paciente: any) => void;
  onCerrar: () => void;
  obrasSociales: ObraSocial[];
}

export const SimplePatientModal: React.FC<SimplePatientModalProps> = ({
  paciente,
  pacientesExistentes,
  onGuardar,
  onCerrar,
  obrasSociales
}) => {
  const [formData, setFormData] = useState({
    id_paciente: paciente?.id_paciente ?? null,
    nombre_paciente: paciente?.nombre_paciente || '',
    apellido_paciente: paciente?.apellido_paciente || '',
    dni: paciente?.dni || '',
    email: paciente?.email || '',
    telefono_paciente: paciente?.telefono_paciente || '',
    fecha_nacimiento: paciente?.fecha_nacimiento || '',
     genero: paciente?.genero === 'M' ? 'Masculino' : paciente?.genero === 'F' ? 'Femenino' : 'Femenino',
    id_obraSocial: paciente?.id_obraSocial ? Number(paciente.id_obraSocial) : null,
    nro_obraSocial: paciente?.nro_obraSocial ?? '',
    observaciones: paciente?.observaciones || '',
    fecha_alta: paciente?.fecha_alta || new Date().toISOString().split('T')[0],
    fecha_ult_upd: new Date().toISOString().split('T')[0],
    estado: paciente?.estado !== undefined ? paciente.estado : true
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.nombre_paciente.trim()) newErrors.nombre_paciente = 'El nombre es obligatorio';
    if (!formData.apellido_paciente.trim()) newErrors.apellido_paciente = 'El apellido es obligatorio';
    if (formData.dni.length < 7 || formData.dni.length > 10) newErrors.dni = 'El DNI debe tener entre 7 y 10 dígitos';

    const dniExistente = pacientesExistentes.find(
      (p) => p.dni === formData.dni && p.id_paciente !== formData.id_paciente
    );
    if (dniExistente) newErrors.dni = 'Este DNI ya está registrado';

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'El formato del email es inválido';

    if (!/^[0-9+\-() ]{8,15}$/.test(formData.telefono_paciente))
      newErrors.telefono_paciente = 'Teléfono inválido (8-15 dígitos)';

    if (!formData.fecha_nacimiento) newErrors.fecha_nacimiento = 'La fecha de nacimiento es obligatoria';
    else if (new Date(formData.fecha_nacimiento) > new Date())
      newErrors.fecha_nacimiento = 'La fecha de nacimiento no puede ser futura';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    let processedValue: string | number | null = value;

    if (name === 'dni') {
      processedValue = value.replace(/[^0-9]/g, '');
    } else if (name === 'telefono_paciente') {
      processedValue = value.replace(/[^0-9+\-() ]/g, '');
    } else if (name === 'id_obraSocial') {
      processedValue = value === '' ? null : Number(value);
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const dataToSave = {
      ...formData,
      id_obraSocial: formData.id_obraSocial ?? null, // number | null
      nro_obraSocial:
        formData.nro_obraSocial === '' || formData.nro_obraSocial === undefined
          ? null
          : Number(formData.nro_obraSocial) // number | null
    };

    onGuardar(dataToSave);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {formData.id_paciente ? 'Editar Paciente' : 'Nuevo Paciente'}
            </h2>
            <button
              onClick={onCerrar}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombre_paciente"
                  value={formData.nombre_paciente}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="Ingrese el nombre"
                />
                {errors.nombre_paciente && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.nombre_paciente}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellido <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="apellido_paciente"
                  value={formData.apellido_paciente}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="Ingrese el apellido"
                />
                {errors.apellido_paciente && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.apellido_paciente}
                  </p>
                )}
              </div>
            </div>

            {/* DNI y Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  DNI <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  required
                  maxLength={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="12345678"
                />
                {errors.dni && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.dni}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="email@ejemplo.com"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Teléfono y Fecha de Nacimiento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="telefono_paciente"
                  value={formData.telefono_paciente}
                  onChange={handleChange}
                  required
                  maxLength={15}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="11-1234-5678"
                />
                {errors.telefono_paciente && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.telefono_paciente}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Nacimiento <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="fecha_nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                  required
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                />
                {errors.fecha_nacimiento && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.fecha_nacimiento}
                  </p>
                )}
              </div>
            </div>

            {/* Género y Obra Social */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Género <span className="text-red-500">*</span>
                </label>
                <select
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
                >
                  <option value="Femenino">Femenino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Obra Social
                </label>
                <select
                  name="id_obraSocial"
                  value={formData.id_obraSocial ?? ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
                >
                  <option value="">Ninguna</option>
                  {obrasSociales.map((os) => (
                    <option key={os.id_os} value={os.id_os}>
                      {os.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Número de Afiliado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Afiliado
              </label>
              <input
                type="text"
                name="nro_obraSocial"
                value={formData.nro_obraSocial}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                placeholder="Número de afiliado"
              />
            </div>

            {/* Observaciones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observaciones
              </label>
              <textarea
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                placeholder="Observaciones médicas, alergias, notas especiales..."
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCerrar}
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-sm"
            >
              {formData.id_paciente ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
