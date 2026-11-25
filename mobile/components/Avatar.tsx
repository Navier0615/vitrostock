import { StyleSheet, Text, View } from 'react-native';

import { colores } from '../theme';

interface Props {
  nombre: string;
  tamano?: number;
  color?: string;
  fondo?: string;
}

// Círculo con las iniciales del nombre (ej. "Aluminios del Cauca" → "AC").
export default function Avatar({
  nombre,
  tamano = 44,
  color = colores.primario,
  fondo = colores.primarioSuave,
}: Props) {
  const iniciales = nombre
    .split(' ')
    .filter((p) => p.length > 2 || /^[A-ZÁÉÍÓÚÑ]/.test(p))
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');

  return (
    <View style={[styles.avatar, { width: tamano, height: tamano, borderRadius: tamano / 2, backgroundColor: fondo }]}>
      <Text style={[styles.texto, { color, fontSize: tamano * 0.38 }]}>{iniciales || '?'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: {
    fontWeight: '700',
  },
});
