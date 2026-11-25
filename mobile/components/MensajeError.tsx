import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colores, espacio, radio } from '../theme';

// Caja roja suave para mostrar errores del servidor o de validación.
export default function MensajeError({ mensaje }: { mensaje: string }) {
  return (
    <View style={styles.caja}>
      <Ionicons name="alert-circle" size={18} color={colores.peligro} />
      <Text style={styles.texto}>{mensaje}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  caja: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.sm,
    backgroundColor: colores.peligroSuave,
    borderRadius: radio.md,
    padding: espacio.md,
    marginBottom: espacio.md,
  },
  texto: {
    flex: 1,
    color: colores.peligro,
    fontSize: 14,
  },
});
