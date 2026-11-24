import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import NuevoProductoScreen from './screens/NuevoProductoScreen';
import ProductoDetalleScreen from './screens/ProductoDetalleScreen';
import ProductosScreen from './screens/ProductosScreen';

// Navegación simple con estado (sin librerías extra).
type Pantalla = { nombre: 'productos' } | { nombre: 'nuevo' } | { nombre: 'detalle'; id: number };

const TITULOS: Record<Pantalla['nombre'], string> = {
  productos: 'Inventario',
  nuevo: 'Nuevo producto',
  detalle: 'Detalle del producto',
};

export default function App() {
  const [pantalla, setPantalla] = useState<Pantalla>({ nombre: 'productos' });
  const volver = () => setPantalla({ nombre: 'productos' });

  return (
    <View style={styles.safe}>
      <View style={styles.header}>
        {pantalla.nombre !== 'productos' && (
          <Pressable onPress={volver} hitSlop={10}>
            <Text style={styles.volver}>‹ Volver</Text>
          </Pressable>
        )}
        <Text style={styles.titulo}>VitroStock · {TITULOS[pantalla.nombre]}</Text>
      </View>

      <View style={styles.contenido}>
        {pantalla.nombre === 'productos' && (
          <ProductosScreen
            onNuevo={() => setPantalla({ nombre: 'nuevo' })}
            onVerDetalle={(id) => setPantalla({ nombre: 'detalle', id })}
          />
        )}
        {pantalla.nombre === 'nuevo' && <NuevoProductoScreen onGuardado={volver} onCancelar={volver} />}
        {pantalla.nombre === 'detalle' && <ProductoDetalleScreen id={pantalla.id} />}
      </View>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#1F3A5F',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 36,
    paddingBottom: 14,
    backgroundColor: '#1F3A5F',
  },
  volver: {
    color: '#BFD7FF',
    fontSize: 16,
    marginBottom: 4,
  },
  titulo: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  contenido: {
    flex: 1,
    backgroundColor: '#F2F4F7',
  },
});
