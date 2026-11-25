import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import CuentaCobrarItem from '../components/CuentaCobrarItem';
import EstadoVacio from '../components/EstadoVacio';
import FAB from '../components/FAB';
import Filtros, { OpcionFiltro } from '../components/Filtros';
import MensajeError from '../components/MensajeError';
import TarjetaResumen from '../components/TarjetaResumen';
import { useCuentasCobrar } from '../hooks/useCuentasCobrar';
import { colores, espacio } from '../theme';
import { EstadoCuentaCobrar } from '../types/cuentaCobrar';
import { avisar, confirmar } from '../utils/confirmar';
import { formatearMoneda } from '../utils/formato';

interface Props {
  onNueva: () => void;
}

const FILTROS: OpcionFiltro<EstadoCuentaCobrar>[] = [
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
      <Filtros opciones={FILTROS} valor={estado} onCambiar={setEstado} />

      <TarjetaResumen
        icono="cash-outline"
        etiqueta="Total por cobrar"
        valor={formatearMoneda(totalPendiente)}
        color={totalPendiente > 0 ? colores.advertencia : colores.exito}
        fondoIcono={totalPendiente > 0 ? colores.advertenciaSuave : colores.exitoSuave}
      />

      {error && <MensajeError mensaje={error} />}

      {cargando && cuentas.length === 0 ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color={colores.primario} />
      ) : (
        <FlatList
          data={cuentas}
          keyExtractor={(c) => String(c.id)}
          refreshing={cargando}
          onRefresh={recargar}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => <CuentaCobrarItem cuenta={item} onCobrar={() => onCobrar(item.id)} />}
          ListEmptyComponent={
            !error ? (
              <EstadoVacio
                icono="receipt-outline"
                titulo="No hay cuentas para mostrar"
                mensaje={estado === 'pendiente' ? 'Ningún cliente tiene pagos pendientes.' : undefined}
              />
            ) : undefined
          }
        />
      )}

      <FAB icono="refresh" position="left" color={colores.neutro} onPress={recargar} />
      <FAB icono="add" label="Cuenta" onPress={onNueva} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: espacio.lg,
  },
});
