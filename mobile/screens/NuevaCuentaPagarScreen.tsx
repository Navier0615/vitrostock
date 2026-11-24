import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BotonesFormulario, Campo, Etiqueta, formStyles } from '../components/Formulario';
import { useProveedores } from '../hooks/useProveedores';
import { crearCuentaPagar } from '../services/cuentaPagarService';
import { avisar, confirmar } from '../utils/confirmar';
import { formatearMoneda, hoyISO } from '../utils/formato';

interface Props {
  proveedorInicial?: number;
  onGuardado: () => void;
  onCancelar: () => void;
}

// Registrar una cuenta por pagar asociada a un proveedor existente (HU07).
export default function NuevaCuentaPagarScreen({ proveedorInicial, onGuardado, onCancelar }: Props) {
  const { proveedores, cargando } = useProveedores();
  const [proveedorId, setProveedorId] = useState<number | undefined>(proveedorInicial);
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState(hoyISO());
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validar(): string | null {
    if (!proveedorId) return 'Selecciona un proveedor';
    const valor = Number(monto.replace(',', '.'));
    if (!monto.trim() || Number.isNaN(valor) || valor <= 0) return 'El monto debe ser un número mayor a 0';
    if (fecha && !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return 'La fecha debe tener formato AAAA-MM-DD';
    return null;
  }

  function onGuardar() {
    const mensaje = validar();
    setError(mensaje);
    if (mensaje) return;

    const proveedor = proveedores.find((p) => p.id === proveedorId);
    const valor = Number(monto.replace(',', '.'));
    confirmar(
      'Registrar cuenta por pagar',
      `¿Registrar una deuda de ${formatearMoneda(valor)} con ${proveedor?.nombre}?`,
      () => guardar(valor),
    );
  }

  async function guardar(valor: number) {
    setGuardando(true);
    try {
      await crearCuentaPagar({ proveedor_id: proveedorId!, monto: valor, fecha: fecha || undefined });
      avisar('Cuenta registrada', 'La cuenta por pagar quedó pendiente.');
      onGuardado();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={formStyles.container}>
      <Etiqueta>Proveedor</Etiqueta>
      {cargando ? (
        <ActivityIndicator style={{ marginVertical: 12 }} />
      ) : proveedores.length === 0 ? (
        <Text style={styles.aviso}>Primero registra un proveedor en la pestaña Proveedores.</Text>
      ) : (
        <View style={styles.chips}>
          {proveedores.map((p) => {
            const activo = p.id === proveedorId;
            return (
              <Pressable
                key={p.id}
                onPress={() => setProveedorId(p.id)}
                style={[styles.chip, activo && styles.chipActivo]}
              >
                <Text style={[styles.chipTexto, activo && styles.chipTextoActivo]}>{p.nombre}</Text>
              </Pressable>
            );
          })}
        </View>
      )}

      <Campo label="Monto" value={monto} onChangeText={setMonto} placeholder="Ej. 1500000" keyboardType="decimal-pad" />
      <Campo label="Fecha (AAAA-MM-DD)" value={fecha} onChangeText={setFecha} placeholder={hoyISO()} />

      {error && <Text style={formStyles.error}>{error}</Text>}

      <BotonesFormulario guardando={guardando} onGuardar={onGuardar} onCancelar={onCancelar} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  chip: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
  },
  chipActivo: {
    backgroundColor: '#007AFF',
  },
  chipTexto: {
    color: '#007AFF',
  },
  chipTextoActivo: {
    color: '#fff',
    fontWeight: '600',
  },
  aviso: {
    color: '#856404',
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
});
