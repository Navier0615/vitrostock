import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colores, espacio, radio, tarjeta, tipografia } from '../theme';
import { CuentaCobrar } from '../types/cuentaCobrar';
import { formatearFecha, formatearMoneda } from '../utils/formato';
import Insignia from './Insignia';

interface Props {
  cuenta: CuentaCobrar;
  mostrarCliente?: boolean;
  onCobrar?: () => void;
}

export default function CuentaCobrarItem({ cuenta, mostrarCliente = true, onCobrar }: Props) {
  const pendiente = cuenta.estado === 'pendiente';

  return (
    <View style={styles.card}>
      <View style={[styles.icono, { backgroundColor: pendiente ? colores.advertenciaSuave : colores.exitoSuave }]}>
        <Ionicons
          name={pendiente ? 'arrow-down' : 'checkmark-done'}
          size={22}
          color={pendiente ? colores.advertencia : colores.exito}
        />
      </View>

      <View style={styles.info}>
        {mostrarCliente && (
          <Text style={tipografia.secundario} numberOfLines={1}>
            {cuenta.cliente_nombre}
          </Text>
        )}
        <Text style={styles.monto}>{formatearMoneda(cuenta.monto)}</Text>
        <View style={styles.fecha}>
          <Ionicons name="calendar-outline" size={12} color={colores.textoTenue} />
          <Text style={styles.textoFecha}>{formatearFecha(cuenta.fecha)}</Text>
        </View>
      </View>

      {pendiente && onCobrar ? (
        <Pressable onPress={onCobrar} style={({ pressed }) => [styles.boton, pressed && { opacity: 0.75 }]}>
          <Ionicons name="checkmark-circle" size={16} color="#fff" />
          <Text style={styles.textoBoton}>Cobrar</Text>
        </Pressable>
      ) : pendiente ? (
        <Insignia texto="Pendiente" tipo="advertencia" icono="time-outline" />
      ) : (
        <Insignia texto="Cobrada" tipo="exito" icono="checkmark" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...tarjeta,
    padding: espacio.md + 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.md,
    marginBottom: espacio.sm + 2,
  },
  icono: {
    width: 44,
    height: 44,
    borderRadius: radio.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  monto: {
    fontSize: 18,
    fontWeight: '800',
    color: colores.texto,
    marginVertical: 1,
  },
  fecha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  textoFecha: {
    fontSize: 12,
    color: colores.textoTenue,
  },
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colores.exito,
    borderRadius: radio.completo,
    paddingVertical: espacio.sm,
    paddingHorizontal: espacio.md + 2,
  },
  textoBoton: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
