import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { obtenerProducto } from '../services/productoService';
import { Producto } from '../types/producto';

interface Props {
  id: number;
}

export default function ProductoDetalleScreen({ id }: Props) {
  const [producto, setProducto] = useState<Producto | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    obtenerProducto(id)
      .then(setProducto)
      .catch((e: Error) => setError(e.message));
  }, [id]);

  if (error) return <Text style={styles.error}>{error}</Text>;
  if (!producto) return <ActivityIndicator style={{ marginTop: 40 }} size="large" />;

  const precio = producto.precio_unitario.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.nombre}>{producto.nombre}</Text>
      <Fila label="Código" valor={`#${producto.id}`} />
      <Fila label="Categoría" valor={producto.categoria} />
      <Fila label="Unidad de medida" valor={producto.unidad_medida} />
      <Fila label="Precio unitario" valor={precio} />
      <Fila label="Stock actual" valor={`${producto.stock_actual} ${producto.unidad_medida}`} />
    </View>
  );
}

function Fila({ label, valor }: { label: string; valor: string }) {
  return (
    <View style={styles.fila}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.valor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  nombre: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  label: {
    color: '#666',
    fontSize: 15,
  },
  valor: {
    fontSize: 15,
    fontWeight: '600',
  },
  error: {
    color: '#B00020',
    margin: 16,
  },
});
