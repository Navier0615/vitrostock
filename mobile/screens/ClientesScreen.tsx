import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import ContactoItem from '../components/ContactoItem';
import EstadoVacio from '../components/EstadoVacio';
import FAB from '../components/FAB';
import MensajeError from '../components/MensajeError';
import { useClientes } from '../hooks/useClientes';
import { colores, espacio, tipografia } from '../theme';

interface Props {
  onNuevo: () => void;
  onVerDetalle: (id: number) => void;
}

export default function ClientesScreen({ onNuevo, onVerDetalle }: Props) {
  const { clientes, cargando, error, recargar } = useClientes();

  return (
    <View style={styles.container}>
      {error && <MensajeError mensaje={error} />}

      {clientes.length > 0 && (
        <Text style={styles.contador}>
          {clientes.length} {clientes.length === 1 ? 'cliente' : 'clientes'}
        </Text>
      )}

      {cargando && clientes.length === 0 ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color={colores.primario} />
      ) : (
        <FlatList
          data={clientes}
          keyExtractor={(item) => String(item.id)}
          refreshing={cargando}
          onRefresh={recargar}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <ContactoItem nombre={item.nombre} telefono={item.telefono} onPress={() => onVerDetalle(item.id)} />
          )}
          ListEmptyComponent={
            !error ? (
              <EstadoVacio
                icono="people-outline"
                titulo="Aún no hay clientes"
                mensaje="Toca «Cliente» para registrar el primero."
              />
            ) : undefined
          }
        />
      )}

      <FAB icono="refresh" position="left" color={colores.neutro} onPress={recargar} />
      <FAB icono="add" label="Cliente" onPress={onNuevo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: espacio.lg,
  },
  contador: {
    ...tipografia.etiqueta,
    marginBottom: espacio.sm,
    marginLeft: espacio.xs,
  },
});
