import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

import FAB from '../components/FAB';
import ProductoItem from '../components/ProductoItem';
import { useStock } from '../hooks/useStock';

interface Props {
  onNuevo: () => void;
  onVerDetalle: (id: number) => void;
}

// HU04: consultar stock con filtro por nombre.
export default function ProductosScreen({ onNuevo, onVerDetalle }: Props) {
  const { productos, buscar, setBuscar, cargando, error, recargar } = useStock();

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.buscador}
        placeholder="Buscar producto por nombre"
        value={buscar}
        onChangeText={setBuscar}
        autoCorrect={false}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      {cargando && productos.length === 0 ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" />
      ) : (
        <FlatList
          data={productos}
          keyExtractor={(p) => String(p.id)}
          renderItem={({ item }) => (
            <ProductoItem producto={item} onPress={() => onVerDetalle(item.id)} />
          )}
          refreshing={cargando}
          onRefresh={recargar}
          contentContainerStyle={{ paddingBottom: 90 }}
          ListEmptyComponent={
            !error ? (
              <Text style={styles.vacio}>
                {buscar ? 'Ningún producto coincide con la búsqueda.' : 'Aún no hay productos registrados.'}
              </Text>
            ) : undefined
          }
        />
      )}

      <FAB label="↻" position="left" color="#6C757D" onPress={recargar} />
      <FAB label="+ Nuevo" onPress={onNuevo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  buscador: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  error: {
    color: '#B00020',
    marginBottom: 12,
  },
  vacio: {
    textAlign: 'center',
    color: '#777',
    marginTop: 40,
  },
});
