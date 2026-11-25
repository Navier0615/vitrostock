import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BotonesFormulario, Campo, Etiqueta, formStyles } from '../components/Formulario';
import MensajeError from '../components/MensajeError';
import { useClientes } from '../hooks/useClientes';
import { crearCuentaCobrar } from '../services/cuentaCobrarService';
import { colores, espacio, radio } from '../theme';
import { avisar, confirmar } from '../utils/confirmar';
import { formatearMoneda, hoyISO } from '../utils/formato';

interface Props {
  clienteInicial?: number;
  onGuardado: () => void;
  onCancelar: () => void;
}

// Registrar una cuenta por cobrar asociada a un cliente existente.
export default function NuevaCuentaCobrarScreen({ clienteInicial, onGuardado, onCancelar }: Props) {
  const { clientes, cargando } = useClientes();
  const [clienteId, setClienteId] = useState<number | undefined>(clienteInicial);
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState(hoyISO());
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validar(): string | null {
    if (!clienteId) return 'Selecciona un cliente';
    const valor = Number(monto.replace(',', '.'));
    if (!monto.trim() || Number.isNaN(valor) || valor <= 0) return 'El monto debe ser un número mayor a 0';
    if (fecha && !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return 'La fecha debe tener formato AAAA-MM-DD';
    return null;
  }

  function onGuardar() {
    const mensaje = validar();
    setError(mensaje);
    if (mensaje) return;

    const cliente = clientes.find((c) => c.id === clienteId);
    const valor = Number(monto.replace(',', '.'));
    confirmar('Registrar cuenta por cobrar', `¿Registrar que ${cliente?.nombre} debe ${formatearMoneda(valor)}?`, () =>
      guardar(valor),
    );
  }

  async function guardar(valor: number) {
    setGuardando(true);
    try {
      await crearCuentaCobrar({ cliente_id: clienteId!, monto: valor, fecha: fecha || undefined });
      avisar('Cuenta registrada', 'La cuenta por cobrar quedó pendiente.');
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
        <Etiqueta>Cliente</Etiqueta>
        {cargando ? (
          <ActivityIndicator style={{ marginVertical: 12 }} color={colores.primario} />
        ) : clientes.length === 0 ? (
          <Text style={styles.aviso}>Primero registra un cliente en la pestaña Clientes.</Text>
        ) : (
          <View style={styles.chips}>
            {clientes.map((c) => {
              const activo = c.id === clienteId;
              return (
                <Pressable
                  key={c.id}
                  onPress={() => setClienteId(c.id)}
                  style={[styles.chip, activo && styles.chipActivo]}
                >
                  {activo && <Ionicons name="checkmark" size={14} color="#fff" />}
                  <Text style={[styles.chipTexto, activo && styles.chipTextoActivo]}>{c.nombre}</Text>
                </Pressable>
              );
            })}
          </View>
        )}

        <Campo
          label="Monto"
          value={monto}
          onChangeText={setMonto}
          placeholder="Ej. 850000"
          keyboardType="decimal-pad"
          icono="cash-outline"
        />
        <Campo
          label="Fecha (AAAA-MM-DD)"
          value={fecha}
          onChangeText={setFecha}
          placeholder={hoyISO()}
          icono="calendar-outline"
        />
      </View>

      {error && <MensajeError mensaje={error} />}

      <BotonesFormulario guardando={guardando} onGuardar={onGuardar} onCancelar={onCancelar} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espacio.sm,
    marginBottom: espacio.lg,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.xs,
    borderRadius: radio.completo,
    borderWidth: 1.5,
    borderColor: colores.borde,
    paddingVertical: espacio.sm - 1,
    paddingHorizontal: espacio.md + 2,
    backgroundColor: colores.superficie,
  },
  chipActivo: {
    backgroundColor: colores.primario,
    borderColor: colores.primario,
  },
  chipTexto: {
    color: colores.texto,
    fontWeight: '500',
  },
  chipTextoActivo: {
    color: '#fff',
    fontWeight: '700',
  },
  aviso: {
    color: colores.advertencia,
    backgroundColor: colores.advertenciaSuave,
    borderRadius: radio.sm,
    padding: espacio.md,
    marginBottom: espacio.lg,
  },
});
