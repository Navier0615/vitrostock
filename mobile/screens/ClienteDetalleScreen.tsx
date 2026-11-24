import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import CuentaCobrarItem from '../components/CuentaCobrarItem';
import FAB from '../components/FAB';
import { useCuentasCobrar } from '../hooks/useCuentasCobrar';
import { obtenerCliente } from '../services/clienteService';
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

  if (errorCliente) return <Text style={styles.error}>{errorCliente}</Text>;
  if (!cliente) return <ActivityIndicator style={{ marginTop: 40 }} size="large" />;

  return (
    <View style={styles.container}>
      <View style={styles.resumen}>
        <Text style={styles.nombre}>{cliente.nombre}</Text>
        <Text style={styles.telefono}>{cliente.telefono || 'Sin teléfono'}</Text>
        <Text style={styles.totalLabel}>Saldo pendiente por cobrar</Text>
        <Text style={[styles.total, totalPendiente > 0 && styles.totalDeuda]}>{formatearMoneda(totalPendiente)}</Text>
      </View>

      <Text style={styles.subtitulo}>Cuentas por cobrar</Text>
      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={cuentas}
        keyExtractor={(c) => String(c.id)}
        refreshing={cargando}
        onRefresh={recargar}
        contentContainerStyle={{ paddingBottom: 90 }}
        renderItem={({ item }) => (
          <CuentaCobrarItem cuenta={item} mostrarCliente={false} onCobrar={() => onCobrar(item.id)} />
        )}
        ListEmptyComponent={
          !cargando && !error ? <Text style={styles.vacio}>No hay cuentas registradas.</Text> : undefined
        }
      />

      <FAB label="+ Cuenta" onPress={() => onNuevaCuenta(id)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  resumen: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  nombre: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  telefono: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  totalLabel: {
    fontSize: 13,
    color: '#666',
    marginTop: 14,
  },
  total: {
    fontSize: 26,
    fontWeight: '700',
    color: '#28A745',
  },
  totalDeuda: {
    color: '#E67E22',
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  error: {
    color: '#B00020',
    margin: 16,
  },
  vacio: {
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
  },
});
