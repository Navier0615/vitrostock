import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ProductoStock } from '../types/producto';

interface Props {
  producto: ProductoStock;
  onPress?: () => void;
}

export default function ProductoItem({ producto, onPress }: Props) {
  const sinStock = producto.stock_actual <= 0;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.7 }]}
    >
      <View style={styles.info}>
        <Text style={styles.nombre}>{producto.nombre}</Text>
        <Text style={styles.categoria}>{producto.categoria}</Text>
      </View>
      <View style={[styles.stock, sinStock ? styles.stockVacio : styles.stockOk]}>
        <Text style={styles.stockNumero}>{producto.stock_actual}</Text>
        <Text style={styles.stockUnidad}>{producto.unidad_medida}</Text>
      </View>
    </Pressable>
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
  nombre: {
    fontSize: 16,
    fontWeight: '600',
  },
  categoria: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  stock: {
    alignItems: 'center',
    minWidth: 64,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  stockOk: {
    backgroundColor: '#E6F4EA',
  },
  stockVacio: {
    backgroundColor: '#FDE8E8',
  },
  stockNumero: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stockUnidad: {
    fontSize: 11,
    color: '#555',
  },
});
