import { useState } from 'react';
import { ScrollView, Text } from 'react-native';

import { BotonesFormulario, Campo, formStyles } from '../components/Formulario';
import { crearCliente } from '../services/clienteService';
import { avisar, confirmar } from '../utils/confirmar';

interface Props {
  onGuardado: () => void;
  onCancelar: () => void;
}

export default function NuevoClienteScreen({ onGuardado, onCancelar }: Props) {
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
    confirmar('Registrar cliente', `¿Registrar a "${nombre.trim()}"?`, guardar);
  }

  async function guardar() {
    setGuardando(true);
    try {
      await crearCliente({ nombre: nombre.trim(), telefono: telefono.trim() || undefined });
      avisar('Cliente registrado', 'El cliente se guardó correctamente.');
      onGuardado();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={formStyles.container}>
      <Campo label="Nombre" value={nombre} onChangeText={setNombre} placeholder="Ej. Constructora Popayán" />
      <Campo
        label="Teléfono (opcional)"
        value={telefono}
        onChangeText={setTelefono}
        placeholder="Ej. 3001234567"
        keyboardType="phone-pad"
      />

      {error && <Text style={formStyles.error}>{error}</Text>}

      <BotonesFormulario guardando={guardando} onGuardar={onGuardar} onCancelar={onCancelar} />
    </ScrollView>
  );
}
