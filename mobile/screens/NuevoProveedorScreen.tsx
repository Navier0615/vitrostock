import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { BotonesFormulario, Campo, formStyles } from '../components/Formulario';
import MensajeError from '../components/MensajeError';
import { crearProveedor } from '../services/proveedorService';
import { avisar, confirmar } from '../utils/confirmar';

interface Props {
  onGuardado: () => void;
  onCancelar: () => void;
}

export default function NuevoProveedorScreen({ onGuardado, onCancelar }: Props) {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onGuardar() {
    if (!nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    setError(null);
    confirmar('Registrar proveedor', `¿Registrar a "${nombre.trim()}"?`, guardar);
  }

  async function guardar() {
    setGuardando(true);
    try {
      await crearProveedor({
        nombre: nombre.trim(),
        telefono: telefono.trim() || undefined,
      });
      avisar('Proveedor registrado', 'El proveedor se guardó correctamente.');
      onGuardado();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={formStyles.container}>
      <View style={formStyles.tarjeta}>
        <Campo
          label="Nombre"
          value={nombre}
          onChangeText={setNombre}
          placeholder="Ej. Aluminios del Cauca"
          icono="business-outline"
        />
        <Campo
          label="Teléfono (opcional)"
          value={telefono}
          onChangeText={setTelefono}
          placeholder="Ej. 3001234567"
          keyboardType="phone-pad"
          icono="call-outline"
        />
      </View>

      {error && <MensajeError mensaje={error} />}

      <BotonesFormulario guardando={guardando} onGuardar={onGuardar} onCancelar={onCancelar} />
    </ScrollView>
  );
}
