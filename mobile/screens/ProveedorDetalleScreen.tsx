import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import CuentaPagarItem from '../components/CuentaPagarItem';
import FAB from '../components/FAB';
import { useCuentasPagar } from '../hooks/useCuentasPagar';
import { obtenerProveedor } from '../services/proveedorService';
import { Proveedor } from '../types/proveedor';
import { avisar, confirmar } from '../utils/confirmar';
import { formatearMoneda } from '../utils/formato';

interface Props {
  id: number;
  onNuevaCuenta: (proveedorId: number) => void;
}

// Detalle del proveedor con sus cuentas por pagar y el total que se le debe.
export default function ProveedorDetalleScreen({ id, onNuevaCuenta }: Props) {
  const [proveedor, setProveedor] = useState<Proveedor | null>(null);
  const [errorProveedor, setErrorProveedor] = useState<string | null>(null);
  const { cuentas, cargando, error, recargar, pagar, totalPendiente } = useCuentasPagar({ proveedorId: id });

  useEffect(() => {
    obtenerProveedor(id)
      .then(setProveedor)
      .catch((e: Error) => setErrorProveedor(e.message));
  }, [id]);

  function onPagar(cuentaId: number) {
    confirmar('Marcar como pagada', '¿Confirmas que esta cuenta ya se pagó?', async () => {
      try {
        await pagar(cuentaId);
      } catch (e) {
        avisar('No se pudo marcar', (e as Error).message);
      }
    });
  }

  if (errorProveedor) return <Text style={styles.error}>{errorProveedor}</Text>;
  if (!proveedor) return <ActivityIndicator style={{ marginTop: 40 }} size="large" />;

  return (
    <View style={styles.container}>
      <View style={styles.resumen}>
        <Text style={styles.nombre}>{proveedor.nombre}</Text>
        <Text style={styles.telefono}>{proveedor.telefono || 'Sin teléfono'}</Text>
        <Text style={styles.totalLabel}>Total pendiente</Text>
        <Text style={[styles.total, totalPendiente > 0 && styles.totalDeuda]}>
          {formatearMoneda(totalPendiente)}
        </Text>
      </View>

      <Text style={styles.subtitulo}>Cuentas por pagar</Text>
      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={cuentas}
        keyExtractor={(c) => String(c.id)}
        refreshing={cargando}
        onRefresh={recargar}
        contentContainerStyle={{ paddingBottom: 90 }}
        renderItem={({ item }) => (
          <CuentaPagarItem cuenta={item} mostrarProveedor={false} onPagar={() => onPagar(item.id)} />
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
    color: '#C0392B',
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
