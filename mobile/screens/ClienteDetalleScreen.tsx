import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import Avatar from '../components/Avatar';
import CuentaCobrarItem from '../components/CuentaCobrarItem';
import EstadoVacio from '../components/EstadoVacio';
import FAB from '../components/FAB';
import MensajeError from '../components/MensajeError';
import { useCuentasCobrar } from '../hooks/useCuentasCobrar';
import { obtenerCliente } from '../services/clienteService';
import { colores, espacio, tarjeta, tipografia } from '../theme';
import { Cliente } from '../types/cliente';
import { avisar, confirmar } from '../utils/confirmar';
import { formatearMoneda } from '../utils/formato';

interface Props {
  id: number;
  onNuevaCuenta: (clienteId: number) => void;
}

// Detalle del cliente con sus cuentas por cobrar y el total que debe.
export default function ClienteDetalleScreen({ id, onNuevaCuenta }: Props) {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [errorCliente, setErrorCliente] = useState<string | null>(null);
  const { cuentas, cargando, error, recargar, cobrar, totalPendiente } = useCuentasCobrar({ clienteId: id });

  useEffect(() => {
    obtenerCliente(id)
      .then(setCliente)
      .catch((e: Error) => setErrorCliente(e.message));
  }, [id]);

  function onCobrar(cuentaId: number) {
    confirmar('Registrar pago', '¿Confirmas que el cliente ya pagó esta cuenta?', async () => {
      try {
        await cobrar(cuentaId);
      } catch (e) {
        avisar('No se pudo registrar el pago', (e as Error).message);
      }
    });
  }

  if (errorCliente)
    return (
      <View style={styles.container}>
        <MensajeError mensaje={errorCliente} />
      </View>
    );
  if (!cliente) return <ActivityIndicator style={{ marginTop: 40 }} size="large" color={colores.primario} />;

  const debe = totalPendiente > 0;

  return (
    <View style={styles.container}>
      <View style={styles.resumen}>
        <View style={styles.perfil}>
          <Avatar nombre={cliente.nombre} tamano={56} />
          <View style={styles.datos}>
            <Text style={tipografia.titulo} numberOfLines={2}>
              {cliente.nombre}
            </Text>
            <View style={styles.telefono}>
              <Ionicons name="call-outline" size={14} color={colores.textoSecundario} />
              <Text style={tipografia.secundario}>{cliente.telefono || 'Sin teléfono'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.separador} />

        <Text style={tipografia.etiqueta}>Saldo pendiente por cobrar</Text>
        <Text style={[styles.total, { color: debe ? colores.advertencia : colores.exito }]}>
          {formatearMoneda(totalPendiente)}
        </Text>
      </View>

      <Text style={styles.subtitulo}>Cuentas por cobrar</Text>
      {error && <MensajeError mensaje={error} />}

      <FlatList
        data={cuentas}
        keyExtractor={(c) => String(c.id)}
        refreshing={cargando}
        onRefresh={recargar}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <CuentaCobrarItem cuenta={item} mostrarCliente={false} onCobrar={() => onCobrar(item.id)} />
        )}
        ListEmptyComponent={
          !cargando && !error ? <EstadoVacio icono="receipt-outline" titulo="No hay cuentas registradas" /> : undefined
        }
      />

      <FAB icono="add" label="Cuenta" onPress={() => onNuevaCuenta(id)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: espacio.lg,
  },
  resumen: {
    ...tarjeta,
    marginBottom: espacio.lg,
  },
  perfil: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.md,
  },
  datos: {
    flex: 1,
  },
  telefono: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.xs,
    marginTop: 3,
  },
  separador: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colores.borde,
    marginVertical: espacio.md + 2,
  },
  total: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 2,
  },
  subtitulo: {
    ...tipografia.subtitulo,
    marginBottom: espacio.sm + 2,
  },
});
