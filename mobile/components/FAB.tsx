import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colores, espacio, radio, sombraFuerte } from '../theme';
import { NombreIcono } from '../types/icono';

interface Props {
  label?: string;
  icono?: NombreIcono;
  position?: 'left' | 'right';
  color?: string;
  onPress?: () => void;
  onLongPress?: () => void;
}

// Botón flotante reutilizable. Con solo icono es redondo; con texto toma forma de píldora.
export default function FAB({ label, icono, position = 'right', color = colores.acento, onPress, onLongPress }: Props) {
  const soloIcono = !label;
  return (
    <Pressable
      style={({ pressed }) => [
        styles.floatingButton,
        soloIcono ? styles.redondo : styles.pildora,
        { backgroundColor: color },
        position === 'right' ? styles.positionRight : styles.positionLeft,
        pressed && styles.presionado,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      {icono && <Ionicons name={icono} size={soloIcono ? 24 : 20} color="#fff" />}
      {label && <Text style={styles.label}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: espacio.lg + 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacio.xs + 2,
    ...sombraFuerte,
  },
  redondo: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  pildora: {
    height: 52,
    borderRadius: radio.completo,
    paddingHorizontal: espacio.lg + 4,
  },
  positionRight: {
    right: espacio.lg + 4,
  },
  positionLeft: {
    left: espacio.lg + 4,
  },
  presionado: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
