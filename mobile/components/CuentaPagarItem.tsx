import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CuentaPagar } from '../types/cuentaPagar';
import { formatearFecha, formatearMoneda } from '../utils/formato';

interface Props {
  cuenta: CuentaPagar;
  mostrarProveedor?: boolean;
  onPagar?: () => void;
}

export default function CuentaPagarItem({ cuenta, mostrarProveedor = true, onPagar }: Props) {
  const pendiente = cuenta.estado === 'pendiente';

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        {mostrarProveedor && <Text style={styles.proveedor}>{cuenta.proveedor_nombre}</Text>}
        <Text style={styles.monto}>{formatearMoneda(cuenta.monto)}</Text>
        <Text style={styles.fecha}>{formatearFecha(cuenta.fecha)}</Text>
      </View>

      {pendiente && onPagar ? (
        <Pressable
          onPress={onPagar}
          style={({ pressed }) => [styles.botonPagar, pressed && { opacity: 0.7 }]}
        >
          <Text style={styles.textoPagar}>Pagar</Text>
        </Pressable>
      ) : (
        <View style={[styles.estado, pendiente ? styles.estadoPendiente : styles.estadoPagado]}>
          <Text style={styles.textoEstado}>{pendiente ? 'Pendiente' : 'Pagado'}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  info: {
    flex: 1,
  },
  proveedor: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  monto: {
    fontSize: 17,
    fontWeight: '700',
  },
  fecha: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  botonPagar: {
    backgroundColor: '#28A745',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  textoPagar: {
    color: '#fff',
    fontWeight: '600',
  },
  estado: {
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  estadoPendiente: {
    backgroundColor: '#FFF3CD',
  },
  estadoPagado: {
    backgroundColor: '#E6F4EA',
  },
  textoEstado: {
    fontSize: 13,
    fontWeight: '600',
  },
});
