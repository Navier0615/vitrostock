import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colores, espacio, tarjeta, tipografia } from '../theme';
import Avatar from './Avatar';

interface Props {
  nombre: string;
  telefono: string | null;
  onPress?: () => void;
}

// Fila de la lista de proveedores y de clientes: avatar con iniciales, nombre y teléfono.
export default function ContactoItem({ nombre, telefono, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.presionado]}>
      <Avatar nombre={nombre} />
      <View style={styles.info}>
        <Text style={tipografia.subtitulo} numberOfLines={1}>
          {nombre}
        </Text>
        <View style={styles.telefono}>
          <Ionicons name="call-outline" size={13} color={colores.textoSecundario} />
          <Text style={tipografia.secundario}>{telefono || 'Sin teléfono'}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colores.textoTenue} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    ...tarjeta,
    padding: espacio.md + 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.md,
    marginBottom: espacio.sm + 2,
  },
  presionado: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },
  info: {
    flex: 1,
  },
  telefono: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.xs,
    marginTop: 3,
  },
});
