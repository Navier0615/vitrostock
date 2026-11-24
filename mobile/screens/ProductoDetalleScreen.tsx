import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { obtenerProducto, registrarEntrada } from '../services/productoService';
import { Producto } from '../types/producto';
import { avisar, confirmar } from '../utils/confirmar';

interface Props {
  id: number;
}

// Detalle del producto y registro de entradas de stock (HU02).
export default function ProductoDetalleScreen({ id }: Props) {
  const [producto, setProducto] = useState<Producto | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [cantidad, setCantidad] = useState('');
  const [motivo, setMotivo] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [errorEntrada, setErrorEntrada] = useState<string | null>(null);

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

  function onRegistrar() {
    if (!producto) return;
    const valor = Number(cantidad);
    if (!cantidad.trim() || !Number.isInteger(valor) || valor <= 0) {
      setErrorEntrada('La cantidad debe ser un número entero mayor a 0');
      return;
    }
    setErrorEntrada(null);
    confirmar(
      'Registrar entrada',
      `¿Sumar ${valor} ${producto.unidad_medida} al stock de "${producto.nombre}"?`,
      () => guardarEntrada(valor),
    );
  }

  async function guardarEntrada(valor: number) {
    setGuardando(true);
    try {
      const actualizado = await registrarEntrada(id, { cantidad: valor, motivo: motivo.trim() || undefined });
      setProducto(actualizado);
      setCantidad('');
      setMotivo('');
      avisar('Entrada registrada', `Ahora hay ${actualizado.stock_actual} ${actualizado.unidad_medida} en stock.`);
    } catch (e) {
      setErrorEntrada((e as Error).message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      <View style={styles.tarjeta}>
        <Text style={styles.nombre}>{producto.nombre}</Text>
        <Fila label="Código" valor={`#${producto.id}`} />
        <Fila label="Categoría" valor={producto.categoria} />
        <Fila label="Unidad de medida" valor={producto.unidad_medida} />
        <Fila label="Precio unitario" valor={precio} />
        <Fila label="Stock actual" valor={`${producto.stock_actual} ${producto.unidad_medida}`} />
      </View>

      <View style={styles.tarjeta}>
        <Text style={styles.subtitulo}>Registrar entrada de stock</Text>
        <Text style={styles.ayuda}>Úsalo cuando llegue mercancía: la cantidad se suma al stock actual.</Text>

        <Text style={styles.label}>Cantidad ({producto.unidad_medida})</Text>
        <TextInput
          style={styles.input}
          value={cantidad}
          onChangeText={setCantidad}
          placeholder="Ej. 10"
          keyboardType="number-pad"
        />

        <Text style={styles.label}>Motivo (opcional)</Text>
        <TextInput
          style={styles.input}
          value={motivo}
          onChangeText={setMotivo}
          placeholder="Ej. Compra a proveedor"
          maxLength={200}
        />

        {errorEntrada && <Text style={styles.errorEntrada}>{errorEntrada}</Text>}

        <Pressable style={styles.boton} onPress={onRegistrar} disabled={guardando}>
          {guardando ? <ActivityIndicator color="#fff" /> : <Text style={styles.textoBoton}>Registrar entrada</Text>}
        </Pressable>
      </View>
    </ScrollView>
  );
}

function Fila({ label, valor }: { label: string; valor: string }) {
  return (
    <View style={styles.fila}>
      <Text style={styles.filaLabel}>{label}</Text>
      <Text style={styles.valor}>{valor}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 16,
    gap: 16,
  },
  tarjeta: {
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
  filaLabel: {
    color: '#666',
    fontSize: 15,
  },
  valor: {
    fontSize: 15,
    fontWeight: '600',
  },
  subtitulo: {
    fontSize: 17,
    fontWeight: '700',
  },
  ayuda: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 14,
  },
  boton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  textoBoton: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  errorEntrada: {
    color: '#B00020',
    marginBottom: 12,
  },
  error: {
    color: '#B00020',
    margin: 16,
  },
});
