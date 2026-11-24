import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import CuentaCobrarItem from '../components/CuentaCobrarItem';
import FAB from '../components/FAB';
import { useCuentasCobrar } from '../hooks/useCuentasCobrar';
import { EstadoCuentaCobrar } from '../types/cuentaCobrar';
import { avisar, confirmar } from '../utils/confirmar';
import { formatearMoneda } from '../utils/formato';

interface Props {
  onNueva: () => void;
}

const FILTROS: { label: string; valor?: EstadoCuentaCobrar }[] = [
  { label: 'Pendientes', valor: 'pendiente' },
  { label: 'Cobradas', valor: 'pagado' },
  { label: 'Todas' },
];

// Cuentas por cobrar a clientes.
export default function CuentasCobrarScreen({ onNueva }: Props) {
  const [estado, setEstado] = useState<EstadoCuentaCobrar | undefined>('pendiente');
  const { cuentas, cargando, error, recargar, cobrar, totalPendiente } = useCuentasCobrar({ estado });

  function onCobrar(id: number) {
    confirmar('Registrar pago', '¿Confirmas que el cliente ya pagó esta cuenta?', async () => {
      try {
        await cobrar(id);
      } catch (e) {
        avisar('No se pudo registrar el pago', (e as Error).message);
      }
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.filtros}>
        {FILTROS.map((f) => {
          const activo = f.valor === estado;
          return (
            <Pressable key={f.label} onPress={() => setEstado(f.valor)} style={[styles.chip, activo && styles.chipActivo]}>
              <Text style={[styles.chipTexto, activo && styles.chipTextoActivo]}>{f.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.total}>
        Total por cobrar: <Text style={styles.totalValor}>{formatearMoneda(totalPendiente)}</Text>
      </Text>

      {error && <Text style={styles.error}>{error}</Text>}

      {cargando && cuentas.length === 0 ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" />
      ) : (
        <FlatList
          data={cuentas}
          keyExtractor={(c) => String(c.id)}
          refreshing={cargando}
          onRefresh={recargar}
          contentContainerStyle={{ paddingBottom: 90 }}
          renderItem={({ item }) => <CuentaCobrarItem cuenta={item} onCobrar={() => onCobrar(item.id)} />}
          ListEmptyComponent={!error ? <Text style={styles.vacio}>No hay cuentas para mostrar.</Text> : undefined}
        />
      )}

      <FAB label="↻" position="left" color="#6C757D" onPress={recargar} />
      <FAB label="+ Cuenta" onPress={onNueva} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  filtros: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1F3A5F',
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  chipActivo: {
    backgroundColor: '#1F3A5F',
  },
  chipTexto: {
    color: '#1F3A5F',
  },
  chipTextoActivo: {
    color: '#fff',
    fontWeight: '600',
  },
  total: {
    fontSize: 15,
    marginBottom: 12,
  },
  totalValor: {
    fontWeight: '700',
    color: '#E67E22',
  },
  error: {
    color: '#B00020',
    marginBottom: 12,
  },
  vacio: {
    textAlign: 'center',
    color: '#777',
    marginTop: 40,
  },
});
