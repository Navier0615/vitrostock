import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';

import CuentaPagarItem from '../components/CuentaPagarItem';
import EstadoVacio from '../components/EstadoVacio';
import FAB from '../components/FAB';
import Filtros, { OpcionFiltro } from '../components/Filtros';
import MensajeError from '../components/MensajeError';
import TarjetaResumen from '../components/TarjetaResumen';
import { useCuentasPagar } from '../hooks/useCuentasPagar';
import { colores, espacio } from '../theme';
import { EstadoCuenta } from '../types/cuentaPagar';
import { avisar, confirmar } from '../utils/confirmar';
import { formatearMoneda } from '../utils/formato';

interface Props {
  onNueva: () => void;
}

const FILTROS: OpcionFiltro<EstadoCuenta>[] = [
  { label: 'Pendientes', valor: 'pendiente' },
  { label: 'Pagadas', valor: 'pagado' },
  { label: 'Todas' },
];

// HU07: cuentas por pagar a proveedores.
export default function CuentasPagarScreen({ onNueva }: Props) {
  const [estado, setEstado] = useState<EstadoCuenta | undefined>('pendiente');
  const { cuentas, cargando, error, recargar, pagar, totalPendiente } = useCuentasPagar({ estado });

  function onPagar(id: number) {
    confirmar('Marcar como pagada', '¿Confirmas que esta cuenta ya se pagó?', async () => {
      try {
        await pagar(id);
      } catch (e) {
        avisar('No se pudo marcar', (e as Error).message);
      }
    });
  }

  return (
    <View style={styles.container}>
      <Filtros opciones={FILTROS} valor={estado} onCambiar={setEstado} />

      {estado !== 'pagado' && (
        <TarjetaResumen
          icono="wallet-outline"
          etiqueta="Total pendiente por pagar"
          valor={formatearMoneda(totalPendiente)}
          color={totalPendiente > 0 ? colores.peligro : colores.exito}
          fondoIcono={totalPendiente > 0 ? colores.peligroSuave : colores.exitoSuave}
        />
      )}

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
          renderItem={({ item }) => <CuentaPagarItem cuenta={item} onPagar={() => onPagar(item.id)} />}
          ListEmptyComponent={
            !error ? (
              <EstadoVacio
                icono="receipt-outline"
                titulo="No hay cuentas para mostrar"
                mensaje={estado === 'pendiente' ? '¡Todo al día! No hay deudas pendientes.' : undefined}
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
