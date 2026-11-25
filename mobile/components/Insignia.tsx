import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colores, espacio, radio } from '../theme';
import { NombreIcono } from '../types/icono';

export type TipoInsignia = 'exito' | 'advertencia' | 'peligro' | 'info' | 'neutro';

const COLORES: Record<TipoInsignia, { fondo: string; texto: string }> = {
  exito: { fondo: colores.exitoSuave, texto: colores.exito },
  advertencia: { fondo: colores.advertenciaSuave, texto: colores.advertencia },
  peligro: { fondo: colores.peligroSuave, texto: colores.peligro },
  info: { fondo: colores.infoSuave, texto: colores.info },
  neutro: { fondo: colores.neutroSuave, texto: colores.neutro },
};

interface Props {
  texto: string;
  tipo?: TipoInsignia;
  icono?: NombreIcono;
}

// Etiqueta pequeña de color para mostrar estados (pendiente, pagado, stock bajo...).
export default function Insignia({ texto, tipo = 'neutro', icono }: Props) {
  const { fondo, texto: color } = COLORES[tipo];
  return (
    <View style={[styles.insignia, { backgroundColor: fondo }]}>
      {icono && <Ionicons name={icono} size={12} color={color} />}
      <Text style={[styles.texto, { color }]}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  insignia: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.xs,
    alignSelf: 'flex-start',
    borderRadius: radio.completo,
    paddingVertical: 3,
    paddingHorizontal: espacio.sm + 2,
  },
  texto: {
    fontSize: 12,
    fontWeight: '700',
  },
});
