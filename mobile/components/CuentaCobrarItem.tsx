import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CuentaCobrar } from '../types/cuentaCobrar';
import { formatearFecha, formatearMoneda } from '../utils/formato';

interface Props {
  cuenta: CuentaCobrar;
  mostrarCliente?: boolean;
  onCobrar?: () => void;
}

export default function CuentaCobrarItem({ cuenta, mostrarCliente = true, onCobrar }: Props) {
  const pendiente = cuenta.estado === 'pendiente';

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        {mostrarCliente && <Text style={styles.cliente}>{cuenta.cliente_nombre}</Text>}
        <Text style={styles.monto}>{formatearMoneda(cuenta.monto)}</Text>
        <Text style={styles.fecha}>{formatearFecha(cuenta.fecha)}</Text>
      </View>

      {pendiente && onCobrar ? (
        <Pressable onPress={onCobrar} style={({ pressed }) => [styles.botonCobrar, pressed && { opacity: 0.7 }]}>
          <Text style={styles.textoCobrar}>Cobrar</Text>
        </Pressable>
      ) : (
        <View style={[styles.estado, pendiente ? styles.estadoPendiente : styles.estadoPagado]}>
          <Text style={styles.textoEstado}>{pendiente ? 'Pendiente' : 'Cobrada'}</Text>
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
  cliente: {
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
  botonCobrar: {
    backgroundColor: '#17A2B8',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  textoCobrar: {
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
