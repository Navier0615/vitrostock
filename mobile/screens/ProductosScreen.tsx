import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import EstadoVacio from '../components/EstadoVacio';
import FAB from '../components/FAB';
import MensajeError from '../components/MensajeError';
import ProductoItem from '../components/ProductoItem';
import { useStock } from '../hooks/useStock';
import { colores, espacio, radio, sombra, tipografia } from '../theme';

interface Props {
  onNuevo: () => void;
  onVerDetalle: (id: number) => void;
}

// HU04: consultar stock con filtro por nombre.
export default function ProductosScreen({ onNuevo, onVerDetalle }: Props) {
  const { productos, buscar, setBuscar, cargando, error, recargar } = useStock();

  return (
    <View style={styles.container}>
      <View style={styles.buscador}>
        <Ionicons name="search" size={18} color={colores.textoTenue} />
        <TextInput
          style={styles.input}
          placeholder="Buscar producto por nombre"
          placeholderTextColor={colores.textoTenue}
          value={buscar}
          onChangeText={setBuscar}
          autoCorrect={false}
        />
        {buscar.length > 0 && (
          <Pressable onPress={() => setBuscar('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colores.textoTenue} />
          </Pressable>
        )}
      </View>

      {error && <MensajeError mensaje={error} />}

      {productos.length > 0 && (
        <Text style={styles.contador}>
          {productos.length} {productos.length === 1 ? 'producto' : 'productos'}
        </Text>
      )}

      {cargando && productos.length === 0 ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color={colores.primario} />
      ) : (
        <FlatList
          data={productos}
          keyExtractor={(p) => String(p.id)}
          renderItem={({ item }) => <ProductoItem producto={item} onPress={() => onVerDetalle(item.id)} />}
          refreshing={cargando}
          onRefresh={recargar}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            !error ? (
              buscar ? (
                <EstadoVacio
                  icono="search-outline"
                  titulo="Sin resultados"
                  mensaje="Ningún producto coincide con la búsqueda."
                />
              ) : (
                <EstadoVacio
                  icono="cube-outline"
                  titulo="Aún no hay productos"
                  mensaje="Toca «Nuevo» para registrar el primero."
                />
              )
            ) : undefined
          }
        />
      )}

      <FAB icono="refresh" position="left" color={colores.neutro} onPress={recargar} />
      <FAB icono="add" label="Nuevo" onPress={onNuevo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: espacio.lg,
  },
  buscador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.sm,
    backgroundColor: colores.superficie,
    borderRadius: radio.md,
    paddingHorizontal: espacio.md,
    marginBottom: espacio.md,
    ...sombra,
  },
  input: {
    flex: 1,
    paddingVertical: espacio.md,
    fontSize: 16,
    color: colores.texto,
  },
  contador: {
    ...tipografia.etiqueta,
    marginBottom: espacio.sm,
    marginLeft: espacio.xs,
  },
});
