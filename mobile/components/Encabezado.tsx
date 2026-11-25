import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colores, espacio, radio } from '../theme';

interface Props {
  titulo: string;
  // Si se pasa, se muestra la flecha para volver a la pantalla anterior.
  onVolver?: () => void;
  // Espacio de la barra de estado del sistema.
  margenSuperior?: number;
}

// Encabezado azul de la app con el nombre de la pantalla actual.
export default function Encabezado({ titulo, onVolver, margenSuperior = 0 }: Props) {
  return (
    <View style={[styles.header, { paddingTop: margenSuperior + espacio.md }]}>
      <View style={styles.fila}>
        {onVolver ? (
          <Pressable
            onPress={onVolver}
            hitSlop={10}
            style={({ pressed }) => [styles.volver, pressed && { opacity: 0.6 }]}
          >
            <Ionicons name="chevron-back" size={22} color={colores.textoSobrePrimario} />
          </Pressable>
        ) : (
          <View style={styles.logo}>
            <Ionicons name="layers" size={20} color={colores.primario} />
          </View>
        )}
        <View style={styles.textos}>
          <Text style={styles.marca}>VitroStock</Text>
          <Text style={styles.titulo} numberOfLines={1}>
            {titulo}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colores.primario,
    paddingHorizontal: espacio.lg,
    paddingBottom: espacio.lg + 2,
    borderBottomLeftRadius: radio.xl,
    borderBottomRightRadius: radio.xl,
  },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.md,
  },
  volver: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 38,
    height: 38,
    borderRadius: radio.md,
    backgroundColor: colores.superficie,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: {
    flex: 1,
  },
  marca: {
    color: colores.textoSobrePrimarioTenue,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  titulo: {
    color: colores.textoSobrePrimario,
    fontSize: 21,
    fontWeight: '700',
    marginTop: 1,
  },
});
