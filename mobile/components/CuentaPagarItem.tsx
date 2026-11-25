import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colores, espacio, radio, tarjeta, tipografia } from '../theme';
import { CuentaPagar } from '../types/cuentaPagar';
import { formatearFecha, formatearMoneda } from '../utils/formato';
import Insignia from './Insignia';

interface Props {
  cuenta: CuentaPagar;
  mostrarProveedor?: boolean;
  onPagar?: () => void;
}

export default function CuentaPagarItem({ cuenta, mostrarProveedor = true, onPagar }: Props) {
  const pendiente = cuenta.estado === 'pendiente';

  return (
    <View style={styles.card}>
      <View style={[styles.icono, { backgroundColor: pendiente ? colores.peligroSuave : colores.exitoSuave }]}>
        <Ionicons
          name={pendiente ? 'arrow-up' : 'checkmark-done'}
          size={22}
          color={pendiente ? colores.peligro : colores.exito}
        />
      </View>

      <View style={styles.info}>
        {mostrarProveedor && (
          <Text style={tipografia.secundario} numberOfLines={1}>
            {cuenta.proveedor_nombre}
          </Text>
        )}
        <Text style={styles.monto}>{formatearMoneda(cuenta.monto)}</Text>
        <View style={styles.fecha}>
          <Ionicons name="calendar-outline" size={12} color={colores.textoTenue} />
          <Text style={styles.textoFecha}>{formatearFecha(cuenta.fecha)}</Text>
        </View>
      </View>

      {pendiente && onPagar ? (
        <Pressable onPress={onPagar} style={({ pressed }) => [styles.boton, pressed && { opacity: 0.75 }]}>
          <Ionicons name="checkmark-circle" size={16} color="#fff" />
          <Text style={styles.textoBoton}>Pagar</Text>
        </Pressable>
      ) : pendiente ? (
        <Insignia texto="Pendiente" tipo="advertencia" icono="time-outline" />
      ) : (
        <Insignia texto="Pagado" tipo="exito" icono="checkmark" />
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
