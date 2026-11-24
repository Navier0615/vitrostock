import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import FAB from '../components/FAB';
import { useClientes } from '../hooks/useClientes';

interface Props {
  onNuevo: () => void;
  onVerDetalle: (id: number) => void;
}

export default function ClientesScreen({ onNuevo, onVerDetalle }: Props) {
  const { clientes, cargando, error, recargar } = useClientes();

  return (
    <View style={styles.container}>
      {error && <Text style={styles.error}>{error}</Text>}

      {cargando && clientes.length === 0 ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" />
      ) : (
        <FlatList
          data={clientes}
          keyExtractor={(c) => String(c.id)}
          refreshing={cargando}
          onRefresh={recargar}
          contentContainerStyle={{ paddingBottom: 90 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onVerDetalle(item.id)}
              style={({ pressed }) => [styles.card, pressed && { opacity: 0.7 }]}
            >
              <Text style={styles.nombre}>{item.nombre}</Text>
              <Text style={styles.telefono}>{item.telefono || 'Sin teléfono'}</Text>
            </Pressable>
          )}
          ListEmptyComponent={
            !error ? <Text style={styles.vacio}>Aún no hay clientes registrados.</Text> : undefined
          }
        />
      )}

      <FAB label="↻" position="left" color="#6C757D" onPress={recargar} />
      <FAB label="+ Cliente" onPress={onNuevo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
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
  nombre: {
    fontSize: 16,
    fontWeight: '600',
  },
  telefono: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
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
