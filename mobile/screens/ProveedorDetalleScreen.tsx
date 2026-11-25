import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import Avatar from '../components/Avatar';
import CuentaPagarItem from '../components/CuentaPagarItem';
import EstadoVacio from '../components/EstadoVacio';
import FAB from '../components/FAB';
import MensajeError from '../components/MensajeError';
import { useCuentasPagar } from '../hooks/useCuentasPagar';
import { obtenerProveedor } from '../services/proveedorService';
import { colores, espacio, tarjeta, tipografia } from '../theme';
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

  if (errorProveedor)
    return (
      <View style={styles.container}>
        <MensajeError mensaje={errorProveedor} />
      </View>
    );
  if (!proveedor) return <ActivityIndicator style={{ marginTop: 40 }} size="large" color={colores.primario} />;

  const debe = totalPendiente > 0;

  return (
    <View style={styles.container}>
      <View style={styles.resumen}>
        <View style={styles.perfil}>
          <Avatar nombre={proveedor.nombre} tamano={56} />
          <View style={styles.datos}>
            <Text style={tipografia.titulo} numberOfLines={2}>
              {proveedor.nombre}
            </Text>
            <View style={styles.telefono}>
              <Ionicons name="call-outline" size={14} color={colores.textoSecundario} />
              <Text style={tipografia.secundario}>{proveedor.telefono || 'Sin teléfono'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.separador} />

        <Text style={tipografia.etiqueta}>Total pendiente</Text>
        <Text style={[styles.total, { color: debe ? colores.peligro : colores.exito }]}>
          {formatearMoneda(totalPendiente)}
        </Text>
      </View>

      <Text style={styles.subtitulo}>Cuentas por pagar</Text>
      {error && <MensajeError mensaje={error} />}

      <FlatList
        data={cuentas}
        keyExtractor={(c) => String(c.id)}
        refreshing={cargando}
        onRefresh={recargar}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <CuentaPagarItem cuenta={item} mostrarProveedor={false} onPagar={() => onPagar(item.id)} />
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
