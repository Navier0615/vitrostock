import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colores, espacio, radio, STOCK_BAJO, tarjeta, tipografia } from '../theme';
import { ProductoStock } from '../types/producto';
import Insignia from './Insignia';

interface Props {
  producto: ProductoStock;
  onPress?: () => void;
}

export default function ProductoItem({ producto, onPress }: Props) {
  const sinStock = producto.stock_actual <= 0;
  const stockBajo = !sinStock && producto.stock_actual <= STOCK_BAJO;
  const colorStock = sinStock ? colores.peligro : stockBajo ? colores.advertencia : colores.exito;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.presionado]}>
      <View style={styles.icono}>
        <Ionicons name="cube-outline" size={22} color={colores.primario} />
      </View>

      <View style={styles.info}>
        <Text style={tipografia.subtitulo} numberOfLines={1}>
          {producto.nombre}
        </Text>
        <Text style={[tipografia.secundario, styles.categoria]}>{producto.categoria}</Text>
        {sinStock && <Insignia texto="Agotado" tipo="peligro" icono="close-circle" />}
        {stockBajo && <Insignia texto="Stock bajo" tipo="advertencia" icono="warning" />}
      </View>

      <View style={styles.stock}>
        <Text style={[styles.stockNumero, { color: colorStock }]}>{producto.stock_actual}</Text>
        <Text style={styles.stockUnidad}>{producto.unidad_medida}</Text>
      </View>
    </Pressable>
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
  presionado: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },
  icono: {
    width: 44,
    height: 44,
    borderRadius: radio.md,
    backgroundColor: colores.primarioSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 3,
  },
  categoria: {
    marginBottom: 1,
  },
  stock: {
    alignItems: 'flex-end',
    minWidth: 56,
  },
  stockNumero: {
    fontSize: 22,
    fontWeight: '800',
  },
  stockUnidad: {
    fontSize: 12,
    color: colores.textoSecundario,
  },
});
