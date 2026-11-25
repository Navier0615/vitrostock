import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import ContactoItem from '../components/ContactoItem';
import EstadoVacio from '../components/EstadoVacio';
import FAB from '../components/FAB';
import MensajeError from '../components/MensajeError';
import { useProveedores } from '../hooks/useProveedores';
import { colores, espacio, tipografia } from '../theme';

interface Props {
  onNuevo: () => void;
  onVerDetalle: (id: number) => void;
}

export default function ProveedoresScreen({ onNuevo, onVerDetalle }: Props) {
  const { proveedores, cargando, error, recargar } = useProveedores();

  return (
    <View style={styles.container}>
      {error && <MensajeError mensaje={error} />}

      {proveedores.length > 0 && (
        <Text style={styles.contador}>
          {proveedores.length} {proveedores.length === 1 ? 'proveedor' : 'proveedores'}
        </Text>
      )}

      {cargando && proveedores.length === 0 ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color={colores.primario} />
      ) : (
        <FlatList
          data={proveedores}
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
                icono="business-outline"
                titulo="Aún no hay proveedores"
                mensaje="Toca «Proveedor» para registrar el primero."
              />
            ) : undefined
          }
        />
      )}

      <FAB icono="refresh" position="left" color={colores.neutro} onPress={recargar} />
      <FAB icono="add" label="Proveedor" onPress={onNuevo} />
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
